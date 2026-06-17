import { Product } from '../Schema.js';

export const getProducts = async (req, res) => {
  try {
    const { category, gender, sortBy, search } = req.query;
    let query = {};

    if (category) {
      const categoriesArray = category.split(',');
      query.category = { $in: categoriesArray };
    }

    if (gender) {
      const gendersArray = gender.split(',');
      query.gender = { $in: gendersArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sortBy === 'Price (low to high)') {
      sortOption.price = 1;
    } else if (sortBy === 'Price (high to low)') {
      sortOption.price = -1;
    } else if (sortBy === 'Discount') {
      sortOption.discount = -1;
    } else {
      // Default/Popular
      sortOption._id = -1;
    }

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, sizes, category, gender, price, discount } = req.body;
    
    const newProduct = new Product({
      title,
      description,
      mainImg,
      carousel: carousel || [],
      sizes: sizes || [],
      category,
      gender,
      price: Number(price),
      discount: Number(discount)
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, sizes, category, gender, price, discount } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        mainImg,
        carousel,
        sizes,
        category,
        gender,
        price: Number(price),
        discount: Number(discount)
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
