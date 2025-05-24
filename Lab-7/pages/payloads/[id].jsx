import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import YouTube from "react-youtube";
export default function PayloadDetails({ payload }) {
  return (
    <div className="container">
      <h2>{payload.name}</h2>
      <div style={{ padding: "16px" }}>
        {payload.type && (
          <p>
            <strong>Type:</strong> {payload.type}
          </p>
        )}
        {payload.customers && payload.customers.length > 0 && (
          <div>
            <strong>Customers:</strong>
            <ul>
              {payload.customers.map((customer, index) => (
                <li key={index}>{customer}</li>
              ))}
            </ul>
          </div>
        )}
        {payload.nationalities && payload.nationalities.length > 0 && (
          <div>
            <strong>Nationalities:</strong>
            <ul>
              {payload.nationalities.map((nation, index) => (
                <li key={index}>{nation}</li>
              ))}
            </ul>
          </div>
        )}
        {payload.manufacturers && payload.manufacturers.length > 0 && (
          <div>
            <strong>Manufacturers:</strong>
            <ul>
              {payload.manufacturers.map((manufacturer, index) => (
                <li key={index}>{manufacturer}</li>
              ))}
            </ul>
          </div>
        )}
        {payload.launch && payload.launch.links.youtube_id && (
          <div style={{ marginTop: "16px" }}>
            <iframe
              height="200"
              src={`https://www.youtube.com/embed/${payload.launch.links.youtube_id}`}
              allowFullScreen
              title="Launch Video"
            ></iframe>
          </div>
        )}
        {payload.orbit && (
          <p>
            <strong>Orbit:</strong> {payload.orbit}
          </p>
        )}
        {payload.mass_lbs && (
          <p>
            <strong>Mass:</strong> {payload.mass_lbs} lbs
          </p>
        )}
        {payload.launch && (
          <p>
            <strong>Launch:</strong>{" "}
            <a
              href={`/launches/${payload.launch.id}`}
              style={{
                textDecoration: "none",
                color: "#1e8678",
                fontWeight: "bold",
              }}
            >
              {payload.launch.name}
            </a>
          </p>
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
    "https://api.spacexdata.com/v4/payloads/query",
    {
      query: {
        _id: params.id,
      },
      options: {
        populate: ["launch"],
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
  const { data } = await axios.get(`https://api.spacexdata.com/v4/payloads`);
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
