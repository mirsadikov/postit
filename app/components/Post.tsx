'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CommentType } from '../types/Posts'
import { useEffect, useRef, useState } from 'react'

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
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isMutating = isDeleting || isUpdating

  useEffect(() => {
    if (isUpdated) {
      setEditingActive(false)
    }
  }, [isUpdated])

  const onEditClick = () => {
    setEditingActive(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      )
    })
  }

  const onEditSubmit = () => {
    onEdit!({ id, title: newPost })
  }

  const onCancel = () => {
    setNewPost(postTitle)
    setEditingActive(false)
  }

  return (
    <div className="bg-white my-8 p-6 md:p-8  rounded-lg dark:bg-gray-700">
      <div className="flex items-center gap-2">
        <Image className="rounded-full" width={32} height={32} src={avatar} alt="avatar" />
        <h3 className="font-bold">{name}</h3>
      </div>
      <div
        className={`my-8 border-2 rounded-md ${
          editingActive ? 'border-gray-200 dark:border-gray-500' : 'border-transparent'
        }`}>
        {editingActive ? (
          <textarea
            ref={inputRef}
            className="block w-full resize-none outline-none bg-transparent h-24"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        ) : (
          <p className="break-words whitespace-break-spaces">{postTitle}</p>
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
              <>
                <button
                  disabled={isMutating}
                  onClick={onCancel}
                  className="text-sm font-bold disabled:opacity-25">
                  Cancel
                </button>
                <p
                  className={`font-bold text-sm flex-1 text-right ${
                    newPost.length > 300 ? ' text-red-700 dark:text-red-500' : ''
                  }`}>{`${newPost.length}/300`}</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
