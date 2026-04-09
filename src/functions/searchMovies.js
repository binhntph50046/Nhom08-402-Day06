import movieData from "../data/netflix_movies_detailed_up_to_2025.json";
import { slugify } from "./slugify";

export default async function searchMovie(payload) {
    let keyword = payload[0];

    try {
        if (!keyword) return [];

        // Tìm kiếm các phim có tên chứa từ khóa
        const results = movieData
            .filter(m => m.title.toLowerCase().includes(keyword.toLowerCase()))
            .slice(0, 48); // Lấy tối đa 48 kết quả
        
        // Trả về mảng các phim đã được ánh xạ
        return results.map(m => ({
            _id: m.show_id,
            name: m.title,
            origin_name: m.title,
            slug: slugify(m.title),
            thumb_url: `https://loremflickr.com/300/450/movie,poster,${slugify(m.title)}`,
            poster_url: `https://loremflickr.com/1200/600/cinema,theater,${slugify(m.title)}`,
            year: m.release_year,
            time: m.duration || "N/A",
            episode_current: m.type === 'Movie' ? 'Phim Lẻ' : 'Phim Bộ'
        }));

    } catch (err) {
        console.error("Lỗi khi tìm kiếm phim:", err);
        return [];
    }
}