import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Login from './Login'
import Logged from './Logged'

export default async function Nav() {
  const session = await getServerSession(authOptions)

  return (
    <nav className="flex justify-between items-center py-8">
      <Link href="/">
        <h1 className="font-bold text-3xl italic tracking-tighter">Post It.</h1>
      </Link>
      <ul className="flex items-center gap-6">
        {!session?.user && <Login />}
        {session?.user && (
          <h1>
            <Logged image={session.user.image as string} />
          </h1>
        )}
      </ul>
    </nav>
  )
}
