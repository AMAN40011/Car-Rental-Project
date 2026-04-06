import express from "express";
import { addReview, getCarReviews, deleteReview, updateReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", protect, addReview);
router.get("/:carId", getCarReviews);
router.delete("/:id", protect, deleteReview);
router.put("/:id", protect, updateReview);
export default router;