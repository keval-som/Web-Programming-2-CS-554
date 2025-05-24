import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import YouTube from "react-youtube";
export default function PayloadDetails({ payload }) {
  return (
    <div className="container">
      <h2>{payload.name}</h2>
      <img
        src={payload.image || "/not-found.png"}
        alt={payload.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <div style={{ padding: "16px" }}>
        <p>
          <strong>Type: </strong> {payload.type}
        </p>
        <p>
          <strong>Active: </strong> {payload.active ? "Yes" : "No"}
        </p>
        <p>
          <strong>Home Port: </strong> {payload.home_port}
        </p>
        <p>
          <strong>Year Built: </strong> {payload.year_built}
        </p>
        <p>
          <strong>Roles: </strong>{" "}
        </p>
        {payload.roles && payload.roles.length > 0 && (
          <ul>
            {payload.roles.map((role, index) => (
              <li key={index}>{role}</li>
            ))}
          </ul>
        )}

        {payload.link && (
          <p>
            <a href={payload.link} target="_blank" rel="noopener noreferrer">
              More Info
            </a>
          </p>
        )}
        {payload.launches && payload.launches.length > 0 && (
          <div>
            <strong>Launches:</strong>
            <ul>
              {payload.launches.map((launch, index) => (
                <li key={index}>
                  <Link href={`/launches/${launch.id}`}>{launch.name}</Link>
                </li>
              ))}
            </ul>
          </div>
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
    "https://api.spacexdata.com/v4/ships/query",
    {
      query: {
        _id: params.id,
      },
      options: {
        populate: ["launches"],
      },
    }
  );
  return {
    props: {
      payload: data.docs[0],
    },
  };
}

export async function getStaticPaths() {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/ships`);
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
