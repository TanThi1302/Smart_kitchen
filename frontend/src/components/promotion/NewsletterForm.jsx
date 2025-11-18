import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Bell, Mail, Phone, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const contactCards = [
  {
    title: 'Email ưu đãi',
    value: 'promo@smartkitchen.com',
    icon: Mail,
  },
  {
    title: 'Hotline khuyến mãi',
    value: '1900 636 889',
    icon: Phone,
  },
  {
    title: 'Showroom cập nhật tin',
    value: '145 Nguyễn Đình Chiểu, Q.3',
    icon: MapPin,
  },
]

const newsletterSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  hp: z.string().max(0),
})

export function NewsletterForm() {
  const [stage, setStage] = useState('intro')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { hp: '' },
  })

  const onSubmit = async (data) => {
    if (data.hp) return
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('newsletter payload:', data)
    alert('Đăng ký thành công! 🎉')
    reset()
    setStage('intro')
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#03102a] via-[#051842] to-[#030a1a] py-16">
      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.35),transparent_45%),radial-gradient(circle_at_85%_18%,rgba(14,165,233,0.25),transparent_55%)]" />
      <div className="relative container mx-auto px-6">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="mx-auto max-w-4xl rounded-[32px] bg-gradient-to-br from-blue-900/70 via-blue-950/60 to-slate-950/70 p-6 sm:p-8 md:p-10 text-white backdrop-blur-3xl ring-1 ring-white/15 shadow-[0_20px_60px_rgba(15,23,42,0.45)]"
        >
          <AnimatePresence mode="wait">
            {stage === 'intro' ? (
              <motion.div
                key="newsletter-intro"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-50">
                    <Sparkles className="h-3.5 w-3.5" />
                    Nhận ưu đãi sớm
                  </span>
                  <div className="space-y-3">
                    <h3 className="text-[32px] sm:text-[36px] font-semibold leading-tight text-white">
                      Đăng ký nhận thông báo khuyến mãi & sự kiện giảm giá
                    </h3>
                    <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                      Mỗi tuần một email tổng hợp mã giảm giá, flash sale và lịch sự kiện trải nghiệm tại Smart Kitchen.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-blue-900">
                    {['Voucher độc quyền', 'Workshop trải nghiệm', 'Flash sale 48h'].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-full bg-white px-3.5 py-1 font-medium text-blue-700 shadow-sm shadow-blue-900/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {contactCards.map(({ title, value, icon: Icon }) => (
                    <div
                      key={title}
                      className="flex items-center gap-3 rounded-2xl bg-white/12 px-4 py-3 text-xs sm:text-sm ring-1 ring-white/10 transition hover:bg-white/18"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/18">
                        <Icon className="h-4 w-4 text-blue-200" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-blue-100/80">{title}</p>
                        <p className="font-semibold text-white/95">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-blue-100/75">
                    Ưu tiên nhận mã giảm giá và lịch sự kiện showroom ngay khi mở đăng ký.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStage('form')}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/60"
                  >
                    <Bell className="h-4 w-4" />
                    Nhập email của bạn
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="newsletter-form"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('hp')} />

                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-50">
                    <Sparkles className="h-3.5 w-3.5" />
                    Email ưu đãi
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-[32px] sm:text-[36px] font-semibold leading-tight tracking-tight">
                      Sẵn sàng nhận thông báo khuyến mãi
                    </h3>
                    <p className="text-sm text-blue-100/85 leading-relaxed">
                      Chúng tôi chỉ gửi email khi có ưu đãi, workshop hoặc sản phẩm đáng chú ý. Bạn có thể huỷ đăng ký bất kỳ lúc nào.
                    </p>
                  </div>
                </div>

                <div className="rounded-[22px] bg-white/12 p-1.5 ring-1 ring-white/15 shadow-[0_12px_40px_rgba(14,116,233,0.25)]">
                  <div className="rounded-[18px] bg-slate-950/40 p-4">
                    <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-blue-100/80">
                      Email của bạn
                    </label>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/25 via-white/10 to-white/0 blur-lg" />
                        <input
                          type="email"
                          {...register('email')}
                          className="relative w-full rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-[inset_0_2px_5px_rgba(15,23,42,0.08)] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-400/40"
                          placeholder="ban@domain.com"
                        />
                        {errors.email && <p className="mt-2 text-xs text-rose-200">{errors.email.message}</p>}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:from-blue-500 hover:via-indigo-600 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-80"
                      >
                        <Bell className="h-4 w-4" />
                        {isSubmitting ? 'Đang gửi...' : 'Nhận thông báo ưu đãi'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                  <p className="text-[11px] text-blue-100/70">
                    Chỉ 1 email mỗi tuần, ưu tiên mã giảm giá sớm nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStage('intro')}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-medium text-blue-100 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                  >
                    Quay lại quyền lợi
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
