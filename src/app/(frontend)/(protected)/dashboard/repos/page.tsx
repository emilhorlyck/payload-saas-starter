'use client'

import { useEffect, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Repo } from '@/payload-types'
import { getReposByTenant } from './actions'

export default function ReposPage() {
  const { selectedTenantID } = useTenantSelection()
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRepos = async () => {
      if (!selectedTenantID) {
        setRepos([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const result = await getReposByTenant(selectedTenantID)

        if (result.success) {
          setRepos(result.repos)
        } else {
          throw new Error(result.error || 'Failed to fetch repositories')
        }
      } catch (err) {
        console.error('Error fetching repos:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories')
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [selectedTenantID])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading repositories...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!selectedTenantID) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Please select a tenant to view repositories.</div>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>No repositories found for the selected tenant.</div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <Card key={repo.id}>
          <CardHeader>
            <CardTitle>{repo.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
