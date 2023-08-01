'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CommentType } from '../types/Posts'
import { useEffect, useState } from 'react'

type PostProps = {
  id: string
  avatar: string
  name: string
  postTitle: string
  comments: CommentType[]
  onDeleteClick?: (id: string) => void
  isDeleting?: boolean
  onEdit?: ({ id, title }: { id: string; title: string }) => void
  isUpdating?: boolean
  isUpdated?: boolean
}

export default function Post({
  avatar,
  name,
  postTitle,
  id,
  comments,
  onDeleteClick,
  isDeleting,
  onEdit,
  isUpdating,
  isUpdated,
}: PostProps) {
  const [newPost, setNewPost] = useState(postTitle)
  const [editingActive, setEditingActive] = useState(false)

  const isMutating = isDeleting || isUpdating

  useEffect(() => {
    if (isUpdated) {
      setEditingActive(false)
    }
  }, [isUpdated])

  const onEditClick = () => {
    setEditingActive(true)
  }

  const onEditSubmit = () => {
    onEdit!({ id, title: newPost })
  }

  return (
    <div className="bg-white my-8 p-6 md:p-8  rounded-lg dark:bg-gray-700">
      <div className="flex items-center gap-2">
        <Image className="rounded-full" width={32} height={32} src={avatar} alt="avatar" />
        <h3 className="font-bold">{name}</h3>
      </div>
      <div className="my-8">
        {editingActive ? (
          <textarea
            className="w-full p-2 rounded-md resize-none outline-none"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        ) : (
          <p className="break-all">{postTitle}</p>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <Link href={`/post/${id}`}>
          <span className="text-sm font-bold">Comments</span>
          <span className="bg-gray-200 dark:bg-gray-500 py-1 px-1.5 font-medium rounded-md text-xs ml-1.5">
            {comments.length}
          </span>
        </Link>
        {onDeleteClick && (
          <button
            onClick={() => onDeleteClick(id)}
            disabled={isMutating}
            className="text-sm font-bold text-red-700 dark:text-red-500 disabled:opacity-25">
            Delete
          </button>
        )}
        {onEdit && (
          <>
            <button
              disabled={isMutating}
              onClick={() => (editingActive ? onEditSubmit() : onEditClick())}
              className="text-sm font-bold text-blue-700 dark:text-blue-500 disabled:opacity-25">
              {editingActive ? 'Submit' : 'Edit'}
            </button>
            {editingActive && (
              <button
                disabled={isMutating}
                onClick={() => setEditingActive(false)}
                className="text-sm font-bold disabled:opacity-25">
                Cancel
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
