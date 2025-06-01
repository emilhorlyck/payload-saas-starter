'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Github, Loader2 } from 'lucide-react'
import { RepositoryCard } from '@/components/RepositoryCard'
import { useGitHubReposFetcher } from '@/hooks/useGitHubReposFetcher'

interface GitHubReposFetcherProps {
  onReposFetched?: () => void
}

export function GitHubReposFetcher({ onReposFetched }: GitHubReposFetcherProps) {
  const {
    githubRepos,
    githubLoading,
    githubError,
    showGithubDialog,
    setShowGithubDialog,
    handleFetchSigniflyRepos,
  } = useGitHubReposFetcher({ onReposFetched })

  return (
    <Dialog open={showGithubDialog} onOpenChange={setShowGithubDialog}>
      <DialogTrigger asChild>
        <Button
          onClick={handleFetchSigniflyRepos}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
          title="Fetch Signifly GitHub Repos"
        >
          <Github className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Signifly GitHub Repositories ({githubRepos.length})
          </DialogTitle>
        </DialogHeader>
        {/* <ScrollArea className="h-[60vh]">
          {githubLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Fetching repositories...</span>
            </div>
          ) : githubError ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-red-600">Error: {githubError}</div>
            </div>
          ) : githubRepos.length > 0 ? (
            <div className="grid gap-4 p-4">
              {githubRepos.map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <div>No repositories found.</div>
            </div>
          )}
        </ScrollArea> */}
      </DialogContent>
    </Dialog>
  )
}
