const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Script name is required'],
    trim: true,
    maxlength: [100, 'Script name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Script type is required'],
    enum: ['powershell', 'batch', 'vbs', 'javascript', 'bash'],
    default: 'powershell'
  },
  
  content: {
    type: String,
    required: [true, 'Script content is required'],
    maxlength: [50000, 'Script content cannot exceed 50000 characters']
  },
  
  trigger: {
    type: String,
    required: [true, 'Script trigger is required'],
    enum: ['startup', 'shutdown', 'manual', 'scheduled'],
    default: 'manual'
  },
  
  executionOrder: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  timeout: {
    type: Number,
    default: 300, // 5 minutes
    min: 1,
    max: 3600 // 1 hour
  },
  
  environment: {
    type: Map,
    of: String,
    default: new Map()
  },
  
  workingDirectory: {
    type: String,
    default: ''
  },
  
  runAsAdmin: {
    type: Boolean,
    default: false
  },
  
  continueOnError: {
    type: Boolean,
    default: false
  },
  
  schedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    cron: {
      type: String,
      default: ''
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  associatedVMs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VM'
  }],
  
  tags: [String],
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastExecution: {
    timestamp: Date,
    status: {
      type: String,
      enum: ['success', 'error', 'timeout', 'cancelled']
    },
    output: String,
    error: String,
    duration: Number
  },
  
  executionHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    vmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VM'
    },
    status: {
      type: String,
      enum: ['success', 'error', 'timeout', 'cancelled'],
      required: true
    },
    output: String,
    error: String,
    duration: Number,
    triggeredBy: {
      type: String,
      enum: ['user', 'system', 'schedule'],
      default: 'user'
    }
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for file extension
scriptSchema.virtual('fileExtension').get(function() {
  const extensions = {
    'powershell': '.ps1',
    'batch': '.bat',
    'vbs': '.vbs',
    'javascript': '.js',
    'bash': '.sh'
  };
  return extensions[this.type] || '.txt';
});

// Virtual for execution success rate
scriptSchema.virtual('successRate').get(function() {
  if (this.executionHistory.length === 0) return 100;
  
  const successCount = this.executionHistory.filter(exec => exec.status === 'success').length;
  return Math.round((successCount / this.executionHistory.length) * 100);
});

// Index for better query performance
scriptSchema.index({ name: 1 });
scriptSchema.index({ type: 1 });
scriptSchema.index({ trigger: 1 });
scriptSchema.index({ associatedVMs: 1 });
scriptSchema.index({ createdBy: 1 });
scriptSchema.index({ isActive: 1 });

// Pre-save middleware to limit execution history
scriptSchema.pre('save', function(next) {
  if (this.executionHistory && this.executionHistory.length > 100) {
    this.executionHistory = this.executionHistory.slice(-100);
  }
  next();
});

module.exports = mongoose.model('Script', scriptSchema);
