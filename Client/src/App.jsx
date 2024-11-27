
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/routes/Home.jsx';
import NotFound from "./components/routes/NotFound.jsx";
import Auth from "./components/routes/Auth.jsx";
import Login from "./components/routes/Login.jsx";
import Moviedetails from "./components/routes/Moviedetails.jsx";
import { MovieProvider } from "./components/contextAPI/MovieContext.jsx";
import { GenreProvider } from "./components/contextAPI/GenreContext.jsx";
function App() {
  return (
    <MovieProvider>
      <GenreProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Auth" element={<Auth />} />
        <Route path="Login" element={<Login />} />
        <Route path="Moviedetails/:id" element={<Moviedetails />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </HashRouter> 
    </GenreProvider>
    </MovieProvider>  
  );
}

export default App;
