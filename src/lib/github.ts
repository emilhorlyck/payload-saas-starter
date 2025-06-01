import { Octokit } from 'octokit'
import type { Repo } from '@/payload-types'

/**
 * GitHub Repository interface based on GitHub API response
 */
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  html_url: string
  clone_url: string
  ssh_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  default_branch: string
  created_at: string
  updated_at: string
  pushed_at: string | null
  size: number
  archived: boolean
  disabled: boolean
  topics: string[]
  visibility: 'public' | 'private'
  owner: {
    login: string
    id: number
    avatar_url: string
    html_url: string
    type: 'User' | 'Organization'
  }
}

/**
 * Options for fetching repositories
 */
export interface FetchReposOptions {
  /**
   * Type of repositories to fetch
   * @default 'all'
   */
  type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member'
  /**
   * Sort repositories by
   * @default 'updated'
   */
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  /**
   * Sort direction
   * @default 'desc'
   */
  direction?: 'asc' | 'desc'
  /**
   * Number of results per page (max 100)
   * @default 100
   */
  per_page?: number
  /**
   * Page number to fetch
   * @default 1
   */
  page?: number
}

/**
 * Result type for repository fetching operations
 */
export type FetchReposResult =
  | {
      success: true
      repos: GitHubRepo[]
      total_count: number
      has_more: boolean
    }
  | {
      success: false
      error: string
      status_code?: number
    }

/**
 * GitHub client for fetching organization repositories
 */
export class GitHubClient {
  private octokit: Octokit

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token,
    })
  }

  /**
   * Fetch all repositories for a given organization
   * @param org Organization name
   * @param options Fetch options
   * @returns Promise with repositories or error
   */
  async fetchOrgRepos(org: string, options: FetchReposOptions = {}): Promise<FetchReposResult> {
    try {
      const {
        type = 'all',
        sort = 'updated',
        direction = 'desc',
        per_page = 100,
        page = 1,
      } = options

      const apiParams = {
        org,
        type,
        sort,
        direction,
        per_page: Math.min(per_page, 100), // GitHub API max is 100
        page,
      }
      const response = await this.octokit.rest.repos.listForOrg(apiParams)

      const repos: GitHubRepo[] = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        default_branch: repo.default_branch,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        size: repo.size,
        archived: repo.archived,
        disabled: repo.disabled,
        topics: repo.topics || [],
        visibility: repo.visibility,
        owner: {
          login: repo.owner.login,
          id: repo.owner.id,
          avatar_url: repo.owner.avatar_url,
          html_url: repo.owner.html_url,
          type: repo.owner.type,
        },
      }))

      // Check if there are more pages
      const linkHeader = response.headers.link
      const hasMore = linkHeader ? linkHeader.includes('rel="next"') : false

      return {
        success: true,
        repos,
        total_count: repos.length,
        has_more: hasMore,
      }
    } catch (error: any) {
      console.error(`Error fetching repos for org "${org}":`, error)

      let errorMessage = 'Failed to fetch repositories'
      let statusCode: number | undefined

      if (error.response) {
        statusCode = error.response.status
        switch (statusCode) {
          case 401:
            errorMessage = 'Authentication failed. Please check your GitHub token.'
            break
          case 403:
            errorMessage =
              'Access forbidden. You may have exceeded the rate limit or lack permissions.'
            break
          case 404:
            errorMessage = `Organization "${org}" not found or is private.`
            break
          case 422:
            errorMessage = 'Invalid request parameters.'
            break
          default:
            errorMessage = error.response.data?.message || 'Unknown GitHub API error'
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.'
      } else {
        errorMessage = error.message || 'Unknown error occurred'
      }

      return {
        success: false,
        error: errorMessage,
        status_code: statusCode,
      }
    }
  }

  /**
   * Fetch all repositories for an organization with automatic pagination
   * @param org Organization name
   * @param options Fetch options (page will be ignored as we fetch all)
   * @returns Promise with all repositories or error
   */
  async fetchAllOrgRepos(
    org: string,
    options: Omit<FetchReposOptions, 'page'> = {},
  ): Promise<FetchReposResult> {
    try {
      const allRepos: GitHubRepo[] = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        const result = await this.fetchOrgRepos(org, { ...options, page })

        if (!result.success) {
          return result
        }

        allRepos.push(...result.repos)
        hasMore = result.has_more
        page++

        // Safety break to prevent infinite loops
        if (page > 100) {
          console.warn(`Stopped fetching after 100 pages for org "${org}"`)
          break
        }
      }

      return {
        success: true,
        repos: allRepos,
        total_count: allRepos.length,
        has_more: false,
      }
    } catch (error: any) {
      console.error(`Error fetching all repos for org "${org}":`, error)
      return {
        success: false,
        error: error.message || 'Failed to fetch all repositories',
      }
    }
  }

  /**
   * Test the GitHub connection and authentication
   * @returns Promise with connection status
   */
  async testConnection(): Promise<{ success: boolean; user?: string; error?: string }> {
    try {
      const response = await this.octokit.rest.users.getAuthenticated()
      return {
        success: true,
        user: response.data.login,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to authenticate with GitHub',
      }
    }
  }
}

/**
 * Create a GitHub client instance
 * @param token Optional GitHub personal access token
 * @returns GitHubClient instance
 */
export function createGitHubClient(token?: string): GitHubClient {
  const finalToken = token || process.env.GITHUB_TOKEN
  return new GitHubClient(finalToken)
}

/**
 * Default GitHub client instance (uses environment variable for token)
 */
export const github = createGitHubClient(process.env.GITHUB_TOKEN)

/**
 * Helper function to format GitHub repository data for display
 * @param repo GitHub repository
 * @returns Formatted repository data
 */
export function formatRepoForDisplay(repo: GitHubRepo): any
export function formatRepoForDisplay(repo: Repo): any
export function formatRepoForDisplay(repo: GitHubRepo | Repo) {
  if ('github_id' in repo) {
    // This is a Repo from Payload
    return {
      id: repo.github_id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description available',
      isPrivate: repo.private || false,
      url: repo.html_url,
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      issues: repo.open_issues_count || 0,
      lastUpdated: repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : 'Unknown',
      createdAt: repo.created_at ? new Date(repo.created_at).toLocaleDateString() : 'Unknown',
      topics: repo.topics?.map((t) => t.topic).filter(Boolean) || [],
      isArchived: repo.archived || false,
      defaultBranch: repo.default_branch || 'main',
      owner: repo.owner.login,
      ownerAvatar: repo.owner.avatar_url,
    }
  } else {
    // This is a GitHubRepo
    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description available',
      isPrivate: repo.private,
      url: repo.html_url,
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
      createdAt: new Date(repo.created_at).toLocaleDateString(),
      topics: repo.topics,
      isArchived: repo.archived,
      defaultBranch: repo.default_branch,
      owner: repo.owner.login,
      ownerAvatar: repo.owner.avatar_url,
    }
  }
}
