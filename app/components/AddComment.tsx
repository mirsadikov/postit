'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { CommentType } from '../types/Posts'

type AddCommentProps = {
  id: string
}

export default function AddComment({ id }: AddCommentProps) {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const toastCommentID = 'COMMENT_TOAST'

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: CommentType) => await axios.post(`/api/posts/${id}/comments`, data),
    onError: (error) => {
      error instanceof AxiosError &&
        toast.error(error?.response?.data.message || 'Something went wrong', { id: toastCommentID })
    },
    onSuccess: () => {
      toast.success('Comment added successfully', { id: toastCommentID })
      queryClient.invalidateQueries(['detail-post'])
      setTitle('')
    },
  })

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.loading('Adding comment...', { id: toastCommentID })
    mutate({ text: title, postId: id })
  }

  return (
    <form className="my-8" onSubmit={submitComment}>
      <h3>Add a comment</h3>
      <div className="flex flex-col my-2">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name="title"
          type="text"
          className="p-4 text-lg rounded-md my-2 dark:bg-gray-600"
          placeholder="Comment..."
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={isLoading}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
          type="submit">
          Add Comment 🚀
        </button>
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? 'text-red-700 dark:text-red-500' : ''
          }`}>
          {`${title.length}/300`}
        </p>
      </div>
    </form>
  )
}
