export function getSessionId() {
  let sessionId = localStorage.getItem('sakhi-session-id')
  if (!sessionId) {
    sessionId = 'session_' + Date.now()
    localStorage.setItem('sakhi-session-id', sessionId)
  }
  return sessionId
}

const moodGreetings = {
  Happy:     "You seem happy today 😊 That's wonderful! Let's make the most of this great energy. What would you like to work on?",
  Sad:       "I noticed you're feeling sad today 💙 That's okay — I'm here for you. Take it one small step at a time. What's on your mind?",
  Stressed:  "I can see you're stressed right now 🌬️ Take a slow deep breath. You've handled hard things before and you'll get through this too. How can I help?",
  Anxious:   "Feeling anxious is tough, but you're not alone 🤗 Let's slow down together. Focus on what you can control right now. I'm right here with you.",
  Bored:     "Feeling bored? Let's fix that! 🎯 We could try a quick quiz, explore a new topic, or just have a fun chat. What sounds good?",
  Motivated: "You're on fire today 🔥 Love that energy! Let's channel it into something great. What are you working on?",
  Neutral:   "Hey there 👋 No pressure — we can go at whatever pace feels right. What would you like to do today?",
}

function getMoodOpener() {
  const mood = localStorage.getItem('userMood')
  return mood && moodGreetings[mood] ? moodGreetings[mood] : null
}

export function getBotReply(message) {
  const msg = message.toLowerCase().trim()
  const mood = localStorage.getItem('userMood')

  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    const moodGreet = getMoodOpener()
    return moodGreet || 'Hello! How can I help you today? 😊'
  }

  if (msg.includes('stress') || msg.includes('stressed') || msg.includes('overwhelmed'))
    return mood === 'Stressed'
      ? "I know — you told me you're stressed today 💙 Let's break things down. Pick ONE small task and focus only on that. You've got this!"
      : "It's okay to feel stressed sometimes. Take a deep breath 🌬️ One step at a time — you've got this! 💪"

  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('nervous'))
    return mood === 'Anxious'
      ? "You mentioned feeling anxious today 🤗 Try the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. It really helps!"
      : "Anxiety can feel overwhelming, but it passes 🌸 Try grounding yourself — focus on your breathing for 60 seconds."

  if (msg.includes('sad') || msg.includes('unhappy') || msg.includes('depressed') || msg.includes('cry'))
    return mood === 'Sad'
      ? "I know today feels heavy 💙 It's okay to feel sad. Be gentle with yourself. Even tiny progress counts — I'm proud of you for showing up."
      : "I hear you, and it's okay to feel this way 💙 Be kind to yourself today. Small steps forward still count. I'm here with you 🌸"

  if (msg.includes('motivat') || msg.includes('inspire') || msg.includes('goal'))
    return mood === 'Motivated'
      ? "Yes! You're already motivated — now let's make it count 🔥 Set a clear goal for the next 30 minutes and crush it!"
      : "Believe in yourself — you are more capable than you think! 🚀 Stay curious, stay consistent, and success will follow. 🌟"

  if (msg.includes('bored') || msg.includes('boring') || msg.includes('nothing to do'))
    return mood === 'Bored'
      ? "Since you're bored, how about a quick quiz? 📝 Head to the Quiz page and test yourself on any topic — it's actually fun!"
      : "Boredom is a sign your brain wants a challenge 🎯 Try learning something new for just 10 minutes!"

  if (msg.includes('study') || msg.includes('studying') || msg.includes('learn') || msg.includes('exam'))
    return mood === 'Stressed' || mood === 'Anxious'
      ? "I know studying feels hard right now 📚 Try the Pomodoro method: 25 min study, 5 min break. Small chunks make it manageable. You can do this!"
      : "Every minute you spend studying is an investment in your future 📚 Break it into small chunks, stay consistent. You're doing great! 🌟"

  if (msg.includes('tired') || msg.includes('exhausted') || msg.includes('sleep'))
    return "Rest is part of the process 🌙 A well-rested mind learns better. Take a short break, drink some water, and come back refreshed. You deserve it! 💧"

  if (msg.includes('help'))
    return "I'm here for you! 🌸 You can ask me about studying, managing stress, staying motivated, or just chat. What's on your mind?"

  if (msg.includes('thank') || msg.includes('thanks'))
    return "You're so welcome! 🌸 I'm always here whenever you need me. Keep up the great work!"

  // Mood-aware fallback
  if (mood === 'Happy')     return "Love your energy today 😊 Keep that positivity going! What else is on your mind?"
  if (mood === 'Sad')       return "I'm here with you 💙 You don't have to figure everything out today. What would make you feel a little better right now?"
  if (mood === 'Stressed')  return "Remember to breathe 🌬️ You're doing better than you think. What's the one thing stressing you most right now?"
  if (mood === 'Anxious')   return "You're safe and you're doing okay 🤗 Take it one moment at a time. I'm right here."
  if (mood === 'Bored')     return "Let's find something interesting! 🎯 Want to try a quiz, learn a fun fact, or just chat?"
  if (mood === 'Motivated') return "Keep that fire burning 🔥 What's your next goal? Let's talk about it!"

  return "That's interesting! 🌸 I'm always here to support your studies and keep you motivated. What else is on your mind?"
}
