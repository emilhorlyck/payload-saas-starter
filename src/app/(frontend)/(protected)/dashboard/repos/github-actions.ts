'use server'

import { createGitHubClient, type GitHubRepo, type FetchReposOptions } from '@/lib/github'

/**
 * Server action to fetch repositories from a GitHub organization
 * @param orgName Organization name
 * @param options Fetch options
 * @param token Optional GitHub token (if not using environment variable)
 * @returns Promise with repositories or error
 */
export async function fetchGitHubOrgRepos(
  orgName: string,
  options: FetchReposOptions = {
    type: 'all',
  },
  token?: string,
) {
  try {
    if (!orgName || orgName.trim() === '') {
      return {
        success: false,
        error: 'Organization name is required',
      }
    }

    const github = createGitHubClient(token)
    const result = await github.fetchOrgRepos(orgName.trim(), options)

    return result
  } catch (error) {
    console.error('Error in fetchGitHubOrgRepos:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch GitHub repositories',
    }
  }
}

/**
 * Server action to fetch ALL repositories from a GitHub organization (with pagination)
 * @param orgName Organization name
 * @param options Fetch options (page will be ignored)
 * @param token Optional GitHub token
 * @returns Promise with all repositories or error
 */
export async function fetchAllGitHubOrgRepos(
  orgName: string,
  options: Omit<FetchReposOptions, 'page'> = {},
  token?: string,
) {
  try {
    if (!orgName || orgName.trim() === '') {
      return {
        success: false,
        error: 'Organization name is required',
      }
    }

    const github = createGitHubClient(token)
    const result = await github.fetchAllOrgRepos(orgName.trim(), options)

    return result
  } catch (error) {
    console.error('Error in fetchAllGitHubOrgRepos:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch all GitHub repositories',
    }
  }
}

/**
 * Server action to test GitHub connection
 * @param token Optional GitHub token
 * @returns Promise with connection status
 */
export async function testGitHubConnection(token?: string) {
  try {
    const github = createGitHubClient(token)
    const result = await github.testConnection()

    return result
  } catch (error) {
    console.error('Error in testGitHubConnection:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to test GitHub connection',
    }
  }
}
