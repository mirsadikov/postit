import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/prisma/client'

export async function POST(req: NextRequest) {
  const session = await getServerSession({
    req,
    ...authOptions,
  })

  if (!session || !session.user || !session.user.email)
    return NextResponse.json({ message: 'Please sign in to make a post' }, { status: 401 })

  const body = await req.json()
  const title: string = body.title?.trim()

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!prismaUser) return NextResponse.json({ message: 'User not found' }, { status: 403 })

  if (!title) return NextResponse.json({ message: 'Title cannot be empty' }, { status: 403 })

  if (title.length > 300)
    return NextResponse.json({ message: 'Please write a shorter post' }, { status: 403 })

  // Create Post
  try {
    const result = await prisma.post.create({
      data: { title, userId: prismaUser.id },
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error has occured whilst creating a post' },
      { status: 403 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all posts
    const result = await prisma.post.findMany({
      include: { user: true, comments: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error has occured whilst fetching posts' },
      { status: 403 }
    )
  }
}
