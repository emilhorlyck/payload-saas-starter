'use server'

import { getPayload } from 'payload'
import { headers } from 'next/headers'
import config from '@/payload.config'
import { getUser } from '@/lib/auth'
import type { Repo } from '@/payload-types'
import type { GitHubRepo } from '@/lib/github'

type GetReposResult =
  | {
      success: true
      repos: Repo[]
    }
  | {
      success: false
      error: string
    }

type UpsertGitHubReposResult =
  | {
      success: true
      upserted: number
      created: number
      updated: number
    }
  | {
      success: false
      error: string
    }

export async function getRepos(): Promise<GetReposResult> {
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
    console.error('Error fetching repos:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch repositories',
    }
  }
}

/**
 * Upsert GitHub repositories into the Repos collection (tenant-agnostic)
 * @param githubRepos Array of GitHub repositories
 * @returns Promise with upsert results
 */
export async function upsertGitHubRepos(
  githubRepos: GitHubRepo[],
): Promise<UpsertGitHubReposResult> {
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

    if (!githubRepos || githubRepos.length === 0) {
      return {
        success: true,
        upserted: 0,
        created: 0,
        updated: 0,
      }
    }

    let created = 0
    let updated = 0

    // Get all existing repos to check for duplicates (regardless of tenant)
    const { docs: existingRepos } = await payload.find({
      collection: 'repos',
      limit: 1000, // Adjust based on expected repo count
      req: {
        headers: headersList,
        user: {
          ...user,
          collection: 'users' as const,
        },
      } as any,
    })

    const existingRepoMap = new Map(existingRepos.map((repo) => [repo.name, repo]))

    // Process each GitHub repo
    for (const githubRepo of githubRepos) {
      const existingRepo = existingRepoMap.get(githubRepo.name)

      const repoData = {
        github_id: githubRepo.id,
        name: githubRepo.name,
        full_name: githubRepo.full_name,
        description: githubRepo.description,
        private: githubRepo.private,
        html_url: githubRepo.html_url,
        clone_url: githubRepo.clone_url,
        ssh_url: githubRepo.ssh_url,
        homepage: githubRepo.homepage,
        language: githubRepo.language,
        stargazers_count: githubRepo.stargazers_count,
        watchers_count: githubRepo.watchers_count,
        forks_count: githubRepo.forks_count,
        open_issues_count: githubRepo.open_issues_count,
        default_branch: githubRepo.default_branch,
        created_at: githubRepo.created_at,
        updated_at: githubRepo.updated_at,
        pushed_at: githubRepo.pushed_at,
        size: githubRepo.size,
        archived: githubRepo.archived,
        disabled: githubRepo.disabled,
        topics: githubRepo.topics.map((topic) => ({ topic })),
        visibility: githubRepo.visibility,
        owner: {
          login: githubRepo.owner.login,
          github_id: githubRepo.owner.id,
          avatar_url: githubRepo.owner.avatar_url,
          html_url: githubRepo.owner.html_url,
          type: githubRepo.owner.type,
        },
        // Set tenant to null - repos are tenant-agnostic
        tenant: null,
      }

      if (existingRepo) {
        // Update existing repo (update all fields)
        await payload.update({
          collection: 'repos',
          id: existingRepo.id,
          data: repoData,
          req: {
            headers: headersList,
            // Remove user context to bypass tenant restrictions
          } as any,
        })
        updated++
      } else {
        // Create new repo without tenant association
        await payload.create({
          collection: 'repos',
          data: repoData,
          req: {
            headers: headersList,
            // Remove user context to bypass tenant restrictions
          } as any,
        })
        created++
      }
    }

    return {
      success: true,
      upserted: created + updated,
      created,
      updated,
    }
  } catch (error) {
    console.error('Error upserting GitHub repos:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upsert GitHub repositories',
    }
  }
}
