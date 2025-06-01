import { useState } from 'react'
import type { GitHubRepo } from '@/lib/github'
import { fetchAllGitHubOrgRepos } from '@/app/(frontend)/(protected)/dashboard/repos/github-actions'
import { upsertGitHubRepos } from '@/app/(frontend)/(protected)/dashboard/repos/actions'

interface UseGitHubReposFetcherProps {
  onReposFetched?: () => void
}

export function useGitHubReposFetcher({ onReposFetched }: UseGitHubReposFetcherProps = {}) {
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [githubLoading, setGithubLoading] = useState(false)
  const [githubError, setGithubError] = useState<string | null>(null)
  const [showGithubDialog, setShowGithubDialog] = useState(false)

  const handleFetchSigniflyRepos = async () => {
    setGithubLoading(true)
    setGithubError(null)
    setShowGithubDialog(true)

    try {
      const result = await fetchAllGitHubOrgRepos('signifly', {
        type: 'all',
        sort: 'updated',
        direction: 'desc',
      })

      if (result.success && 'repos' in result) {
        const repos = result.repos
        setGithubRepos(repos)
        setGithubError(null)

        // Upsert the repositories into the database (tenant-agnostic)
        if (repos.length > 0) {
          const upsertResult = await upsertGitHubRepos(repos)

          if (upsertResult.success) {
            console.log(
              `Successfully upserted ${upsertResult.upserted} repositories (${upsertResult.created} created, ${upsertResult.updated} updated)`,
            )

            // Call the callback to refresh the main repo list
            onReposFetched?.()
          } else {
            console.error('Failed to upsert repositories:', upsertResult.error)
            // Still show the GitHub repos even if upsert failed
          }
        }
      } else {
        setGithubError(result.error)
        setGithubRepos([])
      }
    } catch (err) {
      setGithubError(err instanceof Error ? err.message : 'Failed to fetch GitHub repositories')
      setGithubRepos([])
    } finally {
      setGithubLoading(false)
    }
  }

  return {
    githubRepos,
    githubLoading,
    githubError,
    showGithubDialog,
    setShowGithubDialog,
    handleFetchSigniflyRepos,
  }
}
