import ExpandArrow from '../assets/ExpandArrow.png'
import Search from '../assets/Search.png'
import Notifcation from '../assets/Notification.png'
import Enter from '../assets/Enter.png'
export default function TopBar() {
    return (
        <div className="flex flex-row space-x-10 mt-10 w-full mr-10 relative ml-[21rem] font-sans font-light text-white text-lg z-50">
            <div className=" flex justify-center items-center w-fit p-2 border-2 border-slate-800 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-xl text-white">
        
                <h2 className="ml-2 -mb-1">All</h2>
                <img src={ExpandArrow} alt='arrow' className='ml-2 h-3' />
                
            </div>  
            <div className="flex justify-center  items-center min-w-60 p-2 border-2 border-slate-800 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-xl text-white">
                <input type="text" placeholder="Search" className="bg-transparent focus:outline-none ml-2 -mb-1 min-w-40"/>
                <button><img src={Search}  className='ml-2 h-6' /></button>
             </div>
        </div>
    )    
}