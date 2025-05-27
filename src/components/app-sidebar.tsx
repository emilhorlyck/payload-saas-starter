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

const user: User | null = await getUser()

// This is sample data.
const data = {
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
