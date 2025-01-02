import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/routes/Home.jsx';
import NotFound from "./components/routes/NotFound.jsx";
import Login from "./components/routes/Login.jsx";
import Moviedetails from "./components/routes/Moviedetails.jsx";
import Favourite from "./components/routes/Favourite.jsx";
import { SearchProvider } from "./components/contextAPI/SearchContext.jsx";
import { GenreProvider } from "./components/contextAPI/GenreContext.jsx";
import { LikedMoviesProvider } from "./components/contextAPI/LikeContext.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./components/contextAPI/AuthContext.jsx";
import AuthenticatedRoutes from "./Utils/AuthenticatedRoutes.jsx";
import { BackgroundGradientAnimation } from "./components/Gradient.jsx";
import ProfileComplete from "./components/routes/ProfileComplete.jsx";
import TopRated from "./components/routes/TopRated.jsx";
import Friends from "./components/routes/Friends.jsx";
import WatchHistroy from "./components/routes/WatchHistroy.jsx";
import { AiRecommendationProvider } from "./components/contextAPI/AiRecommendationContext.jsx";
import {SparklesCore} from "./components/SparkleText.jsx";
export default function App(){
  return (
    <BackgroundGradientAnimation>
      <div className='w-full absolute inset-0 h-screen'>
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.2}
                    maxSize={1}
                    particleDensity={40}
                    className="w-full h-full "
                    particleColor="#FFFFFF"
                    speed={1}
                />
        </div>
      <GenreProvider>
        <AuthProvider>
          <LikedMoviesProvider>
            <SearchProvider>
              <AiRecommendationProvider>
                <HashRouter>
                  <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/ProfileComplete" element={<ProfileComplete />} />
                    <Route path="*" element={<NotFound />} />
                    <Route element={<AuthenticatedRoutes />}>
                      <Route path="/" element={<Home />}/ >
                      <Route path="/Home" element={<Home />}/ >
                      <Route path="/Moviedetails/:media_type/:id" element={<Moviedetails />} />
                      <Route path="/Favourite" element={<Favourite />} />
                      <Route path="/TopRated" element={<TopRated />} />
                      <Route path="/Friends" element={<Friends />} />
                      <Route path="WatchHistory" element={<WatchHistroy />} />
                    </Route>
                  </Routes>
                </HashRouter>
              </AiRecommendationProvider>
            </SearchProvider>
          </LikedMoviesProvider>
        </AuthProvider>
      </GenreProvider> 
    </BackgroundGradientAnimation>
  );
}


