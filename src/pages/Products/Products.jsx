import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, getCategories } from "../../services/api";
import ProductCard from "../../components/ui/ProductCard";
import {
  FiGrid,
  FiList,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import styles from "./Products.module.css";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

const BRANDS = [
  "Optimum Nutrition",
  "MuscleBlaze",
  "Dymatize",
  "Cellucor",
  "AS-IT-IS",
  "HealthKart",
];
const RATINGS = [4.5, 4.0, 3.5];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
  });

  const [selCategories, setSelCategories] = useState([]);
  const [selBrands, setSelBrands] = useState([]);
  const [selRating, setSelRating] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    Promise.all([getAllProducts(), getCategories()]).then(([pRes, cRes]) => {
      setAllProducts(pRes.data);
      setCategories(cRes.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelCategories([cat]);
    // eslint-disable-next-line
  }, []);

  const applyFilters = useCallback(() => {
    const search = searchParams.get("search") || "";
    let result = [...allProducts];

    if (search)
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()),
      );
    if (selCategories.length)
      result = result.filter((p) => selCategories.includes(p.category));
    if (selBrands.length)
      result = result.filter((p) => selBrands.includes(p.brand));
    if (selRating) result = result.filter((p) => p.rating >= selRating);

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFiltered(result);
  }, [
    allProducts,
    selCategories,
    selBrands,
    selRating,
    priceRange,
    sortBy,
    searchParams,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const toggleCategory = (slug) =>
    setSelCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );

  const toggleBrand = (brand) =>
    setSelBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );

  const clearAll = () => {
    setSelCategories([]);
    setSelBrands([]);
    setSelRating(null);
    setPriceRange([0, 10000]);
    setSortBy("popular");
    setSearchParams({});
  };

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeTags = [
    ...selCategories.map((s) => ({
      label: categories.find((c) => c.slug === s)?.name || s,
      onRemove: () => setSelCategories((p) => p.filter((c) => c !== s)),
    })),
    ...selBrands.map((b) => ({
      label: b,
      onRemove: () => setSelBrands((p) => p.filter((x) => x !== b)),
    })),
    ...(selRating
      ? [{ label: `${selRating}★ & above`, onRemove: () => setSelRating(null) }]
      : []),
    ...(searchParams.get("search")
      ? [
          {
            label: `"${searchParams.get("search")}"`,
            onRemove: () => setSearchParams({}),
          },
        ]
      : []),
  ];

  return (
    <div className={styles.ppPage}>
      <div className={styles.ppBreadcrumb}>
        <span className={styles.bcHome}>Home</span> ›
        <span className={styles.bcCur}>
          {selCategories.length === 1
            ? categories.find((c) => c.slug === selCategories[0])?.name
            : "All Products"}
        </span>
      </div>

      <div className={styles.ppBody}>
        {/* Sidebar */}
        <aside className={styles.ppSidebar}>
          <div className={styles.sbHeader}>
            <span className={styles.sbTitle}>FILTERS</span>
            {activeTags.length > 0 && (
              <button className={styles.clearAllBtn} onClick={clearAll}>
                Clear All
              </button>
            )}
          </div>

          {/* Category */}
          <div className={styles.filterSection}>
            <div
              className={styles.fsHeader}
              onClick={() => toggleSection("category")}
            >
              <span>Category</span>
              {openSections.category ? (
                <FiChevronUp size={14} />
              ) : (
                <FiChevronDown size={14} />
              )}
            </div>
            {openSections.category && (
              <div className={styles.fsBody}>
                {categories.map((cat) => (
                  <label className={styles.checkRow} key={cat.slug}>
                    <input
                      type="checkbox"
                      checked={selCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                    />
                    <span className={styles.checkLbl}>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className={styles.filterSection}>
            <div
              className={styles.fsHeader}
              onClick={() => toggleSection("price")}
            >
              <span>Price Range</span>
              {openSections.price ? (
                <FiChevronUp size={14} />
              ) : (
                <FiChevronDown size={14} />
              )}
            </div>
            {openSections.price && (
              <div className={styles.fsBody}>
                <div className={styles.priceDisplay}>
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className={styles.priceSlider}
                />
              </div>
            )}
          </div>

          {/* Brand */}
          <div className={styles.filterSection}>
            <div
              className={styles.fsHeader}
              onClick={() => toggleSection("brand")}
            >
              <span>Brand</span>
              {openSections.brand ? (
                <FiChevronUp size={14} />
              ) : (
                <FiChevronDown size={14} />
              )}
            </div>
            {openSections.brand && (
              <div className={styles.fsBody}>
                {BRANDS.map((brand) => (
                  <label className={styles.checkRow} key={brand}>
                    <input
                      type="checkbox"
                      checked={selBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span className={styles.checkLbl}>{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className={styles.filterSection}>
            <div
              className={styles.fsHeader}
              onClick={() => toggleSection("rating")}
            >
              <span>Rating</span>
              {openSections.rating ? (
                <FiChevronUp size={14} />
              ) : (
                <FiChevronDown size={14} />
              )}
            </div>
            {openSections.rating && (
              <div className={styles.fsBody}>
                {RATINGS.map((r) => (
                  <label className={styles.checkRow} key={r}>
                    <input
                      type="radio"
                      name="rating"
                      checked={selRating === r}
                      onChange={() => setSelRating(r)}
                    />
                    <span className={styles.checkLbl}>
                      {"★".repeat(Math.floor(r))} {r} & above
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className={styles.ppMain}>
          <div className={styles.ppToolbar}>
            <div className={styles.resultsCount}>
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <strong>{filtered.length}</strong> products found
                </>
              )}
            </div>
            <div className={styles.toolbarRight}>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.vtBtn} ${viewMode === "grid" ? styles.active : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <FiGrid size={15} />
                </button>
                <button
                  className={`${styles.vtBtn} ${viewMode === "list" ? styles.active : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <FiList size={15} />
                </button>
              </div>
            </div>
          </div>

          {activeTags.length > 0 && (
            <div className={styles.activeTags}>
              {activeTags.map((tag, i) => (
                <span className={styles.filterTag} key={i}>
                  {tag.label}
                  <FiX
                    size={12}
                    onClick={tag.onRemove}
                    style={{ cursor: "pointer" }}
                  />
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div className={`${styles.prodGrid} ${styles.grid}`}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div className={styles.skeletonCard} key={n} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className={styles.clearFiltersBtn} onClick={clearAll}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={`${styles.prodGrid} ${viewMode === "grid" ? styles.grid : styles.list}`}
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
