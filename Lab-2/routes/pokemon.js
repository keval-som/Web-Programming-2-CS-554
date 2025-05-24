import express from "express";
const router = express.Router();
import axios from "axios";
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

router.get("/api/pokemon", async (req, res) => {
  try {
    let response;
    try {
      response = await axios.get("https://pokeapi.co/api/v2/pokemon");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: "Pokemon not found" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    if (!response.data) {
      return res.status(404).json({ error: "Not found" });
    }
    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ error: "Response Not found" });
    }
    let results = response.data;
    await client.set("pokemonHome", JSON.stringify(results));

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/api/pokemon/history", async (req, res) => {
  try {
    let history = await client.lRange("history", -25, -1);
    history = history.map((item) => JSON.parse(item));

    return res.status(200).json(history);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
export default router;

router.get("/api/pokemon/:id", async (req, res) => {
  try {
    let response;
    try {
      response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: "Pokemon not found" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    if (!response.data) {
      return res.status(404).json({ error: "Not found" });
    }
    let results = response.data;
    await client.set(req.originalUrl, JSON.stringify(results));

    let history = JSON.stringify(results);
    await client.rPush("history", history);

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/api/move", async (req, res) => {
  try {
    let response;
    try {
      response = await axios.get("https://pokeapi.co/api/v2/move");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: "Move not found" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    if (!response.data) {
      return res.status(404).json({ error: "Not found" });
    }
    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ error: "Response Not found" });
    }

    let results = response.data;

    await client.set(req.originalUrl, JSON.stringify(results));

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/api/move/:id", async (req, res) => {
  try {
    let response;
    try {
      response = await axios.get(
        `https://pokeapi.co/api/v2/move/${req.params.id}`
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: "Move not found" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    if (!response.data) {
      return res.status(404).json({ error: "Not found" });
    }
    let results = response.data;
    await client.set(req.originalUrl, JSON.stringify(results));

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/api/item", async (req, res) => {
  try {
    let response;
    try {
      response = await axios.get("https://pokeapi.co/api/v2/item");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: "Item not found" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    if (!response.data) {
      return res.status(404).json({ error: "Not found" });
    }
    let results = response.data;
    await client.set(req.originalUrl, JSON.stringify(results));

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/api/item/:id", async (req, res) => {
  try {
    let response;
    try {
      response = await axios.get(
        `https://pokeapi.co/api/v2/item/${req.params.id}`
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: "Item not found" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    if (!response.data) {
      return res.status(404).json({ error: "Not found" });
    }
    let results = response.data;
    await client.set(req.originalUrl, JSON.stringify(results));
    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
