import { motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthModal } from '../../auth/AuthModalContext'
import ThemeToggle from '../ThemeToggle'

const HeroScene = lazy(() => import('./HeroScene'))

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const { openAuth } = useAuthModal()
  const [reduced, setReduced] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {mounted ? (
          <Suspense
            fallback={
              <div
                className="absolute inset-0"
                style={{ background: 'var(--hero-fallback)' }}
              />
            }
          >
            <HeroScene reduced={reduced} />
          </Suspense>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'var(--hero-fallback)' }}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--hero-veil)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{ background: 'var(--hero-glow)' }}
        />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10 md:py-6">
        <Link
          to="/"
          className="font-display text-xl tracking-[0.18em] text-mist/80 transition hover:text-mist md:text-2xl"
        >
          FITNES
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => openAuth('login')}
            className="text-sm font-medium text-fog transition hover:text-mist"
          >
            Войти
          </button>
          <button
            type="button"
            onClick={() => openAuth('register')}
            className="rounded-sm bg-signal px-3.5 py-2 text-sm font-semibold text-on-accent transition hover:bg-cta-hover hover:text-ink-soft"
          >
            Начать
          </button>
        </nav>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-5.5rem)] w-full max-w-6xl grid-cols-1 items-end px-5 pb-16 pt-6 md:grid-cols-12 md:items-center md:px-10 md:pb-24 md:pt-0">
        <div className="md:col-span-6 lg:col-span-5">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease }}
            className="font-display text-[clamp(4.5rem,14vw,9.5rem)] leading-[0.82] tracking-[0.08em] text-mist"
          >
            FITNES
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="mt-5 max-w-md text-2xl font-semibold leading-tight text-mist sm:text-3xl md:text-[2.1rem]"
          >
            AI-тренер под твою цель
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.24, ease }}
            className="mt-4 max-w-sm text-base leading-relaxed text-fog md:text-lg"
          >
            Введи данные и цель — получи рацион и тренировки, собранные под тебя.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.36, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={() => openAuth('register')}
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-signal px-6 text-sm font-semibold text-on-accent transition hover:bg-cta-hover hover:text-ink-soft"
            >
              Попробовать бета
            </button>
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="inline-flex min-h-11 items-center justify-center rounded-sm border border-line px-6 text-sm font-medium text-mist transition hover:border-signal hover:text-signal"
            >
              Войти в профиль
            </button>
          </motion.div>
        </div>

        <div className="pointer-events-none hidden md:col-span-6 md:block lg:col-span-7" aria-hidden />
      </div>
    </section>
  )
}
