import { Orders } from '../Schema.js';

export const getOrders = async (req, res) => {
  try {
    const userId = req.user;
    const usertype = req.usertype;

    let orders;
    if (usertype === 'Admin') {
      orders = await Orders.find().sort({ _id: -1 });
    } else {
      orders = await Orders.find({ userId }).sort({ _id: -1 });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { name, email, mobile, address, pincode, paymentMethod, items } = req.body;

    if (!name || !email || !mobile || !address || !pincode || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({ message: 'All order fields and items are required.' });
    }

    const orderDate = new Date().toISOString().split('T')[0];
    const deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const orderDocuments = items.map(item => {
      return new Orders({
        userId,
        name,
        email,
        mobile,
        address,
        pincode,
        title: item.title,
        description: item.description,
        mainImg: item.mainImg,
        size: item.size,
        quantity: Number(item.quantity),
        price: Number(item.price),
        discount: Number(item.discount),
        paymentMethod,
        orderDate,
        deliveryDate,
        orderStatus: 'order placed'
      });
    });

    const savedOrders = [];
    for (const doc of orderDocuments) {
      const saved = await doc.save();
      savedOrders.push(saved);
    }

    res.status(201).json(savedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) {
      return res.status(400).json({ message: 'Order status is required.' });
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user;
    const usertype = req.usertype;
    const order = await Orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (usertype !== 'Admin' && order.userId !== userId) {
      return res.status(403).json({ message: 'Access denied. You can only cancel your own orders.' });
    }

    await Orders.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
