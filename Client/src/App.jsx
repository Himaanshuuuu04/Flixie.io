import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/routes/Home.jsx';
import NotFound from "./components/routes/NotFound.jsx";
import Login from "./components/routes/Login.jsx";
import Moviedetails from "./components/routes/Moviedetails.jsx";
import Favourite from "./components/routes/Favourite.jsx";
import { MovieProvider } from "./components/contextAPI/MovieContext.jsx";
import { GenreProvider } from "./components/contextAPI/GenreContext.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./components/contextAPI/AuthContext.jsx";
import AuthenticatedRoutes from "./Utils/AuthenticatedRoutes.jsx";
import { BackgroundGradientAnimation } from "./components/Gradient.jsx";
import ProfileComplete from "./components/routes/ProfileComplete.jsx";
function App() {
  return (
    <BackgroundGradientAnimation>
    <MovieProvider>
      <GenreProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
           
            <Route path="/Login" element={<Login />} />
            <Route path="/ProfileComplete" element={<ProfileComplete />} />
          
            <Route path="*" element={<NotFound />} />
            <Route element={<AuthenticatedRoutes />}>
              
              <Route path="/" element={<Home />}/ >
              <Route path="/Home" element={<Home />}/ >
              <Route path="/Moviedetails/:id" element={<Moviedetails />} />
              <Route path="/Favourite" element={<Favourite />} />
              
            </Route>
            </Routes>
          </HashRouter>
        </AuthProvider>
      </GenreProvider>
    </MovieProvider>
    </BackgroundGradientAnimation>
  );
}

export default App;
