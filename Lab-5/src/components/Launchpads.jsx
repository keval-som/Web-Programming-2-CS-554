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

function LaunchPads() {
  const { id } = useParams();
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.spacexdata.com/v4/launchpads/query",
          {
            query: {
              _id: id,
            },
            options: { populate: ["rockets", "launches"] },
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
        <p>No Launchpad found.</p>
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
        image={apiData.images.large || notFound}
        alt={apiData.name}
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <div variant="body2" color="text.secondary">
          <strong>Full Name: </strong> {apiData.full_name}
          <br />
          <strong>Detail: </strong> {apiData.details}
          <br />
          <strong>Loacality: </strong> {apiData.locality}
          <br />
          <strong>Region: </strong> {apiData.region}
          <br />
          <strong>Launch attempts: </strong> {apiData.launch_attempts}
          <br />
          <strong>Launch successes: </strong> {apiData.launch_successes}
          <br />
          <strong>Status: </strong> {apiData.status}
          <br />
          <strong>Rockets:</strong>
          {apiData.rockets && apiData.rockets.length > 0 ? (
            <ul>
              {apiData.rockets.map((rocket) => (
                <li key={rocket.id}>
                  <Link
                    to={`/rockets/${rocket.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {rocket.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rockets available.</p>
          )}
          <br />
          <strong>Launches:</strong>
          {apiData.launches.length > 0 ? (
            <ul>
              {apiData.launches.map((launch) => (
                <li key={launch.id}>
                  <Link
                    to={`/launches/${launch.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {launch.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No launches available.</p>
          )}
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

export default LaunchPads;
