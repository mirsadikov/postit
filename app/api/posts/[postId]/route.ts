import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/prisma/client'

type Context = {
  params: {
    postId: string
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const session = await getServerSession({
    req,
    ...authOptions,
  })

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { postId } = params

    const result = await prisma.post.delete({
      where: { id: postId, user: { email: session.user.email } },
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: 'Error has occured while deleting post' }, { status: 403 })
  }
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { postId } = params

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: true,
          },
        },
        user: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ message: 'Error has occured while fetching post' }, { status: 403 })
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  const session = await getServerSession({
    req,
    ...authOptions,
  })

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { postId } = params
    const body = await req.json()

    const result = await prisma.post.update({
      where: { id: postId, user: { email: session.user.email } },
      data: {
        title: body.title,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: 'Error has occured while updating post' }, { status: 403 })
  }
}
