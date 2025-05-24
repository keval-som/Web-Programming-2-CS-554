import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import Add from "./Add.jsx";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";

function Albums() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAlbum, setEditAlbum] = useState(null);
  const [deleteAlbum, setDeleteAlbum] = useState(null);
  const { loading, error, data } = useQuery(queries.GET_ALBUMS, {
    fetchPolicy: "cache-and-network",
  });
  const handleEditAlbum = (album) => {
    setEditAlbum(album);
    setShowEditModal(true);
  };
  const handleDeleteAlbum = (album) => {
    setDeleteAlbum(album);
    setShowDeleteModal(true);
  };

  const closeAddFormState = () => {
    setShowAddForm(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  let errorDiv = null;
  if (error) {
    errorDiv = <p className="error-message">Error: {error.message}</p>;
  }

  if (data) {
    var { albums } = data;
  }

  const albumsList = albums || [];
  return (
    <div className="artists-list">
      <h2>Albums</h2>
      <button
        className="add-artist"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        Add Album
      </button>
      {showAddForm && (
        <Add type="album" closeAddFormState={closeAddFormState} />
      )}
      {data && (
        <>
          <div className="artists-cards">
            {albumsList?.map((album) => (
              <div key={album._id} className="artist-card">
                <NavLink to={`/albums/${album._id}`}>
                  <h3>{album.title}</h3>
                </NavLink>
                <p>Genre: {album.genre}</p>
                <NavLink to={`/artists/${album.artist._id}`}>
                  <p>Artist: {album.artist.name}</p>
                </NavLink>
                <div className="buttons">
                  <button
                    className="edit-artist"
                    onClick={() => handleEditAlbum(album)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-artist"
                    onClick={() => handleDeleteAlbum(album)}
                  >
                    Delete
                  </button>
                </div>
                {showEditModal && (
                  <EditModal
                    isOpen={showEditModal}
                    type="album"
                    data={editAlbum}
                    handleClose={() => setShowEditModal(false)}
                    editQuery={queries.EDIT_ALBUM}
                    getQuery={queries.GET_ALBUMS}
                  />
                )}
                {showDeleteModal && (
                  <DeleteModal
                    type="album"
                    isOpen={showDeleteModal}
                    data={deleteAlbum}
                    handleClose={() => setShowDeleteModal(false)}
                    deleteQuery={queries.DELETE_ALBUM}
                    getQuery={queries.GET_ALBUMS}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {errorDiv && errorDiv}
    </div>
  );
}

export default Albums;
