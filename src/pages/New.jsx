import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Controller from "../controllers/controller";
import useTitle from '../hooks/useTitle'
import SkeletonGrid from "../components/SkeletonGrid/SkeletonGrid";

import MovieCard from "../components/MovieCard/MovieCard";
import PageButtons from "../components/PageButtons/PageButtons";
import IntroNewVersion from '../components/IntroNewVersion/IntroNewVersion'
import { useRecommend } from '../contexts/recommendContext';
import { Star, Clock, Calendar, Film, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../functions/slugify';
import './Recommended.scss';

const RecommendedMovieCard = ({ movie, index }) => {
    const rating = parseFloat(movie.vote_average) || 0;
    const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'N/A';
    const slug = slugify(movie.title);

    return (
        <Link to={`/phim/${slug}`} className="recommended-card group block">
            {/* Gradient overlay top-left rank */}
            <div className="recommended-card-rank">
                <span>#{index + 1}</span>
            </div>

            {/* Card Content */}
            <div className="recommended-card-body">
                <h3 className="recommended-card-title">{movie.title}</h3>

                {/* Meta info */}
                <div className="recommended-card-meta">
                    {movie.release_year && (
                        <span className="rc-tag">
                            <Calendar size={13} />
                            {movie.release_year}
                        </span>
                    )}
                    {movie.duration && (
                        <span className="rc-tag">
                            <Clock size={13} />
                            {movie.duration}
                        </span>
                    )}
                    {rating > 0 && (
                        <span className="rc-tag rc-rating">
                            <Star size={13} />
                            {ratingDisplay}
                        </span>
                    )}
                    {movie.type && (
                        <span className="rc-tag rc-type">
                            <Film size={13} />
                            {movie.type}
                        </span>
                    )}
                </div>

                {/* Genres */}
                {movie.genres && (
                    <div className="recommended-card-genres">
                        {movie.genres.split(',').map((genre, i) => (
                            <span key={i} className="rc-genre">{genre.trim()}</span>
                        ))}
                    </div>
                )}

                {/* Description */}
                {movie.description && (
                    <p className="recommended-card-desc">
                        {movie.description.length > 200
                            ? movie.description.substring(0, 200) + '...'
                            : movie.description}
                    </p>
                )}

                {/* Director & Cast */}
                <div className="recommended-card-credits">
                    {movie.director && movie.director !== 'N/A' && (
                        <p><strong>🎬 Đạo diễn:</strong> {movie.director}</p>
                    )}
                    {movie.cast && movie.cast !== 'N/A' && (
                        <p><strong>🎭 Diễn viên:</strong> {movie.cast.length > 100 ? movie.cast.substring(0, 100) + '...' : movie.cast}</p>
                    )}
                </div>

                {/* Country & Language */}
                <div className="recommended-card-extra">
                    {movie.country && movie.country !== 'N/A' && (
                        <span>🌍 {movie.country}</span>
                    )}
                    {movie.language && (
                        <span className="rc-lang">{movie.language.toUpperCase()}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

const New = () => {
    // ------ Data State
    const [movies, setMovies] = useState(null)
    let { page } = useParams()
    const { recommendedMovies } = useRecommend();

    useTitle(`Phim mới cập nhật - Trang ${page} | Joy Film`)

    // ------ Fetching Data
    useEffect(() => {
        const fetchData = async () => {
            setMovies(null)
            let data = await Controller('GETNEWMOVIES', page)
            setMovies(data)
        }

        fetchData()
    }, [page])


    return (
        <div id="new" className="page-container-0topside">
            <div className="section-container">
            
                <IntroNewVersion/>

                {/* ===== PHIM DÀNH CHO BẠN Section ===== */}
                {recommendedMovies && recommendedMovies.length > 0 && (
                    <div className="recommended-section">
                        <div className="recommended-header">
                            <div className="recommended-header-left">
                                <Sparkles size={24} className="sparkle-icon" />
                                <h1 className="recommended-title">PHIM DÀNH CHO BẠN</h1>
                            </div>
                            <p className="recommended-subtitle">
                                Dựa trên tâm trạng bạn chia sẻ, Joy Film AI gợi ý những bộ phim phù hợp nhất
                            </p>
                        </div>

                        <div className="recommended-grid">
                            {recommendedMovies.map((movie, index) => (
                                <RecommendedMovieCard
                                    key={movie.show_id || index}
                                    movie={movie}
                                    index={index}
                                />
                            ))}
                        </div>

                        <div className="recommended-divider"></div>
                    </div>
                )}

                <h1 className="section-title-no-up">Phim mới cập nhật - Trang {page}</h1>

                {
                    (!movies || !movies.data) ?
                    (
                        <>
                            <SkeletonGrid />
                            <SkeletonGrid />
                            <SkeletonGrid />
                            <SkeletonGrid />
                        </>
                    ) :
                    (
                        <div className="mt-6 movies-grid">
                            {movies.data.map((movie, index) => (
                                <MovieCard key={index} movie={movie} />
                            ))}
                        </div>
                    )
                }

                <div className="mt-6 flex flex-row flex-wrap justify-center">
                    {
                        movies && movies.totalPages &&
                        <PageButtons curr={page} total={movies.totalPages} url={'phim-moi'} />
                    }
                </div>

            </div>
        </div>
    );
};

export default New;
