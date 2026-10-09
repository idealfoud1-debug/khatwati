import { ChatMessage } from '../types';
import { detectKhatwatiIntent } from './aiIntentService';

export async function askKhatwatiAssistant(
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<{
  reply: string;
  actionRoute?: string;
  actionParams?: Record<string, any>;
  actionLabel?: string;
  isFallback: boolean;
}> {
  // First, check deterministic Khatwati intent
  const detectedIntent = detectKhatwatiIntent(userPrompt);

  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userPrompt,
        history: history.slice(-6).map((h) => ({ role: h.sender === 'user' ? 'user' : 'model', text: h.text })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        reply: data.reply,
        actionRoute: data.actionRoute || detectedIntent?.route,
        actionParams: data.actionParams || detectedIntent?.params,
        actionLabel: data.actionLabel || detectedIntent?.label,
        isFallback: !!data.isFallback,
      };
    }
  } catch (err) {
    console.warn('Network error calling AI assistant backend:', err);
  }

  // Pure client-side offline fallback logic based strictly on detected intent & approved Khatwati lessons
  if (detectedIntent) {
    return {
      reply: detectedIntent.replyText,
      actionRoute: detectedIntent.route,
      actionParams: detectedIntent.params,
      actionLabel: detectedIntent.label,
      isFallback: true,
    };
  }

  return {
    reply: 'أهلاً بك في منصة خطوتي! يمكنك استكشاف أقسام الصلاة، الاستغفار، القرآن الكريم، والاختبارات من خلال القائمة الرئيسية.',
    actionRoute: 'home',
    actionLabel: 'العودة للصفحة الرئيسية',
    isFallback: true,
  };
}
