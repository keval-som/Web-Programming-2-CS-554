import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import YouTube from "react-youtube";
export default function rocketDetails({ rocket }) {
  return (
    <div className="container">
      <h2>{rocket.name}</h2>
      <img
        src={rocket.flickr_images[0] || "/not-found.png"}
        alt={rocket.name}
        style={{
          width: "50%",
          height: "50%",
          objectFit: "cover",
        }}
      />
      <div style={{ padding: "16px" }}>
        <div>
          <strong>Type: </strong> {rocket.type}
        </div>
        <div>
          <strong>Active: </strong> {rocket.active ? "Yes" : "No"}
        </div>
        <div>
          <strong>Cost per launch: </strong> {rocket.cost_per_launch} USD
        </div>
        <div>
          <strong>Description: </strong>{" "}
          {rocket.description || "No description available."}
        </div>
        <div>
          <strong>First flight: </strong> {rocket.first_flight || "N/A"}
          <br />
          <strong>Company: </strong> {rocket.company || "N/A"}
          <br />
          <strong>Country: </strong> {rocket.country || "N/A"}
          <br />
          <strong>Dimensions: </strong> {rocket.height?.meters} m x{" "}
          {rocket.diameter?.meters} m x {rocket.mass?.kg} kg
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "16px" }}>
        <Link href="/" className="btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await axios.post(
    "https://api.spacexdata.com/v4/rockets/query",
    {
      query: {
        _id: params.id,
      },
      options: {},
    }
  );
  return {
    props: {
      rocket: data.docs[0],
    },
  };
}

export async function getStaticPaths() {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/rockets`);
  const paths = data.map((rocket) => {
    return {
      params: { id: rocket.id.toString() },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
