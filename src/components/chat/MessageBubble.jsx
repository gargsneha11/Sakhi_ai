import { motion } from 'framer-motion'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const time   = message.id
    ? new Date(message.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <motion.div
      className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mb-0.5"
            style={{ background: 'var(--mood-accent-light, #ede9fe)' }}>
            <img src="/logo.png" alt="Sakhi" className="w-full h-full object-cover rounded-full" />
          </div>
        )}
        <div
          className="max-w-[78%] sm:max-w-[68%] px-4 py-2.5 text-sm leading-relaxed shadow-sm"
          style={isUser ? {
            background: 'var(--mood-accent, #7c3aed)',
            color: 'white',
            borderRadius: '18px 18px 4px 18px',
          } : {
            background: 'white',
            color: '#374151',
            border: '1px solid #f3f4f6',
            borderRadius: '18px 18px 18px 4px',
          }}
        >
          {message.text}
        </div>
      </div>
      {time && (
        <span className={`text-[10px] text-gray-300 px-1 ${isUser ? 'pr-2' : 'pl-9'}`}>
          {time}
        </span>
      )}
    </motion.div>
  )
}
