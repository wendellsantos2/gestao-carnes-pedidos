import {
  Home as HomeIcon,
  LocalDining as LocalDiningIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material'
import type { SvgIconComponent } from '@mui/icons-material'

export interface NavItem {
  label: string
  path: string
  icon: SvgIconComponent
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', path: '/', icon: HomeIcon },
  { label: 'Carnes', path: '/carnes', icon: LocalDiningIcon },
  { label: 'Compradores', path: '/compradores', icon: PeopleIcon },
  { label: 'Pedidos', path: '/pedidos', icon: ShoppingCartIcon },
]

export const DRAWER_WIDTH = 260
