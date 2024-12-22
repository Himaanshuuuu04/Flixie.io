export default function Carouselskeleton() {
    return (
        <div className="overflow-hidden">
            <div className="relative w-full rounded-2xl shadow-2xl bg-white/20 animate-pulse">
                <div
                className="flex rounded-2xl transition-transform duration-1000 ease-in-out"
                >
                
                <div className="flex-shrink-0 w-full h-[15rem] relative">
                    <div className="bg-white/20 w-full h-full rounded-2xl"></div>
                    <div className="absolute inset-0  items-center justify-center p-3 hidden md:flex">
                    <div className="text-white text-center space-y-2">
                        <span className="absolute top-3 left-3 bg-white/20 text-transparent rounded-full px-2 py-1"></span>
                        <div className="absolute bottom-5 left-5 text-left p-4 rounded-2xl border border-white/20 bg-white/20">
                        <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-full mb-2"></div>
                        <div className="flex gap-2 mt-2">
                            <div className="h-6 w-20 bg-white/20 rounded"></div>
                            <div className="h-6 w-20 bg-white/20 rounded"></div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="absolute bottom-0 h-[30%] bg-white/20 w-full flex flex-col justify-center p-4 md:hidden rounded-2xl border border-white/20 rounded-t-none">
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                    <div className="flex gap-4">
                        <div className="h-6 w-20 bg-white/20 rounded"></div>
                        <div className="h-6 w-20 bg-white/20 rounded"></div>
                    </div>
                    </div>
                </div>
              
                </div>
            </div>
            <div className="mt-4 flex justify-center space-x-1">
                <div className="h-1.5 w-1.5 md:w-2 md:h-2 bg-white/20 rounded-full animate-pulse"></div>
                <div className="h-1.5 w-1.5 md:w-2 md:h-2 bg-white/20 rounded-full animate-pulse"></div>
                <div className="h-1.5 w-1.5 md:w-2 md:h-2 bg-white/20 rounded-full animate-pulse"></div>
            </div>
        </div>
);}
