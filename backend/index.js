import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(cors('*'));
app.use(express.json());

const mongoURL = process.env.NODE_ENV === 'test' 
  ? "mongodb://localhost:27017/recipes_test" 
  : "mongodb://mongo:27017/recipes";

mongoose.connect(mongoURL)
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

const recipeSchema = mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  cookingTime: Number,
  difficulty: String,
  favorite: Boolean
});

const Recipe = mongoose.model("Recipe", recipeSchema);

app.get("/", (req, res) => {
  res.send("Recipe API is running...");
});

app.post("/api/recipes", (req, res) => {
    const newRecipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      cookingTime: req.body.cookingTime,
      difficulty: req.body.difficulty,
      favorite: false
    });
    newRecipe.save()
      .then(() => {
        res.status(201).send("Recipe added");
      })
      .catch((err) => {
        console.error("Error adding recipe:", err);
        res.status(500).send("Internal Server Error");
      });
});

app.get("/api/recipes", (req, res) => {
  Recipe.find()
    .then((recipes) => {
      res.json(recipes);
    })
    .catch((err) => {
      console.error("Error fetching recipes:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.delete("/api/recipes/:id", (req, res) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).send(`Recipe with id ${req.params.id} deleted`);
    })
    .catch((err) => {
      console.error("Error deleting recipe:", err);
      res.status(500).send("Internal Server Error");
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server };