const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    group: {
      type: String,
      enum: ['general', 'shipping', 'tax', 'footer', 'header', 'social', 'seo', 'payment'],
      default: 'general',
    },
    description: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

settingsSchema.index({ key: 1 });
settingsSchema.index({ group: 1 });

// Static: get setting by key
settingsSchema.statics.getSetting = async function (key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static: set setting
settingsSchema.statics.setSetting = async function (key, value, group = 'general', userId = null) {
  return this.findOneAndUpdate(
    { key },
    { value, group, updatedBy: userId },
    { upsert: true, new: true }
  );
};

// Static: get all settings by group
settingsSchema.statics.getByGroup = async function (group) {
  const settings = await this.find({ group });
  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
};

module.exports = mongoose.model('Settings', settingsSchema);
