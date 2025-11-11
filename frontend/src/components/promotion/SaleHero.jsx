import { motion } from 'framer-motion'
import { Sparkles, Calendar, User, ArrowUpRight } from 'lucide-react'

const heroHighlights = [
  { title: 'Lắp đặt trong 24h', desc: 'Đội ngũ kỹ thuật toàn quốc', icon: <Sparkles className="h-5 w-5" /> },
  { title: 'Bảo hành 3 năm', desc: 'Bếp từ & máy hút chính hãng', icon: <Calendar className="h-5 w-5" /> },
  { title: 'Tư vấn thiết kế', desc: 'Tối ưu không gian bếp gia đình', icon: <User className="h-5 w-5" /> },
  { title: 'Trả góp 0%', desc: 'Áp dụng cho đơn từ 10 triệu', icon: <ArrowUpRight className="h-5 w-5" /> },
]

export function SaleHero({ sale }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=1600&auto=format&fit=crop"
          alt="Modern kitchen background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/55 to-slate-950/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.45),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.35),transparent_55%)]" />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-16 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          BLUE NOVEMBER
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.6 } }}
          className="mt-4 text-lg md:text-xl text-blue-100"
        >
          Combo Bếp Từ & Máy Hút – Ưu đãi đến 35% cho Kitchen Store
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-white/30 bg-blue-600 hover:bg-blue-700"
        >
          Ưu đãi lên đến 5.000.000đ
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}
          className="mt-10"
        >
          <p className="mb-4 text-sm tracking-widest text-blue-100/90 uppercase">Chương trình kết thúc sau</p>
          <div className="flex items-end justify-center gap-5 md:gap-10">
            {[
              { label: 'ngày', value: sale.days },
              { label: 'giờ', value: sale.hours },
              { label: 'phút', value: sale.minutes },
              { label: 'giây', value: sale.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/10 px-5 py-4 shadow-lg backdrop-blur-md"
              >
                <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="mt-2 text-xs uppercase tracking-wider text-blue-100/95">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.6 } }}
        className="container mx-auto px-6 pb-10 -mt-6 md:-mt-12"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {heroHighlights.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 px-5 py-4 text-white backdrop-blur-lg ring-1 ring-white/20 shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/40 to-blue-500/40 shadow-lg">
                {item.icon}
              </div>
              <div>
                <h4 className="text-base font-semibold tracking-tight">{item.title}</h4>
                <p className="text-sm text-blue-100/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-white" />
    </section>
  )
}
