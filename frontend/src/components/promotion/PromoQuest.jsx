import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Gift, CheckCircle2, Sparkles } from 'lucide-react'

const promoDetails = {
  title: 'Blue November Voucher Quest',
  description:
    'Hoàn thành các nhiệm vụ trải nghiệm để mở khoá mã giảm giá thiết bị nhà bếp thông minh cho mùa lễ hội.',
  timeline: '07.11 – 30.11.2025',
  rewardCode: 'BLUEKITCHEN35',
  rewardValue: 'Giảm 3.500.000đ cho đơn từ 20.000.000đ',
}

const tasks = [
  {
    id: 'showroom',
    title: 'Đăng ký tham quan showroom',
    detail: 'Chọn khung giờ phù hợp và xác nhận email để giữ chỗ trải nghiệm Kitchen Lab.',
  },
  {
    id: 'consult',
    title: 'Nhận tư vấn cấu hình bếp',
    detail: 'Trao đổi cùng chuyên gia thiết kế để tối ưu hoá không gian và chi phí.',
  },
  {
    id: 'share',
    title: 'Chia sẻ bộ sưu tập yêu thích',
    detail: 'Đăng story hoặc bài viết về thiết bị bạn thích kèm hashtag #BlueNovemberKitchen.',
  },
]

export function PromoQuest({ variants }) {
  const [state, setState] = useState(() =>
    tasks.reduce((acc, task) => {
      acc[task.id] = false
      return acc
    }, {}),
  )

  const completedCount = useMemo(() => Object.values(state).filter(Boolean).length, [state])
  const progress = Math.round((completedCount / tasks.length) * 100)
  const allDone = completedCount === tasks.length

  const toggleTask = (taskId) => {
    setState((prev) => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className="rounded-[32px] bg-gradient-to-br from-[#03102a] via-[#081a3b] to-[#030a1a] p-8 text-white shadow-[0_40px_120px_rgba(3,10,25,0.65)] ring-1 ring-sky-500/20"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
            <Sparkles className="h-3.5 w-3.5" />
            Khuyến mãi độc quyền
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl md:text-4xl font-bold leading-tight">{promoDetails.title}</h3>
            <p className="text-sm text-white/75 leading-relaxed">{promoDetails.description}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/5 p-5 text-sm">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-sky-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">Thời gian</p>
                <p className="text-base font-semibold text-white">{promoDetails.timeline}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-sky-300" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">Quà tặng</p>
                <p className="text-base font-semibold text-white">{promoDetails.rewardValue}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Tiến độ</span>
            <span className="text-sm text-sky-200">{progress}%</span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 space-y-3">
            {tasks.map((task) => {
              const checked = state[task.id]
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    checked
                      ? 'border-sky-400/40 bg-sky-400/10 shadow-lg shadow-sky-500/20'
                      : 'border-white/10 bg-white/5 hover:border-sky-200/40'
                  }`}
                >
                  <CheckCircle2
                    className={`h-5 w-5 flex-shrink-0 ${checked ? 'text-sky-300' : 'text-white/40'}`}
                    strokeWidth={checked ? 3 : 2}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{task.title}</p>
                    <p className="text-xs text-white/70">{task.detail}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-sky-300/60 bg-sky-500/10 p-5 text-center">
            {allDone ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">Voucher unlocked</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[0.4em] text-white">{promoDetails.rewardCode}</p>
                <p className="mt-2 text-sm text-white/70">Sao chép mã khi thanh toán để áp dụng ưu đãi.</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  Hoàn thành nhiệm vụ để nhận mã
                </p>
                <p className="mt-3 text-sm text-white/70">
                  Bạn còn <span className="font-semibold text-white">{tasks.length - completedCount}</span> nhiệm vụ nữa.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
