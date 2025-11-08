import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export function PostsFilters({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  metrics,
  variants,
}) {
  return (
    <motion.section
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className="container mx-auto px-6 mb-12"
    >
      <div className="flex flex-col gap-8 items-center">
        <div className="w-full max-w-3xl rounded-[22px] bg-white/90 p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm khuyến mãi, voucher hoặc sản phẩm mới..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="w-full rounded-[18px] bg-slate-50 pl-12 pr-5 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Danh mục
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                custom={i}
                variants={variants}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-2 text-sm rounded-full transition font-medium ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 w-full">
          {metrics.map((metric, idx) => (
            <div
              key={metric.label}
              className="group relative flex-1 min-w-[200px] rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:ring-blue-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {metric.label}
                </p>
                <span className="text-xs font-medium text-blue-500/80">#{idx + 1}</span>
              </div>
              <div className="mt-4 text-3xl font-semibold text-slate-900">
                {metric.value}
              </div>
              <p className="mt-2 text-xs text-slate-500">{metric.hint}</p>
              <div className="pointer-events-none absolute inset-x-4 bottom-0 h-1 rounded-full bg-gradient-to-r from-sky-400/0 via-sky-400/30 to-sky-400/0 opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
