import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [minFoundedYear, setMinFoundedYear] = useState("");
  const [maxFoundedYear, setMaxFoundedYear] = useState("");
  const {
    data: albumsData,
    loading: albumsLoading,
    error: albumsError,
  } = useQuery(queries.GET_ALBUMS_BY_GENRE, {
    variables: { genre: searchTerm },
    skip: searchType !== "GET_ALBUMS_BY_GENRE" || !searchTerm,
  });

  const {
    data: companiesData,
    loading: companiesLoading,
    error: companiesError,
  } = useQuery(queries.GET_COMPANY_BY_FOUNDED_YEAR, {
    variables: {
      min: parseInt(minFoundedYear) || 1900,
      max: parseInt(maxFoundedYear),
    },
    skip: searchType !== "GET_COMPANY_BY_FOUNDED_YEAR" || !maxFoundedYear,
  });

  const {
    data: artistsData,
    loading: artistsLoading,
    error: artistsError,
  } = useQuery(queries.GET_ARTIST_BY_NAME, {
    variables: { searchTerm },
    skip: searchType !== "GET_ARTIST_BY_NAME" || !searchTerm,
  });

  const {
    data: songsData,
    loading: songsLoading,
    error: songsError,
  } = useQuery(queries.GET_SONG_BY_TITLE, {
    variables: { searchTitleTerm: searchTerm },
    skip: searchType !== "GET_SONG_BY_TITLE" || !searchTerm,
  });

  const handleSearch = (type) => {
    setSearchType(type);
  };

  const AlbumByGenreData = () => {
    let data = albumsData;
    let loading = albumsLoading;
    let error = albumsError;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (data) {
      let { albumsByGenre } = data;
      let albumsList = albumsByGenre || [];
      if (albumsByGenre.length === 0) {
        return <p>No albums found for the genre: {searchTerm}</p>;
      }
      return (
        <div className="artists-list">
          <h2>Albums by Genre</h2>
          {data && (
            <>
              <div className="artists-cards">
                {albumsList?.map((album) => (
                  <div key={album._id} className="artist-card">
                    <NavLink to={`/albums/${album._id}`}>
                      <h3>{album.title}</h3>
                    </NavLink>
                    <p>Genre: {album.genre}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const CompanyFoundedYearData = () => {
    let data = companiesData;
    let loading = companiesLoading;
    let error = companiesError;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (data) {
      let { companyByFoundedYear } = data;
      let companies = companyByFoundedYear || [];
      return (
        <div className="artists-list">
          <h2>Companies</h2>

          {data && (
            <>
              <div className="artists-cards">
                {companies?.map((company) => (
                  <div key={company._id} className="artist-card">
                    <NavLink to={`/companies/${company._id}`}>
                      <h3>{company.name}</h3>
                      <p>Number of Albums: {company.numOfAlbums}</p>
                      <p>Country: {company.country}</p>
                    </NavLink>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }
  };

  const ArtistByName = () => {
    let data = artistsData;
    let loading = artistsLoading;
    let error = artistsError;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (data) {
      let { searchArtistByArtistName } = data;
      let artists = searchArtistByArtistName || [];
      return (
        <div className="artists-list">
          <h2>Artists</h2>
          {data && (
            <>
              <div className="artists-cards">
                {artists.map((artist) => (
                  <div key={artist._id} className="artist-card">
                    <NavLink to={`/artists/${artist._id}`}>
                      <h3>{artist.name}</h3>
                    </NavLink>
                    <p>
                      <strong>Date Formed:</strong> {artist.dateFormed}
                    </p>
                    <p>
                      <strong>Members:</strong> {artist.members.join(", ")}
                    </p>
                    <p>
                      <strong>Number of Albums:</strong> {artist.numOfAlbums}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }
  };

  const SongByTitle = () => {
    let data = songsData;
    let loading = songsLoading;
    let error = songsError;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (data) {
      let { searchSongByTitle } = data;
      let songs = searchSongByTitle || [];
      return (
        <div className="artists-list">
          <h2>Songs</h2>
          {data && (
            <>
              <div className="artists-cards">
                {songs.map((song) => (
                  <div key={song._id} className="artist-card">
                    <NavLink to={`/songs/${song._id}`}>
                      <h3>{song.title}</h3>
                      <p>Duration: </p> {song.duration}
                    </NavLink>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const renderSearchBar = () => {
    switch (searchType) {
      case "GET_ALBUMS_BY_GENRE":
        return (
          <div>
            <label htmlFor="genre">Genre:</label>
            <select
              name="genre"
              id="genre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <option value="">Select Genre</option>
              <option value="POP">POP</option>
              <option value="ROCK">ROCK</option>
              <option value="HIP_HOP">HIP_HOP</option>
              <option value="COUNTRY">COUNTRY</option>
              <option value="JAZZ">JAZZ</option>
              <option value="CLASSICAL">CLASSICAL</option>
              <option value="ELECTRONIC">ELECTRONIC</option>
              <option value="R_AND_B">R_AND_B</option>
              <option value="INDIE">INDIE</option>
              <option value="ALTERNATIVE">ALTERNATIVE</option>
            </select>
            <button onClick={() => AlbumByGenreData()}>Search</button>
          </div>
        );
      case "GET_COMPANY_BY_FOUNDED_YEAR":
        return (
          <div>
            <input
              type="number"
              placeholder="Enter Min Founded Year"
              value={minFoundedYear}
              min="1900"
              onChange={(e) => setMinFoundedYear(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter Max Founded Year"
              value={maxFoundedYear}
              onChange={(e) => setMaxFoundedYear(e.target.value)}
            />
            <button onClick={() => CompanyFoundedYearData()}>Search</button>
          </div>
        );
      case "GET_ARTIST_BY_NAME":
        return (
          <div>
            <input
              type="text"
              placeholder="Enter Artist Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => ArtistByName()}>Search</button>
          </div>
        );
      case "GET_SONG_BY_TITLE":
        return (
          <div>
            <input
              type="text"
              placeholder="Enter Song Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => SongByTitle()}>Search</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <div>
        <button
          onClick={() => handleSearch("GET_ALBUMS_BY_GENRE")}
          style={{
            backgroundColor:
              searchType === "GET_ALBUMS_BY_GENRE" ? "lightblue" : "black",
          }}
        >
          Search Albums by Genre
        </button>
        <button
          onClick={() => handleSearch("GET_COMPANY_BY_FOUNDED_YEAR")}
          style={{
            backgroundColor:
              searchType === "GET_COMPANY_BY_FOUNDED_YEAR"
                ? "lightblue"
                : "black",
          }}
        >
          Search Company by Founded Year
        </button>
        <button
          onClick={() => handleSearch("GET_ARTIST_BY_NAME")}
          style={{
            backgroundColor:
              searchType === "GET_ARTIST_BY_NAME" ? "lightblue" : "black",
          }}
        >
          Search Artist by Name
        </button>
        <button
          onClick={() => handleSearch("GET_SONG_BY_TITLE")}
          style={{
            backgroundColor:
              searchType === "GET_SONG_BY_TITLE" ? "lightblue" : "black",
          }}
        >
          Search Song by Title
        </button>
      </div>
      {renderSearchBar()}
      {searchType === "GET_ALBUMS_BY_GENRE" && <AlbumByGenreData />}
      {searchType === "GET_COMPANY_BY_FOUNDED_YEAR" && (
        <CompanyFoundedYearData />
      )}
      {searchType === "GET_ARTIST_BY_NAME" && <ArtistByName />}
      {searchType === "GET_SONG_BY_TITLE" && <SongByTitle />}
    </div>
  );
}
export default Search;
