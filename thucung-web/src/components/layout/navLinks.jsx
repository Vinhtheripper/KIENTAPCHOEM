import { Bot, FileText, HeartPulse, Home, Settings, UploadCloud } from 'lucide-react'
import { Users } from 'lucide-react'

export const navLinks = [
  { to: '/app', label: 'Dashboard', icon: Home, end: true, roles: ['pet_owner', 'admin'] },
  { to: '/app/users', label: 'Users', icon: Users, roles: ['admin'] },
  { to: '/app/pets', label: 'Pets', icon: HeartPulse, roles: ['pet_owner', 'admin'] },
  { to: '/app/upload', label: 'Upload', icon: UploadCloud, roles: ['pet_owner', 'admin'] },
  { to: '/app/content', label: 'Content', icon: FileText, roles: ['pet_owner', 'admin'] },
  { to: '/app/chat', label: 'AI Chat', icon: Bot, roles: ['pet_owner', 'admin'] },
  { to: '/app/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
]

export function linksForRole(role = 'pet_owner') {
  return navLinks.filter((link) => link.roles.includes(role))
}
