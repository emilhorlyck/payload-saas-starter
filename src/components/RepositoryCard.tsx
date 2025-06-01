'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Archive, Eye, GitFork, Globe, Star, Clock, ExternalLink, Lock } from 'lucide-react'
import { formatRepoForDisplay } from '@/lib/github'
import { Repo } from '@/payload-types'

interface RepositoryCardProps {
  repo: Repo
}

export function RepositoryCard({ repo }: RepositoryCardProps) {
  const formatted = formatRepoForDisplay(repo)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate flex items-center gap-2">
              {formatted.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
              {formatted.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{formatted.fullName}</p>
          </div>
          <a
            href={formatted.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{formatted.description}</p>

        <div className="flex flex-wrap gap-1">
          {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
          {formatted.isArchived && (
            <Badge variant="outline" className="text-orange-600">
              <Archive size={12} className="mr-1" />
              Archived
            </Badge>
          )}
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topicObj, index) => (
              <Badge
                key={topicObj.id || topicObj.topic || index}
                variant="outline"
                className="text-xs"
              >
                {topicObj.topic}
              </Badge>
            ))}
            {repo.topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{repo.topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={14} />
              {formatted.stars}
            </div>
            <div className="flex items-center gap-1">
              <GitFork size={14} />
              {formatted.forks}
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              {formatted.issues}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={12} />
          Updated {formatted.lastUpdated}
        </div>
      </CardContent>
    </Card>
  )
}
