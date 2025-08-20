const { exec, spawn } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

const execAsync = util.promisify(exec);

class VirtualBoxService {
  constructor() {
    this.vboxManagePath = this.findVBoxManage();
  }

  findVBoxManage() {
    // Common VirtualBox installation paths on Windows
    const possiblePaths = [
      'C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe',
      'C:\\Program Files (x86)\\Oracle\\VirtualBox\\VBoxManage.exe',
      process.env.VBOX_MSI_INSTALL_PATH ? path.join(process.env.VBOX_MSI_INSTALL_PATH, 'VBoxManage.exe') : null,
      process.env.VBOX_INSTALL_PATH ? path.join(process.env.VBOX_INSTALL_PATH, 'VBoxManage.exe') : null
    ].filter(Boolean);

    // Try to find VBoxManage in PATH first
    return 'VBoxManage';
  }

  async executeCommand(command, args = []) {
    try {
      const fullCommand = `"${this.vboxManagePath}" ${command} ${args.join(' ')}`;
      logger.info(`Executing VirtualBox command: ${fullCommand}`);
      
      const { stdout, stderr } = await execAsync(fullCommand);
      
      if (stderr && !stderr.includes('WARNING')) {
        logger.warn(`VirtualBox command warning: ${stderr}`);
      }
      
      return stdout.trim();
    } catch (error) {
      logger.error(`VirtualBox command failed: ${error.message}`);
      throw new Error(`VirtualBox operation failed: ${error.message}`);
    }
  }

  async listVMs() {
    try {
      const output = await this.executeCommand('list', ['vms']);
      const vms = [];
      
      const lines = output.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const match = line.match(/^"(.+)"\s+\{(.+)\}$/);
        if (match) {
          const [, name, uuid] = match;
          const info = await this.getVMInfo(name);
          vms.push({
            name,
            uuid,
            ...info
          });
        }
      }
      
      return vms;
    } catch (error) {
      logger.error('Failed to list VMs:', error);
      throw error;
    }
  }

  async getVMInfo(vmName) {
    try {
      const output = await this.executeCommand('showvminfo', ['"' + vmName + '"', '--machinereadable']);
      const info = {};
      
      const lines = output.split('\n');
      for (const line of lines) {
        const [key, value] = line.split('=');
        if (key && value) {
          info[key.trim()] = value.trim().replace(/^"|"$/g, '');
        }
      }
      
      return {
        status: info.VMState || 'unknown',
        memory: parseInt(info.memory) || 0,
        cpus: parseInt(info.cpus) || 1,
        osType: info.ostype || 'Unknown'
      };
    } catch (error) {
      logger.error(`Failed to get VM info for ${vmName}:`, error);
      return {
        status: 'unknown',
        memory: 0,
        cpus: 1,
        osType: 'Unknown'
      };
    }
  }

  async createVM(config) {
    try {
      const { name, osType, memory, cpus, diskSize } = config;
      
      // Create VM
      await this.executeCommand('createvm', [
        '--name', `"${name}"`,
        '--ostype', osType,
        '--register'
      ]);
      
      // Configure memory
      await this.executeCommand('modifyvm', [
        `"${name}"`,
        '--memory', memory.toString(),
        '--cpus', cpus.toString()
      ]);
      
      // Create and attach hard disk
      const vdiPath = path.join(process.env.VM_STORAGE_PATH || 'C:\\VirtualBox VMs', name, `${name}.vdi`);
      
      await this.executeCommand('createhd', [
        '--filename', `"${vdiPath}"`,
        '--size', diskSize.toString()
      ]);
      
      await this.executeCommand('storagectl', [
        `"${name}"`,
        '--name', '"SATA Controller"',
        '--add', 'sata',
        '--controller', 'IntelAHCI'
      ]);
      
      await this.executeCommand('storageattach', [
        `"${name}"`,
        '--storagectl', '"SATA Controller"',
        '--port', '0',
        '--device', '0',
        '--type', 'hdd',
        '--medium', `"${vdiPath}"`
      ]);
      
      logger.info(`Successfully created VM: ${name}`);
      return await this.getVMInfo(name);
    } catch (error) {
      logger.error(`Failed to create VM ${config.name}:`, error);
      throw error;
    }
  }

  async startVM(vmName) {
    try {
      await this.executeCommand('startvm', [`"${vmName}"`, '--type', 'headless']);
      logger.info(`Successfully started VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to start VM ${vmName}:`, error);
      throw error;
    }
  }

  async stopVM(vmName, force = false) {
    try {
      const command = force ? 'poweroff' : 'acpipowerbutton';
      await this.executeCommand('controlvm', [`"${vmName}"`, command]);
      logger.info(`Successfully stopped VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to stop VM ${vmName}:`, error);
      throw error;
    }
  }

  async pauseVM(vmName) {
    try {
      await this.executeCommand('controlvm', [`"${vmName}"`, 'pause']);
      logger.info(`Successfully paused VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to pause VM ${vmName}:`, error);
      throw error;
    }
  }

  async resumeVM(vmName) {
    try {
      await this.executeCommand('controlvm', [`"${vmName}"`, 'resume']);
      logger.info(`Successfully resumed VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to resume VM ${vmName}:`, error);
      throw error;
    }
  }

  async restartVM(vmName) {
    try {
      await this.executeCommand('controlvm', [`"${vmName}"`, 'reset']);
      logger.info(`Successfully restarted VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to restart VM ${vmName}:`, error);
      throw error;
    }
  }

  async deleteVM(vmName, deleteFiles = false) {
    try {
      // Stop VM if running
      try {
        await this.stopVM(vmName, true);
        // Wait a bit for VM to fully stop
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        // VM might already be stopped
      }
      
      const args = [`"${vmName}"`];
      if (deleteFiles) {
        args.push('--delete');
      }
      
      await this.executeCommand('unregistervm', args);
      logger.info(`Successfully deleted VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete VM ${vmName}:`, error);
      throw error;
    }
  }

  async createSnapshot(vmName, snapshotName, description = '') {
    try {
      const args = [`"${vmName}"`, 'take', `"${snapshotName}"`];
      if (description) {
        args.push('--description', `"${description}"`);
      }
      
      await this.executeCommand('snapshot', args);
      logger.info(`Successfully created snapshot ${snapshotName} for VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to create snapshot ${snapshotName} for VM ${vmName}:`, error);
      throw error;
    }
  }

  async restoreSnapshot(vmName, snapshotName) {
    try {
      await this.executeCommand('snapshot', [`"${vmName}"`, 'restore', `"${snapshotName}"`]);
      logger.info(`Successfully restored snapshot ${snapshotName} for VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to restore snapshot ${snapshotName} for VM ${vmName}:`, error);
      throw error;
    }
  }

  async deleteSnapshot(vmName, snapshotName) {
    try {
      await this.executeCommand('snapshot', [`"${vmName}"`, 'delete', `"${snapshotName}"`]);
      logger.info(`Successfully deleted snapshot ${snapshotName} for VM: ${vmName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete snapshot ${snapshotName} for VM ${vmName}:`, error);
      throw error;
    }
  }

  async listSnapshots(vmName) {
    try {
      const output = await this.executeCommand('snapshot', [`"${vmName}"`, 'list', '--machinereadable']);
      const snapshots = [];
      
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.startsWith('SnapshotName')) {
          const name = line.split('=')[1].replace(/^"|"$/g, '');
          snapshots.push({ name });
        }
      }
      
      return snapshots;
    } catch (error) {
      logger.error(`Failed to list snapshots for VM ${vmName}:`, error);
      return [];
    }
  }

  async executeGuestCommand(vmName, username, password, command) {
    try {
      const args = [
        `"${vmName}"`,
        '--username', username,
        '--password', password,
        '--',
        command
      ];
      
      const output = await this.executeCommand('guestcontrol', args);
      logger.info(`Successfully executed command on VM ${vmName}: ${command}`);
      return output;
    } catch (error) {
      logger.error(`Failed to execute command on VM ${vmName}:`, error);
      throw error;
    }
  }

  async getVMScreenshot(vmName, outputPath) {
    try {
      await this.executeCommand('controlvm', [`"${vmName}"`, 'screenshotpng', `"${outputPath}"`]);
      logger.info(`Successfully captured screenshot for VM: ${vmName}`);
      return outputPath;
    } catch (error) {
      logger.error(`Failed to capture screenshot for VM ${vmName}:`, error);
      throw error;
    }
  }
}

module.exports = new VirtualBoxService();
