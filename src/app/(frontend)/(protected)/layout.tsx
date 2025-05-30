import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { TenantSelectionProvider } from '@payloadcms/plugin-multi-tenant/rsc'
import { getPayload } from 'payload'
import config from '@/payload.config'

import type { User } from '@/payload-types'

type AuthLayoutProps = {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user: User | null = await getUser()

  if (!user) {
    redirect('/login')
  }

  const payload = await getPayload({ config })

  // Cast user to include collection property that Payload expects
  const payloadUser = {
    ...user,
    collection: 'users' as const,
  }

  return (
    <TenantSelectionProvider
      payload={payload}
      user={payloadUser}
      tenantsCollectionSlug="tenants"
      useAsTitle="name"
    >
      {children}
    </TenantSelectionProvider>
  )
}
