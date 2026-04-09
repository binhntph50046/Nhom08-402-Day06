import { createContext, useContext, useState } from 'react';

const RecommendContext = createContext();

export const RecommendProvider = ({ children }) => {
    const [recommendedMovies, setRecommendedMovies] = useState([]);

    return (
        <RecommendContext.Provider value={{ recommendedMovies, setRecommendedMovies }}>
            {children}
        </RecommendContext.Provider>
    );
};

export const useRecommend = () => {
    const context = useContext(RecommendContext);
    if (!context) {
        throw new Error('useRecommend must be used within a RecommendProvider');
    }
    return context;
};
