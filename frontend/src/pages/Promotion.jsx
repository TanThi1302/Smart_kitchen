import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { SaleHero } from '../components/promotion/SaleHero'
import { NewsletterForm } from '../components/promotion/NewsletterForm'
import { PostsFilters } from '../components/promotion/PostsFilters'
import { PostGrid } from '../components/promotion/PostGrid'
import { ProductGrid } from '../components/promotion/ProductGrid'
import { PromoQuest } from '../components/promotion/PromoQuest'
import { useCountdown } from '../components/promotion/useCountdown'
import { fadeUp } from '../components/promotion/animations'
import { getPromotions, getProducts } from '@/services/api'
import { formatPrice } from '@/lib/utils'

const categories = ['Khuyến mãi', 'Sản phẩm mới']

const normalizeProduct = (product) => {
  const effectivePrice = product.sale_price ?? product.price
  const discountPercent = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null

  return {
    id: product.id,
    name: product.name,
    description:
      product.description?.slice(0, 150) ||
      'Thiết bị nhà bếp cao cấp Smart Kitchen cùng công nghệ kiểm soát nhiệt thông minh.',
    price: formatPrice(effectivePrice),
    oldPrice: product.sale_price ? formatPrice(product.price) : null,
    image:
      product.image_url ||
      `https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&auto=format&fit=crop&sig=${product.id}`,
    tag: discountPercent ? `Giảm ${discountPercent}%` : 'Sản phẩm mới',
  }
}

/* ======================== Page ======================== */
export default function Promotion() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Khuyến mãi')

  const SALE_END = useMemo(() => {
    const now = new Date()
    const target = new Date(now)
    target.setMonth(target.getMonth() + 1)
    target.setDate(1)
    target.setHours(0, 0, 0, 0)
    return target.toISOString()
  }, [])
  const sale = useCountdown(SALE_END)

  const { data: promotionsData, isLoading: loadingPromotions } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await getPromotions()
      return res.data
    },
  })

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['promotion-products'],
    queryFn: async () => {
      const res = await getProducts({ limit: 6, sort: 'created_at', order: 'DESC' })
      return res.data
    },
  })

  const promotions = promotionsData?.data ?? []
  const normalizedProducts = useMemo(() => {
    return (productsData?.data ?? []).map(normalizeProduct)
  }, [productsData])

  const normalizedQuery = query.trim().toLowerCase()

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) =>
      `${promo.title} ${promo.description || ''}`.toLowerCase().includes(normalizedQuery),
    )
  }, [promotions, normalizedQuery])

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((product) =>
      (product.name + ' ' + product.description).toLowerCase().includes(normalizedQuery),
    )
  }, [normalizedProducts, normalizedQuery])

  const showProducts = activeCategory === 'Sản phẩm mới'
  const promoCount = promotions.length
  const productCount = normalizedProducts.length
  const metrics = [
    {
      label: 'Ưu đãi đang mở',
      value: `${promoCount}`,
      hint: 'Áp dụng cho thành viên Kitchen+',
    },
    {
      label: 'Sản phẩm mới',
      value: `${productCount}`,
      hint: 'Được cập nhật mỗi tuần',
    },
    {
      label: 'Voucher trực tiếp',
      value: `${promotions.filter((promo) => promo.discount_amount).length}`,
      hint: 'Giảm đến 5.000.000đ',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] via-white to-white">
      <SaleHero sale={sale} />

      <div className="container mx-auto px-6 mt-4">
        <div className="flex items-center text-sm text-slate-500">
          <span className="hover:text-slate-700 cursor-pointer transition">Trang chủ</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-slate-700 font-medium">Khuyến mãi & Sản phẩm mới</span>
        </div>
      </div>

      <PostsFilters
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        metrics={metrics}
        variants={fadeUp}
      />

      {activeCategory === 'Khuyến mãi' && (
        <section className="container mx-auto px-6 mb-12">
          <PromoQuest variants={fadeUp} />
        </section>
      )}

      <section className="container mx-auto px-6 mb-16">
        {showProducts ? (
          loadingProducts ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
              Đang tải danh sách sản phẩm mới...
            </div>
          ) : (
            <ProductGrid products={filteredProducts} variants={fadeUp} />
          )
        ) : loadingPromotions ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            Đang tải khuyến mãi mới nhất...
          </div>
        ) : (
          <PostGrid promotions={filteredPromotions} variants={fadeUp} />
        )}
      </section>

      <NewsletterForm />
    </div>
  )
}
