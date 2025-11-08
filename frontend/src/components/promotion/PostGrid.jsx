import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const formatDate = (value) => {
  if (!value) return 'Đang cập nhật'
  return new Date(value).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const getDiscountLabel = (promotion) => {
  if (promotion.discount_percent) {
    return `Giảm ${promotion.discount_percent}%`
  }
  if (promotion.discount_amount) {
    return `Tiết kiệm ${formatPrice(promotion.discount_amount)}`
  }
  return 'Ưu đãi đặc biệt'
}

export function PostGrid({ promotions, variants }) {
  if (!promotions.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Không tìm thấy khuyến mãi phù hợp
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {promotions.map((promotion, idx) => (
        <motion.article
          key={promotion.id}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          custom={idx}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition hover:shadow-xl"
        >
          <div className="flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-blue-700">
                Khuyến mãi
              </span>
              <span className="text-sm font-semibold text-blue-600">{getDiscountLabel(promotion)}</span>
            </div>

            <div>
              <h3 className="text-xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
                {promotion.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 line-clamp-3">{promotion.description}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                Thời gian áp dụng
              </div>
              <p className="mt-1">
                {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-400/0 via-sky-500/70 to-sky-400/0 opacity-0 transition group-hover:opacity-100" />
          <div className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100 bg-gradient-to-br from-sky-100 via-transparent to-indigo-100" />
        </motion.article>
      ))}
    </div>
  )
}
