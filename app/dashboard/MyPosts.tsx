'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { UserType as AuthorType } from '../types/Posts'
import Toggle from './Toggle'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Post from '../components/Post'

const fetchAuthPosts = async () => {
  const response = await axios.get('/api/posts/my')
  return response.data
}

export default function MyPosts() {
  const [toggle, setToggle] = useState(false)
  const [currentID, setCurrentID] = useState('')

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<AuthorType>({
    queryFn: fetchAuthPosts,
    queryKey: ['auth-posts'],
  })

  const { mutate } = useMutation({
    mutationFn: async (id: string) => await axios.delete(`/api/posts/${id}`),
    onError: (error) => {
      error instanceof AxiosError &&
        toast.error(error?.response?.data.message || 'Something went wrong', { id: currentID })
    },
    onSuccess: () => {
      toast.success('Post deleted successfully', { id: currentID })
      queryClient.invalidateQueries(['auth-posts'])
    },
  })

  const deletePost = async () => {
    mutate(currentID)
    setToggle(false)
  }

  const onDeleteClick = (id: string) => {
    setToggle(true)
    setCurrentID(id)
  }

  return (
    <div>
      {isLoading && <p>Post are loading...</p>}
      {data?.posts?.length === 0 && <p className="text-center mt-24">You have no posts</p>}
      {data?.posts?.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          avatar={data.image}
          name={data.name}
          postTitle={post.title}
          comments={post.comments}
          onDeleteClick={() => onDeleteClick(post.id)}
        />
      ))}
      {toggle && <Toggle deletePost={deletePost} close={() => setToggle(false)} />}
    </div>
  )
}
