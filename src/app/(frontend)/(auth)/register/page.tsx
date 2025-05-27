import { RegisterForm } from '@/components/auth/register-form'
import { AuthBox } from '@/components/auth/auth-box'

import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

import Link from 'next/link'

import type { User } from '@/payload-types'
import { LoginForm } from '@/components/auth/login-form'
import { Card } from '@/components/ui/card'

export default async function RegisterPage() {
  const user: User | null = await getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="mx-auto my-auto max-w-[400px] ">
      <Card className="p-8">
        <RegisterForm />
      </Card>
    </div>

    // <AuthBox>
    //   <h1>Sign Up</h1>
    //   <RegisterForm />
    //   <p className="text-muted-foreground">
    //     Already have an account?{' '}
    //     <Link className="text-foreground" href="/login">
    //       Login Now
    //     </Link>
    //   </p>
    // </AuthBox>
  )
}
