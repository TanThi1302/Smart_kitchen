import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { submitContactMessage, getJobPostings } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Mail, Clock, Briefcase } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await getJobPostings()
      return res.data
    },
  })

  const jobs = jobsData?.data || []

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await submitContactMessage(data)
      return res.data
    },
    onSuccess: () => {
      setSubmitted(true)
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    },
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Liên hệ với chúng tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Địa chỉ</h3>
                  <p className="text-gray-600 text-sm">
                    123 Đường ABC, Quận 1<br />
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Điện thoại</h3>
                  <p className="text-gray-600 text-sm">
                    Hotline: 1800 1212<br />
                    Di động: 0123 456 789
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">
                    info@kitchenstore.com<br />
                    support@kitchenstore.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Giờ làm việc</h3>
                  <p className="text-gray-600 text-sm">
                    Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                    Thứ 7: 8:00 - 17:00<br />
                    Chủ nhật: Nghỉ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-64 bg-gray-200 rounded-md">
                <iframe
                  title="Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6308846583896!2d106.69544731533315!3d10.762622092327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded310a7b1bc!2zSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
                    <p className="font-semibold">Cảm ơn bạn đã liên hệ!</p>
                    <p className="text-sm">Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                  </div>
                  <Button onClick={() => setSubmitted(false)}>
                    Gửi tin nhắn khác
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Họ và tên *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Chủ đề</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Nội dung *</Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      className="w-full min-h-[150px] px-3 py-2 border rounded-md"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nội dung tin nhắn..."
                    />
                  </div>

                  {mutation.isError && (
                    <p className="text-red-500 text-sm">
                      Có lỗi xảy ra. Vui lòng thử lại.
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Postings */}
      {jobs.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Briefcase className="mr-2 h-6 w-6" />
            Cơ hội nghề nghiệp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{job.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    {job.department && <p>Phòng ban: {job.department}</p>}
                    {job.location && <p>Địa điểm: {job.location}</p>}
                  </div>
                  {job.description && (
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                      {job.description}
                    </p>
                  )}
                  <Button variant="outline" className="w-full">
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
