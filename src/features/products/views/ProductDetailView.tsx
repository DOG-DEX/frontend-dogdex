'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS, Product, ProductReview } from '../types/product';
import { useToast } from '@/components/ToastContext';

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { toast } = useToast();

  // Find product by id from mock dataset
  const initialProduct =
    MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  const [product] = useState<Product>(initialProduct);
  const [reviews, setReviews] = useState<ProductReview[]>(
    initialProduct.reviews,
  );
  const [quantity, setQuantity] = useState(1);

  // New Review Form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleAddToCart = () => {
    toast.success(
      'ADDED TO CART',
      `Added ${quantity}x ${product.name} to your cart.`,
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      toast.error('FORM INCOMPLETE', 'Please enter your name and review comment.');
      return;
    }

    const createdReview: ProductReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: new Date().toLocaleDateString('vi-VN'),
      comment: newComment.trim(),
      verifiedPurchase: true,
    };

    setReviews([createdReview, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
    toast.success('REVIEW SUBMITTED', 'Thank you for your feedback!');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12 space-y-10">
      {/* ── Breadcrumb Navigation ── */}
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#6C7770]">
        <Link href="/products" className="hover:underline text-[#FF6B00]">
          ← Back to Store
        </Link>
        <span>/</span>
        <span>{product.categoryLabel}</span>
        <span>/</span>
        <span className="text-[#232B26] truncate">{product.name}</span>
      </div>

      {/* ── Main Product Detail Card ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Product Image Column */}
        <div className="lg:col-span-6">
          <div className="relative flex h-80 sm:h-96 w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] shadow-[6px_6px_0px_#232B26]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 right-4 rounded-lg border-2 border-[#232B26] bg-[#FFD6A5] px-3 py-1 font-mono text-xs font-black text-[#232B26] shadow-[2px_2px_0px_#232B26]">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Product Info Column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-[#232B26] bg-[#F0EDE6] px-2.5 py-1 font-mono text-xs font-bold text-[#232B26]">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs font-black text-[#FF6B00]">
                <span>★</span>
                <span>{product.rating}</span>
                <span className="text-gray-500">
                  ({reviews.length} đánh giá)
                </span>
              </div>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-[#232B26] leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-3xl font-black text-[#FF6B00]">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-base font-semibold text-gray-400 line-through">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm font-medium leading-relaxed text-[#4B5750]">
              {product.description}
            </p>

            {/* Key Features */}
            <div className="mt-5 space-y-2 border-t-2 border-[#F0EDE6] pt-4">
              <p className="font-mono text-xs font-black uppercase text-[#232B26]">
                Điểm nổi bật:
              </p>
              <ul className="space-y-1.5">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 font-mono text-xs font-bold text-[#232B26]"
                  >
                    <span className="text-[#00A170]">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quantity & Buy Button */}
          <div className="space-y-4 pt-4 border-t-2 border-[#232B26]">
            <div className="flex items-center gap-4">
              <label className="font-mono text-xs font-black uppercase text-[#232B26]">
                Số lượng:
              </label>
              <div className="flex items-center rounded-xl border-2 border-[#232B26] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 font-mono text-base font-black text-[#232B26] hover:bg-[#F0EDE6]"
                >
                  -
                </button>
                <span className="px-4 font-mono text-sm font-black text-[#232B26]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 font-mono text-base font-black text-[#232B26] hover:bg-[#F0EDE6]"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-2xl border-4 border-[#232B26] bg-[#85E0C0] py-3.5 font-mono text-sm font-black uppercase tracking-wider text-[#232B26] shadow-[4px_4px_0px_#232B26] transition-all hover:bg-[#6CD4AD] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#232B26]"
            >
              Thêm Vào Giỏ Hàng • {formatVND(product.price * quantity)}
            </button>
          </div>
        </div>
      </div>

      {/* ── CUSTOMER REVIEWS & RATINGS SECTION ── */}
      <section className="card-brutal bg-white p-6 sm:p-8 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#232B26] pb-6">
          <div>
            <h2 className="text-2xl font-black text-[#232B26]">
              Đánh Giá & Nhận Xét Từ Khách Hàng
            </h2>
            <p className="mt-1 font-mono text-xs font-semibold text-[#6C7770]">
              Trải nghiệm thực tế từ các chủ nuôi đã sử dụng sản phẩm
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] px-4 py-2 font-mono text-sm font-black text-[#232B26] shadow-[2px_2px_0px_#232B26]">
            <span>★ {product.rating} / 5.0</span>
            <span>({reviews.length} đánh giá)</span>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6] p-5 space-y-4">
          <h3 className="font-mono text-sm font-black uppercase text-[#232B26]">
            Viết Đánh Giá Của Bạn
          </h3>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-[#232B26]">
                  Tên người đánh giá
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="mt-1.5 w-full rounded-xl border-2 border-[#232B26] bg-white px-3.5 py-2 font-medium text-[#232B26] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-[#232B26]">
                  Đánh giá số sao
                </label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border-2 border-[#232B26] bg-white px-3.5 py-2 font-mono text-xs font-bold text-[#232B26] outline-none"
                >
                  <option value={5}>★★★★★ (5/5)</option>
                  <option value={4}>★★★★☆ (4/5)</option>
                  <option value={3}>★★★☆☆ (3/5)</option>
                  <option value={2}>★★☆☆☆ (2/5)</option>
                  <option value={1}>★☆☆☆☆ (1/5)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#232B26]">
                Nội dung nhận xét
              </label>
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm sử dụng sản phẩm..."
                className="mt-1.5 w-full rounded-xl border-2 border-[#232B26] bg-white px-3.5 py-2 font-medium text-[#232B26] outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl border-2 border-[#232B26] bg-[#85E0C0] px-6 py-2.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[2.5px_2.5px_0px_#232B26] hover:bg-[#6CD4AD] active:translate-y-0.5"
            >
              Gửi Đánh Giá
            </button>
          </form>
        </div>

        {/* Review Items List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border-2 border-[#232B26] bg-white p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-[#232B26]">
                    {rev.author}
                  </span>
                  {rev.verifiedPurchase && (
                    <span className="rounded-md border border-[#232B26] bg-[#85E0C0]/40 px-2 py-0.5 font-mono text-[10px] font-bold text-[#232B26]">
                      Đã mua hàng
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-semibold text-gray-400">
                  {rev.date}
                </span>
              </div>

              <div className="font-mono text-xs font-black text-[#FF6B00]">
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>

              <p className="text-sm font-medium text-[#4B5750]">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
