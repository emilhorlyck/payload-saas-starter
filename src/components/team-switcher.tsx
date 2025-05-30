'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

// Helper function to safely extract string from label
const getLabelString = (label: any): string => {
  if (typeof label === 'string') return label
  if (typeof label === 'function') return 'Team' // fallback for function labels
  return String(label || 'Team')
}

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
    id?: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const { options, selectedTenantID, setTenant } = useTenantSelection()

  // Auto-select first tenant if none is selected and options are available
  React.useEffect(() => {
    if (!selectedTenantID && options.length > 0) {
      setTenant({
        id: options[0].value,
        refresh: false, // Don't refresh to avoid reset
      })
    }
  }, [selectedTenantID, options, setTenant])

  const selectedValue = React.useMemo(() => {
    if (selectedTenantID) {
      return options.find((option) => option.value === selectedTenantID)
    }
    return undefined
  }, [options, selectedTenantID])

  const switchTenant = React.useCallback(
    (option: any) => {
      if (option && 'value' in option) {
        setTenant({
          id: option.value,
          refresh: false, // Prevent refresh to avoid losing selection
        })
      } else {
        setTenant({
          id: undefined,
          refresh: false,
        })
      }
    },
    [setTenant],
  )

  // Get the display name for the selected team
  const selectedTeamName = selectedValue ? getLabelString(selectedValue.label) : 'Select Team'
  const selectedTeamInitial = selectedValue
    ? getLabelString(selectedValue.label).charAt(0).toUpperCase()
    : '?'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <span className="text-xs font-medium">{selectedTeamInitial}</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{selectedTeamName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {selectedValue
                    ? 'Active team'
                    : `${options.length} team${options.length !== 1 ? 's' : ''} available`}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams ({options.length} available)
            </DropdownMenuLabel>
            {options.length === 0 ? (
              <DropdownMenuItem disabled className="gap-2 p-2">
                <div className="text-muted-foreground">No teams available</div>
              </DropdownMenuItem>
            ) : (
              options.map((option, index) => {
                const isSelected = selectedTenantID === option.value
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => switchTenant(option)}
                    className={`gap-2 p-2 ${isSelected ? 'bg-accent' : ''}`}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <span className="text-xs font-medium">
                        {getLabelString(option.label).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <span>{getLabelString(option.label)}</span>
                      {isSelected && <span className="text-xs text-muted-foreground">✓</span>}
                    </div>
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )
              })
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
