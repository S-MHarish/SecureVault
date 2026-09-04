'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  RefreshCw,
  Check,
  Bot,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';
import { queryAIAssistant } from '@/lib/ai/securityAdvisor';

export default function AISecurityAdvisorDrawer() {
  const {
    isAdvisorOpen,
    setIsAdvisorOpen,
    aiRecommendations,
    securityScore,
    accounts,
    setSelectedAccountForModal,
  } = useVault();

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; actions?: string[] }[]
  >([
    {
      role: 'assistant',
      text: `Hello Alex! I am your SecureVault AI Security Advisor. I've analyzed your 12 accounts and identified 3 key actions that will boost your security score from ${securityScore.overallScore} to 98/100. How can I assist your identity hardening today?`,
      actions: [
        'Why is my score 87?',
        'Hardening recommendations for GitHub',
        'Check passkey readiness',
      ],
    },
  ]);

  if (!isAdvisorOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, text };
    const response = queryAIAssistant(text, accounts, securityScore.overallScore);

    const botMsg = {
      role: 'assistant' as const,
      text: response.answer,
      actions: response.suggestedActions,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-vault-maroon/30 backdrop-blur-sm">
      <div className="w-full max-w-lg h-full glass-panel bg-white/95 border-l border-vault-ivoryDark shadow-vault-lg flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-vault-ivoryDark flex items-center justify-between bg-gradient-to-r from-vault-blush to-vault-ivory/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-maroon flex items-center justify-center text-vault-cream shadow-vault-sm">
              <Sparkles className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <h3 className="text-base font-bold text-vault-maroon font-display">
                AI Security Advisor
              </h3>
              <p className="text-[11px] text-vault-roseDust">
                Tailored identity remediation and posture guidance
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdvisorOpen(false)}
            className="w-8 h-8 rounded-xl bg-vault-cream hover:bg-vault-blush border border-vault-copper/20 flex items-center justify-center text-vault-roseDust hover:text-vault-maroon transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Tabs / Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Actionable Recommendations Deck */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-vault-maroon uppercase tracking-wider">
                Priority Action Plan ({aiRecommendations.length})
              </h4>
              <span className="text-[10px] text-vault-copper font-semibold font-mono">
                +{aiRecommendations.reduce((s, r) => s + r.impactScore, 0)} Potential Pts
              </span>
            </div>

            <div className="space-y-2.5">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-vault-ivory/70 border border-vault-ivoryDark hover:border-vault-copper/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {rec.severity === 'critical' ? (
                        <ShieldAlert className="w-4 h-4 text-vault-roseMuted flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-vault-copper flex-shrink-0" />
                      )}
                      <h5 className="text-xs font-bold text-vault-maroon">{rec.title}</h5>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vault-blush text-vault-maroon font-mono border border-vault-copper/20">
                      +{rec.impactScore} pts
                    </span>
                  </div>

                  <p className="text-[11px] text-vault-roseDust leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="pt-2 border-t border-vault-ivoryDark/60 flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                      {rec.tags.map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white text-vault-roseDust border border-vault-ivoryDark">
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const target = accounts.find((a) => a.id === rec.accountId);
                        if (target) {
                          setSelectedAccountForModal(target);
                        }
                      }}
                      className="text-[11px] font-semibold text-vault-maroon hover:text-vault-maroonLight flex items-center gap-1"
                    >
                      <span>Fix Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Chat Log */}
          <div className="pt-4 border-t border-vault-ivoryDark space-y-3">
            <h4 className="text-xs font-bold text-vault-maroon uppercase tracking-wider">
              Ask AI Security Advisor
            </h4>

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-xs ${
                  msg.role === 'assistant'
                    ? 'bg-vault-blush/60 text-vault-maroon border border-vault-copper/20'
                    : 'bg-vault-maroon text-vault-cream ml-8'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-semibold text-[11px] opacity-80">
                  {msg.role === 'assistant' ? (
                    <>
                      <Bot className="w-3.5 h-3.5 text-vault-copper" />
                      <span>SecureVault AI</span>
                    </>
                  ) : (
                    <span>You</span>
                  )}
                </div>
                <p className="leading-relaxed">{msg.text}</p>

                {/* Suggested Follow-up Actions */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-vault-copper/15 flex items-center gap-1.5 flex-wrap">
                    {msg.actions.map((act) => (
                      <button
                        key={act}
                        onClick={() => handleSend(act)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-white hover:bg-vault-ivory text-vault-maroon font-medium border border-vault-copper/20 transition-colors cursor-pointer"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-vault-ivory/80 border-t border-vault-ivoryDark">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about your vault security..."
              className="flex-1 p-2.5 rounded-xl glass-input text-xs"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream transition-colors cursor-pointer shadow-vault-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
