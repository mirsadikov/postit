import { getServerSession } from 'next-auth'
import AddPost from './components/AddPost'
import Posts from './components/Posts'
import { authOptions } from './api/auth/[...nextauth]/route'

export default async function Home() {
  const session = await getServerSession({ ...authOptions })

  return (
    <main>
      {session ? <AddPost /> : <p className="text-center">Sign in to create a post</p>}
      <Posts />
    </main>
  )
}
