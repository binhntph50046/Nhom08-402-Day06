import movieData from "../data/netflix_movies_detailed_up_to_2025.json";
import { slugify } from "./slugify";

export default async function getHomePageMovies() {
    try {
        // Hàm ánh xạ từ dữ liệu Netflix chi tiết sang Joy Film schema
        const mapMovie = (m) => ({
            _id: m.show_id,
            name: m.title,
            origin_name: m.title,
            slug: slugify(m.title),
            thumb_url: `https://loremflickr.com/300/450/movie,poster,${slugify(m.title)}`, // Sử dụng tiêu đề phim làm keyword
            poster_url: `https://loremflickr.com/1200/600/cinema,theater,${slugify(m.title)}`,
            year: m.release_year,
            time: m.duration || "N/A",
            episode_current: m.type === 'Movie' ? 'Phim Lẻ' : 'Phim Bộ',
            content: m.description, // Thêm description vào content
            category: (m.genres || "").split(',').map(g => ({ name: g.trim() })),
            director: (m.director || "").split(',').map(d => d.trim()),
            actor: (m.cast || "").split(',').map(a => a.trim()),
            country: [{ name: m.country || "N/A" }]
        });

        // Lọc và phân loại phim (lấy số lượng nhỏ để demo từ tập dữ liệu khổng lồ)
        const allMovies = movieData.slice(0, 50); 
        
        const mappedData = {
            newMovies: allMovies.slice(0, 10).map(mapMovie),
            theaterMovies: movieData.filter(m => m.type === 'Movie').slice(0, 10).map(mapMovie),
            singleMovies: movieData.filter(m => m.type === 'Movie').slice(10, 20).map(mapMovie),
            seriesMovies: movieData.filter(m => m.type === 'TV Show').slice(0, 10).map(mapMovie),
            cartoonMovies: movieData.filter(m => (m.genres || "").includes('Animation')).slice(0, 10).map(mapMovie)
        };

        return mappedData;
    } catch (err) {
        console.error("Lỗi khi xử lý dữ liệu phim Netflix:", err);
        return { error: "Không thể tải dữ liệu phim cục bộ" };
    }
}
