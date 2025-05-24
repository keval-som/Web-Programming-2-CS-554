import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import YouTube from "react-youtube";
import Image from "next/image";
const notFound = "/NotFound.png";

export default function LaunchpadDetails({ launchpad }) {
  return (
    <div className="container">
      <h2>{launchpad.name}</h2>
      <Image
        src={launchpad.images.large[0] || notFound}
        alt={launchpad.name}
        width={200}
        height={200}
      />
      <div style={{ padding: "16px" }}>
        <p>
          <strong>Full Name: </strong> {launchpad.full_name}
        </p>
        <p>
          <strong>Detail: </strong> {launchpad.details}
        </p>
        <p>
          <strong>Locality: </strong> {launchpad.locality}
        </p>
        <p>
          <strong>Region: </strong> {launchpad.region}
        </p>
        <p>
          <strong>Launch attempts: </strong> {launchpad.launch_attempts}
        </p>
        <p>
          <strong>Launch successes: </strong> {launchpad.launch_successes}
        </p>
        <p>
          <strong>Status: </strong> {launchpad.status}
        </p>
        <p>
          <strong>Rockets:</strong>
        </p>
        {launchpad.rockets && launchpad.rockets.length > 0 ? (
          <ul>
            {launchpad.rockets.map((rocket) => (
              <li key={rocket.id}>
                <Link
                  href={`/rockets/${rocket.id}`}
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
        <p>
          <strong>Launches:</strong>
        </p>
        {launchpad.launches.length > 0 ? (
          <ul>
            {launchpad.launches.map((launch) => (
              <li key={launch.id}>
                <Link
                  href={`/launches/${launch.id}`}
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
      <Link href="/" className="btn-primary">
        Go to Home
      </Link>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await axios.post(
    "https://api.spacexdata.com/v4/launchpads/query",
    {
      query: {
        _id: params.id,
      },
      options: {
        populate: ["rockets", "launches"],
      },
    }
  );
  return {
    props: {
      launchpad: data.docs[0],
    },
  };
}

export async function getStaticPaths() {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/launchpads`);
  const paths = data.map((payload) => {
    return {
      params: { id: payload.id.toString() },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
