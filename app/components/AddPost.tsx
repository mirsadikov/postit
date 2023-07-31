'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export default function AddPost() {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()
  const toastPostID = 'POST_TOAST'

  // Create a post
  const { mutate, isLoading } = useMutation({
    mutationFn: async (title: string) => await axios.post('/api/posts', { title }),
    onError: (error) => {
      error instanceof AxiosError &&
        toast.error(error?.response?.data.message || 'Something went wrong', { id: toastPostID })
    },
    onSuccess: () => {
      toast.success('Post created successfully 🔥', { id: toastPostID })
      queryClient.invalidateQueries(['posts'])
      setTitle('')
    },
  })

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.loading('Creating post...', { id: toastPostID })
    mutate(title)
  }

  return (
    <form onSubmit={submitPost} className="bg-white dark:bg-gray-700 my-8 p-8 rounded-md">
      <div className="flex flex-col my-4">
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          placeholder="What's on your mind?"
          className="p-4 text-lg rounded-md my-2 bg-gray-200 dark:bg-gray-600"
          value={title}></textarea>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? ' text-red-700 dark:text-red-500' : ''
          }`}>{`${title.length}/300`}</p>
        <button
          disabled={isLoading || title.length > 300}
          type="submit"
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25">
          Create a post
        </button>
      </div>
    </form>
  )
}
