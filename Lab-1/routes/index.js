import authRoutes from "./auth_routes.js";
import postRoutes from "./post_routes.js";

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/", postRoutes);
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
