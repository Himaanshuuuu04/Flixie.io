import Card from "./Card";
export default function CardMapper() { 

    const Movies = [
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
        },
        // Additional Entries
        {
            id: 11,
            title: 'Interstellar',
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            image: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg",
            isPopular: true,
        },
        {
            id: 12,
            title: 'Inception',
            description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.',
            image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
            isPopular: true,
        },
        {
            id: 13,
            title: 'The Matrix Resurrections',
            description: 'Neo returns to the Matrix, where he must reunite with Trinity to unlock his full potential.',
            image: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg",
            isPopular: false,
        },
        {
            id: 14,
            title: 'Joker',
            description: 'Arthur Fleck, a failed comedian, spirals into insanity and becomes the Joker.',
            image: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg",
            isPopular: true,
        },
        {
            id: 15,
            title: 'Tenet',
            description: 'Armed with only one word, Tenet, the Protagonist journeys through a twilight world of international espionage.',
            image: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg",
            isPopular: true,
        }
    ];
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 ">
            
            {Movies.map((movie) => (
                <Card key={movie.id} img={movie.image} title={movie.title} link={movie.link} />
            ))}
        </div>
    );

}