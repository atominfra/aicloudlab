import { Book, Cpu, X, User, Router } from 'lucide-react'

const navItems = [
  { href: '/dashboard/services', icon: Router, label: 'Services' },
  { href: '/dashboard/notebooks', icon: Book, label: 'Notebooks' },
  { href: '/dashboard/nodes', icon: Cpu, label: 'Nodes' },
  // { href: '/profile', icon: User, label: 'Profile' },
]

export default navItems;