// features/menu/hooks/useMenu.ts
"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchMenus } from '../services/menu.service'
import { MenuItem } from '@/features/menu/services/type'

export function useMenu() {
    return useQuery<MenuItem[]>({
        queryKey: ['menus'],
        queryFn: fetchMenus,
        staleTime: 1000 * 60 * 5, // cache 5 phút
    })
}
