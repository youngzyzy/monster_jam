const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a lesson title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add the cost of lessons"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: String,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  academy: {
    type: mongoose.Schema.ObjectId,
    ref: "Academies",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// static method to get average of course $tuition
LessonSchema.statics.getAverageCost = async function (academyId) {
  const obj = await this.aggregate([
    {
      $match: { academy: academyId },
    },
    {
      $group: {
        _id: "$academy",
        averageCost: { $avg: `$tuition` },
      },
    },
  ]);
  try {
    await this.model("Academies").findByIdAndUpdate(academyId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

// call getAverageCost after save
LessonSchema.post("save", function () {
  this.constructor.getAverageCost(this.academy);
});
// call getAverageCost before delete
LessonSchema.pre("deleteOne", { document: true, query: false }, function () {
  console.log("hitting remove middleware");
  this.constructor.getAverageCost(this.academy);
});

module.exports = mongoose.model("Lessons", LessonSchema);
