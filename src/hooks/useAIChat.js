import { useState, useCallback } from 'react';

/**
 * Custom hook to manage AI Chat logic
 * Includes message state, sending logic, and typing status
 */
export const useAIChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'ai',
            content: 'Xin chào! Tôi là Joy Film. Bạn đang cảm thấy thế nào? Hãy để tôi gợi ý cho bạn bộ phim phù hợp nhất nhé! 🍿',
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    /**
     * Sends a message and triggers a mocked AI response
     * @param {string} content - User message content
     */
    const sendMessage = useCallback(async (content) => {
        if (!content.trim()) return;

        // 1. Add User Message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            // 2. Simulate AI "Thinking" state (1.5s - 3s delay)
            const delay = Math.floor(Math.random() * 1500) + 1500;
            await new Promise((resolve) => setTimeout(resolve, delay));

            // 3. Mock AI Response Logic
            // In a real app, this would call an API (e.g., GPT-4 or Gemini)
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: getMockedResponse(content),
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now().toString(),
                role: 'ai',
                content: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau!',
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

/**
 * Basic logic to simulate "intelligent" responses based on keywords
 */
const getMockedResponse = (input) => {
    const text = input.toLowerCase();

    if (text.includes('vui') || text.includes('happy')) {
        return 'Thật tuyệt! Nếu bạn đang vui, một bộ phim hài nhẹ nhàng hoặc hoạt hình như "Despicable Me" hay "The Super Mario Bros. Movie" sẽ rất hợp đấy!';
    }
    if (text.includes('buồn') || text.includes('sad')) {
        return 'Tôi hiểu mà... Những lúc này một bộ phim chữa lành tâm hồn (healing) như "The Pursuit of Happyness" hay một bộ phim hoạt hình Ghibli sẽ là lựa chọn tốt.';
    }
    if (text.includes('sợ') || text.includes('kinh dị')) {
        return 'À, bạn muốn thử thách lòng dũng cảm à? Đang có các phim như "The Conjuring" hay "Insidious" rất hot đấy. Bạn có muốn xem thêm gợi ý không?';
    }
    if (text.includes('hành động') || text.includes('action')) {
        return 'Action ư? Đừng bỏ lỡ "John Wick" hay các phim siêu anh hùng Marvel nhé! Cảm giác cực kỳ bùng nổ.';
    }

    return 'Cảm ơn bạn đã chia sẻ! Hiện tại tôi đang tìm kiếm kho phim tốt nhất dựa trên ý kiến của bạn. Bạn còn muốn chia sẻ thêm gì không?';
};
