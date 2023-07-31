'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CommentType } from '../types/Posts'

type PostProps = {
  id: string
  avatar: string
  name: string
  postTitle: string
  comments: CommentType[]
  onDeleteClick?: () => void
}

export default function Post({ avatar, name, postTitle, id, comments, onDeleteClick }: PostProps) {
  return (
    <div className="bg-white my-8 p-8 rounded-lg dark:bg-gray-700">
      <div className="flex items-center gap-2">
        <Image className="rounded-full" width={32} height={32} src={avatar} alt="avatar" />
        <h3 className="font-bold">{name}</h3>
      </div>
      <div className="my-8">
        <p className="break-all">{postTitle}</p>
      </div>
      <div className="flex gap-4 cursor-pointer items-center">
        <Link href={`/post/${id}`}>
          <span className="text-sm font-bold">Comments</span>
          <span className="bg-gray-200 dark:bg-gray-500 py-1 px-1.5 font-medium rounded-md text-xs ml-1.5">
            {comments.length}
          </span>
        </Link>
        {onDeleteClick && (
          <button
            onClick={onDeleteClick}
            className="text-sm font-bold text-red-700 dark:text-red-500">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
