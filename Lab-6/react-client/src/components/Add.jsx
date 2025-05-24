import React from "react";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
//Import the file where my query constants are defined
import queries from "../queries";

function Add(props) {
  const [addArtist, { error }] = useMutation(queries.ADD_ARTIST, {
    update(cache, { data: { addArtist } }) {
      const existingData = cache.readQuery({ query: queries.GET_ARTISTS });
      const artists = existingData?.artists || [];
      cache.writeQuery({
        query: queries.GET_ARTISTS,
        data: { artists: artists.concat([addArtist]) },
      });
    },
  });
  const [addCompany, { error: companyError }] = useMutation(
    queries.ADD_COMPANY,
    {
      update(cache, { data: { addCompany } }) {
        const existingData = cache.readQuery({ query: queries.GET_COMPANIES });
        const companies = existingData?.recordcompanies || [];
        cache.writeQuery({
          query: queries.GET_COMPANIES,
          data: { recordcompanies: companies.concat([addCompany]) },
        });
      },
    }
  );

  const [addAlbum, { error: albumError }] = useMutation(queries.ADD_ALBUM, {
    update(cache, { data: { addAlbum } }) {
      const existingData = cache.readQuery({ query: queries.GET_ALBUMS });
      const albums = existingData?.albums || [];
      cache.writeQuery({
        query: queries.GET_ALBUMS,
        data: { albums: albums.concat([addAlbum]) },
      });
    },
  });

  const [addSong, { error: songError }] = useMutation(queries.ADD_SONG, {
    update(cache, { data: { addSong } }) {
      const existingData = cache.readQuery({
        query: queries.GET_SONGS_BY_ALBUM_ID,
        variables: { id: props.albumData._id },
      });
      const songs = existingData?.getSongsByAlbumId || [];
      cache.writeQuery({
        query: queries.GET_SONGS_BY_ALBUM_ID,
        variables: { id: props.albumData._id },
        data: { getSongsByAlbumId: songs.concat([addSong]) },
      });
    },
  });

  const onSubmitSong = (e) => {
    e.preventDefault();
    let title = document.getElementById("title").value;
    let duration = document.getElementById("duration").value;
    let albumId = props.albumData._id;
    addSong({
      variables: {
        title: title,
        duration: duration,
        albumId: albumId,
      },
    })
      .then(() => {
        document.getElementById("addData").reset();
        alert("Song added successfully!");
        props.closeAddFormState();
      })
      .catch((err) => {
        console.error("Error adding song:", err);
        alert("Failed to add song. Please try again.");
      });
  };

  const onSubmitArtist = (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let dateFormed = document.getElementById("dateFormed").value;
    dateFormed = moment(dateFormed).format("MM/DD/YYYY");
    let members = document.getElementById("members").value.split(",");
    addArtist({
      variables: {
        name: name,
        dateFormed: dateFormed,
        members: members,
      },
    })
      .then(() => {
        document.getElementById("addData").reset();
        alert("Artist added successfully!");
        props.closeAddFormState();
      })
      .catch((err) => {
        console.error("Error adding artist:", err);
        alert("Failed to add artist. Please try again.");
      });
  };

  const onSubmitCompany = (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let founded_year = document.getElementById("founded_year").value;
    let country = document.getElementById("country").value;
    addCompany({
      variables: {
        name: name,
        foundedYear: parseInt(founded_year),
        country: country,
      },
    })
      .then(() => {
        document.getElementById("addData").reset();
        alert("Company added successfully!");
        props.closeAddFormState();
      })
      .catch((err) => {
        console.error("Error adding company:", err);
        alert("Failed to add company. Please try again.");
      });
  };

  const onSubmitAlbum = (e) => {
    e.preventDefault();
    let title = document.getElementById("title").value;
    let artist = document.getElementById("artistId").value;
    let company = document.getElementById("companyId").value;
    let genre = document.getElementById("genre").value;
    let releaseDate = document.getElementById("releaseDate").value;
    releaseDate = moment(releaseDate).format("MM/DD/YYYY");
    addAlbum({
      variables: {
        title: title,
        artistId: artist,
        companyId: company,
        genre: genre,
        releaseDate: releaseDate,
      },
    })
      .then(() => {
        document.getElementById("addData").reset();
        alert("Album added successfully!");
        props.closeAddFormState();
      })
      .catch((err) => {
        console.error("Error adding album:", err);
        alert("Failed to add album. Please try again.");
      });
  };

  function getArtistsList() {
    const { loading, error, data } = useQuery(queries.GET_ARTISTS, {
      fetchPolicy: "cache-and-network",
    });
    if (loading || error) return null;
    if (data) {
      let { artists } = data;
      return artists.map((artist) => (
        <option key={artist._id} value={artist._id}>
          {artist.name}
        </option>
      ));
    }
  }

  function getCompaniesList() {
    const { loading, error, data } = useQuery(queries.GET_COMPANIES, {
      fetchPolicy: "cache-and-network",
    });
    if (loading || error) return null;
    if (data) {
      let { recordcompanies } = data;
      return recordcompanies.map((company) => (
        <option key={company._id} value={company._id}>
          {company.name}
        </option>
      ));
    }
  }

  let body = null;

  if (props.type === "artist") {
    body = (
      <div className="artist-card">
        <h3>Add Artist</h3>
        <form className="Addform" id="addData" onSubmit={onSubmitArtist}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter artist name"
            />
            <label htmlFor="dateFormed">Date formed:</label>
            <input type="Date" name="dateFormed" id="dateFormed" required />
            <label htmlFor="members">Members:</label>
            <input
              type="text"
              id="members"
              name="members"
              required
              placeholder="Enter artist members (comma separated)"
            />
            <div>
              <button type="submit" className="add-artist-button">
                Add Artist
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("addData").reset();
                  props.closeAddFormState();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        {error && <p className="error-message">Error: {error.message}</p>}
      </div>
    );
  }

  if (props.type === "company") {
    body = (
      <div className="artist-card">
        <h3>Add Company</h3>
        <form className="Addform" id="addData" onSubmit={onSubmitCompany}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter company name"
            />
            <label htmlFor="founded_year">Founded Year:</label>
            <input
              type="number"
              name="founded_year"
              id="founded_year"
              placeholder="Enter founded year"
              required
            />
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              required
              placeholder="Enter country of company"
            />
            <div>
              <button type="submit" className="add-artist-button">
                Add Company
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("addData").reset();
                  props.closeAddFormState();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        {companyError && (
          <p className="error-message">Error: {companyError.message}</p>
        )}
      </div>
    );
  }

  if (props.type === "album") {
    body = (
      <div className="artist-card">
        <h3>Add Album</h3>
        <form className="Addform" id="addData" onSubmit={onSubmitAlbum}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter album title"
            />
            <label htmlFor="artistId">Artist:</label>
            <select id="artistId" name="artistId" required>
              {getArtistsList()}
            </select>
            <label htmlFor="companyId">Company:</label>
            <select id="companyId" name="companyId" required>
              {getCompaniesList()}
            </select>
            <label htmlFor="genre">Genre:</label>
            <select name="genre" id="genre" required>
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

            <label htmlFor="releaseDate">Release Date:</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              max={moment().format("YYYY-MM-DD")}
              required
            />
            <div>
              <button type="submit" className="add-artist-button">
                Add Album
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("addData").reset();
                  props.closeAddFormState();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        {albumError && (
          <p className="error-message">Error: {albumError.message}</p>
        )}
      </div>
    );
  }

  if (props.type === "song") {
    body = (
      <div className="artist-card">
        <h3>Add Song</h3>
        <form className="Addform" id="addData" onSubmit={onSubmitSong}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter song title"
            />
            <label htmlFor="duration">Duration:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              required
              placeholder="Enter song duration (e.g., 3:45)"
            />
            <div>
              <button type="submit" className="add-artist-button">
                Add Song
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("addData").reset();
                  props.closeAddFormState();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        {songError && (
          <p className="error-message">Error: {songError.message}</p>
        )}
      </div>
    );
  }

  return <div>{body}</div>;
}

export default Add;
