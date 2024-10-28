import './App.css'
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/routes/Home.jsx'
import NotFound from './components/NotFound.jsx';
function App() {
  <Routes location={location}>
    <Route path="/" element={<Home />} />
 
    <Route path="*" element={<NotFound/>} />
  </Routes>

  return (
    <>
    <HashRouter>
    </HashRouter> 
    </>
  )
}

export default App
