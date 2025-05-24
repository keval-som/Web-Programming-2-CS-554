import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import {
  strCheck,
  validateName,
  validatePassword,
  validateUsername,
} from "../helpers.js";

export const createUser = async (username, password, name) => {
  name = strCheck(name, "name");
  validateName(name);
  username = strCheck(username, "username");
  validateUsername(username);
  username = username.toLowerCase();
  password = strCheck(password, "password");
  validatePassword(password);

  let userCollection = await users();
  let userCount = 0;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username: username,
    password: hashedPassword,
    name: name,
  };
  try {
    userCount = await userCollection.count({ username: username });
    if (userCount > 0) {
      throw new Error("Username already exists");
    }
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw new Error("Could not add user");
    const newId = insertInfo.insertedId;
    const user = await userCollection.findOne(
      { _id: new ObjectId(newId) },
      { projection: { password: 0 } }
    );
    return user;
  } catch (e) {
    throw e;
  }
};

export const loginUser = async (username, password) => {
  username = strCheck(username, "username");
  validateUsername(username);
  username = username.toLowerCase();
  password = strCheck(password, "password");

  let userCollection = await users();
  let user;
  try {
    user = await userCollection.findOne({ username });
  } catch (e) {
    return { signInCompleted: false };
  }
  if (!user) {
    throw new Error("Either the userId or password is invalid");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Either the userId or password is invalid");
  }
  return {
    signInCompleted: true,
    username: user.username,
    name: user.name,
    _id: user._id,
  };
};
