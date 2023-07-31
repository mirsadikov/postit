import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({
      req,
      ...authOptions,
    })

    if (!session || !session.user || !session.user.email)
      return NextResponse.json({ message: 'Please sign in to get your a posts' }, { status: 401 })

    // Fetch all posts
    const data = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          include: { comments: true },
        },
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error has occured whilst fetching posts' },
      { status: 403 }
    )
  }
}
