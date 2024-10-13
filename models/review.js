const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a number between 1 and 10"],
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

// prevent user from submitting more than 1 review per academy
ReviewSchema.index({ academy: 1, user: 1 }, { unique: true });

// static method to get average rating
ReviewSchema.statics.getAverageRating = async function (academyId) {
  const obj = await this.aggregate([
    {
      $match: { academy: academyId },
    },
    {
      $group: {
        _id: "$academy",
        averageRating: { $avg: `$rating` },
      },
    },
  ]);
  try {
    await this.model("Academies").findByIdAndUpdate(academyId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};

// call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.academy);
});
// call getAverageCost before delete
ReviewSchema.pre("deleteOne", { document: true, query: false }, function () {
  console.log("hitting remove middleware");
  this.constructor.getAverageRating(this.academy);
});

module.exports = mongoose.model("Review", ReviewSchema);
