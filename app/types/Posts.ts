export type UserType = {
  id: string
  name: string
  image: string
  email: string
  posts?: PostType[]
}

export type CommentType = {
  id?: string
  text: string
  createdAt?: string
  userId?: string
  postId: string
}

export type PostType = {
  id: string
  title: string
  createdAt: string
  userId: string
  user: UserType
  comments: CommentType[]
}
