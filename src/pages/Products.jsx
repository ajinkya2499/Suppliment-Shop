import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, getCategories } from "../services/api";
import ProductCard from "../components/ui/ProductCard";
import { FiGrid, FiList, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import "./Products.css";

const SORT_OPTIONS = [
  { label: "Popularity",        value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated",          value: "rating" },
  { label: "Newest",             value: "newest" },
];

const BRANDS   = ["Optimum Nutrition","MuscleBlaze","Dymatize","Cellucor","AS-IT-IS","HealthKart"];
const RATINGS  = [4.5, 4.0, 3.5];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── state ── */
  const [allProducts, setAllProducts]   = useState([]);
  const [categories,  setCategories]    = useState([]);
  const [filtered,    setFiltered]      = useState([]);
  const [loading,     setLoading]       = useState(true);
  const [viewMode,    setViewMode]      = useState("grid");  // grid | list
  const [openSections,setOpenSections]  = useState({ category:true, price:true, brand:true, rating:true });

  /* ── filters ── */
  const [selCategories, setSelCategories] = useState([]);
  const [selBrands,     setSelBrands]     = useState([]);
  const [selRating,     setSelRating]     = useState(null);
  const [priceRange,    setPriceRange]    = useState([0, 10000]);
  const [sortBy,        setSortBy]        = useState("popular");

  /* ── load data once ── */
  useEffect(() => {
    Promise.all([getAllProducts(), getCategories()]).then(([pRes, cRes]) => {
      setAllProducts(pRes.data);
      setCategories(cRes.data);
      setLoading(false);
    });
  }, []);

  /* ── read URL params on mount ── */
  useEffect(() => {
    const cat    = searchParams.get("category");
    const search = searchParams.get("search");
    if (cat) setSelCategories([cat]);
    if (search) { /* handled in filter below */ }
  // eslint-disable-next-line
  }, []);

  /* ── apply filters whenever deps change ── */
  const applyFilters = useCallback(() => {
    const search = searchParams.get("search") || "";
    let result   = [...allProducts];

    if (search)
      result = result.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      );

    if (selCategories.length)
      result = result.filter(p => selCategories.includes(p.category));

    if (selBrands.length)
      result = result.filter(p => selBrands.includes(p.brand));

    if (selRating)
      result = result.filter(p => p.rating >= selRating);

    result = result.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price_asc":  result.sort((a,b) => a.price   - b.price);   break;
      case "price_desc": result.sort((a,b) => b.price   - a.price);   break;
      case "rating":     result.sort((a,b) => b.rating  - a.rating);  break;
      case "newest":     result.sort((a,b) => b.id      - a.id);      break;
      default: break;
    }

    setFiltered(result);
  }, [allProducts, selCategories, selBrands, selRating, priceRange, sortBy, searchParams]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  /* ── helpers ── */
  const toggleCategory = (slug) =>
    setSelCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );

  const toggleBrand = (brand) =>
    setSelBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );

  const clearAll = () => {
    setSelCategories([]);
    setSelBrands([]);
    setSelRating(null);
    setPriceRange([0, 10000]);
    setSortBy("popular");
    setSearchParams({});
  };

  const removeCategory = (slug) => setSelCategories(p => p.filter(c => c !== slug));
  const removeBrand    = (b)    => setSelBrands(p => p.filter(x => x !== b));

  const toggleSection  = (key)  =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  /* ── active filter tags ── */
  const activeTags = [
    ...selCategories.map(s => ({ label: categories.find(c=>c.slug===s)?.name || s, onRemove: () => removeCategory(s) })),
    ...selBrands.map(b     => ({ label: b, onRemove: () => removeBrand(b) })),
    ...(selRating          ? [{ label: `${selRating}★ & above`, onRemove: () => setSelRating(null) }] : []),
    ...(searchParams.get("search") ? [{ label: `"${searchParams.get("search")}"`, onRemove: () => setSearchParams({}) }] : []),
  ];

  /* ── render ── */
  return (
    <div className="pp-page">

      {/* Breadcrumb */}
      <div className="pp-breadcrumb">
        <span className="bc-home">Home</span> › 
        <span className="bc-cur">
          {selCategories.length === 1
            ? categories.find(c => c.slug === selCategories[0])?.name
            : "All Products"}
        </span>
      </div>

      <div className="pp-body">

        {/* ── Sidebar ── */}
        <aside className="pp-sidebar">
          <div className="sb-header">
            <span className="sb-title">FILTERS</span>
            {activeTags.length > 0 && (
              <button className="clear-all-btn" onClick={clearAll}>Clear All</button>
            )}
          </div>

          {/* Category */}
          <div className="filter-section">
            <div className="fs-header" onClick={() => toggleSection("category")}>
              <span>Category</span>
              {openSections.category ? <FiChevronUp size={14}/> : <FiChevronDown size={14}/>}
            </div>
            {openSections.category && (
              <div className="fs-body">
                {categories.map(cat => (
                  <label className="check-row" key={cat.slug}>
                    <input
                      type="checkbox"
                      checked={selCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                    />
                    <span className="check-lbl">{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="filter-section">
            <div className="fs-header" onClick={() => toggleSection("price")}>
              <span>Price Range</span>
              {openSections.price ? <FiChevronUp size={14}/> : <FiChevronDown size={14}/>}
            </div>
            {openSections.price && (
              <div className="fs-body">
                <div className="price-display">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range" min="0" max="10000" step="100"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="price-slider"
                />
              </div>
            )}
          </div>

          {/* Brand */}
          <div className="filter-section">
            <div className="fs-header" onClick={() => toggleSection("brand")}>
              <span>Brand</span>
              {openSections.brand ? <FiChevronUp size={14}/> : <FiChevronDown size={14}/>}
            </div>
            {openSections.brand && (
              <div className="fs-body">
                {BRANDS.map(brand => (
                  <label className="check-row" key={brand}>
                    <input
                      type="checkbox"
                      checked={selBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span className="check-lbl">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="filter-section">
            <div className="fs-header" onClick={() => toggleSection("rating")}>
              <span>Rating</span>
              {openSections.rating ? <FiChevronUp size={14}/> : <FiChevronDown size={14}/>}
            </div>
            {openSections.rating && (
              <div className="fs-body">
                {RATINGS.map(r => (
                  <label className="check-row" key={r}>
                    <input
                      type="radio"
                      name="rating"
                      checked={selRating === r}
                      onChange={() => setSelRating(r)}
                    />
                    <span className="check-lbl">{"★".repeat(Math.floor(r))} {r} & above</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="pp-main">

          {/* Toolbar */}
          <div className="pp-toolbar">
            <div className="results-count">
              {loading
                ? "Loading..."
                : <><strong>{filtered.length}</strong> products found</>}
            </div>
            <div className="toolbar-right">
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="view-toggle">
                <button
                  className={`vt-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <FiGrid size={15}/>
                </button>
                <button
                  className={`vt-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <FiList size={15}/>
                </button>
              </div>
            </div>
          </div>

          {/* Active filter tags */}
          {activeTags.length > 0 && (
            <div className="active-tags">
              {activeTags.map((tag, i) => (
                <span className="filter-tag" key={i}>
                  {tag.label}
                  <FiX size={12} onClick={tag.onRemove} style={{ cursor:"pointer" }}/>
                </span>
              ))}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className={`prod-grid ${viewMode}`}>
              {[1,2,3,4,5,6].map(n => (
                <div className="skeleton-card" key={n}/>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="clear-filters-btn" onClick={clearAll}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`prod-grid ${viewMode}`}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p}/>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Products;