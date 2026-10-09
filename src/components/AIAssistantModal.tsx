import React, { useState, useRef, useEffect } from 'react';
import { askKhatwatiAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  X,
  Compass,
  BookOpen,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  User,
  Bot,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, subRoute?: string, params?: Record<string, any>) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'السلام عليكم ورحمة الله وبركاته! أنا المساعد التعليمي لمنصة «خطوتي». كيف يمكنني مساعدتك اليوم في تعلم الصلاة، الاستغفار، اختبارات الفقه، أو تلاوة القرآن الكريم بالدارجة المغربية أو العربية الفصحى؟',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const result = await askKhatwatiAssistant(query.trim(), messages);
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: result.reply,
        timestamp: Date.now(),
        actionRoute: result.actionRoute,
        actionParams: result.actionParams,
        actionLabel: result.actionLabel,
        isFallback: result.isFallback,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'عذراً، حدث خطأ أثناء الاتصال. يمكنك دائماً مراجعة أقسام الصلاة والوضوء والقرآن مباشرة من القائمة الرئيسية.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'بغيت ندير الاستغفار',
    'بغيت ندير اختبار على الصلاة',
    'بغيت نتعلم الصلاة',
    'بغيت نقرا سورة الكهف',
    'بغيت نسمع الشيخ المنشاوي',
    'كيفاش نتوضأ بالترتيب؟',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 text-right">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 flex flex-col h-[85vh] max-h-[700px] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-l from-emerald-950 to-emerald-800 text-white flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-ui">
                المساعد التعليمي الذكي «خطوتي»
              </h3>
              <span className="text-[11px] text-emerald-200">
                مرشد تعليمي وتنقل بالدارجة المغربية والعربية
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mufti Disclaimer Badge */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <p>
            <strong>تنبيه شرعي:</strong> هذا المساعد تعليمي وإرشادي لتطبيق خطوتي فقط، وليس مفتياً لإصدار فتاوى خاصة أو مسائل فقهية معقدة.
          </p>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-300 text-slate-800'
                    : 'bg-emerald-800 text-amber-300'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Deep Link Action Button */}
                {msg.actionRoute && (
                  <div className="mt-3 pt-2.5 border-t border-emerald-900/10">
                    <button
                      onClick={() => {
                        const route = msg.actionRoute!.replace('/', '');
                        const subRoute = msg.actionParams?.subRoute;
                        onNavigate(route, subRoute, msg.actionParams);
                        onClose();
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{msg.actionLabel || 'الانتقال إلى هذا القسم في التطبيق'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
              <span>المساعد يكتب الآن...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer border border-slate-200/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="اسأل المساعد التعليمي بالدارجة أو العربية..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || loading}
            className={`p-2 rounded-xl text-white transition cursor-pointer ${
              !inputValue.trim() || loading
                ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-700 shadow-xs'
            }`}
            title="إرسال"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
