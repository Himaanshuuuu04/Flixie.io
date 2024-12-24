export default function SkeletonLoaderMoviedetils() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center overflow-y-auto">
        <div className="bg-white/10 backdrop-blur-3xl border-2 border-white/20 h-auto md:h-[90vh] md:w-[95vw] md:m-10 m-5 flex flex-col md:flex-row rounded-2xl relative md:overflow-hidden animate-pulse">
          {/* Left Column */}
          <div className="w-full md:w-1/2 h-48 md:h-full bg-white/30 rounded-t-2xl md:rounded-none"></div>
      
          {/* Right Column */}
          <div className="flex flex-col p-4 md:p-8 gap-6 w-full md:w-1/2">
            {/* Title Placeholder */}
            <div className="h-8 bg-white/30 rounded w-3/4"></div>
      
            {/* Overview Placeholder */}
            <div className="h-16 bg-white/30 rounded w-full"></div>

            {/* Buttons Placeholder */}
            <div className="flex gap-4">
              <div className="h-10 w-24 bg-white/30 rounded-2xl"></div>
              <div className="h-10 w-24 bg-white/30 rounded-2xl"></div>
            </div>
      
            {/* Divider */}
            <hr className="border-gray-600" />
      
            {/* Details Placeholders */}
            <div className="flex flex-col gap-2">
              <div className="h-5 bg-white/30 rounded w-3/4"></div>
              <div className="h-5 bg-white/30 rounded w-2/3"></div>
              <div className="h-5 bg-white/30 rounded w-1/2"></div>
              <div className="h-5 bg-white/30 rounded w-1/3"></div>
            </div>
      
            {/* Cast Placeholder */}
            <div>
              <div className="h-6 bg-white/30 rounded w-1/4 mb-4"></div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className=" bg-white/30 rounded-2xl p-2 flex flex-col items-center w-[120px] sm:w-[140px] md:w-[100px]"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20  bg-white/40 rounded-full"></div>
                    <div className="h-4 w-3/4 bg-white/40 rounded mt-2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }      