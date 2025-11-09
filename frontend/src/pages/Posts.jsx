import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPosts } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Calendar, User } from 'lucide-react'

const categories = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Tin tức', value: 'tin-tuc' },
  { label: 'Khuyến mãi', value: 'khuyen-mai' },
  { label: 'Sự kiện', value: 'su-kien' },
  { label: 'Cẩm nang bếp', value: 'cam-nang-bep' },
]

export default function Posts() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await getPosts({ limit: 30 })
      return res.data
    },
  })

  const posts = data?.data || []
  const filteredPosts =
  selectedCategory === 'all'
    ? posts
    : posts.filter((p) => {
        // So sánh cả category và post_type để linh hoạt
        const cat = p.category?.toLowerCase()
        const type = p.post_type?.toLowerCase()
        const selected = selectedCategory.toLowerCase()

        return (
          cat === selected ||
          type === selected ||
          type?.includes(selected.replace(/\s/g, '-')) 
        )
      })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div
        className="relative w-full h-[350px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            Tin tức & Bài viết
          </h1>
          <p className="italic mt-2 text-lg">Cập nhật xu hướng bếp hiện đại</p>
        </div>
      </div>

      {/* Bộ lọc danh mục */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                selectedCategory === cat.value
                  ? 'bg-yellow-500 text-white border-yellow-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Danh sách bài viết */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48"></div>
                <CardContent className="p-4">
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/posts/${post.slug}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all border-gray-200">
                  {post.thumbnail_url && (
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <CardContent className="p-5">
                    {post.category && (
                      <Badge variant="outline" className="mb-3 uppercase text-xs">
                        {post.category}
                      </Badge>
                    )}
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
