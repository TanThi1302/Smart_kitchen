import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const badges = ['Giao trong 24h', 'Thiết kế bếp thông minh', 'Chuyên gia Kitchen+', 'Bảo hành 3 năm']

export function ProductGrid({ products, variants }) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-200 bg-white p-10 text-center text-rose-400">
        Không tìm thấy sản phẩm mới phù hợp
      </div>
    )
  }

  const highlight = products[0]
  const showcaseItems = products.slice(1, 4)

  const scrollRef = useRef(null)
  const pauseRef = useRef(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleEnter = () => {
      pauseRef.current = true
    }
    const handleLeave = () => {
      pauseRef.current = false
    }

    container.addEventListener('pointerenter', handleEnter)
    container.addEventListener('pointerleave', handleLeave)

    let direction = 1
    const id = setInterval(() => {
      const el = scrollRef.current
      if (!el || pauseRef.current) return
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) return
      if (el.scrollLeft >= maxScroll - 2) {
        direction = -1
      } else if (el.scrollLeft <= 2) {
        direction = 1
      }
      el.scrollLeft += direction * 2
    }, 25)

    return () => {
      clearInterval(id)
      container.removeEventListener('pointerenter', handleEnter)
      container.removeEventListener('pointerleave', handleLeave)
    }
  }, [products.length])

  return (
    <div className="rounded-[36px] bg-gradient-to-b from-[#030c1d] via-[#050f27] to-[#01030a] p-8 md:p-12 text-white shadow-[0_40px_120px_rgba(3,10,25,0.65)] ring-1 ring-sky-500/20">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-200/80">Kitchen Glow</p>
            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Nâng tầm <span className="text-sky-300">không gian bếp</span> của bạn.
            </h3>
            <p className="text-base text-white/75 leading-relaxed">
              Bộ sưu tập thiết bị nhà bếp cao cấp với cảm biến thông minh, hoàn thiện kim loại sang trọng và khả năng
              kết nối Home+ giúp tối ưu trải nghiệm nấu nướng mỗi ngày.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-[#031226]">
            <button className="rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold shadow-[0_15px_40px_rgba(56,189,248,0.45)] transition hover:bg-sky-200">
              Đặt lịch trải nghiệm
            </button>
            <div className="flex flex-col rounded-3xl border border-white/15 bg-white/5 px-5 py-3 text-left text-white">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">50K+ gia đình</span>
              <span className="text-lg font-semibold text-white">đã nâng cấp bếp</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#031733] via-[#082441] to-[#010612] p-6 shadow-[0_35px_90px_rgba(2,12,32,0.55)]"
        >
          <img
            src={highlight.image}
            alt={highlight.name}
            className="h-64 w-full rounded-[28px] object-cover"
          />
          <div className="absolute top-6 left-6 inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white">
            {highlight.tag}
          </div>
          <div className="absolute bottom-6 left-6 right-6 rounded-[28px] bg-blue-950/70 px-5 py-4 backdrop-blur-xl">
            <p className="text-sm text-white/70">Giá chỉ</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold">{highlight.price}</p>
              {highlight.oldPrice && (
                <p className="text-xs text-white/50 line-through">{highlight.oldPrice}</p>
              )}
            </div>
            <p className="mt-2 text-sm text-white/85">{highlight.description}</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[13px] text-sky-200">
        {badges.map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-white/5 px-4 py-2 font-semibold tracking-wide"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-12 space-y-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/60">Bộ sưu tập 2025</p>
        <h4 className="text-3xl font-bold text-white">
          Hướng dẫn chọn thiết bị <span className="text-sky-300">Smart Kitchen</span>
        </h4>
      </div>

      {showcaseItems.length > 0 ? (
        <div
          ref={scrollRef}
          className="mt-10 flex gap-6 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
        >
          {showcaseItems.map((item, idx) => (
            <motion.article
              key={item.id}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              custom={idx}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative w-72 shrink-0 snap-center overflow-hidden rounded-[28px] bg-gradient-to-b from-[#051733] via-[#040a16] to-[#010309] p-5 text-left shadow-[0_25px_70px_rgba(3,10,25,0.6)] ring-1 ring-sky-500/15"
            >
              <div className="h-40 overflow-hidden rounded-[22px] bg-black/20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">{item.tag}</p>
                <h5 className="text-xl font-semibold text-white">{item.name}</h5>
                <p className="text-sm text-white/70">{item.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-sky-200">
                <span>{item.price}</span>
                <div className="inline-flex items-center gap-2 font-semibold transition group-hover:text-white">
                  Khám phá
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-xl leading-none"
                  >
                    →
                  </motion.span>
                </div>
              </div>
              {item.oldPrice && (
                <p className="text-xs text-white/60 line-through">{item.oldPrice}</p>
              )}
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[28px] border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/70">
          Sản phẩm đang được cập nhật. Vui lòng quay lại sau.
        </div>
      )}
    </div>
  )
}
