import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const mockMessages = [
  {
    role: 'ai',
    text: 'Привет! Я твой AI-тренер. Расскажи цель — похудение, набор или тонус — и что есть из оборудования.',
  },
  {
    role: 'user',
    text: 'Хочу похудеть, тренируюсь дома 3 раза в неделю.',
  },
  {
    role: 'ai',
    text: 'Ок. Ниже черновик рациона и домашних тренировок — сохранится в профиле после онбординга.',
  },
]

const nutrition = [
  { title: 'Калории', value: '~1850 ккал / день' },
  { title: 'Белок', value: '120–140 г' },
  { title: 'Пример дня', value: 'Овсянка · курица с рисом · творог · овощи' },
]

const workouts = [
  { day: 'Пн', focus: 'Full body · приседания, отжимания, планка' },
  { day: 'Ср', focus: 'Кардио + кор · берпи, mountain climbers' },
  { day: 'Пт', focus: 'Сила ног/спины · выпады, тяга с рюкзаком' },
]

function getStoredEmail() {
  try {
    return JSON.parse(localStorage.getItem('fitnes-user') || '{}').email || 'Демо-профиль'
  } catch {
    return 'Демо-профиль'
  }
}

export default function AppShell() {
  const [tab, setTab] = useState('chat')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [userEmail] = useState(getStoredEmail)

  function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'ai',
        text: 'Демо без бэкенда: ответ ИИ появится здесь после подключения API.',
      },
    ])
    setInput('')
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-ink text-mist">
      <header className="flex items-center justify-between border-b border-line px-4 py-4 md:px-8">
        <Link to="/" className="font-display text-xl tracking-[0.12em]">
          FITNES
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          <span className="hidden truncate text-fog sm:inline">{userEmail}</span>
          <Link to="/login" className="text-fog hover:text-mist">
            Выйти
          </Link>
        </div>
      </header>

      <div className="flex gap-1 border-b border-line px-4 md:px-8">
        {[
          { id: 'chat', label: 'Чат с ИИ' },
          { id: 'nutrition', label: 'Питание' },
          { id: 'workouts', label: 'Тренировки' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
              tab === item.id
                ? 'border-signal text-mist'
                : 'border-transparent text-fog hover:text-mist'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 md:px-8">
        {tab === 'chat' && (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto pb-4">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={`max-w-[90%] rounded-sm px-4 py-3 text-sm leading-relaxed md:text-base ${
                    msg.role === 'user'
                      ? 'ml-auto bg-signal/15 text-mist'
                      : 'bg-ink-soft text-fog'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="mt-auto flex gap-2 pt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-11 flex-1 rounded-sm border border-line bg-ink-soft px-3 text-sm outline-none focus:border-signal"
                placeholder="Напиши цель или уточнение…"
              />
              <button
                type="submit"
                className="rounded-sm bg-signal px-4 text-sm font-semibold text-on-accent transition hover:bg-cta-hover hover:text-ink-soft"
              >
                Отправить
              </button>
            </form>
          </>
        )}

        {tab === 'nutrition' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Питание</h1>
            <p className="text-sm text-fog">
              Сохранённые рекомендации (mock). Появятся после генерации ИИ.
            </p>
            <ul className="divide-y divide-line border border-line">
              {nutrition.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:justify-between"
                >
                  <span className="text-fog">{item.title}</span>
                  <span className="font-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'workouts' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Тренировки</h1>
            <p className="text-sm text-fog">
              Недельный план (mock). Будет обновляться из чата.
            </p>
            <ul className="space-y-3">
              {workouts.map((w) => (
                <li
                  key={w.day}
                  className="border border-line bg-ink-soft px-4 py-4"
                >
                  <span className="font-display text-lg tracking-wider text-signal">
                    {w.day}
                  </span>
                  <p className="mt-1 text-sm md:text-base">{w.focus}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
