'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MOCK_PRODUCTS,
  Product,
  ProductCategory,
  PriceRange,
} from '../types/product';
import { useToast } from '@/components/ToastContext';

export function ProductsView() {
  const { toast } = useToast();

  // ── Filter State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('all');
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<PriceRange>('all');
  const [cartCount, setCartCount] = useState(0);

  // Filter products based on search query, category, and price range
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.categoryLabel.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Price Range Filter
      if (selectedPriceRange === 'under_200' && product.price >= 200000) {
        return false;
      }
      if (
        selectedPriceRange === '200_300' &&
        (product.price < 200000 || product.price > 300000)
      ) {
        return false;
      }
      if (selectedPriceRange === 'above_300' && product.price <= 300000) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedPriceRange]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setCartCount((prev) => prev + 1);
    toast.success(
      'ADDED TO CART',
      `${product.name} has been added to your shopping cart.`,
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      {/* ── Page Header Banner ── */}
      <header className="card-brutal bg-[#85E0C0] p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#232B26]">
              DogDex Smart Gear & Accessories
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#232B26] md:text-5xl">
              Store & Accessories
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-bold text-[#4B5750]">
              Vòng cổ định vị QR thông minh, phụ kiện & dinh dưỡng cho cún yêu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border-2 border-[#232B26] bg-white px-4 py-2.5 font-mono text-sm font-black text-[#232B26] shadow-[3px_3px_0px_#232B26]">
              Cart: {cartCount} items
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Left Filter Sidebar + Right Product Grid ── */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* ── LEFT SIDEBAR FILTERS ── */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="card-brutal bg-white p-6">
            <h2 className="text-xl font-black text-[#232B26]">Filters</h2>
            <p className="mt-1 font-mono text-xs font-semibold text-[#6C7770]">
              Lọc theo danh mục & mức giá
            </p>

            {/* Search Input Filter */}
            <div className="mt-6">
              <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
                Tìm kiếm sản phẩm
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tên sản phẩm, từ khóa..."
                className="mt-2 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-3.5 py-2.5 font-medium text-[#232B26] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>

            {/* Category Filter */}
            <div className="mt-6">
              <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
                Danh mục
              </label>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { key: 'all', label: 'Tất cả sản phẩm' },
                  { key: 'qr_collar', label: 'Vòng Cổ QR Định Vị' },
                  { key: 'food', label: 'Thức Ăn Hạt' },
                  { key: 'accessories', label: 'Phụ Kiện & Đai Yếm' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(cat.key as ProductCategory)
                    }
                    className={`flex items-center justify-between rounded-xl border-2 px-3.5 py-2.5 text-left font-mono text-xs font-bold transition-all ${
                      selectedCategory === cat.key
                        ? 'border-[#232B26] bg-[#85E0C0] text-[#232B26] shadow-[2px_2px_0px_#232B26]'
                        : 'border-[#232B26] bg-white text-[#4B5750] hover:bg-[#F0EDE6]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.key && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mt-6">
              <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
                Mức giá
              </label>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { key: 'all', label: 'Tất cả mức giá' },
                  { key: 'under_200', label: 'Dưới 200.000 ₫' },
                  { key: '200_300', label: '200.000 ₫ - 300.000 ₫' },
                  { key: 'above_300', label: 'Trên 300.000 ₫' },
                ].map((price) => (
                  <button
                    key={price.key}
                    type="button"
                    onClick={() =>
                      setSelectedPriceRange(price.key as PriceRange)
                    }
                    className={`flex items-center justify-between rounded-xl border-2 px-3.5 py-2.5 text-left font-mono text-xs font-bold transition-all ${
                      selectedPriceRange === price.key
                        ? 'border-[#232B26] bg-[#FFD6A5] text-[#232B26] shadow-[2px_2px_0px_#232B26]'
                        : 'border-[#232B26] bg-white text-[#4B5750] hover:bg-[#F0EDE6]'
                    }`}
                  >
                    <span>{price.label}</span>
                    {selectedPriceRange === price.key && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <div className="mt-6 pt-4 border-t-2 border-[#232B26]">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] py-2.5 font-mono text-xs font-black text-[#232B26] hover:bg-[#e4e0d5] active:translate-y-0.5"
              >
                Reset Bộ Lọc
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT PRODUCT LIST GRID ── */}
        <main className="lg:col-span-8 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="card-brutal bg-white p-8 text-center">
              <h3 className="text-xl font-black text-[#232B26]">
                Không tìm thấy sản phẩm
              </h3>
              <p className="mt-2 font-medium text-[#4B5750]">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 rounded-xl border-2 border-[#232B26] bg-[#85E0C0] px-5 py-2.5 font-mono text-xs font-black text-[#232B26] shadow-[2.5px_2.5px_0px_#232B26]"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="card-brutal group flex flex-col justify-between overflow-hidden bg-white p-4 transition-all hover:-translate-y-1"
                >
                  <div>
                    {/* Product Image Thumbnail */}
                    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-[#232B26] bg-[#F0EDE6]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.badge && (
                        <span className="absolute top-2.5 right-2.5 rounded-md border border-[#232B26] bg-[#FFD6A5] px-2 py-0.5 font-mono text-[10px] font-black text-[#232B26]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Category & Rating */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-[#6C7770]">
                        {product.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-xs font-black text-[#FF6B00]">
                        <span>★</span>
                        <span>{product.rating}</span>
                        <span className="text-gray-400">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="mt-1 text-xl font-black leading-snug text-[#232B26] group-hover:text-[#00A170] transition-colors">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-1.5 text-xs font-semibold text-[#4B5750] line-clamp-2">
                      {product.shortDescription}
                    </p>

                    {/* Price Section */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-mono text-xl font-black text-[#FF6B00]">
                        {formatVND(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-xs font-semibold text-gray-400 line-through">
                          {formatVND(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t-2 border-[#F0EDE6] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className="flex-1 rounded-xl border-2 border-[#232B26] bg-[#85E0C0] py-2.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26] hover:bg-[#6CD4AD] active:translate-y-0.5 active:shadow-none"
                    >
                      Thêm Giỏ Hàng
                    </button>

                    <span className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-3 py-2.5 font-mono text-xs font-black text-[#232B26]">
                      Chi Tiết →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
