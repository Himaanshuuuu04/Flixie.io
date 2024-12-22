import React from "react";

export default function SkeletonLoaderCard() {
    return (
        <div className="flex flex-col items-center cursor-pointer w-full sm:w-36 md:w-44 lg:w-52 overflow-hidden m-0">
            <div className="border-2 border-white/20 rounded-2xl backdrop-filter backdrop-blur-3xl bg-white/20 shadow-xl text-white transition-all duration-300 justify-center">
                {/* Skeleton for image */}
                <div className="w-40 h-52 sm:w-44 sm:h-64 md:w-48 md:h-52 rounded-t-2xl bg-gray-300 animate-pulse"></div>
                
                {/* Skeleton for title */}
                <div className="m-1 h-4 sm:h-5 md:h-6 w-3/4 bg-gray-300 animate-pulse rounded"></div>
            </div>
        </div>
    );
}
