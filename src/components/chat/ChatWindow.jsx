import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import MessageBubble from './MessageBubble'

const ChatWindow = forwardRef(function ChatWindow({ messages, isTyping }, ref) {
  const containerRef = useRef(null)

  // Expose scrollToBottom to parent — only called explicitly after bot reply
  useImperativeHandle(ref, () => ({
    scrollToBottom() {
      const el = containerRef.current
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }))

  // On first mount only — jump to bottom instantly, no animation
  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 scrollbar-hide"
      style={{ minHeight: 0 }}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'var(--mood-accent-light, #ede9fe)' }}>🌸</div>
          <p className="text-sm font-medium text-gray-500">Say hi to Sakhi!</p>
          <p className="text-xs text-gray-400">She's here to help you study 💜</p>
        </div>
      )}

      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isTyping && (
        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0"
            style={{ background: 'var(--mood-accent-light, #ede9fe)' }}>
            <img src="/logo.png" alt="Sakhi" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms]"   style={{ background: 'var(--mood-accent, #7c3aed)' }} />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]" style={{ background: 'var(--mood-accent, #7c3aed)' }} />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]" style={{ background: 'var(--mood-accent, #7c3aed)' }} />
          </div>
        </div>
      )}
    </div>
  )
})

export default ChatWindow
