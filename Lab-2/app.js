import express from "express";
import constructorMethod from "./routes/index.js";
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/pokemon", async (req, res, next) => {
  if (req.originalUrl === "/api/pokemon") {
    let exists = await client.get("pokemonHome");
    if (exists) {
      console.log("Cache hit");
      return res.status(200).json(JSON.parse(exists));
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use("/api/pokemon/:id", async (req, res, next) => {
  let exists = await client.get(req.originalUrl);
  if (exists) {
    console.log("Cache hit");

    let history = JSON.parse(exists);
    await client.rPush("history", JSON.stringify(history));

    return res.status(200).json(history);
  } else {
    next();
  }
});

app.use("/api/move", async (req, res, next) => {
  let exists = await client.get(req.originalUrl);
  if (exists) {
    console.log("Cache hit");
    return res.status(200).json(JSON.parse(exists));
  } else {
    next();
  }
});

app.use("/api/move/:id", async (req, res, next) => {
  let exists = await client.get(req.originalUrl);
  if (exists) {
    console.log("Cache hit");
    return res.status(200).json(JSON.parse(exists));
  } else {
    next();
  }
});

app.use("/api/item", async (req, res, next) => {
  let exists = await client.get(req.originalUrl);
  if (exists) {
    console.log("Cache hit");
    return res.status(200).json(JSON.parse(exists));
  } else {
    next();
  }
});

app.use("/api/item/:id", async (req, res, next) => {
  let exists = await client.get(req.originalUrl);
  if (exists) {
    console.log("Cache hit");
    return res.status(200).json(JSON.parse(exists));
  } else {
    next();
  }
});

constructorMethod(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
