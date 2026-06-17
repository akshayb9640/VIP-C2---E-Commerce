import { Cart } from '../Schema.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user;
    const cartItems = await Cart.find({ userId });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user;
    const { title, description, mainImg, size, quantity, price, discount } = req.body;

    const existingItem = await Cart.findOne({ userId, title, size });
    if (existingItem) {
      const newQty = Number(existingItem.quantity) + Number(quantity || 1);
      existingItem.quantity = String(newQty);
      const savedItem = await existingItem.save();
      return res.json(savedItem);
    }

    const newItem = new Cart({
      userId,
      title,
      description,
      mainImg,
      size,
      quantity: String(quantity || 1),
      price: Number(price),
      discount: Number(discount)
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity, size } = req.body;
    let updateFields = {};
    if (quantity !== undefined) updateFields.quantity = String(quantity);
    if (size !== undefined) updateFields.size = size;

    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
    res.json({ message: 'Cart item removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user;
    await Cart.deleteMany({ userId });
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
