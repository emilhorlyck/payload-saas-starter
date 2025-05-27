'use client'

import * as React from 'react'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import type { User } from '@/payload-types'
import { getUser } from '@/lib/auth'
import { NavCode } from './nav-code'

// This is sample data.
const getDataWithUser = (user: User | null) => ({
  user: {
    name: user?.email,
    email: user?.email,
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Signifly',
      logo: GalleryVerticalEnd,
      plan: 'Owner',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Base SLA',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Custom SLA',
    },
  ],
  navMain: [
    // {
    //   title: 'Playground',
    //   url: '#',
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     {
    //       title: 'History',
    //       url: '#',
    //     },
    //     {
    //       title: 'Starred',
    //       url: '#',
    //     },
    //     {
    //       title: 'Settings',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Models',
    //   url: '#',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: 'Genesis',
    //       url: '#',
    //     },
    //     {
    //       title: 'Explorer',
    //       url: '#',
    //     },
    //     {
    //       title: 'Quantum',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Documentation',
    //   url: '#',
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: 'Introduction',
    //       url: '#',
    //     },
    //     {
    //       title: 'Get Started',
    //       url: '#',
    //     },
    //     {
    //       title: 'Tutorials',
    //       url: '#',
    //     },
    //     {
    //       title: 'Changelog',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Settings',
    //   url: '#',
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: 'General',
    //       url: '#',
    //     },
    //     {
    //       title: 'Team',
    //       url: '#',
    //     },
    //     {
    //       title: 'Billing',
    //       url: '#',
    //     },
    //     {
    //       title: 'Limits',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: 'Support (hello@)',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Website update',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Brand film',
      url: '#',
      icon: Map,
    },
    {
      name: 'All projects',
      url: '#',
      icon: Map,
    },
  ],
  repos: [
    {
      title: 'Solutions',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'Overview',
          url: '#',
        },
        {
          title: 'Uptime',
          url: '#',
        },
      ],
    },
    {
      title: 'Code',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'Overview',
          url: '#',
        },
        {
          title: 'repositories',
          url: '#',
        },
        {
          title: 'Commits',
          url: '#',
        },
      ],
    },
  ],
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const data = getDataWithUser(user)

  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center p-4">Loading...</div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavCode items={data.repos} />
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
