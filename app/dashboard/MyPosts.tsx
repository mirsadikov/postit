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
  const [toastDeleteID, setToastDeleteID] = useState('')
  const [toastEditID, setToastEditID] = useState('')

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<AuthorType>({
    queryFn: fetchAuthPosts,
    queryKey: ['auth-posts'],
  })

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => await axios.delete(`/api/posts/${id}`),
    onError: (error) => {
      error instanceof AxiosError &&
        toast.error(error?.response?.data.message || 'Something went wrong', { id: toastDeleteID })
    },
    onSuccess: () => {
      toast.success('Post deleted successfully', { id: toastDeleteID })
      queryClient.invalidateQueries(['auth-posts'])
    },
  })

  const {
    mutate: editMutation,
    isLoading: isUpdating,
    isSuccess: isUpdated,
  } = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) =>
      await axios.put(`/api/posts/${id}`, { title: title }),
    onError: (error) => {
      error instanceof AxiosError &&
        toast.error(error?.response?.data.message || 'Something went wrong', { id: toastEditID })
    },
    onSuccess: () => {
      toast.success('Post edited successfully', { id: toastEditID })
      queryClient.invalidateQueries(['auth-posts'])
    },
  })

  const deletePost = async () => {
    deleteMutation(toastDeleteID)
    setToggle(false)
  }

  const onDeleteClick = (id: string) => {
    setToggle(true)
    setToastDeleteID(id)
  }

  const onEdit = ({ id, title }: { id: string; title: string }) => {
    setToastEditID(id)
    toast.loading('Updating post...', { id })
    editMutation({ id, title })
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
          onDeleteClick={onDeleteClick}
          isDeleting={isDeleting}
          onEdit={onEdit}
          isUpdating={isUpdating}
          isUpdated={isUpdated}
        />
      ))}
      {toggle && <Toggle deletePost={deletePost} close={() => setToggle(false)} />}
    </div>
  )
}
