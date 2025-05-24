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

function Ships() {
  const { id } = useParams();
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.spacexdata.com/v4/ships/query",
          {
            query: {
              _id: id,
            },
            options: {},
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
        <p>No Ship found.</p>
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
        title={apiData.name}
        sx={{
          borderBottom: "1px solid #1e8678",
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#1e8678",
          color: "#fff",
          padding: "16px",
        }}
      />
      <CardMedia
        component="img"
        height="200"
        image={apiData.image || notFound}
        alt={apiData.name}
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <div variant="body2" color="text.secondary">
          <strong>Type: </strong> {apiData.type}
          <br />
          <strong>Active: </strong> {apiData.active ? "Yes" : "No"}
          <br />
          <strong>Home Port: </strong> {apiData.home_port}
          <br />
          <strong>Year Built: </strong> {apiData.year_built}
          <br />
          <strong>Roles: </strong>{" "}
          {apiData.roles && apiData.roles.length > 0 && (
            <ul>
              {apiData.roles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          )}
        </div>
        {apiData.link && (
          <div>
            <a href={apiData.link} target="_blank" rel="noopener noreferrer">
              More Info
            </a>
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

export default Ships;
