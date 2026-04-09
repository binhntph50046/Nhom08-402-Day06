import movieData from "../data/netflix_movies_detailed_up_to_2025.json";
import { slugify } from "./slugify";

export default async function getMovie(payload) {
    let slug = payload[0];

    try {
        const movie = movieData.find(m => slugify(m.title) === slug);
        
        if (!movie) {
            return { error: "Không tìm thấy phim" };
        }

        // Ánh xạ sang cấu trúc mà UI mong đợi
        return {
            movie: {
                _id: movie.show_id,
                name: movie.title,
                origin_name: movie.title,
                slug: slugify(movie.title),
                thumb_url: `https://loremflickr.com/300/450/movie,poster,${slugify(movie.title)}`,
                poster_url: `https://loremflickr.com/1200/600/cinema,theater,${slugify(movie.title)}`,
                year: movie.release_year,
                time: movie.duration || "N/A",
                episode_current: movie.type === 'Movie' ? 'Phim Lẻ' : 'Phim Bộ',
                content: movie.description, 
                category: (movie.genres || "").split(',').map(g => ({ name: g.trim() })),
                director: (movie.director || "").split(',').map(d => d.trim()),
                actor: (movie.cast || "").split(',').map(a => a.trim()),
                country: [{ name: movie.country || "N/A" }],
                trailer_url: "" 
            },
            episodes: [
                {
                    server_name: "Vietsub",
                    server_data: [
                        {
                            name: "Full",
                            slug: "full",
                            filename: movie.title,
                            link_embed: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
                            link_m3u8: ""
                        }
                    ]
                }
            ]
        };
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu phim:", err);
        return { error: "Không thể tải dữ liệu phim" };
    }
}