const Snapshot = require('../models/Snapshot');
const VM = require('../models/VM');
const virtualboxService = require('../services/virtualboxService');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

class SnapshotController {
  // Get all snapshots for a VM
  async getVMSnapshots(req, res, next) {
    try {
      const { vmId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const vm = await VM.findById(vmId);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      const skip = (page - 1) * limit;
      
      const [snapshots, total] = await Promise.all([
        Snapshot.find({ vmId })
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Snapshot.countDocuments({ vmId })
      ]);
      
      res.json({
        success: true,
        data: {
          snapshots,
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

  // Get snapshot by ID
  async getSnapshotById(req, res, next) {
    try {
      const snapshot = await Snapshot.findById(req.params.id)
        .populate('vmId', 'name')
        .populate('createdBy', 'name email')
        .populate('parentSnapshotId', 'name');
      
      if (!snapshot) {
        return res.status(404).json({
          success: false,
          message: 'Snapshot not found'
        });
      }
      
      res.json({
        success: true,
        data: snapshot
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new snapshot
  async createSnapshot(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { vmId } = req.params;
      const { name, description } = req.body;
      
      const vm = await VM.findById(vmId);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      // Check if snapshot name already exists for this VM
      const existingSnapshot = await Snapshot.findOne({ vmId, name });
      if (existingSnapshot) {
        return res.status(400).json({
          success: false,
          message: 'Snapshot with this name already exists for this VM'
        });
      }
      
      // Create snapshot in VirtualBox
      await virtualboxService.createSnapshot(vm.name, name, description);
      
      // Get current VM state
      const vmInfo = await virtualboxService.getVMInfo(vm.name);
      
      // Create snapshot in database
      const snapshot = new Snapshot({
        name,
        description,
        vmId,
        vmState: vmInfo.status,
        createdBy: req.user?.id
      });
      
      await snapshot.save();
      
      // Add snapshot to VM's snapshots array
      vm.snapshots.push(snapshot._id);
      await vm.save();
      
      logger.info(`Snapshot created successfully: ${name} for VM: ${vm.name}`);
      
      res.status(201).json({
        success: true,
        message: 'Snapshot created successfully',
        data: snapshot
      });
    } catch (error) {
      logger.error('Failed to create snapshot:', error);
      next(error);
    }
  }

  // Restore snapshot
  async restoreSnapshot(req, res, next) {
    try {
      const snapshot = await Snapshot.findById(req.params.id).populate('vmId');
      
      if (!snapshot) {
        return res.status(404).json({
          success: false,
          message: 'Snapshot not found'
        });
      }
      
      const vm = snapshot.vmId;
      
      // Restore snapshot in VirtualBox
      await virtualboxService.restoreSnapshot(vm.name, snapshot.name);
      
      // Update snapshot statistics
      snapshot.restoredCount += 1;
      snapshot.lastRestored = new Date();
      await snapshot.save();
      
      // Update VM status
      vm.status = snapshot.vmState;
      await vm.save();
      
      logger.info(`Snapshot restored successfully: ${snapshot.name} for VM: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'Snapshot restored successfully',
        data: snapshot
      });
    } catch (error) {
      logger.error('Failed to restore snapshot:', error);
      next(error);
    }
  }

  // Delete snapshot
  async deleteSnapshot(req, res, next) {
    try {
      const snapshot = await Snapshot.findById(req.params.id).populate('vmId');
      
      if (!snapshot) {
        return res.status(404).json({
          success: false,
          message: 'Snapshot not found'
        });
      }
      
      const vm = snapshot.vmId;
      
      // Delete snapshot from VirtualBox
      await virtualboxService.deleteSnapshot(vm.name, snapshot.name);
      
      // Remove snapshot from VM's snapshots array
      vm.snapshots.pull(snapshot._id);
      await vm.save();
      
      // Delete snapshot from database
      await Snapshot.findByIdAndDelete(req.params.id);
      
      logger.info(`Snapshot deleted successfully: ${snapshot.name} for VM: ${vm.name}`);
      
      res.json({
        success: true,
        message: 'Snapshot deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete snapshot:', error);
      next(error);
    }
  }

  // Update snapshot
  async updateSnapshot(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const snapshot = await Snapshot.findById(req.params.id);
      
      if (!snapshot) {
        return res.status(404).json({
          success: false,
          message: 'Snapshot not found'
        });
      }
      
      // Update allowed fields
      const allowedUpdates = ['description', 'tags', 'schedule'];
      const updates = {};
      
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      
      Object.assign(snapshot, updates);
      await snapshot.save();
      
      logger.info(`Snapshot updated successfully: ${snapshot.name}`);
      
      res.json({
        success: true,
        message: 'Snapshot updated successfully',
        data: snapshot
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all snapshots (admin view)
  async getAllSnapshots(req, res, next) {
    try {
      const { page = 1, limit = 10, vmName, search } = req.query;
      
      // Build query
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      const skip = (page - 1) * limit;
      
      let snapshots = await Snapshot.find(query)
        .populate('vmId', 'name')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      // Filter by VM name if specified
      if (vmName) {
        snapshots = snapshots.filter(snapshot => 
          snapshot.vmId && snapshot.vmId.name.toLowerCase().includes(vmName.toLowerCase())
        );
      }
      
      const total = await Snapshot.countDocuments(query);
      
      res.json({
        success: true,
        data: {
          snapshots,
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

  // Sync snapshots with VirtualBox
  async syncSnapshots(req, res, next) {
    try {
      const { vmId } = req.params;
      
      const vm = await VM.findById(vmId);
      if (!vm) {
        return res.status(404).json({
          success: false,
          message: 'VM not found'
        });
      }
      
      // Get snapshots from VirtualBox
      const vboxSnapshots = await virtualboxService.listSnapshots(vm.name);
      
      // Get snapshots from database
      const dbSnapshots = await Snapshot.find({ vmId });
      
      const syncResults = {
        added: [],
        removed: [],
        existing: []
      };
      
      // Add missing snapshots to database
      for (const vboxSnapshot of vboxSnapshots) {
        const existingSnapshot = dbSnapshots.find(s => s.name === vboxSnapshot.name);
        if (!existingSnapshot) {
          const newSnapshot = new Snapshot({
            name: vboxSnapshot.name,
            vmId,
            vmState: 'unknown',
            isAutoSnapshot: false
          });
          await newSnapshot.save();
          syncResults.added.push(newSnapshot);
        } else {
          syncResults.existing.push(existingSnapshot);
        }
      }
      
      // Remove snapshots from database that don't exist in VirtualBox
      for (const dbSnapshot of dbSnapshots) {
        const existingVboxSnapshot = vboxSnapshots.find(s => s.name === dbSnapshot.name);
        if (!existingVboxSnapshot) {
          await Snapshot.findByIdAndDelete(dbSnapshot._id);
          syncResults.removed.push(dbSnapshot);
        }
      }
      
      logger.info(`Snapshots synced for VM ${vm.name}: +${syncResults.added.length}, -${syncResults.removed.length}`);
      
      res.json({
        success: true,
        message: 'Snapshots synchronized successfully',
        data: syncResults
      });
    } catch (error) {
      logger.error('Failed to sync snapshots:', error);
      next(error);
    }
  }
}

module.exports = new SnapshotController();
