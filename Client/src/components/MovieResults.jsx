// src/components/MovieList.js
import React from 'react';
import Card from "./Card.jsx";
// import { useSearchContext} from "./contextAPI/SearchContext.jsx"
import { useDispatch, useSelector,shallowEqual } from 'react-redux';
import {setSearchActive,setSearchTerm} from "./Redux/Slice/searchSlice.js"
// import {fetchAiRecommendations} from "./Redux/Slice/aiSearchSlice.js"
// import { useAiRecommendationContext } from './contextAPI/AiRecommendationContext.jsx';
import SkeletonLoaderCard from "./SkeletonLoaderCard.jsx";

function MovieResults() {
    const dispatch = useDispatch();
    const { movies, loading, searchTerm } = useSelector((state) => state.search,shallowEqual);
    // const { movies, loading, searchTerm, setSearchActive } = useSearchContext();
    // const { aiLoading } = useAiRecommendationContext();
    const {aiLoading} = useSelector((state) => state.aiSearch,shallowEqual);
    
    return (
        <div className="">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 md:gap-5 justify-items-center bg-white/5 border border-white/20 rounded-xl p-6 ">
                {loading || aiLoading ? (
                    Array.from({ length: 21 }).map((_, index) => (
                        <SkeletonLoaderCard key={index} />
                    ))
                ) : (
                    <>
                        <svg
                            className="bg-white/20 md:w-8 md:h-8 w-8 h-8 absolute  right-24  cursor-pointer rounded-full p-2 z-50 hidden md:flex hover:scale-110 transition-all duration-300 ease-in-out"
                            onClick={() => {dispatch(setSearchActive(false));
                            dispatch(setSearchTerm(''));
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            aria-hidden="true"
                        >
                            <path
                                className="fill-white"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z"
                            ></path>
                        </svg>
                        {movies.map((movie) =>
                            movie.poster_path && movie.vote_average > 4 ? (
                                <Card
                                    key={movie.id}
                                    id={movie.id}
                                    img={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    title={movie.title || movie.name}
                                    link={`/Moviedetails${movie.media_type}/${movie.id}`}
                                    year={movie.release_date || movie.first_air_date}
                                    rating={movie.vote_average}
                                    media_type={movie.media_type}
                                />
                            ) : null
                        )}
                    </>
                )}
                {movies.length === 0 && !loading && searchTerm && !aiLoading && (
                    <p className="text-white">No results found for "{searchTerm}".</p>
                )}
            </div>
        </div>
    );
}

export default MovieResults;
