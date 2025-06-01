'use client'

import { useEffect, useState } from 'react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Repo } from '@/payload-types'
import { getReposByTenant } from './actions'
import { Archive, Badge, Eye, GitFork, Globe, Star } from 'lucide-react'
import { Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

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
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {repos.map((repo) => (
          <Card key={repo.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold truncate">{repo.name}</CardTitle>
                <div className="flex gap-1">
                  {repo.private ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                  {repo.archived && <Archive className="h-4 w-4" />}
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {repo.description || 'No description available'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {repo.topics?.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>{repo.stargazers_count} stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4" />
                  <span>{repo.forks_count} forks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{repo.watchers_count} watchers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" asChild>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Repository
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
