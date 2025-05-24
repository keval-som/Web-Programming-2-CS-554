import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ShowCards from "./ShowCards";
import axios from "axios";

const ListData = (props) => {
  const [launchData, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  let { page } = useParams();
  let cards = undefined;
  let type = props.type;

  useEffect(() => {
    if (!searchTerm) {
      async function fetchLaunches() {
        try {
          let url = `https://api.spacexdata.com/v4/${type}/query`;
          let options = {
            page: page,
            limit: 10,
          };
          let query = {};
          if (type === "cores") {
            options.populate = ["launches"];
          }
          const response = await axios.post(url, {
            query,
            options,
          });
          const data = await response.data.docs;
          setLaunches(data);
          setLoading(false);
          setHasNextPage(response.data.hasNextPage);
          setHasPreviousPage(response.data.hasPrevPage);
        } catch (error) {
          console.error("Error fetching launches:", error);
        }
      }
      fetchLaunches();
    }
  }, [page, searchTerm]);

  useEffect(() => {
    async function fetchSearchData() {
      try {
        let url = `https://api.spacexdata.com/v4/${type}/query`;
        let options = {
          page: page,
          limit: 10,
        };
        let query = {
          name: { $regex: searchTerm, $options: "i" },
        };
        if (type === "cores") {
          options.populate = ["launches"];
          query = {
            serial: { $regex: searchTerm, $options: "i" },
          };
        }
        const response = await axios.post(url, {
          query,
          options,
        });
        const data = await response.data.docs;
        setLaunches(data);
        setLoading(false);
        setHasNextPage(response.data.hasNextPage);
        setHasPreviousPage(response.data.hasPrevPage);
      } catch (error) {
        console.error("Error fetching launches:", error);
      }
    }
    if (searchTerm) {
      fetchSearchData();
    }
  }, [searchTerm, page]);

  if (isNaN(page) || parseInt(page) <= 0) {
    return (
      <div>
        <h2>400</h2>
        <p>Invalid page number.</p>
      </div>
    );
  }

  cards = launchData.map((launch) => {
    return <ShowCards key={launch.id} data={launch} type={type} />;
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (launchData.length === 0 && !searchTerm) {
    return (
      <div>
        <h2>404</h2>
        <p>No {type} found.</p>
      </div>
    );
  } else {
    return (
      <>
        <h1>{type}</h1>
        {(type === "launches" || type === "payloads" || type === "cores") && (
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              display: "block",
              margin: "0 auto 16px",
              padding: "8px",
              width: "50%",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {cards}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          {hasPreviousPage && (
            <Link
              to={`/${type}/page/${parseInt(page) - 1}`}
              style={{ textDecoration: "none", marginRight: "8px" }}
            >
              <button className="btn-primary">Previous</button>
            </Link>
          )}
          {hasNextPage && (
            <Link
              to={`/${type}/page/${parseInt(page) + 1}`}
              style={{ textDecoration: "none", marginLeft: "8px" }}
            >
              <button className="btn-primary">Next</button>
            </Link>
          )}
        </div>
      </>
    );
  }
};

export default ListData;
