import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
function Artists() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(queries.GET_ARTIST_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  let songsData = useQuery(queries.GET_SONGS_BY_ARTIST_ID, {
    variables: { artistId: id },
    fetchPolicy: "cache-and-network",
  });

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

  if (data) {
    let { getArtistById } = data;
    let artists = getArtistById;
    let songs =
      songsData?.data && songsData.data.getSongsByArtistId
        ? songsData.data.getSongsByArtistId
        : [];

    return (
      <div>
        <h2>Artists</h2>

        <div key={artists._id} className="single-card">
          <h3>{artists.name}</h3>
          <p>
            <strong>Date Formed:</strong> {artists.dateFormed}
          </p>
          <p>
            <strong>Members:</strong> {artists.members.join(", ")}
          </p>
          <p>
            <strong>Number of Albums:</strong> {artists.numOfAlbums}
          </p>
          <p>
            <strong>Albums List: </strong>
          </p>
          {artists.albums && artists.albums.length > 0 ? (
            artists.albums.map((album) => (
              <ul key={album._id}>
                <li>
                  <NavLink to={`/albums/${album._id}`}>{album.title}</NavLink>
                </li>
              </ul>
            ))
          ) : (
            <p>No albums found</p>
          )}
          <p>
            <strong>Songs By this Artist List: </strong>{" "}
          </p>
          {songs && songs.length > 0 ? (
            songs.map((song) => (
              <ul key={song._id}>
                <li>
                  <NavLink to={`/songs/${song._id}`}>
                    {song.title} - {song.duration}
                  </NavLink>
                </li>
              </ul>
            ))
          ) : (
            <p>No songs found</p>
          )}
          <button
            onClick={() => {
              handleEditArtist(artists);
            }}
          >
            Edit Artist
          </button>
          <button
            onClick={() => {
              handleDeleteArtist(artists);
            }}
          >
            Delete Artist
          </button>
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
      </div>
    );
  } else if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error: {error.message}</p>;
  }
}

export default Artists;
