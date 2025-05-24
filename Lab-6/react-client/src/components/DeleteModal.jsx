import React, { useState } from "react";
import ReactModal from "react-modal";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

ReactModal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    border: "1px solid #28547a",
    borderRadius: "4px",
  },
};

function DeleteModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [deleteData, setDeleteData] = useState(props.data);
  const client = useApolloClient();

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setDeleteData(null);
    props.handleClose();
  };

  const [deleteDataMutation, { error }] = useMutation(props.deleteQuery, {
    update(cache) {
      const { artists } = cache.readQuery({ query: queries.GET_ARTISTS });
      cache.writeQuery({
        query: queries.GET_ARTISTS,
        data: {
          artists: artists.filter((artist) => artist._id !== deleteData._id),
        },
      });
    },
  });

  const [deleteCompanyMutation] = useMutation(props.deleteQuery, {
    update(cache) {
      const { recordcompanies } = cache.readQuery({
        query: queries.GET_COMPANIES,
      });
      cache.writeQuery({
        query: queries.GET_COMPANIES,
        data: {
          recordcompanies: recordcompanies.filter(
            (company) => company._id !== deleteData._id
          ),
        },
      });
    },
  });

  const [deleteAlbumMutation] = useMutation(props.deleteQuery, {
    update(cache) {
      const { albums } = cache.readQuery({ query: queries.GET_ALBUMS });
      cache.writeQuery({
        query: queries.GET_ALBUMS,
        data: {
          albums: albums.filter((album) => album._id !== deleteData._id),
        },
      });
    },
  });

  const [deleteSongMutation] = useMutation(props.deleteQuery, {
    update(cache) {
      const existingData = cache.readQuery({
        query: queries.GET_SONGS_BY_ALBUM_ID,
        variables: { id: props.albumData._id },
      });
      const updatedSongs = existingData?.getSongsByAlbumId.filter(
        (song) => song._id !== deleteData._id
      );
      cache.writeQuery({
        query: queries.GET_SONGS_BY_ALBUM_ID,
        variables: { id: props.albumData._id },
        data: { getSongsByAlbumId: updatedSongs },
      });
    },
  });

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
  const handleDeleteArtist = () => {
    deleteDataMutation({
      variables: {
        id: deleteData._id,
      },
    })
      .then(() => {
        alert("Artist deleted successfully!");
        props.handleClose();
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.error("Error deleting artist:", err);
        alert("Failed to delete artist. Please try again.");
      });
  };

  const handleDeleteCompany = () => {
    deleteCompanyMutation({
      variables: {
        id: deleteData._id,
      },
    })
      .then(() => {
        alert("Company deleted successfully!");
        props.handleClose();
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.error("Error deleting company:", err);
        alert("Failed to delete company. Please try again.");
      });
  };

  const handleDeleteAlbum = () => {
    deleteAlbumMutation({
      variables: {
        id: deleteData._id,
      },
    })
      .then(() => {
        alert("Album deleted successfully!");
        props.handleClose();
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.error("Error deleting album:", err);
        alert("Failed to delete album. Please try again.");
      });
  };

  const handleDeleteSong = () => {
    handleClearCache();
    deleteSongMutation({
      variables: {
        id: deleteData._id,
      },
    })
      .then(() => {
        alert("Song deleted successfully!");
        props.handleClose();
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.error("Error deleting song:", err);
        alert("Failed to delete song. Please try again.");
      });
  };

  let body = null;

  if (props.type === "artist") {
    body = (
      <div className="delete-card">
        <h3>Delete Artist</h3>
        <p>Are you sure you want to delete {deleteData.name}?</p>
        <NavLink to={`/artists`}>
          <button className="delete-button" onClick={handleDeleteArtist}>
            Delete
          </button>
        </NavLink>
        <button className="cancel-button" onClick={handleCloseModal}>
          Cancel
        </button>
      </div>
    );
  }

  if (props.type === "company") {
    body = (
      <div className="delete-card">
        <h3>Delete Company</h3>
        <p>Are you sure you want to delete {deleteData.name}?</p>
        <NavLink to={`/companies`}>
          <button className="delete-button" onClick={handleDeleteCompany}>
            Delete
          </button>
        </NavLink>
        <button className="cancel-button" onClick={handleCloseModal}>
          Cancel
        </button>
      </div>
    );
  }

  if (props.type === "album") {
    body = (
      <div className="delete-card">
        <h3>Delete Album</h3>
        <p>Are you sure you want to delete {deleteData.title}?</p>
        <NavLink to={`/albums`}>
          <button className="delete-button" onClick={handleDeleteAlbum}>
            Delete
          </button>
        </NavLink>
        <button className="cancel-button" onClick={handleCloseModal}>
          Cancel
        </button>
      </div>
    );
  }

  if (props.type === "song") {
    body = (
      <div className="delete-card">
        <h3>Delete Song</h3>
        <p>Are you sure you want to delete {deleteData.title}?</p>
        <button className="delete-button" onClick={handleDeleteSong}>
          Delete
        </button>
        <button className="cancel-button" onClick={handleCloseModal}>
          Cancel
        </button>
      </div>
    );
  }

  if (props.type === "songSingle") {
    body = (
      <div className="delete-card">
        <h3>Delete Song</h3>
        <p>Are you sure you want to delete {deleteData.title}?</p>
        <NavLink to={`/`}>
          <button className="delete-button" onClick={handleDeleteSong}>
            Delete
          </button>
        </NavLink>
        <button className="cancel-button" onClick={handleCloseModal}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <ReactModal
      name="deleteModal"
      isOpen={showDeleteModal}
      onRequestClose={handleCloseModal}
      style={customStyles}
    >
      {body}
    </ReactModal>
  );
}

export default DeleteModal;
