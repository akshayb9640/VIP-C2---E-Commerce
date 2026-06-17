import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App';

export default function NewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useApp();

  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImg, setMainImg] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [sizes, setSizes] = useState({ S: false, M: false, L: false, XL: false });
  const [gender, setGender] = useState('Unisex');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const catRes = await fetch('http://localhost:8000/api/settings');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories);
          if (catData.categories.length > 0) {
            setCategory(catData.categories[0]);
          }
        }

        if (isEditMode) {
          const prodRes = await fetch(`http://localhost:8000/api/products/${id}`);
          if (prodRes.ok) {
            const prod = await prodRes.json();
            setTitle(prod.title || '');
            setDescription(prod.description || '');
            setMainImg(prod.mainImg || '');
            setImg1(prod.carousel?.[0] || '');
            setImg2(prod.carousel?.[1] || '');
            setImg3(prod.carousel?.[2] || '');
            
            const sizeState = { S: false, M: false, L: false, XL: false };
            if (prod.sizes) {
              prod.sizes.forEach(s => {
                if (sizeState.hasOwnProperty(s)) {
                  sizeState[s] = true;
                }
              });
            }
            setSizes(sizeState);
            setGender(prod.gender || 'Unisex');
            setCategory(prod.category || '');
            setPrice(prod.price || '');
            setDiscount(prod.discount || '');
          }
        }
      } catch (err) {
        console.error('Error loading product form data:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEditMode]);

  const handleSizeToggle = (size) => {
    setSizes({
      ...sizes,
      [size]: !sizes[size]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const carousel = [img1, img2, img3].filter(url => url.trim() !== '');
    const activeSizes = Object.keys(sizes).filter(size => sizes[size]);

    const payload = {
      title,
      description,
      mainImg,
      carousel,
      sizes: activeSizes,
      gender,
      category,
      price: Number(price),
      discount: Number(discount)
    };

    try {
      const url = isEditMode 
        ? `http://localhost:8000/api/products/${id}` 
        : 'http://localhost:8000/api/products';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
        navigate('/admin/products');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to save product.');
      }
    } catch (err) {
      alert('Error saving product.');
    }
  };

  if (loading) {
    return <div className="admin-container"><div className="text-center mt-4">Loading form...</div></div>;
  }

  return (
    <div className="admin-container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="admin-card" style={{ maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3 className="admin-card-title">{isEditMode ? 'Update Product' : 'New Product'}</h3>
        
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Product name</label>
              <input 
                type="text" 
                className="admin-input" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Product Description</label>
              <input 
                type="text" 
                className="admin-input" 
                required 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail Img url</label>
            <input 
              type="text" 
              className="admin-input" 
              required 
              value={mainImg}
              onChange={(e) => setMainImg(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Add on img1 url</label>
              <input 
                type="text" 
                className="admin-input" 
                value={img1}
                onChange={(e) => setImg1(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Add on img2 url</label>
              <input 
                type="text" 
                className="admin-input" 
                value={img2}
                onChange={(e) => setImg2(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Add on img3 url</label>
              <input 
                type="text" 
                className="admin-input" 
                value={img3}
                onChange={(e) => setImg3(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: '1rem 0' }}>
            <label className="form-label">Available Size</label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              {['S', 'M', 'L', 'XL'].map((size) => (
                <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={sizes[size]} 
                    onChange={() => handleSizeToggle(size)}
                    style={{ width: '16px', height: '16px', accentColor: '#f97316' }}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '120px' }}>
              <label className="form-label">Gender</label>
              <select 
                className="admin-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Category</label>
              <select 
                className="admin-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Price (INR)</label>
              <input 
                type="number" 
                className="admin-input" 
                required 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Discount (%)</label>
              <input 
                type="number" 
                className="admin-input" 
                required 
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-admin-submit-blue"
            style={{ display: 'block', width: '100%', marginTop: '1.5rem' }}
          >
            {isEditMode ? 'Update product' : 'Add product'}
          </button>
        </form>
      </div>
    </div>
  );
}
