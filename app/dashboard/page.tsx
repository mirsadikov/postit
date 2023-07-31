import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import MyPosts from './MyPosts'

export default async function Dashboard() {
  const session = await getServerSession({ ...authOptions, req: {} })

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main>
      <h1 className="text-2xl font-bold">Welcome back {session.user?.name}</h1>
      <MyPosts />
    </main>
  )
}
