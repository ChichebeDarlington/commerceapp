import Products from "../models/productsModel.js";

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = req.user;

    const existingItem = await user.cartItems.find(
      (item) => item.id === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    return res.status(201).json(user.cartItems);
  } catch (error) {
    console.log("Error in the addtocart controller", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const removeAllCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    return res.status(201).json(user.cartItems);
  } catch (error) {
    console.log("Error in the removeAllCart controller", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { id: productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;

  try {
    const existingItem = await user.cartItems.find(
      (item) => item.id === productId
    );
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.status(200).json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      return res.status(200).json(user.cartItems);
    } else {
      return res.status(404).json("Item not found");
    }
  } catch (error) {
    console.log("Error in the addtocart controller", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const products = await Products.find({ _id: { $in: req.user.cartItems } });

    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    return res.status(200).json(cartItems);
  } catch (error) {
    console.log("Error in the getCartProducts controller", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
