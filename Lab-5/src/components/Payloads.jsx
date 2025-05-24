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

function Payloads() {
  const { id } = useParams();
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.spacexdata.com/v4/payloads/query",
          {
            query: {
              _id: id,
            },
            options: {
              populate: ["launch"],
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
        <p>No payload found.</p>
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
      <CardContent>
        {apiData.type && (
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ marginBottom: "8px" }}
          >
            <strong>Type:</strong> {apiData.type}
          </Typography>
        )}
        {apiData.customers && apiData.customers.length > 0 && (
          <div variant="body2" color="text.secondary">
            <strong>Customers:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
              {apiData.customers.map((customer, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {customer}
                </li>
              ))}
            </ul>
          </div>
        )}
        {apiData.nationalities && apiData.nationalities.length > 0 && (
          <div variant="body2" color="text.secondary">
            <strong>Nationalities:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
              {apiData.nationalities.map((nation, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {nation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {apiData.manufacturers && apiData.manufacturers.length > 0 && (
          <div variant="body2" color="text.secondary">
            <strong>Manufacturers:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
              {apiData.manufacturers.map((manufacturer, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {manufacturer}
                </li>
              ))}
            </ul>
          </div>
        )}

        {apiData.launch && apiData.launch.links.youtube_id && (
          <div style={{ marginTop: "16px" }}>
            <YouTube
              videoId={apiData.launch.links.youtube_id}
              opts={{
                width: "100%",
                height: "200",
              }}
            />
          </div>
        )}

        {apiData.orbit && (
          <Typography variant="body2" color="text.secondary">
            <strong>Orbit:</strong> {apiData.orbit}
          </Typography>
        )}

        {apiData.mass_lbs && (
          <Typography variant="body2" color="text.secondary">
            <strong>Mass:</strong> {apiData.mass_lbs} lbs
          </Typography>
        )}

        {apiData.launch && (
          <Typography variant="body2" color="text.secondary">
            <strong>Launch:</strong>{" "}
            <Link
              to={`/launches/${apiData.launch.id}`}
              style={{
                textDecoration: "none",
                color: "#1e8678",
                fontWeight: "bold",
              }}
            >
              {apiData.launch.name}
            </Link>
          </Typography>
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

export default Payloads;
