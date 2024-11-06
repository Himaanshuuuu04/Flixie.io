import React, { useState, useEffect } from 'react';
import Favorite from '../assets/Favorite.png';
import Play from '../assets/Play.png';

// Sample Data for the Carousel
const movies = [
  // Array content remains the same
  {
    id: 1,
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    image: "https://variety.com/wp-content/uploads/2024/03/MCDDUPA_WB053.jpg",
    isPopular: true,
  },
  {
    id: 2,
    title: 'Oppenheimer',
    description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during WWII.',
    image: "https://i.ytimg.com/vi/AeRugqnC3lQ/maxresdefault.jpg",
    isPopular: true,
  },
  {
    id: 3,
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales embarks on a multiverse adventure to team up with Gwen Stacy and other Spider-People to face a new threat.',
    image: "https://www.pluggedin.com/wp-content/uploads/2023/06/spider-man-across-the-spider-verse.jpg",
    isPopular: true,
  },
  {
    id: 4,
    title: 'The Batman',
    description: 'Bruce Wayne uncovers corruption in Gotham City while chasing down the sadistic killer known as The Riddler.',
    image: "https://m.media-amazon.com/images/S/pv-target-images/81ef275effa427553a847bc220bebe1dc314b2e79d00333f94a6bcadd7cce851.jpg",
    isPopular: false,
  },
  {
    id: 5,
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully and Neytiri must protect their family from a renewed threat on Pandora.',
    image: "https://m.media-amazon.com/images/M/MV5BYWUwYmFiNjktOTdmNi00MDJlLWIyNTctZDA4MzgxY2E4ZTg1XkEyXkFqcGc@._V1_.jpg",
    isPopular: true,
  },
  {
    id: 6,
    title: 'Guardians of the Galaxy Vol. 3',
    description: 'The Guardians embark on one final mission to protect one of their own from a mysterious new villain.',
    image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2018/05/Guardians-of-the-Galaxy-Vol-1.jpg",
    isPopular: true,
  },
  {
    id: 7,
    title: 'Mission: Impossible - Dead Reckoning Part One',
    description: 'Ethan Hunt and his team face their most dangerous mission yet, with the fate of the world at stake.',
    image: "https://nextbestpicture-com.b-cdn.net/wp-content/uploads/2023/07/Mission-Impossible-Dead-Reckoning-Part-One-2-scaled.jpg",
    isPopular: false,
  },
  {
    id: 8,
    title: 'Barbie',
    description: 'In a vibrant Barbie world, Barbie and Ken embark on a journey to the real world, discovering life beyond plastic.',
    image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/07/greta-gerwig-s-barbie-barbie-spy-squad-and-princess-and-the-pauper.jpg",
    isPopular: true,
  },
  {
    id: 9,
    title: 'John Wick: Chapter 4',
    description: 'John Wick uncovers a path to defeating the High Table, but new enemies stand in his way.',
    image: "https://media.newyorker.com/photos/641a04a8209ee97d3ebfdca8/master/pass/Brody-JW-Review3.jpg",
    isPopular: false,
  },
  {
    id: 10,
    title: 'Elemental',
    description: 'In a city where fire, water, land, and air residents live together, two elements form a surprising bond.',
    image: "https://thecollision.org/wp-content/uploads/2023/06/4.png",
    isPopular: true,
  }
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  // Navigation Handlers
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % movies.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const autoSlide = setInterval(nextSlide, 3000);
      return () => clearInterval(autoSlide);
    }
  }, [isPaused]);

  // Swipe Handlers
  const handleTouchStart = (e) => setTouchStartX(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  };

  return (
    <div className="overflow-hidden">
      <div
        className="relative w-full rounded-2xl shadow-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Content */}
        <div
          className="flex rounded-2xl transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-full  h-[15rem] relative">
              <img src={movie.image} alt={movie.title} className="object-cover w-full h-full opacity-100 rounded-2xl" />

              {/* Overlay Content */}
              <div className="absolute inset-0 items-center justify-center p-3 hidden md:flex">
                <div className="text-white text-center space-y-2 ">
                  {movie.isPopular && (
                    <span className="absolute top-3 left-3 backdrop-blur-3xl bg-black/20 font-lighter text-xs px-2 py-1 rounded-full shadow-md">🔥 Popular</span>
                  )}
                  <div className='absolute bottom-5 left-5 text-left backdrop:filter backdrop-blur-3xl p-4 rounded-2xl border border-slate-700 bg-black/20 mr-5 shadow-2xl'>
                    <h2 className="text-lg font-bold">{movie.title}</h2>
                    <p className="text-xs font-extralight">{movie.description.slice(0, 95) + (movie.description.length > 95 ? '...' : '')}</p>

                    <div className="flex gap-2 mt-2 ">
                      <button className="text-xs hover:bg-blue-500 focus:scale-105 border-white border hover:border-blue-500 transition-all duration-300 px-2 py-1 rounded-full flex items-center space-x-1">
                        <img src={Play} alt="Play" className="w-4 h-4" /> <span className='-mb-1'>Watch Now</span>
                      </button>
                      <button className="text-xs hover:bg-blue-500 focus:scale-105 border-white border hover:border-blue-500 transition-all duration-300 px-2 py-1 rounded-full flex items-center space-x-1">
                        <img src={Favorite} alt="Favorite" className="w-4 h-4" /> <span className='-mb-1'>Like</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Content */}
              <div className="absolute bottom-0 h-[30%] bg-black/20 w-full flex flex-col justify-center p-4 md:hidden backdrop-blur-2xl rounded-2xl text-white transition-opacity duration-300">
                <h2 className="font-semibold text-nowrap text-lg">{movie.title}</h2>
                <div className="flex gap-4">
                  <button className="text-base border border-white px-2 py-[0.15rem] rounded-full flex items-center space-x-1">
                    <img src={Play} alt="Play" className="w-4 h-4" /> <span>Watch Now</span>
                  </button>
                  <button className="text-sm border border-white px-2 rounded-full flex items-center space-x-1">
                    <img src={Favorite} alt="Favorite" className="w-4 h-4" /> <span>Like</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="mt-4 flex justify-center space-x-1">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 w-1.5 md:w-2 md:h-2 rounded-full transition duration-300 ${currentIndex === index ? 'bg-white' : 'bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
