import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { Product, ProductFilters, PaginationMeta } from '../types';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import './ProductsPage.css';

const catTitle: Record<string, string> = {
  gold:       'Gold Jewellery',
  silver:     'Silver Jewellery',
  artificial: 'Fashion Jewellery',
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const getFilters = useCallback((): ProductFilters => ({
    category:    searchParams.get('category')    || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    minPrice:    searchParams.get('minPrice')    || undefined,
    maxPrice:    searchParams.get('maxPrice')    || undefined,
    search:      searchParams.get('search')      || undefined,
    sort:        searchParams.get('sort')        || 'newest',
    page:        Number(searchParams.get('page')) || 1,
    limit:       12,
  }), [searchParams]);

  useEffect(() => {
    setLoading(true);
    productsAPI.getProducts(getFilters())
      .then(r => { setProducts(r.data.products); setPagination(r.data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [getFilters]);

  const updateFilters = (f: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(f).forEach(([k, v]) => {
      if (v === undefined || v === '') params.delete(k);
      else params.set(k, String(v));
    });
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});
  const filters = getFilters();
  const cat = filters.category;

  return (
    <div className="page products-page">
      {/* Header */}
      <div className="products-page__header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">›</span>
            <span>Collections</span>
            {cat && (
              <>
                <span className="breadcrumb-sep">›</span>
                <span>{catTitle[cat] || cat}</span>
              </>
            )}
          </div>
          <h1 className="products-page__title">
            {cat ? catTitle[cat] || cat : 'All Collections'}
          </h1>
          {!loading && pagination && (
            <p className="products-page__count">{pagination.total} pieces</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="products-page__body">
        <div className="container">
          <div className="products-page__layout">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
            />

            <div className="products-page__main">
              {/* Toolbar */}
              <div className="products-page__toolbar">
                <button className="filter-toggle-btn" onClick={() => setFilterOpen(true)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 3h14M4 8h8M7 13h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Filters
                </button>
                <span className="products-page__count-inline">
                  {loading ? '' : `${pagination?.total ?? 0} results`}
                </span>
              </div>

              {loading ? (
                <div className="products-grid">
                  {[...Array(12)].map((_,i) => (
                    <div key={i} className="skeleton-card">
                      <div className="skeleton skeleton-img" style={{ aspectRatio: '1/1' }} />
                      <div style={{ padding: 14 }}>
                        <div className="skeleton" style={{ height: 13, marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 12, width: '65%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">◈</div>
                  <h3>No pieces found</h3>
                  <p>Try adjusting your filters or browse all collections.</p>
                  <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
              )}

              {/* Pagination — static in flow, no absolute positioning */}
              {pagination && pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination__btn"
                    disabled={pagination.page <= 1}
                    onClick={() => updateFilters({ page: pagination.page - 1 })}
                  >
                    ← Prev
                  </button>

                  {[...Array(pagination.pages)].map((_,i) => (
                    <button
                      key={i+1}
                      className={`pagination__btn ${pagination.page === i+1 ? 'pagination__btn--active' : ''}`}
                      onClick={() => updateFilters({ page: i+1 })}
                    >
                      {i+1}
                    </button>
                  ))}

                  <button
                    className="pagination__btn"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => updateFilters({ page: pagination.page + 1 })}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
