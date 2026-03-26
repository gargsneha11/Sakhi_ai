export default function ProgressBar({ pct, color = 'from-violet-400 to-pink-400' }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
