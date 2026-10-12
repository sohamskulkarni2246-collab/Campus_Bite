import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PlusCircle, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Clock, 
  IndianRupee, 
  Boxes 
} from 'lucide-react';

// Convenient photo presets for quick staff addition
const PRESET_PHOTOS = [
  { name: 'Samosa', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { name: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Thali / Meal', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
  { name: 'Dosa', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cold Coffee', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80' },
  { name: 'Fried Rice', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Sandwich', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { name: 'Chai / Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
];

export default function AddItemForm({ onAdded }) {
  const { addNewItem, showToast } = useApp();

  // Form states per user requirements: photo, name, quantity, price
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Snacks');
  const [isVeg, setIsVeg] = useState(true);
  const [prepTime, setPrepTime] = useState(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Handle local image file upload & convert to base64 preview
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
      showToast('Image uploaded and preview ready!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Item Name is required', 'warning');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast('Please enter a valid price', 'warning');
      return;
    }
    if (!quantity || Number(quantity) < 0) {
      showToast('Please enter available quantity/stock', 'warning');
      return;
    }

    // Default image if none chosen
    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

    setIsUploading(true);
    const success = await addNewItem({
      name: name.trim(),
      price: Number(price),
      quantity: Number(quantity),
      category,
      isVeg,
      prepTime: Number(prepTime) || 10,
      description: description.trim(),
      imageUrl: finalImage,
    });
    setIsUploading(false);

    if (success) {
      // Reset form
      setName('');
      setPrice('');
      setQuantity('');
      setDescription('');
      setImageUrl('');
      setPrepTime(10);
      if (onAdded) onAdded();
    }
  };

  return (
    <div className="form-card animate-fade-in">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800 }}>➕ Add New Food Item to Menu</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Food items added here will be immediately available for students to browse and preorder.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Item Name */}
          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Crispy Paneer Samosa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Snacks">Snacks & Quick Bites</option>
              <option value="Meals">Meals & Thali</option>
              <option value="Fast Food">Fast Food & Rolls</option>
              <option value="South Indian">South Indian</option>
              <option value="Beverages">Beverages & Drinks</option>
              <option value="Desserts">Desserts & Sweets</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 40"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              required
            />
          </div>

          {/* Available Quantity / Stock */}
          <div className="form-group">
            <label className="form-label">Available Stock (Quantity) *</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 25"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              required
            />
          </div>

          {/* Estimated Prep Time */}
          <div className="form-group">
            <label className="form-label">Est. Preparation Time (Minutes) *</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 10"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min="1"
              required
            />
          </div>

          {/* Food Dietary Type */}
          <div className="form-group">
            <label className="form-label">Dietary Preference *</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="dietary"
                  checked={isVeg === true}
                  onChange={() => setIsVeg(true)}
                />
                <span className="veg-badge"></span>
                <span>Vegetarian</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="dietary"
                  checked={isVeg === false}
                  onChange={() => setIsVeg(false)}
                />
                <span className="non-veg-badge"></span>
                <span>Non-Vegetarian</span>
              </label>
            </div>
          </div>
        </div>

        {/* Photo Upload & Presets Section */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">Food Photo / Image *</label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '8px' }}>
            {/* Upload or URL input */}
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <label className="nav-btn" style={{ cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                  <Upload size={16} />
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <input
                type="text"
                className="form-control"
                style={{ width: '100%', fontSize: '13px' }}
                placeholder="Or paste an image URL (http://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />

              {/* Quick Preset Buttons */}
              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  ⚡ Or click a quick food photo preset:
                </span>
                <div className="photo-presets-grid">
                  {PRESET_PHOTOS.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      className={`preset-chip ${imageUrl === preset.url ? 'active' : ''}`}
                      onClick={() => setImageUrl(preset.url)}
                    >
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="photo-preview-box">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" onError={() => setImageUrl('')} />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={36} style={{ margin: '0 auto 6px' }} />
                  <p style={{ fontSize: '12px' }}>Photo preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Description (Optional)</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="e.g. Served hot with homemade mint & tamarind chutney."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="checkout-btn"
          disabled={isUploading}
          style={{ maxWidth: '300px' }}
        >
          <PlusCircle size={18} />
          <span>{isUploading ? 'Adding to Menu...' : 'Add Food Item to Menu'}</span>
        </button>
      </form>
    </div>
  );
}
