import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'

export default function ComingSoonModal({ open, onClose }) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[400px] rounded-2xl border border-[var(--auth-border)] bg-[var(--auth-bg)] p-7 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть модалку"
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-[var(--auth-muted)] transition hover:bg-[var(--auth-btn)] hover:text-[var(--auth-text)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M1 1l12 12M13 1 1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="text-center">
              <h2
                id={titleId}
                className="text-[1.65rem] font-semibold tracking-tight text-[var(--auth-text)]"
              >
                В разработке
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--auth-muted)]">
                Мобильное приложение ещё в разработке. Сейчас доступна веб-версия — зайди
                через «Войти».
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 flex w-full items-center justify-center rounded-lg bg-[var(--auth-primary)] px-4 py-3 text-sm font-medium text-[var(--auth-primary-text)] transition hover:opacity-90"
            >
              Понятно
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
