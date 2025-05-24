import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import Add from "./Add.jsx";

function Album() {
  const { id } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAlbum, setEditAlbum] = useState(null);
  const [deleteAlbum, setDeleteAlbum] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSongAlbum, setAddSongAlbum] = useState(null);
  const [showSongDeleteModal, setShowSongDeleteModal] = useState(false);
  const [deleteSong, setDeleteSong] = useState(null);

  const { loading, error, data } = useQuery(queries.GET_ALBUM_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const {
    loading: loadingSongs,
    error: errorSongs,
    data: dataSongs,
  } = useQuery(queries.GET_SONGS_BY_ALBUM_ID, {
    variables: { id: id },
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

  const handleAddSongAlbum = (album) => {
    setAddSongAlbum(album);
    setShowAddForm(true);
  };

  const handleDeleteSong = (song, album) => {
    setAddSongAlbum(album);
    setDeleteSong(song);
    setShowSongDeleteModal(true);
  };

  const closeDeleteSongModal = () => {
    setDeleteSong(null);
    setShowSongDeleteModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data) {
    let { getAlbumById } = data;
    let album = getAlbumById;
    let songs =
      dataSongs && dataSongs.getSongsByAlbumId
        ? dataSongs.getSongsByAlbumId
        : [];
    return (
      <div>
        <h2>Album</h2>
        <div key={album._id} className="single-card">
          <h3>{album.title}</h3>
          <p>
            <strong>Release Date:</strong> {album.releaseDate}
          </p>
          <p>
            <strong>Genre:</strong> {album.genre}
          </p>
          <p>
            <strong>Artist:</strong> {album.artist.name}
          </p>
          <p>
            <strong>Record Company:</strong> {album.recordCompany.name}
          </p>
          <p>
            <strong>Songs: </strong>
          </p>
          <ul>
            {songs && songs.length > 0 ? (
              songs.map((song) => (
                <li key={song._id}>
                  <NavLink to={`/songs/${song._id}`} className="nav-link">
                    {song.title} - {song.duration}
                  </NavLink>
                  <button onClick={() => handleDeleteSong(song, album)}>
                    Delete Song
                  </button>
                </li>
              ))
            ) : (
              <p>No songs available for this album.</p>
            )}
          </ul>
          <button onClick={() => handleEditAlbum(album)}>Edit Album</button>
          <button onClick={() => handleDeleteAlbum(album)}>Delete Album</button>
          <button onClick={() => handleAddSongAlbum(album)}>Add song</button>
        </div>
        {showEditModal && (
          <EditModal
            type="album"
            isOpen={showEditModal}
            data={editAlbum}
            handleClose={() => setShowEditModal(false)}
            getQuery={queries.GET_ALBUMS}
            editQuery={queries.EDIT_ALBUM}
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

        {showAddForm && (
          <Add
            type="song"
            closeAddFormState={closeAddFormState}
            albumData={addSongAlbum}
          />
        )}

        {showSongDeleteModal && (
          <DeleteModal
            type="song"
            isOpen={showSongDeleteModal}
            data={deleteSong}
            albumData={addSongAlbum}
            handleClose={closeDeleteSongModal}
            deleteQuery={queries.DELETE_SONG}
            getQuery={queries.GET_SONGS_BY_ALBUM_ID}
          />
        )}
      </div>
    );
  }
}

export default Album;
