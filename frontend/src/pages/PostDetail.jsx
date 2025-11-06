import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug, getProducts } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Calendar, User, ArrowLeft } from 'lucide-react'

export default function PostDetail() {
  const { slug } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await getPostBySlug(slug)
      return res.data
    },
  })

  const { data: productData } = useQuery({
    queryKey: ['related-products'],
    queryFn: async () => {
      const res = await getProducts({ limit: 4 })
      return res.data
    },
  })

  const post = data?.data
  const related = productData?.data || []

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="bg-gray-200 h-8 rounded w-3/4 mb-4"></div>
        <div className="bg-gray-200 h-64 rounded mb-6"></div>
      </div>
    )

  if (!post)
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <Link to="/posts">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
      </div>
    )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div
        className="relative w-full h-[300px] bg-cover bg-center"
        style={{
          backgroundImage: `url('${post.thumbnail_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold mb-2 max-w-3xl">{post.title}</h1>
          {post.category && <Badge>{post.category}</Badge>}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/posts">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại tin tức
          </Button>
        </Link>

        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 text-gray-600 mb-6 text-sm">
              {post.author && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at || post.created_at)}
              </span>
            </div>

            {post.excerpt && (
              <p className="text-xl text-gray-700 font-medium mb-6 italic">
                {post.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </CardContent>
        </Card>

        {/* Sản phẩm liên quan */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Sản phẩm / khuyến mãi liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.slug}`}
                  className="group bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition-all"
                >
                  <img
                    src={item.image_url || item.thumbnail_url}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-yellow-600 font-medium">
                      {item.price?.toLocaleString()} ₫
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}