import type { CollectionConfig } from 'payload'

export const Repos: CollectionConfig = {
  slug: 'repos',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'github_id',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        description: 'GitHub repository ID',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Repository name',
      },
    },
    {
      name: 'full_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full repository name (owner/repo)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Repository description',
      },
    },
    {
      name: 'private',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the repository is private',
      },
    },
    {
      name: 'html_url',
      type: 'text',
      required: true,
      admin: {
        description: 'GitHub repository URL',
      },
    },
    {
      name: 'clone_url',
      type: 'text',
      admin: {
        description: 'Repository clone URL',
      },
    },
    {
      name: 'ssh_url',
      type: 'text',
      admin: {
        description: 'Repository SSH URL',
      },
    },
    {
      name: 'homepage',
      type: 'text',
      admin: {
        description: 'Repository homepage URL',
      },
    },
    {
      name: 'language',
      type: 'text',
      admin: {
        description: 'Primary programming language',
      },
    },
    {
      name: 'stargazers_count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of stars',
      },
    },
    {
      name: 'watchers_count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of watchers',
      },
    },
    {
      name: 'forks_count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of forks',
      },
    },
    {
      name: 'open_issues_count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of open issues',
      },
    },
    {
      name: 'default_branch',
      type: 'text',
      defaultValue: 'main',
      admin: {
        description: 'Default branch name',
      },
    },
    {
      name: 'created_at',
      type: 'date',
      admin: {
        description: 'Repository creation date',
      },
    },
    {
      name: 'updated_at',
      type: 'date',
      admin: {
        description: 'Last update date',
      },
    },
    {
      name: 'pushed_at',
      type: 'date',
      admin: {
        description: 'Last push date',
      },
    },
    {
      name: 'size',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Repository size in KB',
      },
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the repository is archived',
      },
    },
    {
      name: 'disabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the repository is disabled',
      },
    },
    {
      name: 'topics',
      type: 'array',
      fields: [
        {
          name: 'topic',
          type: 'text',
        },
      ],
      admin: {
        description: 'Repository topics/tags',
      },
    },
    {
      name: 'visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      defaultValue: 'public',
      admin: {
        description: 'Repository visibility',
      },
    },
    {
      name: 'owner',
      type: 'group',
      fields: [
        {
          name: 'login',
          type: 'text',
          required: true,
          admin: {
            description: 'Owner username',
          },
        },
        {
          name: 'github_id',
          type: 'number',
          required: true,
          admin: {
            description: 'Owner GitHub ID',
          },
        },
        {
          name: 'avatar_url',
          type: 'text',
          admin: {
            description: 'Owner avatar URL',
          },
        },
        {
          name: 'html_url',
          type: 'text',
          admin: {
            description: 'Owner GitHub profile URL',
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'User', value: 'User' },
            { label: 'Organization', value: 'Organization' },
          ],
          defaultValue: 'User',
          admin: {
            description: 'Owner type',
          },
        },
      ],
      admin: {
        description: 'Repository owner information',
      },
    },
  ],
}
