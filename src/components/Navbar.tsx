"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { ThemeToggleMode } from './theme/ThemeToggleMode'

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;
  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a className="text-xl font-bold mb-4 md:mb-0"href="#">Nameless Feedback</a>
        {
          session ? (
           <>
            <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
            <div className='flex space-x-4'>
              <ThemeToggleMode />
              <Button className="w-full md:w-auto" onClick={()=> signOut()}>Logout</Button>
            </div>
           </>
          ) : (
            <Link href="/sign-in">
              <Button className='w-full md:w-auto'>Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar