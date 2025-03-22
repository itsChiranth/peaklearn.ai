import mongoose from "mongoose";

const StudyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  hoursPerDay: { type: Number, required: true },
  completed: { type: Boolean, default: false },
});

const StudyPlan = mongoose.model("StudyPlan", StudyPlanSchema);
export default StudyPlan;
