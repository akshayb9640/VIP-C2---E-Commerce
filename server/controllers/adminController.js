import { User, Product, Orders, Admin } from '../Schema.js';

export const getMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const allProducts = await Product.countDocuments();
    const allOrders = await Orders.countDocuments();

    res.json({
      totalUsers,
      allProducts,
      allOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminSettings = async (req, res) => {
  try {
    let settings = await Admin.findOne();
    if (!settings) {
      settings = new Admin({
        banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop',
        categories: ['Fashion', 'Electronics', 'Mobiles', 'Groceries', 'Sports Equipments']
      });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const { banner, categories } = req.body;
    let settings = await Admin.findOne();
    if (!settings) {
      settings = new Admin({ banner, categories });
    } else {
      if (banner !== undefined) settings.banner = banner;
      if (categories !== undefined) settings.categories = categories;
    }
    const saved = await settings.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
