import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

function RecordCompany() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(queries.GET_COMPANY_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [deleteCompany, setDeleteCompany] = useState(null);

  const handleEditCompany = (company) => {
    setEditCompany(company);
    setShowEditModal(true);
  };

  const handleDeleteCompany = (company) => {
    setDeleteCompany(company);
    setShowDeleteModal(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data) {
    let { getCompanyById } = data;
    let companies = getCompanyById;
    return (
      <div>
        <h2>Record Company</h2>

        <div key={companies._id} className="single-card">
          <h3>{companies.name}</h3>
          <p>
            <strong>Founded:</strong> {companies.foundedYear}
          </p>
          <p>
            <strong>Country:</strong> {companies.country}
          </p>
          <p>
            <strong>Number of Albums Released:</strong> {companies.numOfAlbums}
          </p>
          <p>
            <strong>Albums List: </strong>
          </p>
          <ul>
            {companies.albums?.map((album) => (
              <NavLink to={`/albums/${album._id}`} key={album._id}>
                <li>{album.title}</li>
              </NavLink>
            ))}
          </ul>
        </div>
        <div className="button-container">
          <button
            className="edit-button"
            onClick={() => handleEditCompany(companies)}
          >
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => handleDeleteCompany(companies)}
          >
            Delete
          </button>
        </div>
        {showEditModal && (
          <EditModal
            type="company"
            isOpen={showEditModal}
            data={editCompany}
            handleClose={() => setShowEditModal(false)}
            getQuery={queries.GET_COMPANIES}
            editQuery={queries.EDIT_COMPANY}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            type="company"
            isOpen={showDeleteModal}
            data={deleteCompany}
            handleClose={() => setShowDeleteModal(false)}
            getQuery={queries.GET_COMPANIES}
            deleteQuery={queries.DELETE_COMPANY}
          />
        )}
      </div>
    );
  }
}

export default RecordCompany;
