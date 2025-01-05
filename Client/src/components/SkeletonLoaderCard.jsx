import React from "react";

export default function SkeletonLoaderCard() {
    return (
        <div className="flex flex-col items-center cursor-pointer w-fit">
            <div className="border border-white/30 rounded-xl backdrop-filter backdrop-blur-3xl  shadow-xl text-white transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:text-black items-center">
                {/* Skeleton for image */}
                <div className="w-40 h-52 sm:w-44 sm:h-64 md:w-36 md:h-48 rounded-xl bg-white/20 animate-pulse"></div>
                
                {/* Skeleton for title */}
               
            </div>
        </div>
    );
}
