'use client'

import Post from '@/app/components/Post'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CommentType, PostType, UserType } from '@/app/types/Posts'
import AddComment from '@/app/components/AddComment'
import Image from 'next/image'

type Props = {
  params: {
    slug: string
  }
}

type SinglePostType = Omit<PostType, 'comments'> & {
  comments: (CommentType & {
    user: UserType
  })[]
}

const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`)
  return response.data
}

export default function PostPage({ params }: Props) {
  const { data, isLoading } = useQuery<SinglePostType>({
    queryFn: () => fetchDetails(params.slug),
    queryKey: ['detail-post'],
  })

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <Post
            id={data.id}
            avatar={data.user.image}
            name={data.user.name}
            postTitle={data.title}
            comments={data.comments}
          />
          <AddComment id={data.id} />
          {data.comments?.length === 0 ? (
            <p className="text-center mt-24">No comments yet</p>
          ) : (
            <h2 className="text-lg font-bold mt-8 mb-4">Comments</h2>
          )}
          {data.comments?.map((comment) => (
            <div key={comment.id} className="my-6 bg-white dark:bg-gray-700 p-8 rounded-md">
              <div className="flex items-center gap-2">
                <Image
                  width={24}
                  height={24}
                  src={comment.user.image || ''}
                  alt={comment.user.name || 'avatar'}
                  className="rounded-full"
                />
                <h3 className="font-bold">{comment.user.name}</h3>
                <h2 className="text-sm">
                  {new Date(comment.createdAt as string).toLocaleString()}
                </h2>
              </div>
              <div className="py-4">{comment.text}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
