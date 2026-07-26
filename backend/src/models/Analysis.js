import mongoose from 'mongoose';

// A saved bond analysis owned by a Firebase user. `input` is the raw bond form
// payload; `result` is the full output of analyzeBond(). ratingBand/finalScore
// are denormalized for cheap list rendering.
const analysisSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    input: { type: mongoose.Schema.Types.Mixed, required: true },
    result: { type: mongoose.Schema.Types.Mixed, required: true },
    ratingBand: { type: String },
    finalScore: { type: Number },
  },
  { timestamps: true },
);

// Supports newest-first cursor pagination scoped to a user.
analysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Analysis', analysisSchema);
