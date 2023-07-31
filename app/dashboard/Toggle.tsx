'use client'

import { useEffect } from 'react'

type ToggleProps = {
  deletePost: () => void
  close: () => void
}

export default function Toggle({ deletePost, close }: ToggleProps) {
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <div
      onClick={close}
      className="fixed bg-black/50 dark:bg-gray-900/80 w-full h-full z-20 left-0 top-0">
      <div
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="absolute bg-white dark:bg-gray-700 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-12 rounded-lg flex flex-col gap-6">
        <h2 className="text-xl">Are you sure you want to delete this post?</h2>
        <h3 className="text-red-600 text-sm">
          Pressing the delete button will permanently delete this post
        </h3>
        <button onClick={deletePost} className="bg-red-600 text-sm text-white py-2 px-4 rounded-md">
          Delete Post
        </button>
      </div>
    </div>
  )
}
