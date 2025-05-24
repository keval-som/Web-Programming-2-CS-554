import Link from "next/link";

function Company() {
  return (
    <>
      <h1>SpaceX</h1>
      <p>
        Space Exploration Technologies Corp., commonly referred to as SpaceX, is
        an American space technology company headquartered at the Starbase
        development site near Brownsville, Texas. Since its founding in 2002,
        the company has made numerous advancements in rocket propulsion,
        reusable launch vehicles, human spaceflight and satellite constellation
        technology. As of 2024, SpaceX is the world's dominant space launch
        provider, its launch cadence eclipsing all others, including private
        competitors and national programs like the Chinese space program.
        SpaceX, NASA, and the United States Armed Forces work closely together
        by means of governmental contracts.
      </p>
      <Link href="/" className="btn-primary">
        Go to Home
      </Link>
    </>
  );
}

export default Company;
