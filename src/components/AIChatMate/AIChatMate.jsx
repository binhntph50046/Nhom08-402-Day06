import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';
import './AIChatMate.scss';

const AIChatMate = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const { messages, isTyping, sendMessage } = useAIChat();
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom whenever messages or typing state changes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = () => {
        if (inputValue.trim() && !isTyping) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="ai-chat-mate-container">
            {/* Floating Trigger Button */}
            <motion.button
                className="chat-trigger"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle AI Chat"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            <Sparkles size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-window"
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <div className="brand">
                                <div className="logo-box">
                                    <Bot size={20} color="white" strokeWidth={2.5} />
                                </div>
                                <h3>Joy Film</h3>
                            </div>
                            <X
                                className="close-btn"
                                size={18}
                                onClick={() => setIsOpen(false)}
                            />
                        </div>

                        {/* Message List */}
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`message ${msg.role}`}
                                >
                                    {msg.content}
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="typing-indicator"
                                >
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="chat-input-area">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Hỏi tôi bất cứ điều gì về phim..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isTyping}
                                />
                                <button
                                    className="send-btn"
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                >
                                    <Send size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIChatMate;
