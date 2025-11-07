import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '@/services/api'
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

  const post = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="bg-gray-200 h-8 rounded w-3/4 mb-4"></div>
          <div className="bg-gray-200 h-64 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="bg-gray-200 h-4 rounded"></div>
            <div className="bg-gray-200 h-4 rounded"></div>
            <div className="bg-gray-200 h-4 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <Link to="/posts">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/posts">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại tin tức
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8">
            {post.category && (
              <Badge className="mb-4">{post.category}</Badge>
            )}

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-6 text-gray-600 mb-6">
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

            {post.thumbnail_url && (
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-auto rounded-lg mb-6"
              />
            )}

            {post.excerpt && (
              <p className="text-xl text-gray-700 font-medium mb-6">
                {post.excerpt}
</p>
            )}

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}