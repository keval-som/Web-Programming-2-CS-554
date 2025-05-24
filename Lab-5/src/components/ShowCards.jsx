import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import notFound from "../assets/NotFound.png";

function ShowCards({ data, type }) {
  let card = undefined;

  if (type === "launches") {
    card = (
      <Grid key={data.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 300,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea component={Link} to={`/launches/${data.id}`}>
            <CardHeader
              title={
                <Typography gutterBottom variant="h6" component="div">
                  {data.name}
                </Typography>
              }
            />
            <CardMedia
              component="img"
              height="200"
              image={data.links.patch.small ? data.links.patch.small : notFound}
            />
          </CardActionArea>

          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Flight Number: {data.flight_number}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }
  if (type === "payloads") {
    card = (
      <Grid key={data.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 300,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea component={Link} to={`/payloads/${data.id}`}>
            <CardHeader
              title={
                <Typography gutterBottom variant="h6" component="div">
                  {data.name}
                </Typography>
              }
            />
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  if (type === "cores") {
    card = (
      <Grid key={data.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 300,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea component={Link} to={`/cores/${data.id}`}>
            <CardHeader
              title={
                <Typography gutterBottom variant="h6" component="div">
                  {data.serial}
                </Typography>
              }
            />

            {data.launches.length > 0 ? (
              <CardMedia
                component="img"
                height="200"
                image={
                  data.launches[0].links.patch.small
                    ? data.launches[0].links.patch.small
                    : notFound
                }
              />
            ) : (
              <CardMedia component="img" height="200" image={notFound} />
            )}
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  if (type === "rockets") {
    card = (
      <Grid key={data.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 300,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea component={Link} to={`/rockets/${data.id}`}>
            <CardHeader
              title={
                <Typography gutterBottom variant="h6" component="div">
                  {data.name}
                </Typography>
              }
            />
            {data.flickr_images.length > 0 ? (
              <CardMedia
                component="img"
                height="200"
                image={data.flickr_images[0] ? data.flickr_images[0] : notFound}
              />
            ) : (
              <CardMedia component="img" height="200" image={notFound} />
            )}
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  if (type === "ships") {
    card = (
      <Grid key={data.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 300,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea component={Link} to={`/ships/${data.id}`}>
            <CardHeader
              title={
                <Typography gutterBottom variant="h6" component="div">
                  {data.name}
                </Typography>
              }
            />
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  if (type === "launchpads") {
    card = (
      <Grid key={data.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 300,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea component={Link} to={`/launchpads/${data.id}`}>
            <CardHeader
              title={
                <Typography gutterBottom variant="h6" component="div">
                  {data.name}
                </Typography>
              }
            />
            {data.images.large ? (
              <CardMedia
                component="img"
                height="200"
                image={data.images.large ? data.images.large : notFound}
              />
            ) : (
              <CardMedia component="img" height="200" image={notFound} />
            )}
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  return <div>{card}</div>;
}

export default ShowCards;
