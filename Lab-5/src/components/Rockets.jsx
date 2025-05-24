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

function Rockets() {
  const { id } = useParams();
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.spacexdata.com/v4/rockets/query",
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
        <p>No Rocket found.</p>
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
        image={apiData.flickr_images[0] || notFound}
        alt={apiData.name}
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <div variant="body2" color="text.secondary">
          <strong>Type: </strong> {apiData.type}
        </div>
        <div>
          <strong>Active: </strong> {apiData.active ? "Yes" : "No"}
        </div>
        <div>
          <strong>Cost per launch: </strong> {apiData.cost_per_launch} USD
        </div>
        <div>
          <strong>Description: </strong>{" "}
          {apiData.description || "No description available."}
        </div>
        <div>
          <strong>First flight: </strong> {apiData.first_flight || "N/A"}
          <br />
          <strong>Company: </strong> {apiData.company || "N/A"}
          <br />
          <strong>Country: </strong> {apiData.country || "N/A"}
          <br />
          <strong>Dimensions: </strong> {apiData.height?.meters} m x{" "}
          {apiData.diameter?.meters} m x {apiData.mass?.kg} kg
        </div>
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

export default Rockets;
