import Review from "../models/Review.js";
import Car from "../models/Car.js";
import mongoose from "mongoose";
export const addReview = async (req, res) => {
  try {
    const { rating, comment, carId } = req.body;
    const userId = req.user.id;

    const existing = await Review.findOne({ user: userId, car: carId });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this car" });
    }

    const review = await Review.create({
      user: userId,
      car: carId,
      rating,
      comment
    });

    // ✅ SAFE RATING UPDATE
    const car = await Car.findById(carId);

    const total = car.totalReviews || 0;
    const avg = car.averageRating || 0;

    const newAvg = ((avg * total) + rating) / (total + 1);

    car.averageRating = newAvg;
    car.totalReviews = total + 1;

    await car.save();

    res.json({ message: "Review added", review });

  } catch (err) {
    console.log("Add review error:", err);
    res.status(500).json({ error: err.message });
  }
};
export const getCarReviews = async (req, res) => {
  try {
    const { carId } = req.params;

    // ✅ Prevent crash
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID"
      });
    }

    const reviews = await Review.find({ car: carId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });

  } catch (err) {
    console.log("Review error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // only owner can delete
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // 🔥 IMPORTANT (ownership check)
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.json({ message: "Review updated", review });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};