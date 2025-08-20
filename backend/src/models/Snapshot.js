const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Snapshot name is required'],
    trim: true,
    maxlength: [100, 'Snapshot name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  vmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VM',
    required: [true, 'VM ID is required']
  },
  
  uuid: {
    type: String,
    unique: true,
    sparse: true
  },
  
  parentSnapshotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snapshot'
  },
  
  size: {
    type: Number,
    default: 0
  },
  
  vmState: {
    type: String,
    enum: ['running', 'stopped', 'paused'],
    required: true
  },
  
  isAutoSnapshot: {
    type: Boolean,
    default: false
  },
  
  schedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    time: {
      type: String,
      default: '02:00'
    },
    maxSnapshots: {
      type: Number,
      default: 7,
      min: 1,
      max: 30
    }
  },
  
  tags: [String],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  restoredCount: {
    type: Number,
    default: 0
  },
  
  lastRestored: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
snapshotSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Index for better query performance
snapshotSchema.index({ vmId: 1, createdAt: -1 });
snapshotSchema.index({ name: 1 });
snapshotSchema.index({ isAutoSnapshot: 1 });
snapshotSchema.index({ createdBy: 1 });

// Compound index for VM snapshots
snapshotSchema.index({ vmId: 1, name: 1 }, { unique: true });

// Pre-remove middleware to handle cascade deletion
snapshotSchema.pre('remove', async function(next) {
  // Remove child snapshots
  await this.constructor.deleteMany({ parentSnapshotId: this._id });
  next();
});

module.exports = mongoose.model('Snapshot', snapshotSchema);
