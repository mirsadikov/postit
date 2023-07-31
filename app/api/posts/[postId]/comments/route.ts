import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await getServerSession({
    req,
    ...authOptions,
  })

  if (!session || !session.user || !session.user.email)
    return NextResponse.json({ message: 'Please sign in to add a comment' }, { status: 401 })

  const body = await req.json()
  const { text, postId } = body

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!prismaUser) return NextResponse.json({ message: 'User not found' }, { status: 403 })

  if (!text || !postId)
    return NextResponse.json({ message: 'Invalid post or comment' }, { status: 403 })

  if (text.length > 300)
    return NextResponse.json({ message: 'Please write a shorter comment' }, { status: 403 })

  // Create Comment
  try {
    const result = await prisma.comment.create({
      data: { text, userId: prismaUser.id, postId },
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error has occured whilst creating a comment' },
      { status: 403 }
    )
  }
}
