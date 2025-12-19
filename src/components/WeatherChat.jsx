import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUp, Cloud, Moon, Sun, CloudRain, Wind, Paperclip, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Lightweight animated loader shown while waiting for agent response
function TextDotsLoader({ text = "Thinking", size = "md", className = "" }) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`font-medium ${textSizes[size]}`} style={{ color: 'inherit' }}>
        {text}
      </span>
      <span className="inline-flex">
        <span className="animate-[loading-dots_1.4s_infinite_0.2s]" style={{ color: 'inherit' }}>
          .
        </span>
        <span className="animate-[loading-dots_1.4s_infinite_0.4s]" style={{ color: 'inherit' }}>
          .
        </span>
        <span className="animate-[loading-dots_1.4s_infinite_0.6s]" style={{ color: 'inherit' }}>
          .
        </span>
      </span>
    </div>
  );
}

// Weather agent API endpoint (non-streaming response)
const API_URL = "https://api-dev.provue.ai/api/webapp/agent/test-agent";

// Hero heading with animated shimmer effect for empty chat state
function ShimmerText({ text, darkMode }) {
    const [position, setPosition] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition(prev => (prev + 1) % 200);
        }, 15);
        return () => clearInterval(interval);
    }, []);

    return (
        <h1 
            className="text-[1.75rem] sm:text-[2.75rem] font-bold mb-12 text-center bg-clip-text text-transparent"
            style={{
                backgroundImage: darkMode 
                    ? 'linear-gradient(to right, #ffffff, #737373, #ffffff)'
                    : 'linear-gradient(to right, #121212, #a3a3a3, #121212)',
                backgroundSize: '200% 100%',
                backgroundPosition: `${position}% center`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            {text}
        </h1>
    );
}

// Custom hook to auto-resize the textarea based on content and window resize
function useAutoResizeTextarea({ minHeight, maxHeight }) {
    const textareaRef = useRef(null);

    const adjustHeight = useCallback((reset) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (reset) {
            textarea.style.height = `${minHeight}px`;
            return;
        }

        textarea.style.height = `${minHeight}px`;
        const newHeight = Math.max(
            minHeight,
            Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
        );
        textarea.style.height = `${newHeight}px`;
    }, [minHeight, maxHeight]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

function ActionButton({ icon, label, onClick, darkMode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border"
            style={{
                backgroundColor: darkMode ? '#171717' : '#f5f5f5',
                borderColor: darkMode ? '#262626' : '#e5e5e5',
                color: darkMode ? '#a3a3a3' : '#737373'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#262626' : '#e5e5e5';
                e.currentTarget.style.color = darkMode ? '#ffffff' : '#121212';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#171717' : '#f5f5f5';
                e.currentTarget.style.color = darkMode ? '#a3a3a3' : '#737373';
            }}
        >
            {icon}
            <span className="text-xs">{label}</span>
        </button>
    );
}

export default function WeatherChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(true);

    const bottomRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });

    // Auto-scroll to the latest message when chat updates
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);

    // Sends user input to the weather agent API and appends agent response to chat
    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userText = input;

        setMessages((prev) => [
            ...prev,
            { role: "user", content: userText },
        ]);

        setInput("");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: userText,
                    stream: false,
                }),
            });

            if (!res.ok) {
                throw new Error("API request failed");
            }

            const data = await res.json();
            console.log("API RESPONSE:", data);

            setMessages((prev) => [
                ...prev,
                {
                    role: "agent",
                    content: data?.data?.response || "No response received.",
                },
            ]);
        } catch (err) {
            setError("Failed to fetch weather response.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickQuestions = [
        { icon: <Cloud className="w-4 h-4" />, label: "Today's Weather" },
        { icon: <CloudRain className="w-4 h-4" />, label: "Will it Rain?" },
        { icon: <Sun className="w-4 h-4" />, label: "Weekly Forecast" },
        { icon: <Wind className="w-4 h-4" />, label: "Temperature" },
    ];

    const handleQuickQuestion = (label) => {
        let query = "";
        switch (label) {
            case "Today's Weather":
                query = "What's the weather today?";
                break;
            case "Will it Rain?":
                query = "Will it rain today?";
                break;
            case "Weekly Forecast":
                query = "What's the forecast for this week?";
                break;
            case "Temperature":
                query = "What's the temperature right now?";
                break;
        }
        setInput(query);
        setTimeout(() => adjustHeight(), 0);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: darkMode ? '#121212' : '#ffffff' }}>
            <style>{`
                @keyframes loading-dots {
                    0%, 20% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
            
            {/* Theme toggle button - top right */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={() => {
                        setDarkMode(d => {
                            const next = !d
                            document.documentElement.classList.toggle("dark", next)
                            return next
                        })
                    }}
                    className="p-2 rounded-lg transition-colors"
                    style={{
                        backgroundColor: darkMode ? '#171717' : '#f5f5f5',
                        color: darkMode ? '#ffffff' : '#000000'
                    }}
                    aria-label="Toggle theme"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {messages.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setMessages([])}
                        className="p-2 rounded-lg transition-colors text-xs px-3"
                        style={{
                            backgroundColor: darkMode ? '#171717' : '#f5f5f5',
                            color: darkMode ? '#f87171' : '#dc2626'
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Messages area - scrollable */}
            {messages.length > 0 && (
                <div className="flex-1 overflow-y-auto px-4 pt-20 pb-4">
                    <div className="w-full max-w-4xl mx-auto space-y-4">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm ${m.role === "user"
                                        ? "bg-neutral-800 text-white"
                                        : ""
                                        }`}
                                    style={m.role === "agent" ? {
                                        backgroundColor: darkMode ? '#171717' : '#f5f5f5',
                                        color: darkMode ? '#ffffff' : '#000000',
                                        border: `1px solid ${darkMode ? '#262626' : '#e5e5e5'}`
                                    } : {}}
                                >
                                    {m.role === "user" ? (
                                        <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                                    ) : (
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({node, className, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0" {...props} />,
                                                    h2: ({node, className, ...props}) => <h2 className="text-base font-bold mt-3 mb-2 first:mt-0" {...props} />,
                                                    h3: ({node, className, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1 first:mt-0" {...props} />,
                                                    p: ({node, className, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({node, className, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                                    ol: ({node, className, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                                    li: ({node, className, ...props}) => <li className="ml-2" {...props} />,
                                                    strong: ({node, className, ...props}) => <strong className="font-semibold" {...props} />,
                                                    em: ({node, className, ...props}) => <em className="italic" {...props} />,
                                                    code: ({node, inline, className, ...props}) => 
                                                        inline ? (
                                                            <code className="px-1 py-0.5 rounded text-xs" style={{
                                                                backgroundColor: darkMode ? '#262626' : '#e5e5e5'
                                                            }} {...props} />
                                                        ) : (
                                                            <code className="block p-2 rounded text-xs mb-2" style={{
                                                                backgroundColor: darkMode ? '#262626' : '#e5e5e5'
                                                            }} {...props} />
                                                        ),
                                                }}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div
                                    className="px-4 py-3 rounded-2xl"
                                    style={{
                                        backgroundColor: darkMode ? '#171717' : '#f5f5f5',
                                        border: `1px solid ${darkMode ? '#262626' : '#e5e5e5'}`,
                                        color: darkMode ? '#ffffff' : '#000000'
                                    }}
                                >
                                    <TextDotsLoader text="Checking weather" size="sm" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}

            {/* Center content when no messages */}
            {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <ShimmerText 
                        text="Hey Siri, What's the weather looking like today?"
                        darkMode={darkMode}
                    />
                </div>
            )}

            {/* Input area - fixed at bottom */}
            <div className="w-full px-4 pb-6">
                <div className="w-full max-w-4xl mx-auto">
                    {error && (
                        <div
                            className="mb-3 p-3 rounded-lg text-sm"
                            style={{
                                backgroundColor: darkMode ? 'rgba(127, 29, 29, 0.2)' : '#fee',
                                border: `1px solid ${darkMode ? '#991b1b' : '#fca5a5'}`,
                                color: darkMode ? '#fca5a5' : '#dc2626'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div
                        className="relative rounded-xl"
                        style={{
                            backgroundColor: darkMode ? '#171717' : '#f5f5f5',
                            border: `1px solid ${darkMode ? '#262626' : '#e5e5e5'}`
                        }}
                    >
                        <div className="overflow-y-auto">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about the weather..."
                                disabled={loading}
                                className="w-full px-4 py-3 resize-none bg-transparent border-none text-sm focus:outline-none min-h-[60px] placeholder:transition-colors"
                                style={{
                                    overflow: "hidden",
                                    color: darkMode ? '#ffffff' : '#000000'
                                }}
                            />
                        </div>

                        <div
                            className="flex items-center justify-between px-3 py-3"
                            style={{ borderTop: `1px solid ${darkMode ? '#262626' : '#e5e5e5'}` }}
                        >
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="group p-2 rounded-lg transition-colors flex items-center gap-1"
                                    style={{
                                        color: darkMode ? '#ffffff' : '#000000'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#262626' : '#e5e5e5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="px-2 py-1 rounded-lg text-sm transition-colors border border-dashed flex items-center justify-between gap-1"
                                    style={{
                                        borderColor: darkMode ? '#404040' : '#d4d4d4',
                                        color: darkMode ? '#a3a3a3' : '#737373'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = darkMode ? '#525252' : '#a3a3a3';
                                        e.currentTarget.style.backgroundColor = darkMode ? '#262626' : '#e5e5e5';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = darkMode ? '#404040' : '#d4d4d4';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Project
                                </button>
                                <button
                                    type="button"
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    className="px-1.5 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-center border"
                                    style={{
                                        backgroundColor: input.trim() && !loading
                                            ? (darkMode ? '#ffffff' : '#000000')
                                            : 'transparent',
                                        color: input.trim() && !loading
                                            ? (darkMode ? '#000000' : '#ffffff')
                                            : (darkMode ? '#525252' : '#a3a3a3'),
                                        borderColor: input.trim() && !loading
                                            ? (darkMode ? '#ffffff' : '#000000')
                                            : (darkMode ? '#404040' : '#d4d4d4'),
                                        cursor: input.trim() && !loading ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                    <span className="sr-only">Send</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Questions */}
                    {messages.length === 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            {quickQuestions.map((q, i) => (
                                <ActionButton
                                    key={i}
                                    icon={q.icon}
                                    label={q.label}
                                    onClick={() => handleQuickQuestion(q.label)}
                                    darkMode={darkMode}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}