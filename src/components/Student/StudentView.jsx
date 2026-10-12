import React from 'react';
import { useApp } from '../../context/AppContext';
import FoodCard from './FoodCard';
import EmptyMenuState from './EmptyMenuState';
import { 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  Banknote, 
  Flame, 
  Sparkles,
  SlidersHorizontal 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Snacks',
  'Meals',
  'Fast Food',
  'South Indian',
  'Beverages',
  'Desserts',
];

export default function StudentView() {
  const { 
    items, 
    itemsLoading, 
    cartCount, 
    cartTotal, 
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isVegOnly,
    setIsVegOnly
  } = useApp();

  // Filter items based on category, veg filter, and search
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesVeg = !isVegOnly || item.isVeg === true;

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesVeg && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero Banner (Swiggy & Zomato Aesthetic) */}
      <div className="hero-banner">
        <div className="hero-banner-content">
          <h2>Campus Pre-Order Hub 🍔</h2>
          <p>
            Order ahead from the college canteen, skip long break-time queues, and 
            pick up warm, fresh food instantly!
          </p>

          <div className="hero-badges">
            <span className="hero-pill">
              <Clock size={13} color="#ea580c" />
              <span>Real-time Prep Tracking</span>
            </span>
            <span className="hero-pill">
              <Banknote size={13} color="#16a34a" />
              <span>Offline Payment (Cash/UPI at counter)</span>
            </span>
            <span className="hero-pill">
              <Flame size={13} color="#dc2626" />
              <span>Freshly Made Upon Order</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Search */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search for snacks, meals, drinks, rolls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Veg Only Toggle */}
        <button
          className={`veg-toggle-btn ${isVegOnly ? 'active' : ''}`}
          onClick={() => setIsVegOnly(!isVegOnly)}
        >
          <span className="veg-badge"></span>
          <span>Pure Veg Only</span>
        </button>

        {/* Category Chips Scroll */}
        <div className="categories-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid or Empty State */}
      {itemsLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍲</div>
          <p>Connecting to canteen menu...</p>
        </div>
      ) : items.length === 0 ? (
        /* Explicit requirement: initially no food items cards, loaded from backend */
        <EmptyMenuState />
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            No items match your search or filter.
          </p>
          <button
            className="nav-btn"
            style={{ marginTop: '12px' }}
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setIsVegOnly(false);
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="food-grid">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Swiggy Signature Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="floating-cart-pill" onClick={() => setIsCartOpen(true)}>
          <div className="cart-pill-left">
            <span className="cart-pill-count">{cartCount} ITEMS</span>
            <span className="cart-pill-price">₹{cartTotal}</span>
          </div>
          <div className="cart-pill-right">
            <span>VIEW CART</span>
            <ArrowRight size={18} />
          </div>
        </div>
      )}
    </div>
  );
}
