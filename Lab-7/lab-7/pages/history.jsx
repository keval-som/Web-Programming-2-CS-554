import Link from "next/link";
function HistoryComponent() {
  return (
    <div
      style={{
        padding: "20px",
        lineHeight: "1.6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2c3e50" }}>
        SpaceX: A Journey Beyond
      </h2>
      <p>
        SpaceX, founded in 2002 by Elon Musk, is a pioneering private aerospace
        manufacturer and space transportation company. Its mission is to reduce
        space transportation costs and enable the colonization of Mars.
      </p>
      <p>
        Over the years, SpaceX has achieved remarkable milestones, including:
      </p>
      <ul style={{ marginLeft: "20px" }}>
        <li>The first privately-funded spacecraft to reach orbit.</li>
        <li>
          The first privately-funded company to dock with the International
          Space Station.
        </li>
        <li>The groundbreaking development of reusable rocket technology.</li>
      </ul>
      <p>
        With its innovative approach and relentless pursuit of excellence,
        SpaceX continues to redefine the boundaries of space exploration and
        inspire humanity to dream bigger.
      </p>
      <Link href="/" className="btn-primary">
        Go to Home
      </Link>
    </div>
  );
}

export default HistoryComponent;
