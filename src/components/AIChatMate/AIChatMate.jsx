import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, Star, Clock, Film, Calendar } from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';
import './AIChatMate.scss';

/**
 * MovieCard component to display a recommended movie
 */
const MovieCard = ({ movie, index }) => {
    const rating = parseFloat(movie.vote_average) || 0;
    const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'N/A';

    return (
        <motion.div
            className="movie-card"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
        >
            <div className="movie-card-header">
                <div className="movie-rank">#{index + 1}</div>
                <h4 className="movie-title">{movie.title}</h4>
            </div>

            <div className="movie-meta">
                {movie.release_year && (
                    <span className="meta-tag">
                        <Calendar size={12} />
                        {movie.release_year}
                    </span>
                )}
                {movie.duration && (
                    <span className="meta-tag">
                        <Clock size={12} />
                        {movie.duration}
                    </span>
                )}
                {rating > 0 && (
                    <span className="meta-tag rating-tag">
                        <Star size={12} />
                        {ratingDisplay}
                    </span>
                )}
                {movie.type && (
                    <span className="meta-tag type-tag">
                        <Film size={12} />
                        {movie.type}
                    </span>
                )}
            </div>

            {movie.genres && (
                <div className="movie-genres">
                    {movie.genres.split(',').slice(0, 3).map((genre, i) => (
                        <span key={i} className="genre-chip">{genre.trim()}</span>
                    ))}
                </div>
            )}

            {movie.description && (
                <p className="movie-desc">
                    {movie.description.length > 120
                        ? movie.description.substring(0, 120) + '...'
                        : movie.description}
                </p>
            )}

            {movie.director && movie.director !== 'N/A' && (
                <div className="movie-director">
                    🎬 <span>{movie.director}</span>
                </div>
            )}
        </motion.div>
    );
};

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
                                <div key={msg.id} className="message-group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`message ${msg.role}`}
                                    >
                                        {msg.content}
                                    </motion.div>

                                    {/* Render Movie Recommendations */}
                                    {msg.movies && msg.movies.length > 0 && (
                                        <motion.div
                                            className="movies-container"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="movies-header">
                                                <Sparkles size={14} />
                                                <span>Phim gợi ý cho bạn</span>
                                            </div>
                                            <div className="movies-list">
                                                {msg.movies.map((movie, idx) => (
                                                    <MovieCard
                                                        key={movie.show_id || idx}
                                                        movie={movie}
                                                        index={idx}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
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
                                    placeholder="Chia sẻ tâm trạng của bạn..."
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
