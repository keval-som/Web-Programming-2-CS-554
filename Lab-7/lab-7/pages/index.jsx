import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          Welcome to SpaceX Launches
        </h1>
        <p className="mt-4">
          This site is dedicated to providing information about SpaceX, its
          missions, and its groundbreaking achievements in space exploration. We
          utilize the SpaceX API to fetch and display real-time data about
          launches, rockets, and more.
        </p>
        <div>
          <Link href="/history" className="btn-primary">
            Go to History Page
          </Link>
          <Link href="/company" className="btn-primary">
            Go to Company Page
          </Link>
        </div>
        <div>
          <Link href="/launches/page/0" className="btn-primary">
            Go to Launches Listing
          </Link>
          <Link href="/payloads/page/0" className="btn-primary">
            Go to Payloads Listing
          </Link>
          <Link href="/cores/page/0" className="btn-primary">
            Go to Cores Listing
          </Link>
          <Link href="/rockets/page/0" className="btn-primary">
            Go to Rockets Listing
          </Link>
          <Link href="/ships/page/0" className="btn-primary">
            Go to Ships Listing
          </Link>
          <Link href="/launchpads/page/0" className="btn-primary">
            Go to Launch Pads Listing
          </Link>
        </div>
      </div>
    </>
  );
}
