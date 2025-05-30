'use server'

import { getPayload } from 'payload'
import { headers } from 'next/headers'
import config from '@/payload.config'
import { getUser } from '@/lib/auth'
import type { Repo } from '@/payload-types'

type GetReposByTenantResult =
  | {
      success: true
      repos: Repo[]
    }
  | {
      success: false
      error: string
    }

export async function getReposByTenant(tenantId: string | number): Promise<GetReposByTenantResult> {
  try {
    const payload = await getPayload({ config })
    const headersList = await headers()
    const user = await getUser()

    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      }
    }

    const { docs: repos } = await payload.find({
      collection: 'repos',
      limit: 100,
      where: {
        tenant: {
          equals: tenantId,
        },
      },
      req: {
        headers: headersList,
        user: {
          ...user,
          collection: 'users' as const,
        },
      } as any,
    })

    return {
      success: true,
      repos,
    }
  } catch (error) {
    console.error('Error fetching repos by tenant:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch repositories',
    }
  }
}
