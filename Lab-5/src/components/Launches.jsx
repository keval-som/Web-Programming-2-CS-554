import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const Launches = (props) => {
  const { id } = useParams();
  const [launch, setLaunch] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunch = async () => {
      try {
        const response = await axios.post(
          "https://api.spacexdata.com/v4/launches/query",
          {
            query: {
              _id: id,
            },
            options: {
              populate: ["payloads", "rocket", "crew", "ships", "launchpad"],
            },
          }
        );
        setLaunch(response.data.docs[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching launch data:", error);
        setLoading(false);
        setLaunch(null);
      }
    };
    fetchLaunch();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!launch) {
    return (
      <div>
        <h2>404</h2>
        <p>No launch found.</p>
      </div>
    );
  }

  let LaunchCard = (
    <Card style={{ maxWidth: 400 }}>
      <CardHeader
        title={launch.name}
        sx={{
          borderBottom: "1px solid #1e8678",
          fontWeight: "bold",
        }}
      />
      <CardMedia
        component="img"
        height="200"
        image={launch.links.patch.small ? launch.links.patch.small : notFound}
        style={{ objectFit: "contain" }}
      />
      <CardContent>
        <Typography variant="body1" align="center">
          Flight Number: {launch.flight_number}
        </Typography>
        <Typography variant="body1" align="center">
          Successful?: {launch.success ? "Yes" : "No"}
        </Typography>
        <Typography variant="body2" align="center">
          Details: {launch.details || "No details available."}
        </Typography>
        <Typography variant="body2" align="center">
          Launch Date: {new Date(launch.date_utc).toLocaleString()}
        </Typography>
        {launch.links.youtube_id && (
          <YouTube
            videoId={launch.links.youtube_id}
            opts={{ width: "100%", height: "200" }}
          />
        )}
        {launch.links.wikipedia && (
          <Typography variant="body2" align="center">
            <a
              href={launch.links.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more on Wikipedia
            </a>
          </Typography>
        )}
        {launch.links.article && (
          <Typography variant="body2" align="center">
            <a
              href={launch.links.article}
              target="_blank"
              rel="noopener noreferrer"
            >
              Article
            </a>
          </Typography>
        )}
        {launch.rocket && (
          <Typography variant="body2" align="center">
            <Link
              to={`/rockets/${launch.rocket.id}`}
              style={{ textDecoration: "none" }}
            >
              Rocket: {launch.rocket.name}
            </Link>
          </Typography>
        )}
        {launch.launchpad && (
          <Typography variant="body2" align="center">
            <Link
              to={`/launchpads/${launch.launchpad.id}`}
              style={{ textDecoration: "none" }}
            >
              Launchpad: {launch.launchpad.name}
            </Link>
          </Typography>
        )}
        {launch.payloads && launch.payloads.length > 0 && (
          <div style={{ textAlign: "center" }}>
            <Typography variant="body2">Payloads:</Typography>
            <ul style={{ paddingLeft: "20px", textAlign: "center" }}>
              {launch.payloads.map((payload) => (
                <li key={payload.id}>
                  <Link
                    to={`/payloads/${payload.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {payload.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {launch.ships && launch.ships.length > 0 && (
          <div style={{ textAlign: "center" }}>
            <Typography variant="body2">Ships:</Typography>
            <ul style={{ paddingLeft: "20px", textAlign: "center" }}>
              {launch.ships.map((ship) => (
                <li key={ship.id}>
                  <Link
                    to={`/ships/${ship.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {ship.name}
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
      <Grid key={launch.id}>{LaunchCard}</Grid>
    </div>
  );
};

export default Launches;
