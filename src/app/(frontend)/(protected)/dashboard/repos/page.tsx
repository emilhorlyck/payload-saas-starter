'use client'

import { useEffect, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Repo } from '@/payload-types'
import { getRepos } from './actions'
import { RepositoryCard } from '@/components/RepositoryCard'
import { GitHubReposFetcher } from '@/components/GitHubReposFetcher'
import { Clock } from 'lucide-react'

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

        const result = await getRepos()

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

  const handleReposFetched = async () => {
    // Refresh the tenant repos to show any updates
    if (selectedTenantID) {
      const refreshResult = await getRepos()
      if (refreshResult.success) {
        setRepos(refreshResult.repos)
      }
    }
  }

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
      <div className="min-h-screen relative">
        <div className="flex items-center justify-center p-8">
          <div>No repositories found for the selected tenant.</div>
        </div>

        {selectedTenantID === 1 && <GitHubReposFetcher onReposFetched={handleReposFetched} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {repos.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>

      {selectedTenantID === 1 && <GitHubReposFetcher onReposFetched={handleReposFetched} />}
    </div>
  )
}
