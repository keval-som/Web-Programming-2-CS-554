import { useState } from "react";
import queries from "../queries.js";
import { useQuery } from "@apollo/client";
import Add from "./Add.jsx";
import EditModal from "./EditModal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { NavLink } from "react-router-dom";

function Companies() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [deleteCompany, setDeleteCompany] = useState(null);

  const { loading, error, data } = useQuery(queries.GET_COMPANIES, {
    fetchPolicy: "cache-and-network",
  });

  const handleEditCompany = (company) => {
    setEditCompany(company);
    setShowEditModal(true);
  };

  const handleDeleteCompany = (company) => {
    setDeleteCompany(company);
    setShowDeleteModal(true);
  };

  const closeAddFormState = () => {
    setShowAddForm(false);
  };

  if (loading) return <p>Loading...</p>;
  let errorDiv = null;
  if (error) {
    errorDiv = <p className="error-message">Error: {error.message}</p>;
  }
  if (data) {
    var { recordcompanies } = data;
  }
  const companies = recordcompanies || [];
  return (
    <div className="artists-list">
      <h2>Companies</h2>
      <button
        className="add-artist"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        Add Company
      </button>
      {showAddForm && (
        <Add type="company" closeAddFormState={closeAddFormState} />
      )}
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
                <div className="buttons">
                  <button
                    className="edit-artist"
                    onClick={() => handleEditCompany(company)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-artist"
                    onClick={() => handleDeleteCompany(company)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
        </>
      )}
      {errorDiv && errorDiv}
    </div>
  );
}

export default Companies;
