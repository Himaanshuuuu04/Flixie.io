import React, { useState, useEffect } from 'react';
import Favorite from '../assets/Favorite.png';
import Play from '../assets/Play.png';
// Sample Data for the Carousel
const movies = [
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const autoSlide = setInterval(nextSlide, 3000); // Slide every 3 seconds
      return () => clearInterval(autoSlide);
    }
  }, [isPaused]);

  const MAX_DESCRIPTION_LENGTH = 95; // Adjust length as needed

// Truncat  function to limit description length and add ellipses
    const truncateDescription = (description) => {
    return description.length > MAX_DESCRIPTION_LENGTH 
        ? description.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
        : description;
    };

  return (
    <div 
      className="relative w-full overflow-hidden z-30 rounded-3xl font-light shadow-xl "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Content */}
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {movies.map((movie, index) => (
          <div key={movie.id} className="flex-shrink-0 w-full max-h-[17rem] bg-black relative">
            <img src={movie.image} alt={movie.title} className="object-cover w-full h-full opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-white text-center">
                {movie.isPopular && <span className="rounded-2xl backdrop-filter backdrop-blur-3xl shadow-xl absolute left-5 top-5 text-white text-xs font-light p-2 border border-slate-700">🔥 Now Popular</span>}
                <div className="text-left w-[25rem] absolute left-5 bottom-5  p-5 rounded-2xl border border-slate-800 backdrop-filter backdrop-blur-3xl shadow-xl">
                  <h2 className="text-xl font-bold">{movie.title}</h2>
                  <p>{truncateDescription(movie.description)}</p>
                  <div className="mt-4 flex justify-left space-x-6 font-semibold ">
                    <button className="border border-slate-500  text-white px-4 py-1 rounded-full hover:bg-blue-400 hover:scale-110
                    transition-all duration-300">
                        <img src={Play} alt="Play" className="inline-block mr-1 -mt-1 -ml-2" />Watch Now</button>
                    <button className="text-white border border-slate-500 px-4 py-1 rounded-full  hover:bg-blue-400 hover:scale-110
                    transition-all duration-300">
                        <img src={Favorite} alt="Favorite" className="inline-block mr-1 -mt-1 -ml-2" />Like</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     
     
      {/* Slide Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' :'bg-slate-700 '} transition-colors duration-300 shadow-xl`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
