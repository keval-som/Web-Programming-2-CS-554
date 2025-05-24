import express from "express";
import * as usersData from "../data/users.js";
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.status(200).json({ message: "User is authenticated" });
  } else {
    next();
  }
};

router.post("/login", ensureAuthenticated, async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await usersData.loginUser(username, password);
    if (user.signInCompleted === false) {
      return res
        .status(400)
        .json({ error: "Either the userId or password is invalid" });
    } else {
      req.session.user = {
        username: user.username,
        _id: user._id,
      };
    }

    return res
      .status(200)
      .send({ username: user.username, name: user.name, _id: user._id });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/signup", ensureAuthenticated, async (req, res) => {
  try {
    const { username, name, password } = req.body;
    let users = await usersData.createUser(username, password, name);
    return res.status(200).send(users);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ error: "User is not logged in" });
  }
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ error: "Error logging out" });
    }
    return res.status(200).json({ message: "User has been logged out" });
  });
});

export default router;
