import { strCheck, isValidId } from "../helpers.js";
import { ObjectId } from "mongodb";

import { users, posts } from "../config/mongoCollections.js";
import moment from "moment";
const validMoods = [
  "Happy",
  "Sad",
  "Angry",
  "Excited",
  "Surprised",
  "Loved",
  "Blessed",
  "Greatful",
  "Blissful",
  "Silly",
  "Chill",
  "Motivated",
  "Emotional",
  "Annoyed",
  "Lucky",
  "Determined",
  "Bored",
  "Hungry",
  "Disappointed",
  "Worried",
  "Embarrassed",
  "Playful",
  "Anxious",
  "Joyful",
  "Proud",
  "Lazy",
  "Sleepy",
  "Uneasy",
  "Scared",
];

export const createPost = async (postTextReq, postMoodReq, user) => {
  let postText = strCheck(postTextReq, "postText");
  if (postText.length < 5 || postText.length > 255) {
    throw new Error("Post text must be between 5 and 255 characters");
  }
  let postMood = strCheck(postMoodReq, "postMood");

  const validMood = validMoods.find(
    (mood) => mood.toLowerCase() === postMood.toLowerCase()
  );
  if (!validMood) {
    throw new Error("Invalid mood supplied");
  }
  user._id = new ObjectId(user._id);
  postMood = validMood;
  let postCollection = await posts();
  let newPost = {
    postText: postText,
    postMood: postMood,
    userThatPosted: user,
    postDateTime: moment().format("MM/DD/YYYY hh:mmA"),
    replies: [],
    likes: [],
  };

  const insertInfo = await postCollection.insertOne(newPost);
  if (insertInfo.insertedCount === 0) throw new Error("Could not add post");
  const newId = insertInfo.insertedId;
  let post = await postCollection.findOne({ _id: new ObjectId(newId) });
  return post;
};

export const getPostById = async (id) => {
  isValidId(id);
  id = id.trim();
  let postCollection = await posts();
  try {
    let post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return post;
  } catch (e) {
    throw "Error occured while fetching post";
  }
};

export const updatePost = async (id, postTextReq, postMoodReq, user) => {
  let postText;
  if (postTextReq) {
    postText = strCheck(postTextReq, "postText");
    if (postText.length < 5 || postText.length > 255) {
      throw new Error("Post text must be between 5 and 255 characters");
    }
  }
  let postMood;
  if (postMoodReq) {
    postMood = strCheck(postMoodReq, "postMood");
    const validMood = validMoods.find(
      (mood) => mood.toLowerCase() === postMood.toLowerCase()
    );
    if (!validMood) {
      throw new Error("Invalid mood supplied");
    }
    postMood = validMood;
  }
  isValidId(id);
  id = id.trim();
  let postCollection = await posts();
  try {
    let post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    if (post.userThatPosted._id.toString() !== user._id.toString()) {
      return "Not authorized";
    }
    post.postText = postText || post.postText;
    post.postMood = postMood || post.postMood;
    post.postDateTime = moment().format("MM/DD/YYYY hh:mmA");
    const updatedInfo = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post }
    );
    // if (updatedInfo.modifiedCount === 0) {
    //   throw new Error("Could not update post successfully");
    // }
    post = await postCollection.findOne({ _id: new ObjectId(id) });
    return post;
  } catch (e) {
    throw new Error("Error occured while fetching post");
  }
};

export const deletePost = async (id, user) => {
  isValidId(id);
  id = id.trim();
  let postCollection = await posts();
  try {
    let post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    if (post.userThatPosted._id.toString() !== user._id.toString()) {
      return "Not authorized";
    }
    const deletionInfo = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletionInfo.deletedCount === 0) {
      throw new Error("Could not delete post successfully");
    }
    return { postDeleted: true };
  } catch (e) {
    throw new Error("Error occured while deleting post");
  }
};

export const likePost = async (id, user) => {
  isValidId(id);
  id = id.trim();
  let postCollection = await posts();
  try {
    let post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    let likes = post.likes;
    if (likes.includes(user._id.toString())) {
      likes = likes.filter((like) => like !== user._id.toString());
    } else {
      likes.push(user._id.toString());
    }
    post.likes = likes;
    const updatedInfo = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post }
    );
    return { postLiked: true };
  } catch (e) {
    throw new Error("Error occured while liking post");
  }
};

export const addReply = async (id, reply, user) => {
  isValidId(id);
  id = id.trim();
  reply = strCheck(reply, "reply");
  if (reply.length < 15 || reply.length > 255) {
    throw new Error("Reply must be between 15 and 255 characters");
  }
  let postCollection = await posts();
  try {
    let post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    user._id = new ObjectId(user._id);
    let replyObj = {
      _id: new ObjectId(),
      userThatPostedReply: user,
      reply: reply,
      replyDateTime: moment().format("MM/DD/YYYY hh:mmA"),
    }
    post.replies.push(replyObj);
    const updatedInfo = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post }
    );
    return post;
  } catch (e) {
    throw new Error("Error occured while adding reply");
  }
};

export const deleteReply = async (postId, replyId, user) => {
  isValidId(postId);
  postId = postId.trim();
  isValidId(replyId);
  replyId = replyId.trim();
  let postCollection = await posts();
  try {
    let post = await postCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return null;
    }
    let replies = post.replies;
    let reply = replies.find((reply) => reply._id.toString() === replyId);
    if (!reply) {
      return null;
    }
    if (reply.userThatPostedReply._id.toString() !== user._id.toString()) {
      return "Not authorized";
    }
    replies = replies.filter((reply) => reply._id.toString() !== replyId);
    post.replies = replies;
    const updatedInfo = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: post }
    );
    return post;
  } catch (e) {
    throw new Error("Error occured while deleting reply");
  }
};

export const getFeed = async (page) => { 
  if(!page) {
    page = 1;
  }
  page = Number(page);
  if(typeof page !== "number") {
    throw new Error("Page must be a number");
  }
  if (!Number.isInteger(page)) {
    throw new Error("Page must be an integer");
  }
  if(page < 1) {
    throw new Error("Page must be a positive number");
  }
  let postCollection = await posts();
  try {
    let feed = await postCollection.find().skip((page - 1) * 50).limit(50).toArray();
    if(!feed || feed.length === 0) {
      return null;
    }

    return feed;
  } catch (e) {
    throw new Error("Error occured while fetching feed");
  }
};
