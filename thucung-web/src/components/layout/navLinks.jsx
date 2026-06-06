import { Bot, FileText, HeartPulse, Home, Settings, UploadCloud } from 'lucide-react'

export const navLinks = [
  { to: '/app', label: 'Dashboard', icon: Home, end: true },
  { to: '/app/pets', label: 'Pets', icon: HeartPulse },
  { to: '/app/upload', label: 'Upload', icon: UploadCloud },
  { to: '/app/content', label: 'Content', icon: FileText },
  { to: '/app/chat', label: 'AI Chat', icon: Bot },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]
