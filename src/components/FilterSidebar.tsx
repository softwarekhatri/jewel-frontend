import { useState } from 'react';
import { ProductFilters } from '../types';
import './FilterSidebar.css';

const CATEGORIES = [
  { value: 'gold',       label: 'Gold Jewellery' },
  { value: 'silver',     label: 'Silver Jewellery' },
  { value: 'artificial', label: 'Fashion Jewellery' },
];
const SUBCATEGORIES = [
  { value: 'necklace', label: 'Necklaces' }, { value: 'earrings', label: 'Earrings' },
  { value: 'rings',    label: 'Rings' },     { value: 'bangles',  label: 'Bangles' },
  { value: 'anklets',  label: 'Anklets' },   { value: 'bracelet', label: 'Bracelets' },
  { value: 'pendant',  label: 'Pendants' },  { value: 'set',      label: 'Sets' },
];
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
];

interface Props {
  filters: ProductFilters;
  onChange: (f: Partial<ProductFilters>) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar = ({ filters, onChange, onClear, isOpen, onClose }: Props) => {
  const [minP, setMinP] = useState(filters.minPrice || '');
  const [maxP, setMaxP] = useState(filters.maxPrice || '');

  return (
    <>
      <aside className={`filter-sidebar ${isOpen ? 'filter-sidebar--open' : ''}`}>
        <div className="filter-sidebar__header">
          <h3 className="filter-sidebar__title">Refine</h3>
          <div className="filter-sidebar__header-actions">
            <button className="filter-sidebar__clear" onClick={onClear}>Clear All</button>
            <button className="filter-sidebar__close" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="filter-divider" />

        {/* Sort */}
        <div className="filter-group">
          <h4 className="filter-group__title">Sort By</h4>
          <select
            className="filter-select"
            value={filters.sort || 'newest'}
            onChange={e => onChange({ sort: e.target.value, page: 1 })}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="filter-divider" />

        {/* Category */}
        <div className="filter-group">
          <h4 className="filter-group__title">Category</h4>
          {CATEGORIES.map(cat => (
            <label key={cat.value} className="filter-radio">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.value}
                onChange={() => onChange({ category: cat.value, page: 1 })}
                className="filter-radio__input"
              />
              <span className="filter-radio__mark" />
              <span className="filter-radio__label">{cat.label}</span>
            </label>
          ))}
          {filters.category && (
            <button className="filter-clear-link" onClick={() => onChange({ category: undefined, page: 1 })}>
              Clear category
            </button>
          )}
        </div>

        <div className="filter-divider" />

        {/* Type */}
        <div className="filter-group">
          <h4 className="filter-group__title">Type</h4>
          <div className="filter-tags">
            {SUBCATEGORIES.map(s => (
              <button
                key={s.value}
                className={`filter-tag ${filters.subcategory === s.value ? 'filter-tag--active' : ''}`}
                onClick={() => onChange({ subcategory: filters.subcategory === s.value ? undefined : s.value, page: 1 })}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-divider" />

        {/* Price */}
        <div className="filter-group">
          <h4 className="filter-group__title">Price Range (₹)</h4>
          <div className="filter-price">
            <input
              type="number"
              placeholder="Min"
              className="filter-price__input"
              value={minP}
              onChange={e => setMinP(e.target.value)}
            />
            <span className="filter-price__sep">—</span>
            <input
              type="number"
              placeholder="Max"
              className="filter-price__input"
              value={maxP}
              onChange={e => setMaxP(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline btn-sm filter-price__apply"
            onClick={() => onChange({ minPrice: minP, maxPrice: maxP, page: 1 })}
          >
            Apply
          </button>
        </div>
      </aside>
      {isOpen && <div className="filter-overlay" onClick={onClose} />}
    </>
  );
};

export default FilterSidebar;
