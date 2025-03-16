'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Box,
  Users,
  Settings,
  LogOut,
  MenuIcon,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type SidebarItem = {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Ordem de Cotação',
    href: '/dashboard/cotacao',
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: 'Lista de Compras',
    href: '/dashboard/lista-compras',
    icon: <ShoppingCart className="h-5 w-5" />
  },
  {
    title: 'Produtos',
    href: '/dashboard/produtos',
    icon: <Box className="h-5 w-5" />
  },
  {
    title: 'Fornecedores',
    href: '/dashboard/fornecedores',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: <Settings className="h-5 w-5" />
  }
]

interface SidebarMenuItemProps {
  item: SidebarItem
  isActive: boolean
  isCollapsed: boolean
  onClick?: () => void
}

function SidebarMenuItem({ item, isActive, isCollapsed, onClick }: SidebarMenuItemProps) {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  
  const handleToggleSubmenu = (e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault()
      setSubmenuOpen(!submenuOpen)
    }
  }
  
  return (
    <div className="w-full">
      <Link
        href={item.href}
        className={cn(
          "flex items-center py-3 px-3 rounded-lg text-gray-700 text-base font-medium transition-colors",
          "hover:bg-gray-100 hover:text-gray-900",
          isActive && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        onClick={(e) => {
          if (item.submenu) handleToggleSubmenu(e)
          if (onClick) onClick()
        }}
      >
        <div className="flex flex-1 items-center">
          <span className={cn(
            "mr-3 text-lg",
            isActive ? "text-primary" : "text-gray-500"
          )}>
            {item.icon}
          </span>
          <span className={cn(
            "transition-all duration-200",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            {item.title}
          </span>
        </div>
        {item.submenu && !isCollapsed && (
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform duration-200",
            submenuOpen && "transform rotate-90"
          )} />
        )}
      </Link>
      
      {item.submenu && submenuOpen && !isCollapsed && (
        <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-4 space-y-1">
          {item.submenu.map((subitem, i) => (
            <Link
              key={i}
              href={subitem.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm font-medium text-gray-700 transition-colors",
                "hover:bg-gray-100 hover:text-gray-900",
                usePathname() === subitem.href && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <span className="mr-3 text-gray-500">{subitem.icon}</span>
              {subitem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Close mobile sidebar on path change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])
  
  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <MenuIcon className="h-5 w-5" />
      </Button>
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[280px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">RS</span>
            </div>
            <span className={cn(
              "font-bold text-xl transition-all duration-300",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              Reduzo
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
          >
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform duration-200",
              isCollapsed && "transform rotate-180"
            )} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sidebarItems.map((item, i) => (
            <SidebarMenuItem
              key={i}
              item={item}
              isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              isCollapsed={isCollapsed}
              onClick={() => setIsMobileOpen(false)}
            />
          ))}
        </div>
        
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className={cn(
              "transition-all duration-200",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              Sair
            </span>
          </Button>
        </div>
      </aside>
      
      {/* Margin offset for content */}
      <div className={cn(
        "lg:ml-[280px] transition-all duration-300",
        isCollapsed && "lg:ml-[70px]"
      )} />
    </>
  )
}