import Card from "./Card";
import { Link } from "react-router-dom";
import Movies from "./Movies";
export default function CardMapper() {     
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 ">
            
            {Movies.map((movie) => (
                <Card key={movie.id} id={movie.id} img={movie.image} title={movie.title} link={movie.link} />
            ))}
        </div>
    );

}