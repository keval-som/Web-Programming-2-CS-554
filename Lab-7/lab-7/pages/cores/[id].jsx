import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import YouTube from "react-youtube";
export default function coreDetails({ core }) {
  return (
    <div className="container">
      <h2>{core.serial}</h2>
      <div style={{ padding: "16px" }}>
        <p>
          <strong>Status:</strong> {core.status}
        </p>
        <p>
          <strong>Last Update:</strong> {core.last_update}
        </p>
        <p>
          <strong>Reuse Count:</strong> {core.reuse_count}
        </p>
        {core.launches && core.launches.length > 0 && (
          <div>
            <strong>Launches:</strong>
            <ul>
              {core.launches.map((launch) => (
                <li key={launch.id}>
                  <Link
                    href={`/launches/${launch.id}`}
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
      </div>
      <Link href="/" className="btn-primary">
        Go to Home
      </Link>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await axios.post(
    "https://api.spacexdata.com/v4/cores/query",
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
      core: data.docs[0],
    },
  };
}

export async function getStaticPaths() {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/cores`);
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
