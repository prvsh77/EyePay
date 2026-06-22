import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Trash2, 
  Sparkles, 
  MessageSquare, 
  Bot, 
  User, 
  ChevronRight, 
  Menu, 
  X,
  AlertCircle
} from "lucide-react";

interface LocalMessage {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const suggestedPrompts = [
  "What's my current balance?",
  "Who is my top recipient?",
  "How much did I send to Kenya this month?",
  "Why was transaction TX1 flagged?",
  "Summarize my activity."
];

export default function Copilot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Local state
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeStreamingIndex, setActiveStreamingIndex] = useState<number | null>(null);

  // Load chat history
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/copilot/history"],
    queryFn: () => api.copilot.getHistory(),
  });

  // Sync loaded history to local messages
  useEffect(() => {
    if (historyData) {
      setLocalMessages(
        historyData.map(h => ({
          role: h.role,
          content: h.message,
          isStreaming: false,
        }))
      );
    }
  }, [historyData]);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Send message mutation
  const chatMutation = useMutation({
    mutationFn: (message: string) => api.copilot.chat(message),
    onSuccess: (data) => {
      // Append assistant response and start streaming it
      setLocalMessages(prev => {
        const updated = [...prev];
        const newMsgIdx = updated.length;
        updated.push({
          role: "assistant",
          content: "", // Start empty for streaming
          isStreaming: true,
        });
        
        // Start streaming text
        streamResponse(newMsgIdx, data.reply);
        return updated;
      });
      // Invalidate history to update sidebar log
      queryClient.invalidateQueries({ queryKey: ["/api/copilot/history"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Copilot Error",
        description: err.message || "Failed to contact EyePay AI Copilot service.",
      });
    },
  });

  // Clear chat logs mutation
  const clearMutation = useMutation({
    mutationFn: () => api.copilot.clearHistory(),
    onSuccess: () => {
      setLocalMessages([]);
      queryClient.invalidateQueries({ queryKey: ["/api/copilot/history"] });
      toast({
        title: "Chat Logs Wiped",
        description: "EyePay AI Copilot history has been reset.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: err.message || "Could not wipe conversation history.",
      });
    },
  });

  // Simulated character-by-character typewriter streaming
  const streamResponse = (index: number, fullText: string) => {
    let currentText = "";
    let charIdx = 0;
    setActiveStreamingIndex(index);
    
    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        currentText += fullText[charIdx];
        setLocalMessages(prev =>
          prev.map((m, idx) => (idx === index ? { ...m, content: currentText } : m))
        );
        charIdx++;
      } else {
        clearInterval(interval);
        setLocalMessages(prev =>
          prev.map((m, idx) => (idx === index ? { ...m, isStreaming: false } : m))
        );
        setActiveStreamingIndex(null);
      }
    }, 10);
  };

  const handleSend = (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || chatMutation.isPending || activeStreamingIndex !== null) return;

    // 1. Append user message to local state
    setLocalMessages(prev => [
      ...prev,
      { role: "user", content: queryText }
    ]);
    
    if (!textToSend) setInput("");

    // 2. Trigger mutation
    chatMutation.mutate(queryText);
  };

  const handleSuggestedClick = (prompt: string) => {
    handleSend(prompt);
  };

  // Build unique conversation thread bubbles grouping for sidebar
  const userMessages = localMessages.filter(m => m.role === "user");

  return (
    <div className="flex h-[calc(100vh-4rem)] text-foreground relative z-10 overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-border/40 bg-muted/15 flex-col">
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> Chat Log History
          </span>
          {localMessages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-red-500"
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
              title="Clear entire log"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {userMessages.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No recent conversations
            </div>
          ) : (
            userMessages.map((m, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedClick(m.content)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs hover:bg-muted text-muted-foreground hover:text-foreground truncate transition-all flex items-center gap-2 group font-semibold"
              >
                <ChevronRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="truncate">{m.content}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Sidebar - Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="w-72 h-full bg-background border-r border-border flex flex-col relative animate-in slide-in-from-left duration-200">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-muted-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Chat Log History
              </span>
              {localMessages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-red-500"
                  onClick={() => {
                    clearMutation.mutate();
                    setSidebarOpen(false);
                  }}
                  disabled={clearMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {userMessages.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No recent conversations
                </div>
              ) : (
                userMessages.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSuggestedClick(m.content);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs hover:bg-muted text-muted-foreground hover:text-foreground truncate transition-all flex items-center gap-2"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{m.content}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-background/25 overflow-hidden">
        
        {/* Chat Header */}
        <header className="h-14 border-b border-border/40 px-4 flex items-center justify-between bg-muted/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1">
                AI Copilot <span className="text-[9px] bg-green-500/10 text-green-500 font-bold px-1.5 py-0.5 rounded-full uppercase">Online</span>
              </h2>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary fill-current" /> Financial Context Locked
          </span>
        </header>

        {/* Message Logs Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {localMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto p-4">
              <div className="bg-primary/10 text-primary w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Welcome to EyePay AI Copilot</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                I am your automated financial companion. I have complete secure read-only clearance over your balance, recipients, recent transfers, and AI security audit risk metrics.
              </p>
            </div>
          ) : (
            localMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-primary text-white" : "bg-muted border border-border/40 text-primary"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`text-[10px] text-muted-foreground mb-1 font-semibold ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}>
                    {msg.role === "user" ? "You" : "Copilot"}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "glass-card border border-border/50 text-foreground rounded-tl-none"
                  }`}>
                    {/* Render message with linebreaks */}
                    <p className="whitespace-pre-line font-medium">
                      {msg.content}
                    </p>
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {chatMutation.isPending && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-muted border border-border/40 text-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground mb-1 font-semibold">Copilot</div>
                <div className="glass-card border border-border/50 p-4 rounded-2xl rounded-tl-none flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="p-4 border-t border-border/40 bg-muted/5 flex-shrink-0">
          
          {/* Suggested Prompts pills */}
          {localMessages.length === 0 && !chatMutation.isPending && (
            <div className="mb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Suggested Inquiries</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedClick(p)}
                    className="text-[10px] font-semibold border border-border/60 hover:border-primary bg-background/50 hover:bg-primary/5 text-muted-foreground hover:text-primary px-3 py-1.5 rounded-full transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 relative items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                chatMutation.isPending 
                  ? "Awaiting response..." 
                  : activeStreamingIndex !== null 
                  ? "Writing..." 
                  : "Ask about your transactions, balance, or flags..."
              }
              disabled={chatMutation.isPending || activeStreamingIndex !== null}
              className="flex-1 bg-background border border-border/80 focus:border-primary rounded-xl pl-4 pr-12 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || chatMutation.isPending || activeStreamingIndex !== null}
              className="absolute right-1.5 h-8 w-8 rounded-lg font-semibold flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
