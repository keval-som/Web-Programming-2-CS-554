import express from "express";
const router = express.Router();
import { ObjectId } from "mongodb";
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addReply,
  deleteReply,
  getFeed,
} from "../data/posts.js";

const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).json({ message: "User is not authenticated" });
  } else {
    next();
  }
};

router.get("/feed", async (req, res) => {
  let param = req.query.page;
  try {
    let feed = await getFeed(param);
    if (!feed) {
      return res.status(404).json({ error: "There are no more posts" });
    }
    return res.status(200).json(feed);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/posts/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).send(post);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/posts", ensureAuthenticated, async (req, res) => {
  let user = req.session.user;
  let postMood = req.body.postMood;
  let postText = req.body.postText;
  try {
    let post = await createPost(postText, postMood, user);
    return res.status(200).send(post);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.patch("/posts/:id", ensureAuthenticated, async (req, res) => {
  let user = req.session.user;
  let postMood = req.body.postMood;
  let postText = req.body.postText;
  let id = req.params.id;
  if (!postMood && !postText) {
    return res
      .status(400)
      .json({ error: "At least one of postMood or postText must be supplied" });
  }
  try {
    let post = await updatePost(id, postText, postMood, user);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post === "Not authorized") {
      return res
        .status(403)
        .json({ error: "User is not authorized to update this post" });
    }
    return res.status(200).send(post);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.delete("/posts/:id", ensureAuthenticated, async (req, res) => {
  let user = req.session.user;
  let id = req.params.id;
  try {
    let status = await deletePost(id, user);
    if (!status) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (status === "Not authorized") {
      return res
        .status(403)
        .json({ error: "User is not authorized to delete this post" });
    }
    return res.status(200).json({ message: "Post deleted" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/posts/:id/replies", ensureAuthenticated, async (req, res) => {
  let id = req.params.id;
  let user = req.session.user;
  let reply = req.body.reply;
  try {
    let post = await addReply(id, reply, user);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).send(post);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.delete(
  "/posts/:postId/:replyId",
  ensureAuthenticated,
  async (req, res) => {
    let postId = req.params.postId;
    let replyId = req.params.replyId;
    let user = req.session.user;
    try {
      let post = await deleteReply(postId, replyId, user);
      if (!post) {
        return res.status(404).json({ error: "Post or reply not found" });
      }
      if (post === "Not authorized") {
        return res
          .status(403)
          .json({ error: "User is not authorized to delete this reply" });
      }
      return res.status(200).send(post);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
);

router.post("/posts/:id/likes", ensureAuthenticated, async (req, res) => {
  let id = req.params.id;
  let user = req.session.user;
  try {
    let post = await likePost(id, user);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).send(post);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
