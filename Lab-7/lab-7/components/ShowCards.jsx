import React from "react";
import Link from "next/link";
import Image from "next/image";
import notFound from "../public/NotFound.png";

function ShowCards({ data, type }) {
  let card = undefined;

  if (type === "launches") {
    card = (
      <div key={data.id} className="card-container">
        <a href={`/launches/${data.id}`} className="card-link">
          <div className="card-header">
            <h6 className="card-title">{data.name}</h6>
          </div>
          <div className="card-media">
            <Image
              src={data.links?.patch?.small ? data.links.patch.small : notFound}
              width={200}
              height={200}
              alt={data.name}
              className="card-image"
            />
          </div>
        </a>
        <div className="card-content">
          <p className="card-text">Flight Number: {data.flight_number}</p>
        </div>
      </div>
    );
  }
  if (type === "payloads") {
    card = (
      <div key={data.id} className="card-container">
        <a href={`/payloads/${data.id}`} className="card-link">
          <div className="card-header">
            <h6 className="card-title">{data.name}</h6>
          </div>
        </a>
      </div>
    );
  }

  if (type === "cores") {
    card = (
      <div key={data.id} className="card-container">
        <a href={`/cores/${data.id}`} className="card-link">
          <div className="card-header">
            <h6 className="card-title">{data.serial}</h6>
          </div>
          <div className="card-media">
            <Image
              src={
                data.launches.length > 0 && data.launches[0].links.patch.small
                  ? data.launches[0].links.patch.small
                  : notFound
              }
              width={200}
              height={200}
              alt={data.serial}
              className="card-image"
            />
          </div>
        </a>
      </div>
    );
  }

  if (type === "rockets") {
    card = (
      <div key={data.id} className="card-container">
        <a href={`/rockets/${data.id}`} className="card-link">
          <div className="card-header">
            <h6 className="card-title">{data.name}</h6>
          </div>
          <div className="card-media">
            <Image
              src={
                data.flickr_images.length > 0 ? data.flickr_images[0] : notFound
              }
              width={200}
              height={200}
              alt={data.name}
              className="card-image"
            />
          </div>
        </a>
      </div>
    );
  }

  if (type === "ships") {
    card = (
      <div key={data.id} className="card-container">
        <a href={`/ships/${data.id}`} className="card-link">
          <div className="card-header">
            <h6 className="card-title">{data.name}</h6>
          </div>
        </a>
      </div>
    );
  }

  if (type === "launchpads") {
    card = (
      <div key={data.id} className="card-container">
        <a href={`/launchpads/${data.id}`} className="card-link">
          <div className="card-header">
            <h6 className="card-title">{data.name}</h6>
          </div>
          <div className="card-media">
            <Image
              src={data.images.large[0] ? data.images.large[0] : notFound}
              width={200}
              height={200}
              alt={data.name}
              className="card-image"
            />
          </div>
        </a>
      </div>
    );
  }

  return <div>{card}</div>;
}

export default ShowCards;
