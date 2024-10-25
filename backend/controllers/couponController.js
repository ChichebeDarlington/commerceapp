import { Coupon } from "../models/couponModel.js";

export const getCoupon = async (req, res) => {
  const { isActive } = req.body;
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: isActive,
    });
    return res.status(200).json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(403).json({ msg: "Invalid coupon" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(403).json({ msg: "Coupon expired" });
    }

    return res.status(200).json({
      msg: " Valid coupon",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
