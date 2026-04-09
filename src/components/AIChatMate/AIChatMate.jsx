import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Star, Clock, Film, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { slugify } from '../../functions/slugify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import phd from '../../assets/placeholder.png';
import { useAIChat } from '../../hooks/useAIChat';
import './AIChatMate.scss';

/**
 * MovieCard component to display a recommended movie inside chat
 */
const MovieCard = ({ movie, index }) => {
    const rating = parseFloat(movie.vote_average) || 0;
    const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'N/A';
    const slug = slugify(movie.title);
    const thumbUrl = `https://loremflickr.com/300/450/movie,poster,${slug}`;

    return (
        <Link to={`/phim/${slug}`} className="chat-movie-card-link">
            <motion.div
                className="chat-movie-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
            >
                <div className="poster-wrapper">
                    <LazyLoadImage
                        src={thumbUrl}
                        placeholderSrc={phd}
                        alt={movie.title}
                        effect="blur"
                        className="poster-img"
                    />
                    <div className="poster-overlay">
                        <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </div>
                    {rating > 0 && (
                        <div className="card-rating">
                            <Star size={10} fill="#fbbf24" color="#fbbf24" />
                            <span>{ratingDisplay}</span>
                        </div>
                    )}
                </div>
                <div className="card-info">
                    <h4 className="title">{movie.title}</h4>
                    <p className="meta">{movie.release_year} • {movie.type === 'Movie' ? 'Phim Lẻ' : 'Phim Bộ'}</p>
                </div>
            </motion.div>
        </Link>
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
                                        {msg.role === 'ai' ? (
                                            <div className="markdown-content">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
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
                                                <span>Gợi ý cho bạn</span>
                                            </div>
                                            <div className="horizontal-movies-list">
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
