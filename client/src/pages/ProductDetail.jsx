import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user, fetchCartCount } = useApp();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setActiveImg(data.mainImg);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async (redirect = false) => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }

    setAdding(true);
    try {
      const res = await fetch('http://localhost:8000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          mainImg: product.mainImg,
          size: selectedSize,
          quantity: "1",
          price: product.price,
          discount: product.discount
        })
      });

      if (res.ok) {
        await fetchCartCount();
        if (redirect) {
          navigate('/cart');
        } else {
          alert('Item added to cart!');
        }
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to add item to cart.');
      }
    } catch (err) {
      alert('Connection error. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="detail-container"><div className="text-center mt-4">Loading product details...</div></div>;
  }

  if (!product) {
    return (
      <div className="detail-container">
        <div className="text-center mt-4">
          <p>Product not found.</p>
          <button className="nav-btn mt-4" onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  const currentPrice = Math.round(product.price - (product.price * product.discount / 100));

  return (
    <div className="detail-container">
      {/* Images Left Section */}
      <div className="detail-images-section">
        <img 
          src={activeImg} 
          alt={product.title} 
          className="main-detail-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop';
          }}
        />
        {product.carousel && product.carousel.length > 0 && (
          <div className="carousel-thumbnails">
            <img 
              src={product.mainImg} 
              alt="main" 
              className={`thumbnail-img ${activeImg === product.mainImg ? 'active' : ''}`}
              onClick={() => setActiveImg(product.mainImg)}
            />
            {product.carousel.map((imgUrl, idx) => (
              <img 
                key={idx}
                src={imgUrl} 
                alt={`carousel-${idx}`} 
                className={`thumbnail-img ${activeImg === imgUrl ? 'active' : ''}`}
                onClick={() => setActiveImg(imgUrl)}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Right Section */}
      <div className="detail-info-section">
        <h1 className="detail-title">{product.title}</h1>
        <p className="detail-desc">{product.description}</p>
        
        <div className="detail-price-row">
          <span className="detail-price-current">₹ {currentPrice}</span>
          {product.discount > 0 && (
            <>
              <span className="detail-price-original">₹ {product.price}</span>
              <span className="detail-price-discount">({product.discount}% off)</span>
            </>
          )}
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="size-selector-section">
            <h4 className="form-label" style={{ marginBottom: '0.75rem' }}>Select Size / Option</h4>
            <div className="sizes-grid">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="detail-actions">
          <button 
            className="btn-add-cart" 
            onClick={() => handleAddToCart(false)}
            disabled={adding}
          >
            Add to Cart
          </button>
          <button 
            className="btn-buy-now" 
            onClick={() => handleAddToCart(true)}
            disabled={adding}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
