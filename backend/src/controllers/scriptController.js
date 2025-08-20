const Script = require('../models/Script');
const VM = require('../models/VM');
const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

const execAsync = util.promisify(exec);

class ScriptController {
  // Get all scripts
  async getAllScripts(req, res, next) {
    try {
      const { type, trigger, page = 1, limit = 10, search, vmId } = req.query;
      
      // Build query
      const query = {};
      if (type) query.type = type;
      if (trigger) query.trigger = trigger;
      if (vmId) query.associatedVMs = vmId;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      const skip = (page - 1) * limit;
      
      const [scripts, total] = await Promise.all([
        Script.find(query)
          .populate('associatedVMs', 'name status')
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Script.countDocuments(query)
      ]);
      
      res.json({
        success: true,
        data: {
          scripts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get script by ID
  async getScriptById(req, res, next) {
    try {
      const script = await Script.findById(req.params.id)
        .populate('associatedVMs', 'name status')
        .populate('createdBy', 'name email');
      
      if (!script) {
        return res.status(404).json({
          success: false,
          message: 'Script not found'
        });
      }
      
      res.json({
        success: true,
        data: script
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new script
  async createScript(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const {
        name,
        description,
        type,
        content,
        trigger,
        executionOrder,
        timeout,
        environment,
        workingDirectory,
        runAsAdmin,
        continueOnError,
        schedule,
        associatedVMs,
        tags
      } = req.body;
      
      // Check if script name already exists
      const existingScript = await Script.findOne({ name });
      if (existingScript) {
        return res.status(400).json({
          success: false,
          message: 'Script with this name already exists'
        });
      }
      
      // Validate associated VMs
      if (associatedVMs && associatedVMs.length > 0) {
        const vms = await VM.find({ _id: { $in: associatedVMs } });
        if (vms.length !== associatedVMs.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more associated VMs not found'
          });
        }
      }
      
      const script = new Script({
        name,
        description,
        type,
        content,
        trigger,
        executionOrder: executionOrder || 0,
        timeout: timeout || 300,
        environment: environment || new Map(),
        workingDirectory: workingDirectory || '',
        runAsAdmin: runAsAdmin || false,
        continueOnError: continueOnError || false,
        schedule: schedule || { enabled: false },
        associatedVMs: associatedVMs || [],
        tags: tags || [],
        createdBy: req.user?.id
      });
      
      await script.save();
      
      // Update VMs with script associations
      if (associatedVMs && associatedVMs.length > 0) {
        await this.updateVMScriptAssociations(associatedVMs, script._id, trigger);
      }
      
      logger.info(`Script created successfully: ${name}`);
      
      res.status(201).json({
        success: true,
        message: 'Script created successfully',
        data: script
      });
    } catch (error) {
      logger.error('Failed to create script:', error);
      next(error);
    }
  }

  // Update script
  async updateScript(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const script = await Script.findById(req.params.id);
      if (!script) {
        return res.status(404).json({
          success: false,
          message: 'Script not found'
        });
      }
      
      // Update allowed fields
      const allowedUpdates = [
        'description', 'content', 'trigger', 'executionOrder', 'timeout',
        'environment', 'workingDirectory', 'runAsAdmin', 'continueOnError',
        'schedule', 'associatedVMs', 'tags', 'isActive'
      ];
      
      const updates = {};
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      
      // Increment version for content changes
      if (updates.content && updates.content !== script.content) {
        updates.version = script.version + 1;
      }
      
      Object.assign(script, updates);
      await script.save();
      
      logger.info(`Script updated successfully: ${script.name}`);
      
      res.json({
        success: true,
        message: 'Script updated successfully',
        data: script
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete script
  async deleteScript(req, res, next) {
    try {
      const script = await Script.findById(req.params.id);
      if (!script) {
        return res.status(404).json({
          success: false,
          message: 'Script not found'
        });
      }
      
      // Remove script from associated VMs
      if (script.associatedVMs.length > 0) {
        await this.removeScriptFromVMs(script.associatedVMs, script._id, script.trigger);
      }
      
      await Script.findByIdAndDelete(req.params.id);
      
      logger.info(`Script deleted successfully: ${script.name}`);
      
      res.json({
        success: true,
        message: 'Script deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Execute script
  async executeScript(req, res, next) {
    try {
      const { vmId, environment: customEnv } = req.body;
      
      const script = await Script.findById(req.params.id).populate('associatedVMs');
      if (!script) {
        return res.status(404).json({
          success: false,
          message: 'Script not found'
        });
      }
      
      if (!script.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Script is not active'
        });
      }
      
      let targetVM = null;
      if (vmId) {
        targetVM = await VM.findById(vmId);
        if (!targetVM) {
          return res.status(404).json({
            success: false,
            message: 'Target VM not found'
          });
        }
      }
      
      const executionResult = await this.executeScriptContent(script, targetVM, customEnv);
      
      // Update script execution history
      script.executionHistory.push({
        timestamp: new Date(),
        vmId: targetVM?._id,
        status: executionResult.status,
        output: executionResult.output,
        error: executionResult.error,
        duration: executionResult.duration,
        triggeredBy: 'user'
      });
      
      script.lastExecution = {
        timestamp: new Date(),
        status: executionResult.status,
        output: executionResult.output,
        error: executionResult.error,
        duration: executionResult.duration
      };
      
      await script.save();
      
      logger.info(`Script executed: ${script.name}, Status: ${executionResult.status}`);
      
      res.json({
        success: true,
        message: 'Script executed successfully',
        data: executionResult
      });
    } catch (error) {
      logger.error('Failed to execute script:', error);
      next(error);
    }
  }

  // Execute script content
  async executeScriptContent(script, targetVM = null, customEnv = {}) {
    const startTime = Date.now();
    
    try {
      // Create temporary script file
      const tempDir = path.join(__dirname, '../../temp');
      await fs.mkdir(tempDir, { recursive: true });
      
      const scriptFileName = `script_${script._id}_${Date.now()}${script.fileExtension}`;
      const scriptPath = path.join(tempDir, scriptFileName);
      
      await fs.writeFile(scriptPath, script.content, 'utf8');
      
      // Prepare environment variables
      const env = {
        ...process.env,
        ...Object.fromEntries(script.environment),
        ...customEnv
      };
      
      if (targetVM) {
        env.VM_NAME = targetVM.name;
        env.VM_ID = targetVM._id.toString();
        env.VM_STATUS = targetVM.status;
      }
      
      // Prepare command based on script type
      let command;
      const options = {
        env,
        cwd: script.workingDirectory || process.cwd(),
        timeout: script.timeout * 1000,
        encoding: 'utf8'
      };
      
      switch (script.type) {
        case 'powershell':
          command = script.runAsAdmin
            ? `powershell -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File \\"${scriptPath}\\"' -Verb RunAs -Wait"`
            : `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`;
          break;
        
        case 'batch':
          command = script.runAsAdmin
            ? `powershell -Command "Start-Process cmd -ArgumentList '/c \\"${scriptPath}\\"' -Verb RunAs -Wait"`
            : `"${scriptPath}"`;
          break;
        
        case 'vbs':
          command = `cscript //NoLogo "${scriptPath}"`;
          break;
        
        case 'javascript':
          command = `node "${scriptPath}"`;
          break;
        
        case 'bash':
          command = `bash "${scriptPath}"`;
          break;
        
        default:
          throw new Error(`Unsupported script type: ${script.type}`);
      }
      
      // Execute script
      const { stdout, stderr } = await execAsync(command, options);
      
      const duration = Date.now() - startTime;
      
      // Clean up temp file
      try {
        await fs.unlink(scriptPath);
      } catch (cleanupError) {
        logger.warn('Failed to clean up temp script file:', cleanupError);
      }
      
      return {
        status: 'success',
        output: stdout,
        error: stderr || null,
        duration
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      let status = 'error';
      if (error.killed && error.signal === 'SIGTERM') {
        status = 'timeout';
      }
      
      return {
        status,
        output: error.stdout || '',
        error: error.message,
        duration
      };
    }
  }

  // Update VM script associations
  async updateVMScriptAssociations(vmIds, scriptId, trigger) {
    try {
      const updateField = trigger === 'startup' ? 'startupScripts' : 'shutdownScripts';
      
      await VM.updateMany(
        { _id: { $in: vmIds } },
        { $addToSet: { [updateField]: scriptId } }
      );
    } catch (error) {
      logger.error('Failed to update VM script associations:', error);
    }
  }

  // Remove script from VMs
  async removeScriptFromVMs(vmIds, scriptId, trigger) {
    try {
      const updateField = trigger === 'startup' ? 'startupScripts' : 'shutdownScripts';
      
      await VM.updateMany(
        { _id: { $in: vmIds } },
        { $pull: { [updateField]: scriptId } }
      );
    } catch (error) {
      logger.error('Failed to remove script from VMs:', error);
    }
  }

  // Get script execution history
  async getExecutionHistory(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const script = await Script.findById(req.params.id);
      if (!script) {
        return res.status(404).json({
          success: false,
          message: 'Script not found'
        });
      }
      
      const skip = (page - 1) * limit;
      const history = script.executionHistory
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(skip, skip + parseInt(limit));
      
      res.json({
        success: true,
        data: {
          history,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: script.executionHistory.length,
            pages: Math.ceil(script.executionHistory.length / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get script statistics
  async getScriptStats(req, res, next) {
    try {
      const script = await Script.findById(req.params.id);
      if (!script) {
        return res.status(404).json({
          success: false,
          message: 'Script not found'
        });
      }
      
      const stats = {
        totalExecutions: script.executionHistory.length,
        successfulExecutions: script.executionHistory.filter(h => h.status === 'success').length,
        failedExecutions: script.executionHistory.filter(h => h.status === 'error').length,
        timeoutExecutions: script.executionHistory.filter(h => h.status === 'timeout').length,
        averageDuration: 0,
        lastExecution: script.lastExecution,
        successRate: script.successRate
      };
      
      if (script.executionHistory.length > 0) {
        const totalDuration = script.executionHistory.reduce((sum, h) => sum + (h.duration || 0), 0);
        stats.averageDuration = Math.round(totalDuration / script.executionHistory.length);
      }
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScriptController();
