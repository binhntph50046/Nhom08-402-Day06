import movieData from "../data/netflix_movies_detailed_up_to_2025.json";
import { slugify } from "./slugify";

export default async function getSingleMovies(payload) {
    const page = parseInt(payload[0]) || 1;
    const limit = 24;
    
    try {
        const filtered = movieData.filter(m => m.type === 'Movie');
        const startIndex = (page - 1) * limit;
        const movies = filtered.slice(startIndex, startIndex + limit);
        const totalPages = Math.ceil(filtered.length / limit);

        const mapMovie = (m) => ({
            _id: m.show_id,
            name: m.title,
            origin_name: m.title,
            slug: slugify(m.title),
            thumb_url: `https://loremflickr.com/300/450/movie,poster,${slugify(m.title)}`,
            poster_url: `https://loremflickr.com/1200/600/cinema,theater,${slugify(m.title)}`,
            year: m.release_year,
            time: m.duration || "N/A",
            episode_current: 'Phim Lẻ'
        });

        return {
            data: movies.map(mapMovie),
            totalPages: totalPages
        };
    } catch (err) {
        console.error("Lỗi khi lấy phim lẻ:", err);
        return { data: [], totalPages: 0 };
    }
}