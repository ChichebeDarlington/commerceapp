import User from "../models/authModels.js";
import { Order } from "../models/orderModel.js";
import product from "../models/productsModel.js";

export const dataAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const ensDate = new Date();
    const startDate = new Date(ensDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, ensDate);

    return res.status(200).json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error in analytics controller", error.message);
    return res.status(500).json({ msg: "server error", error: error.message });
  }
};

export const getAnalyticsData = async () => {
  const totalUser = await User.countDocuments();
  const totalProducts = await product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, //Groups all documents together
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUser,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, ensDate) => {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: ensDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  //   date
  const dateArray = getDateInRange(startDate, ensDate);

  return dailySalesData.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);

    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    };
  });
};

function getDateInRange(startDate, ensDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= ensDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
