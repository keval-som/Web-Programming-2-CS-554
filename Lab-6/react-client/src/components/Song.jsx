import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

function Songs() {
  const { id } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [deleteSong, setDeleteSong] = useState(null);
  const [addSongAlbum, setAddSongAlbum] = useState(null);

  const { loading, error, data } = useQuery(queries.GET_SONG_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const handleEditSong = (song) => {
    setEditSong(song);
    setShowEditModal(true);
  };

  const handleDeleteSong = (song) => {
    setAddSongAlbum(song.albumId);
    setDeleteSong(song);
    setShowDeleteModal(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data) {
    let { getSongById } = data;
    let songs = getSongById;
    return (
      <div>
        <h2>Songs</h2>
        <div key={songs._id} className="single-card">
          <h3>{songs.title}</h3>
          <NavLink to={`/albums/${songs.albumId._id}`}>
            <p>
              <strong>Album:</strong> {songs.albumId.title}
            </p>
          </NavLink>
          <p>
            <strong>Duration:</strong>
            {songs.duration}
          </p>
          <button onClick={() => handleEditSong(songs)}>Edit Song</button>
          <button onClick={() => handleDeleteSong(songs)}>Delete Song</button>
        </div>
        {showEditModal && (
          <EditModal
            type="song"
            isOpen={showEditModal}
            data={editSong}
            handleClose={() => setShowEditModal(false)}
            editQuery={queries.EDIT_SONG}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            type="songSingle"
            isOpen={showDeleteModal}
            data={deleteSong}
            handleClose={() => setShowDeleteModal(false)}
            deleteQuery={queries.DELETE_SONG}
            albumData={addSongAlbum}
          />
        )}
      </div>
    );
  }
}

export default Songs;
