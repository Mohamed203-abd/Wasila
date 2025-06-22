import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Nav from './Components/Header';
import Login from './Routes/Login';
import Entity from './Routes/Entity';
import Categories from './Routes/Categories';
import Departments from './Routes/Departments';
import Management from './Routes/Management';
import Template from './Routes/Template';
import Upload from './Routes/Upload';
import Profile from './Routes/Profile';
import Filters from "./Components/Filters";
import Research from "./Routes/Research";
import Contact from "./Routes/Contact";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const publicPaths = ["/"];
  
    if (token) {
      setIsAuthenticated(true);
      if (location.pathname === "/") navigate("/entity");
    } else {
      setIsAuthenticated(false);
      if (!publicPaths.includes(location.pathname)) navigate("/");
    }
  }, [location.pathname, navigate]);



  return (
    <div className="App">
      {isAuthenticated}
      <Nav />
      <Routes>
          <Route path="/entity" element={<Entity />} />
          <Route path="/:category" element={<Categories />} />
          <Route path="/departments/:id" element={<Departments />} />
          <Route path="/management" element={<Management />} />
          <Route path="/template" element={<Template />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/searchpage" element={<Filters />} />
          <Route path="/research" element={<Research />} />
          <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;