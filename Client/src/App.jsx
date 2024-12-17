import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/routes/Home.jsx';
import NotFound from "./components/routes/NotFound.jsx";
import Signin from "./components/routes/Signin.jsx";
import Login from "./components/routes/Login.jsx";
import Moviedetails from "./components/routes/Moviedetails.jsx";
import Favourite from "./components/routes/Favourite.jsx";
import { MovieProvider } from "./components/contextAPI/MovieContext.jsx";
import { GenreProvider } from "./components/contextAPI/GenreContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./components/contextAPI/AuthContext.jsx";
import ForgotPassword from "./components/routes/ForgotPassword.jsx";
import AuthenticatedRoutes from "./Utils/AuthenticatedRoutes.jsx";
import Verify from "./components/routes/Verify.jsx";
import CheckEmail from "./components/routes/CheckEmail.jsx";
function App() {
  return (
    <MovieProvider>
      <GenreProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
            <Route path="/Signin" element={<Signin />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/CheckEmail" element={<CheckEmail />} />
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
  );
}

export default App;
