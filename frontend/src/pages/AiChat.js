import React, { useState, useEffect, useRef } from 'react';

const SUGGESTIONS = [
  "Help me plan my day 📅",
  "How to manage my expenses? 💰",
  "Give me productivity tips 🚀",
  "How to achieve my goals? 🎯",
  "Best study techniques 📚",
  "Help me stay motivated 💪",
];

const getAIResponse = (userInput) => {
  const msg = userInput.toLowerCase();
  if (msg.includes('task') || msg.includes('todo')) {
    return `📅 **Task Management Tips:**\n\n1. Break big tasks into smaller ones\n2. Prioritize by urgency (HIGH → MEDIUM → LOW)\n3. Set realistic deadlines\n4. Review your task list every morning\n5. Celebrate completed tasks! ✅\n\n💡 *Pro tip: Use the Tasks section to track everything in one place!*`;
  } else if (msg.includes('expense') || msg.includes('money') || msg.includes('budget')) {
    return `💰 **Smart Expense Management:**\n\n1. Track every expense, no matter how small\n2. Follow the 50/30/20 rule:\n   • 50% Needs\n   • 30% Wants\n   • 20% Savings\n3. Review monthly spending patterns\n4. Set category-wise budget limits\n5. Avoid impulse purchases 🛍️\n\n💡 *Check your Expense Analytics for detailed insights!*`;
  } else if (msg.includes('goal')) {
    return `🎯 **Goal Achievement Framework:**\n\n1. Use SMART goals:\n   • **S**pecific\n   • **M**easurable\n   • **A**chievable\n   • **R**elevant\n   • **T**ime-bound\n2. Break into weekly milestones\n3. Track progress with sliders\n4. Review every Sunday\n5. Celebrate small wins! 🎉\n\n💡 *Set your goals in the Goals section now!*`;
  } else if (msg.includes('plan') || msg.includes('day') || msg.includes('schedule')) {
    return `📅 **Your Optimal Day Plan:**\n\n🌅 **Morning (6-9 AM)**\n   • Exercise 30 mins\n   • Healthy breakfast\n   • Review today's tasks\n\n💼 **Peak Hours (9 AM-1 PM)**\n   • Focus on HIGH priority tasks\n   • No distractions\n\n🍽️ **Afternoon (1-2 PM)**\n   • Lunch break\n   • Short walk\n\n💻 **Work (2-6 PM)**\n   • Meetings & collaboration\n   • MEDIUM priority tasks\n\n🌙 **Evening (6-9 PM)**\n   • Learning & upskilling\n   • Family time\n\n😴 **Night (9-10 PM)**\n   • Review today\n   • Plan tomorrow\n   • 8 hrs sleep 💤`;
  } else if (msg.includes('study') || msg.includes('learn')) {
    return `📚 **Power Study Techniques:**\n\n1. **Pomodoro Technique** ⏱️\n   • 25 min focus + 5 min break\n   • 4 rounds = 1 long break\n\n2. **Active Recall** 🧠\n   • Test yourself instead of re-reading\n   • Use flashcards\n\n3. **Spaced Repetition** 📆\n   • Review after 1, 3, 7, 14 days\n\n4. **Feynman Technique** 💡\n   • Teach what you learn\n   • Simplify complex topics\n\n5. **Mind Mapping** 🗺️\n   • Visual connections between topics\n\n💡 *Add study goals in the Goals section!*`;
  } else if (msg.includes('health') || msg.includes('fitness') || msg.includes('exercise')) {
    return `💊 **Health & Wellness Guide:**\n\n🏃 **Physical Health:**\n   • Exercise 30 min daily\n   • 10,000 steps/day\n   • Stretch every 2 hours\n\n💧 **Hydration:**\n   • 8 glasses water/day\n   • Start morning with warm water\n\n🥗 **Nutrition:**\n   • Eat 3 balanced meals\n   • Avoid processed foods\n   • Include fruits & vegetables\n\n😴 **Sleep:**\n   • 7-8 hours every night\n   • Fixed sleep schedule\n   • No screens 1hr before bed\n\n💡 *Set health reminders in the Health section!*`;
  } else if (msg.includes('motivat') || msg.includes('stress') || msg.includes('focus')) {
    return `💪 **Stay Motivated & Focused:**\n\n1. **Start small** — 2-minute rule\n   If it takes < 2 min, do it NOW!\n\n2. **Atomic Habits** ⚛️\n   • 1% better every day\n   • Build habit stacks\n\n3. **Eliminate distractions** 📵\n   • Phone in another room\n   • Use website blockers\n\n4. **Reward yourself** 🎁\n   • After completing hard tasks\n   • Track your streaks\n\n5. **Mindset shifts** 🧠\n   • Progress > Perfection\n   • Done > Perfect\n   • Action > Planning\n\n🔥 *You've got this, Champion!*`;
  } else if (msg.includes('note') || msg.includes('write') || msg.includes('remember')) {
    return `📝 **Effective Note-Taking:**\n\n1. **Cornell Method** 📋\n   • Main notes + key points + summary\n\n2. **Digital Notes** 💻\n   • Use NEXUS Notes section\n   • Categorize: Personal/Work/Study\n\n3. **Review Cycle** 🔄\n   • Review within 24 hours\n   • Weekly summary\n   • Monthly review\n\n4. **Action Items** ✅\n   • Mark tasks from notes\n   • Add to Task Manager\n\n💡 *Your notes are safe in NEXUS Notes section!*`;
  } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('vanakkam')) {
    return `👋 **Hello, Champion!**\n\nWelcome to **NEXUS AI Assistant** — your personal productivity companion!\n\nI can help you with:\n\n📅 Task planning & management\n💰 Expense tracking & budgeting\n🎯 Goal setting & achievement\n📚 Study planning & techniques\n💊 Health & wellness tips\n📝 Note organization\n💪 Motivation & focus\n\n*What would you like help with today?*`;
  } else if (msg.includes('productivity') || msg.includes('efficient')) {
    return `⚡ **NEXUS Productivity System:**\n\n**Morning Ritual** 🌅\n• Wake up same time daily\n• No phone first 30 mins\n• Plan top 3 tasks for the day\n\n**Deep Work** 🧠\n• 90-min focused sessions\n• Single-tasking > Multi-tasking\n• Eliminate notifications\n\n**Energy Management** ⚡\n• Match task difficulty to energy\n• High energy = complex tasks\n• Low energy = routine tasks\n\n**Weekly Review** 📊\n• Every Sunday, review NEXUS Analytics\n• Celebrate wins\n• Adjust goals\n\n🔥 *Your NEXUS Productivity Score updates in real-time!*`;
  } else {
    return `🤖 **NEXUS AI at your service!**\n\nI'm your intelligent life management assistant. Here's what I can help with:\n\n📅 **Tasks** — Planning & prioritization\n💰 **Expenses** — Budget & tracking tips\n🎯 **Goals** — Achievement strategies\n📚 **Study** — Learning techniques\n💊 **Health** — Wellness & fitness\n📝 **Notes** — Organization tips\n💪 **Motivation** — Focus & mindset\n📊 **Productivity** — Efficiency hacks\n\n*Try asking: "Help me plan my day" or "Give me productivity tips"*`;
  }
};

function AiChat({ user }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `👋 Hello, **Champion**!\n\nWelcome to **NEXUS AI Assistant** — your personal productivity companion powered by advanced AI.\n\n*How can I help you today?*`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
  const savedChat = localStorage.getItem("nexus-chat");

  if (savedChat) {
    setMessages(JSON.parse(savedChat));
  }
}, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
  localStorage.setItem(
    "nexus-chat",
    JSON.stringify(messages)
  );
}, [messages]);

const clearChat = async () => {

  try {

    const confirmClear = window.confirm(
      "Are you sure you want to clear this conversation?"
    );

    if (!confirmClear) return;

    await fetch("http://localhost:8081/api/chat/clear", {
      method: "DELETE"
    });

    setMessages([]);

    setShowSuggestions(true);

  } catch (error) {

    console.error("Error clearing chat:", error);

  }

};

 const sendMessage = async (text) => {
  const msgText = text || input;
  if (!msgText.trim()) return;

  const userMsg = {
    role: "user",
    text: msgText,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);
  setShowSuggestions(false);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8081/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: msgText,
      }),
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);

let aiReply = data.response || "Sorry, I couldn't generate a response.";

if (data.error) {
  aiReply = "❌ " + data.error;
}

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: aiReply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "❌ Unable to connect to AI Server.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }

  setLoading(false);
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00f5ff">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#aaa">$1</em>')
      .replace(/\n/g, '<br/>');
  };


  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.aiAvatar}>⚡</div>
          <div>
            <div style={styles.aiName}>NEXUS AI Assistant</div>
            <div style={styles.aiStatus}>
              <span style={styles.statusDot} />
              Online • Powered by NEXUS Intelligence
            </div>
          </div>
        </div>
        <button style={styles.clearBtn} onClick={clearChat}>
          🗑 Clear Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div style={styles.chatBox}>
        <div style={styles.summaryCard}>
          <h3 style={{ color: "#00f5ff", marginBottom: "10px" }}>
            🌅 Today's AI Summary
          </h3>

          <p>📅 Stay focused on your highest priority tasks.</p>
          <p>🎯 Keep updating your goals regularly.</p>
          <p>💰 Track today's expenses to stay within budget.</p>
          <p>🚀 Small progress every day leads to big success!</p>
        </div>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.messageWrapper,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
          }}>
            {/* Avatar */}
            <div style={{
              ...styles.msgAvatar,
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #7b2fff, #00f5ff)'
                : 'linear-gradient(135deg, #00f5ff, #0a0a0f)',
              border: msg.role === 'ai' ? '1px solid #00f5ff44' : 'none'
            }}>
              {msg.role === 'user' ? user?.name?.charAt(0).toUpperCase() : '⚡'}
            </div>

            {/* Message Bubble */}
            <div style={{
              ...styles.messageBubble,
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #7b2fff, #5b0fff)'
                : '#12121a',
              border: msg.role === 'ai' ? '1px solid #00f5ff22' : 'none',
              borderRadius: msg.role === 'user'
                ? '18px 4px 18px 18px'
                : '4px 18px 18px 18px',
            }}>
              <div
                style={styles.msgText}
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
              />

              {msg.role === "ai" && (
                <button
                  style={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(msg.text);
                    alert("✅ Response copied!");
                  }}
                >
                  📋 Copy
              </button>
          )}

          <div style={styles.msgTime}>{msg.time}</div>
            </div>
          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div style={{...styles.messageWrapper, flexDirection: 'row'}}>
            <div style={{
              ...styles.msgAvatar,
              background: 'linear-gradient(135deg, #00f5ff, #0a0a0f)',
              border: '1px solid #00f5ff44'
            }}>⚡</div>
            <div style={{...styles.messageBubble, background: '#12121a', border: '1px solid #00f5ff22', borderRadius: '4px 18px 18px 18px'}}>
              <div style={styles.typingDots}>
                <span style={styles.dot} />
                <span style={{...styles.dot, animationDelay: '0.2s'}} />
                <span style={{...styles.dot, animationDelay: '0.4s'}} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div style={styles.suggestions}>
          <div style={styles.suggestLabel}>💡 Quick suggestions:</div>
          <div style={styles.suggestionChips}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} style={styles.chip} onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <textarea
            style={styles.input}
            placeholder="Ask NEXUS AI anything... (Enter to send)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button
            style={{
              ...styles.sendBtn,
              opacity: loading || !input.trim() ? 0.5 : 1
            }}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
        <div style={styles.inputHint}>Press Enter to send • Shift+Enter for new line</div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '85vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', background: '#12121a', borderRadius: '12px',
    marginBottom: '16px', border: '1px solid #00f5ff33',
    boxShadow: '0 0 20px #00f5ff11' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  aiAvatar: { width: '48px', height: '48px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #00f5ff, #7b2fff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', boxShadow: '0 0 15px #00f5ff55' },
  aiName: { fontSize: '16px', fontWeight: 'bold', color: '#00f5ff' },
  aiStatus: { fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%',
    background: '#6bcb77', display: 'inline-block', boxShadow: '0 0 6px #6bcb77' },
  clearBtn: { background: 'transparent', border: '1px solid #333',
    color: '#666', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  chatBox: { flex: 1, overflowY: 'auto', padding: '20px',
    background: '#0a0a0f', borderRadius: '12px',
    border: '1px solid #00f5ff11', marginBottom: '12px',
    display: 'flex', flexDirection: 'column', gap: '16px' },
  messageWrapper: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  msgAvatar: { width: '36px', height: '36px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 'bold', color: 'white',
    flexShrink: 0, marginTop: '4px' },
  messageBubble: { maxWidth: '70%', padding: '12px 16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.3)' },
  msgText: { fontSize: '14px', lineHeight: '1.7', color: '#ddd' },
  msgTime: { fontSize: '11px', color: '#444', marginTop: '6px', textAlign: 'right' },
  typingDots: { display: 'flex', gap: '6px', padding: '4px 0' },
  dot: { width: '8px', height: '8px', borderRadius: '50%',
    background: '#00f5ff', animation: 'bounce 1.2s infinite' },
  suggestions: { marginBottom: '12px' },
  suggestLabel: { fontSize: '12px', color: '#444', marginBottom: '8px' },
  suggestionChips: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip: { background: '#12121a', border: '1px solid #00f5ff33',
    color: '#aaa', padding: '6px 14px', borderRadius: '20px',
    cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' },
  inputArea: { flexShrink: 0 },
  inputWrapper: { display: 'flex', gap: '10px', alignItems: 'flex-end' },
  input: { flex: 1, padding: '14px 16px', border: '1px solid #00f5ff33',
    borderRadius: '12px', fontSize: '15px', outline: 'none',
    background: '#12121a', color: '#fff', resize: 'none',
    fontFamily: 'Arial, sans-serif', lineHeight: '1.5' },
  sendBtn: { width: '48px', height: '48px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #00f5ff, #7b2fff)',
    border: 'none', color: 'white', fontSize: '20px',
    cursor: 'pointer', flexShrink: 0,
    boxShadow: '0 0 15px #00f5ff44' },
  inputHint: { fontSize: '11px', color: '#333', marginTop: '6px', textAlign: 'center' },
  copyBtn: {
  marginTop: "8px",
  background: "transparent",
  border: "1px solid #00f5ff33",
  color: "#00f5ff",
  padding: "4px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px"
},


};

export default AiChat;