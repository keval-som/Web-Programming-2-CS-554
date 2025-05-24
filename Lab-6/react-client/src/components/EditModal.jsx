import React, { useState } from "react";
import ReactModal from "react-modal";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import moment from "moment";
import { useApolloClient } from "@apollo/client";

ReactModal.setAppElement("#root");

function EditModal(props) {
  const client = useApolloClient();
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [editData, setEditData] = useState(props.data);
  const [editDataMutation] = useMutation(props.editQuery);

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditData(null);
    props.handleClose();
  };

  const {
    data: allArtists,
    loading: loadingArtists,
    error: errorArtists,
  } = useQuery(queries.GET_ARTISTS);
  const {
    data: allCompanies,
    loading: loadingCompanies,
    error: errorCompanies,
  } = useQuery(queries.GET_COMPANIES);

  const {
    data: allAlbums,
    loading: loadingAlbums,
    error: errorAlbums,
  } = useQuery(queries.GET_ALBUMS);

  if (loadingArtists || loadingCompanies) return <p>Loading...</p>;
  if (loadingAlbums) return <p>Loading...</p>;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      height: "80%",
      overflow: "auto",
      border: "1px solid black",
      borderRadius: "4px",
    },
  };

  const handleEditArtist = (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let dateFormed = document.getElementById("dateFormed").value;
    dateFormed = moment(dateFormed).format("MM/DD/YYYY");
    let members = document.getElementById("members").value.split(",");
    editDataMutation({
      variables: {
        id: props.data._id,
        name: name,
        dateFormed: dateFormed,
        members: members,
      },
    })
      .then(() => {
        document.getElementById("editData").reset();
        alert("Artist edited successfully!");
        props.handleClose();
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error adding artist:", err);
        alert("Failed to add artist. Please try again.");
      });
  };

  const handleEditCompany = (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let foundedYear = document.getElementById("foundedYear").value;
    let country = document.getElementById("country").value;
    editDataMutation({
      variables: {
        id: props.data._id,
        name: name,
        foundedYear: parseInt(foundedYear),
        country: country,
      },
    })
      .then(() => {
        document.getElementById("editData").reset();
        alert("Company edited successfully!");
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error adding company:", err);
        alert("Failed to add company. Please try again.");
      });
  };

  const handleEditAlbum = (e) => {
    e.preventDefault();
    let title = document.getElementById("title").value;
    let artistId = document.getElementById("artistId").value;
    let companyId = document.getElementById("companyId").value;
    let genre = document.getElementById("genre").value;
    let releaseDate = document.getElementById("releaseDate").value;
    releaseDate = moment(releaseDate).format("MM/DD/YYYY");
    editDataMutation({
      variables: {
        id: props.data._id,
        title: title,
        artistId: artistId,
        companyId: companyId,
        genre: genre,
        releaseDate: releaseDate,
      },
    })
      .then(() => {
        document.getElementById("editData").reset();
        alert("Album edited successfully!");
        props.handleClose();
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error adding album:", err);
        alert("Failed to add album. Please try again.");
      });
  };

  const handleClearCache = () => {
    client
      .resetStore()
      .then(() => {
        console.log("Cache reset successfully!");
      })
      .catch((err) => {
        console.error("Error resetting cache:", err);
      });
  };

  const handleEditSong = (e) => {
    e.preventDefault();
    handleClearCache();
    let title = document.getElementById("title").value;
    let duration = document.getElementById("duration").value;
    let albumId = document.getElementById("albumId").value;
    editDataMutation({
      variables: {
        id: props.data._id,
        title: title,
        duration: duration,
        albumId: albumId,
      },
    })
      .then(() => {
        document.getElementById("editData").reset();
        alert("Song edited successfully!");
        props.handleClose();
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error adding song:", err);
        props.handleClose();
        setShowEditModal(false);
      });
  };

  let body = null;

  if (props.type === "artist") {
    body = (
      <div className="editData-div">
        <ReactModal
          name="editModal"
          isOpen={showEditModal}
          contentLabel="Edit Artist"
          style={customStyles}
        >
          <form
            className="editForm"
            id="editData"
            onSubmit={(e) => handleEditArtist(e)}
          >
            <div>
              <h3>Edit Artist</h3>
              <br />
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={editData.name}
                placeholder="Enter artist name"
              />
              <label htmlFor="dateFormed">Date formed:</label>
              <input
                type="Date"
                name="dateFormed"
                id="dateFormed"
                defaultValue={
                  new Date(editData.dateFormed).toISOString().split("T")[0]
                }
                required
              />
              <label htmlFor="members">Members:</label>
              <input
                type="text"
                id="members"
                name="members"
                required
                defaultValue={editData.members.join(", ")}
                placeholder="Enter artist members (comma separated)"
              />
              <div>
                <button type="submit">Edit Artist</button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </ReactModal>
      </div>
    );
  }

  if (props.type === "company") {
    body = (
      <div className="editData-div">
        <ReactModal
          name="editModal"
          isOpen={showEditModal}
          contentLabel="Edit Company"
          style={customStyles}
        >
          <form
            className="editForm"
            id="editData"
            onSubmit={(e) => handleEditCompany(e)}
          >
            <div>
              <h3>Edit Company</h3>
              <br />
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={editData.name}
                placeholder="Enter company name"
              />
              <label htmlFor="foundedYear">Founded Year:</label>
              <input
                type="text"
                id="foundedYear"
                name="foundedYear"
                required
                defaultValue={editData.foundedYear}
                placeholder="Enter founded year"
              />
              <label htmlFor="country">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                required
                defaultValue={editData.country}
                placeholder="Enter country of origin"
              />
              <div>
                <button type="submit">Edit Company</button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </ReactModal>
      </div>
    );
  }

  if (props.type === "album") {
    body = (
      <div className="editData-div">
        <ReactModal
          name="editModal"
          isOpen={showEditModal}
          contentLabel="Edit Album"
          style={customStyles}
        >
          <form
            className="editForm"
            id="editData"
            onSubmit={(e) => handleEditAlbum(e)}
          >
            <div>
              <h3>Edit Album</h3>
              <br />
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter album title"
                defaultValue={editData.title}
              />
              <label htmlFor="artistId">Artist:</label>
              <select
                id="artistId"
                name="artistId"
                defaultValue={editData.artist._id}
              >
                {allArtists.artists.map((artist) => (
                  <option key={artist._id} value={artist._id}>
                    {artist.name}
                  </option>
                ))}
              </select>
              <label htmlFor="companyId">Company:</label>
              <select
                id="companyId"
                name="companyId"
                defaultValue={editData.recordCompany._id}
              >
                {allCompanies.recordcompanies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <label htmlFor="genre">Genre:</label>
              <select name="genre" id="genre" defaultValue={editData.genre}>
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
                defaultValue={moment(new Date(editData.releaseDate)).format(
                  "YYYY-MM-DD"
                )}
                min="1900-01-01"
                max={moment().format("YYYY-MM-DD")}
              />
              <div>
                <button type="submit">Edit Album</button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </ReactModal>
      </div>
    );
  }

  if (props.type === "song") {
    body = (
      <div className="editData-div">
        <ReactModal
          name="editModal"
          isOpen={showEditModal}
          contentLabel="Edit Song"
          style={customStyles}
        >
          <form
            className="editForm"
            id="editData"
            onSubmit={(e) => handleEditSong(e)}
          >
            <div>
              <h3>Edit Song</h3>
              <br />
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter song title"
                defaultValue={editData.title}
              />
              <label htmlFor="duration">Duration: </label>
              <input
                type="text"
                id="duration"
                name="duration"
                placeholder="Enter song duration"
                defaultValue={editData.duration}
              />
              <label htmlFor="albumId">Album:</label>
              <select
                id="albumId"
                name="albumId"
                defaultValue={editData.albumId._id}
              >
                {allAlbums.albums.map((album) => (
                  <option key={album._id} value={album._id}>
                    {album.title}
                  </option>
                ))}
              </select>
              <button type="submit">Edit Song</button>

              <button
                type="button"
                onClick={() => {
                  handleCloseModal();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </ReactModal>
      </div>
    );
  }

  return <>{body}</>;
}

export default EditModal;
