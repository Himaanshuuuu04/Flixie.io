export default function Card() {
    return (
        <div className='flex flex-col items-center w-48  border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-xl text-white cursor-pointer hover:bg-blue-400 transition-all duration-300 z-40 m-10 ml-0'>
            <img src="https://media5.bollywoodhungama.in/wp-content/uploads/2019/12/Jumanji-The-Next-Level-English-306x393.jpg" alt="logo" className="h-60 w-48 rounded-2xl z-40" />
            <h2 className="ml-2 -mb-1">Flixie</h2>
        </div>
    )
}