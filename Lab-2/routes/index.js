import pokeRoutes from "./pokemon.js";

const constructorMethod = (app) => {
  app.use("/", pokeRoutes);
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
