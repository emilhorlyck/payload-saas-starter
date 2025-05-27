import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/ui/button'

function Navbar({}) {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Aceternity UI</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="default">
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="secondary">
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    </nav>
  )
}

export { Navbar }
