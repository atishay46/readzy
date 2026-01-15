const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    drivePreviewUrl: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    lastReadAt: { type: Number, default: null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true // 🔹 index 1
    }
  },
  { timestamps: true }
);

// 🔹 index 2 (compound index)
BookSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("Book", BookSchema);
