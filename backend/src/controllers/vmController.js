const VM = require('../models/VM');
const virtualboxService = require('../services/virtualboxService');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

class VMController {
  // Get all VMs
  async getAllVMs(req, res, next) {
    try {
      const { status, osType, page = 1, limit = 10, search } = req.query;
      
      // Build query
      const query = {};
      if (status) query.status = status;
      if (osType) query.osType = osType;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Pagination
      const skip = (page - 1) * limit;
      
      const [vms, total] = await Promise.all([
        VM.find(query)
          .populate('snapshots', 'name createdAt')
          .populate('startupScripts', 'name type')
          .populate('shutdownScripts', 'name type')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        VM.countDocuments(query)
      ]);
      
      // Sync with VirtualBox
      try {
        const vboxVMs = await virtualboxService.listVMs();
        
        // Update VM status from VirtualBox
        for (const vm of vms) {
          const vboxVM = vboxVMs.find(v => v.name === vm.name);
          if (vboxVM && vboxVM.status !== vm.status) {
            vm.status = vboxVM.status;
            await vm.save();
          }
        }
      } catch (error) {
        logger.warn('Failed to sync VMs with VirtualBox:', error.message);
      }
      
      res.json({
        success: true,
        data: {
          vms,
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

  // Get VM by ID
  async getVMById(req, res, next) {
    try {
      const vm = await VM.findById(req.params.id)
        .populate('snapshots')
        .populate('startupScripts')
        .populate('shutdownScripts')
        .populate('createdBy', 'name email');
      
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      // Get real-time info from VirtualBox
      try {
        const vboxInfo = await virtualboxService.getVMInfo(vm.name);
        vm.status = vboxInfo.status;
        await vm.save();
      } catch (error) {
        logger.warn(`Failed to get real-time info for VM ${vm.name}:`, error.message);
      }
      
      res.json({
        success: true,
        data: vm
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new VM
  async createVM(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { name, description, osType, memory, cpus, diskSize, networkAdapters, sharedFolders } = req.body;
      
      // Check if VM name already exists
      const existingVM = await VM.findOne({ name });
      if (existingVM) {
        return res.status(400).json({
          success: false,
          message: 'VM with this name already exists'
        });
      }
      
      // Create VM in VirtualBox
      const vboxConfig = {
        name,
        osType,
        memory,
        cpus,
        diskSize
      };
      
      await virtualboxService.createVM(vboxConfig);
      
      // Create VM in database
      const vm = new VM({
        name,
        description,
        osType,
        memory,
        cpus,
        diskSize,
        networkAdapters: networkAdapters || [{ type: 'NAT', enabled: true }],
        sharedFolders: sharedFolders || [],
        createdBy: req.user?.id,
        status: 'stopped'
      });
      
      await vm.save();
      
      logger.info(`VM created successfully: ${name}`);
      
      res.status(201).json({
        success: true,
        message: 'VM created successfully',
        data: vm
      });
    } catch (error) {
      logger.error('Failed to create VM:', error);
      next(error);
    }
  }

  // Update VM
  async updateVM(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      // Update allowed fields
      const allowedUpdates = ['description', 'memory', 'cpus', 'networkAdapters', 'sharedFolders', 'tags'];
      const updates = {};
      
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      
      Object.assign(vm, updates);
      await vm.save();
      
      logger.info(`VM updated successfully: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'VM updated successfully',
        data: vm
      });
    } catch (error) {
      next(error);
    }
  }

  // Start VM
  async startVM(req, res, next) {
    try {
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      if (vm.status === 'running') {
        return res.status(400).json({
          success: false,
          message: 'VM is already running'
        });
      }
      
      await virtualboxService.startVM(vm.name);
      
      vm.status = 'running';
      vm.lastStarted = new Date();
      await vm.save();
      
      logger.info(`VM started successfully: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'VM started successfully',
        data: vm
      });
    } catch (error) {
      next(error);
    }
  }

  // Stop VM
  async stopVM(req, res, next) {
    try {
      const { force = false } = req.body;
      
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      if (vm.status === 'stopped') {
        return res.status(400).json({
          success: false,
          message: 'VM is already stopped'
        });
      }
      
      await virtualboxService.stopVM(vm.name, force);
      
      vm.status = 'stopped';
      vm.lastStopped = new Date();
      await vm.save();
      
      logger.info(`VM stopped successfully: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'VM stopped successfully',
        data: vm
      });
    } catch (error) {
      next(error);
    }
  }

  // Restart VM
  async restartVM(req, res, next) {
    try {
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      if (vm.status !== 'running') {
        return res.status(400).json({
          success: false,
          message: 'VM must be running to restart'
        });
      }
      
      await virtualboxService.restartVM(vm.name);
      
      vm.lastStarted = new Date();
      await vm.save();
      
      logger.info(`VM restarted successfully: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'VM restarted successfully',
        data: vm
      });
    } catch (error) {
      next(error);
    }
  }

  // Pause VM
  async pauseVM(req, res, next) {
    try {
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      if (vm.status !== 'running') {
        return res.status(400).json({
          success: false,
          message: 'VM must be running to pause'
        });
      }
      
      await virtualboxService.pauseVM(vm.name);
      
      vm.status = 'paused';
      await vm.save();
      
      logger.info(`VM paused successfully: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'VM paused successfully',
        data: vm
      });
    } catch (error) {
      next(error);
    }
  }

  // Resume VM
  async resumeVM(req, res, next) {
    try {
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      if (vm.status !== 'paused') {
        return res.status(400).json({
          success: false,
          message: 'VM must be paused to resume'
        });
      }
      
      await virtualboxService.resumeVM(vm.name);
      
      vm.status = 'running';
      await vm.save();
      
      logger.info(`VM resumed successfully: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'VM resumed successfully',
        data: vm
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete VM
  async deleteVM(req, res, next) {
    try {
      const { deleteFiles = false } = req.body;
      
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      // Delete from VirtualBox
      await virtualboxService.deleteVM(vm.name, deleteFiles);
      
      // Delete from database
      await VM.findByIdAndDelete(req.params.id);
      
      logger.info(`VM deleted successfully: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'VM deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get VM screenshot
  async getVMScreenshot(req, res, next) {
    try {
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      if (vm.status !== 'running') {
        return res.status(400).json({
          success: false,
          message: 'VM must be running to capture screenshot'
        });
      }
      
      const outputPath = path.join(__dirname, '../../temp', `${vm.name}_${Date.now()}.png`);
      await virtualboxService.getVMScreenshot(vm.name, outputPath);
      
      res.sendFile(outputPath, (err) => {
        if (err) {
          logger.error('Failed to send screenshot:', err);
        } else {
          // Clean up temp file
          fs.unlink(outputPath).catch(logger.error);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Execute command on VM
  async executeCommand(req, res, next) {
    try {
      const { username, password, command } = req.body;
      
      if (!username || !password || !command) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, and command are required'
        });
      }
      
      const vm = await VM.findById(req.params.id);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      if (vm.status !== 'running') {
        return res.status(400).json({
          success: false,
          message: 'VM must be running to execute commands'
        });
      }
      
      const output = await virtualboxService.executeGuestCommand(vm.name, username, password, command);
      
      logger.info(`Command executed on VM ${vm.name}: ${command}`);
      
      res.json({
        success: true,
        message: 'Command executed successfully',
        data: {
          command,
          output
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VMController();
