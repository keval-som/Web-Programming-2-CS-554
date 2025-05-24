import "../App.css";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ArtistList from "./ArtistList";
import Artist from "./Artist";
import CompaniesList from "./CompanyList.jsx";
import RecordCompany from "./RecordCompany.jsx";
import AlbumList from "./AlbumList.jsx";
import Album from "./Album.jsx";
import Song from "./Song.jsx";
import Search from "./Search.jsx";
function App() {
  return (
    <>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/artists" className="nav-link">
              Artists
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/companies" className="nav-link">
              Companies
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/albums" className="nav-link">
              Albums
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/search" className="nav-link">
              Search
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/artists/:id" element={<Artist />} />
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/companies/:id" element={<RecordCompany />} />
          <Route path="/albums" element={<AlbumList />} />
          <Route path="/albums/:id" element={<Album />} />
          <Route path="/songs/:id" element={<Song />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
