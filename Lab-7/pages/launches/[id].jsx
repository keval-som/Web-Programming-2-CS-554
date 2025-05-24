import Link from "next/link";
import axios from "axios";
export default function List(props) {
  return (
    <div className="container">
      <h1>{props.launch.name}</h1>
      <p>Flight Number: {props.launch.flight_number}</p>
      <p>Successful?: {props.launch.success ? "Yes" : "No"}</p>
      <p>Details: {props.launch.details || "No details available."}</p>
      <p>Launch Date: {new Date(props.launch.date_utc).toLocaleString()}</p>
      {props.launch.links?.youtube_id && (
        <div>
          <h3>Watch on YouTube:</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${props.launch.links.youtube_id}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {props.launch.links.wikipedia && (
        <p>
          <a
            href={props.launch.links.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more on Wikipedia
          </a>
        </p>
      )}
      {props.launch.links.article && (
        <p>
          <a
            href={props.launch.links.article}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Article
          </a>
        </p>
      )}
      {props.launch.rocket && (
        <p>
          <Link
            href={`/rockets/${props.launch.rocket.id}`}
            style={{ textDecoration: "none" }}
          >
            Rocket: {props.launch.rocket.name}
          </Link>
        </p>
      )}
      {props.launch.launchpad && (
        <p>
          <Link
            href={`/launchpads/${props.launch.launchpad.id}`}
            style={{ textDecoration: "none" }}
          >
            Launchpad: {props.launch.launchpad.name}
          </Link>
        </p>
      )}
      {props.launch.payloads && props.launch.payloads.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <p>Payloads:</p>
          <ul style={{ paddingLeft: "20px", textAlign: "center" }}>
            {props.launch.payloads.map((payload) => (
              <li key={payload.id}>
                <Link
                  href={`/payloads/${payload.id}`}
                  style={{ textDecoration: "none" }}
                >
                  {payload.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {props.launch.ships && props.launch.ships.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <p>Ships:</p>
          <ul style={{ paddingLeft: "20px", textAlign: "center" }}>
            {props.launch.ships.map((ship) => (
              <li key={ship.id}>
                <Link
                  href={`/ships/${ship.id}`}
                  style={{ textDecoration: "none" }}
                >
                  {ship.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {props.launch.cores && props.launch.cores.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <p>Cores:</p>
          <ul style={{ paddingLeft: "20px", textAlign: "center" }}>
            {props.launch.cores.map((core) => (
              <li key={core.core}>
                <Link
                  href={`/cores/${core.core}`}
                  style={{ textDecoration: "none" }}
                >
                  {core.core}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link href="/" className="btn-primary">
        Go to Home
      </Link>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await axios.post(
    "https://api.spacexdata.com/v4/launches/query",
    {
      query: {
        _id: params.id,
      },
      options: {
        populate: ["payloads", "rocket", "crew", "ships", "launchpad"],
      },
    }
  );
  return {
    props: {
      launch: data.docs[0],
    },
  };
}

export async function getStaticPaths() {
  const { data } = await axios.get(`https://api.spacexdata.com/v4/launches`);
  const paths = data.map((launch) => {
    return {
      params: { id: launch.id.toString() },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
