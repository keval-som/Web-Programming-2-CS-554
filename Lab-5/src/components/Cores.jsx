import React, { useEffect, useState } from "react";
import { data, Link, useParams } from "react-router-dom";
import notFound from "../assets/NotFound.png";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  CardHeader,
  Typography,
} from "@mui/material";

import axios from "axios";
import YouTube from "react-youtube";

function Cores() {
  const { id } = useParams();
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.spacexdata.com/v4/cores/query",
          {
            query: {
              _id: id,
            },
            options: {
              populate: ["launches"],
            },
          }
        );
        setApiData(response.data.docs[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching launch data:", error);
        setLoading(false);
        setApiData(null);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!apiData) {
    return (
      <div>
        <h2>404</h2>
        <p>No Core found.</p>
      </div>
    );
  }

  let dataCard = (
    <Card
      style={{
        width: 400,
        margin: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
      }}
    >
      <CardHeader
        title={apiData.serial}
        sx={{
          borderBottom: "1px solid #1e8678",
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#1e8678",
          color: "#fff",
          padding: "16px",
        }}
      />
      <CardContent>
        <div variant="body2" color="text.secondary">
          <strong>Status: </strong> {apiData.status}
        </div>
        <div variant="body2" color="text.secondary">
          <strong>Last Update: </strong> {apiData.last_update}
        </div>
        <div variant="body2" color="text.secondary">
          <strong>Reuse Count: </strong> {apiData.reuse_count}
        </div>
        {apiData.launches && apiData.launches.length > 0 && (
          <div variant="body2" color="text.secondary">
            <strong>Launches:</strong>
            <ul>
              {apiData.launches.map((launch) => (
                <li key={launch.id}>
                  <Link
                    to={`/launches/${launch.id}`}
                    style={{
                      textDecoration: "none",
                      color: "#1e8678",
                      fontWeight: "bold",
                    }}
                  >
                    {launch.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            marginRight: "8px",
          }}
        >
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#1e8678",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Home
          </button>
        </Link>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1e8678",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
      <Grid key={apiData.id}>{dataCard}</Grid>
    </div>
  );
}

export default Cores;
