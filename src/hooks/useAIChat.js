import { useState, useCallback, useRef } from 'react';

const API_URL = 'http://localhost:8000/api/v1/recommend';

/**
 * Custom hook to manage AI Chat logic
 * Calls the backend API for movie recommendations based on user mood
 */
export const useAIChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'ai',
            content: 'Xin chào! Tôi là Joy Film. Bạn đang cảm thấy thế nào? Hãy để tôi gợi ý cho bạn bộ phim phù hợp nhất nhé! 🍿',
            movies: [],
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const threadIdRef = useRef(null);

    /**
     * Sends a message to the backend API and processes the response
     * @param {string} content - User message content
     */
    const sendMessage = useCallback(async (content) => {
        if (!content.trim()) return;

        // 1. Add User Message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            movies: [],
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            // 2. Call the backend API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_story: content.trim(),
                    thread_id: threadIdRef.current || 'default',
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();

            // Save thread_id for conversation continuity
            if (!threadIdRef.current) {
                threadIdRef.current = 'default';
            }

            // 3. Parse API response
            const counselorMessage = result?.data?.counselor_message || 'Cảm ơn bạn đã chia sẻ!';
            const recommendedMovies = result?.data?.recommended_movies || [];

            const aiResponse = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: counselorMessage,
                movies: recommendedMovies,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error('Error calling API:', error);
            const errorMessage = {
                id: (Date.now() + 2).toString(),
                role: 'ai',
                content: 'Rất tiếc, đã có lỗi xảy ra khi kết nối với server. Vui lòng kiểm tra backend đã chạy chưa và thử lại! 🔧',
                movies: [],
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    }, []);

    return {
        messages,
        isTyping,
        sendMessage,
    };
};
