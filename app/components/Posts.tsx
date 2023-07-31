'use client'

import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Post from './Post'
import { PostType } from '../types/Posts'

// Fetch all posts
const allPosts = async () => {
  const response = await axios.get('/api/posts')
  return response.data
}

export default function Posts() {
  const { data, error, isLoading } = useQuery<PostType[]>({
    queryFn: allPosts,
    queryKey: ['posts'],
  })

  return (
    <>
      {data?.map((post) => (
        <Post
          comments={post.comments}
          key={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          id={post.id}
        />
      ))}

      {error instanceof Error && <p>{error?.message}</p>}
      {isLoading && <p>Loading...</p>}
    </>
  )
}
