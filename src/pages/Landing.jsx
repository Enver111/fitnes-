import { useEffect, useState } from 'react'
import ComingSoonModal from '@/components/ComingSoonModal'
import AnimatedWaveFooter from '@/components/ui/animated-wave-footer'
import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import { AnimatedNavFramer } from '@/components/ui/navigation-menu'
import { useAuthModal } from '../auth/AuthModalContext'

const navItems = [
  { name: 'Главная', href: '#home' },
  { name: 'Блог', href: '#blog' },
  { name: 'Войти', href: '#login', action: 'login' },
]

export default function Landing() {
  const { openAuth } = useAuthModal()
  const [comingSoonOpen, setComingSoonOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('landing-no-scrollbar')
    return () => {
      document.documentElement.classList.remove('landing-no-scrollbar')
    }
  }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <AnimatedNavFramer
        items={navItems}
        onItemClick={(item) => {
          if (item.action === 'login' || item.action === 'register') {
            openAuth(item.action)
            return false
          }
        }}
      />
      <CinematicHero
        onPrimaryCta={() => setComingSoonOpen(true)}
        onSecondaryCta={() => openAuth('login')}
      />
      <AnimatedWaveFooter />
      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
      />
    </div>
  )
}
