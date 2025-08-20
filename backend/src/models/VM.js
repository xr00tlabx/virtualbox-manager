const mongoose = require('mongoose');

const vmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'VM name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'VM name cannot exceed 100 characters']
  },
  
  uuid: {
    type: String,
    unique: true,
    sparse: true
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  osType: {
    type: String,
    required: [true, 'OS type is required'],
    enum: ['Windows', 'Linux', 'MacOS', 'Other']
  },
  
  status: {
    type: String,
    enum: ['running', 'stopped', 'paused', 'saved', 'unknown'],
    default: 'stopped'
  },
  
  memory: {
    type: Number,
    required: [true, 'Memory size is required'],
    min: [512, 'Memory must be at least 512 MB']
  },
  
  cpus: {
    type: Number,
    required: [true, 'CPU count is required'],
    min: [1, 'Must have at least 1 CPU'],
    max: [32, 'Cannot exceed 32 CPUs']
  },
  
  diskSize: {
    type: Number,
    required: [true, 'Disk size is required'],
    min: [1, 'Disk size must be at least 1 GB']
  },
  
  networkAdapters: [{
    type: {
      type: String,
      enum: ['NAT', 'Bridged', 'Internal', 'Host-only'],
      default: 'NAT'
    },
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  
  sharedFolders: [{
    name: String,
    hostPath: String,
    guestPath: String,
    readOnly: {
      type: Boolean,
      default: false
    }
  }],
  
  snapshots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snapshot'
  }],
  
  startupScripts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Script'
  }],
  
  shutdownScripts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Script'
  }],
  
  tags: [String],
  
  lastStarted: Date,
  lastStopped: Date,
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  isTemplate: {
    type: Boolean,
    default: false
  },
  
  templateFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VM'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for uptime calculation
vmSchema.virtual('uptime').get(function() {
  if (this.status === 'running' && this.lastStarted) {
    return Date.now() - this.lastStarted.getTime();
  }
  return 0;
});

// Index for better query performance
vmSchema.index({ name: 1 });
vmSchema.index({ status: 1 });
vmSchema.index({ osType: 1 });
vmSchema.index({ createdBy: 1 });

// Pre-save middleware
vmSchema.pre('save', function(next) {
  if (this.status === 'running' && !this.lastStarted) {
    this.lastStarted = new Date();
  }
  if (this.status === 'stopped' && this.lastStarted) {
    this.lastStopped = new Date();
  }
  next();
});

module.exports = mongoose.model('VM', vmSchema);
