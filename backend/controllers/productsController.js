import { redis } from "../lib/redis.js";
import Products from "../models/productsModel.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    return res.status(200).json({ products });
  } catch (error) {
    console.log("Internal server error");
    return res.status(200).json({ msg: "server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts));
    }

    // if not in redis, fetch from mongodb
    featuredProducts = await Products.find({ isFeatured: true }).lean(); //.lean() returns js plain object instead of mongodb document
    if (!featuredProducts) {
      return res.status(404).json({ msg: "No featured products" });
    }

    // store in redis if there is featured products found, for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeatured controller", error.message);
    return res.status(500).json({ msg: "server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, image, category } = req.body;

  try {
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "product",
      });
    }

    const product = await Products.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.log("Error occure while creating products", error.message);

    return res.status(201).json({ msg: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "No product found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log("errorl deleting image", error);
      }
    }
    await Products.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: "Product deleted" });
  } catch (error) {
    console.log("server error", error.message);
    return res
      .status(200)
      .json({ msg: "error while deleting products", error: error.message });
  }
};

export const recommendedProducts = async (req, res) => {
  try {
    const products = await Products.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
    ]);
    return res.status(200).json(products);
  } catch (error) {
    console.log("server error", error.message);
    return res.status(200).json({
      msg: "error while in recommended products",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Products.find({ category });
    return res.status(200).json({ products });
  } catch (error) {
    console.log("error in getcatogory controller", error.message);
    return res.status(200).json({
      msg: "error while in category products",
      error: error.message,
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductCache();
      return res.status(200).json(product);
    } else {
      return res.status(200).json({ msg: "Product not found" });
    }
  } catch (error) {
    console.log("error in togglefeatured controller", error.message);
    return res.status(200).json({
      msg: "server error",
      error: error.message,
    });
  }
};

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Products.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in update cache function", error);
  }
}
