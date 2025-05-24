import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import Add from "./Add.jsx";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";
function Artists() {
  const { loading, error, data } = useQuery(queries.GET_ARTISTS, {
    fetchPolicy: "cache-and-network",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editArtist, setEditArtist] = useState(null);
  const [deleteArtist, setDeleteArtist] = useState(null);

  const handleEditArtist = (artist) => {
    setEditArtist(artist);
    setShowEditModal(true);
  };

  const handleDeleteArtist = (artist) => {
    setDeleteArtist(artist);
    setShowDeleteModal(true);
  };

  const closeAddFormState = () => {
    setShowAddForm(false);
  };

  if (loading) return <p>Loading...</p>;
  let errorDiv = null;
  if (error) {
    errorDiv = <p>Error: {error.message}</p>;
  }
  if (data) {
    var { artists } = data;
  }

  return (
    <div className="artists-list">
      <h2>Artists</h2>
      <button
        className="add-artist"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        Add Artist
      </button>
      {showAddForm && (
        <Add type="artist" closeAddFormState={closeAddFormState} />
      )}
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
                <button
                  onClick={() => {
                    handleEditArtist(artist);
                  }}
                >
                  Edit Artist
                </button>
                <button
                  onClick={() => {
                    handleDeleteArtist(artist);
                  }}
                >
                  Delete Artist
                </button>
              </div>
            ))}
          </div>
          {showEditModal && (
            <EditModal
              type="artist"
              isOpen={showEditModal}
              data={editArtist}
              handleClose={() => setShowEditModal(false)}
              getQuery={queries.GET_ARTISTS}
              editQuery={queries.EDIT_ARTIST}
            />
          )}
          {showDeleteModal && (
            <DeleteModal
              type="artist"
              isOpen={showDeleteModal}
              data={deleteArtist}
              handleClose={() => setShowDeleteModal(false)}
              deleteQuery={queries.DELETE_ARTIST}
              getQuery={queries.GET_ARTISTS}
            />
          )}
        </>
      )}
      {errorDiv && (
        <div className="error-message">
          <p>{errorDiv}</p>
        </div>
      )}
    </div>
  );
}

export default Artists;
