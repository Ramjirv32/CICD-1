import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURL = "mongodb://localhost:27017/recipes";

mongoose.connect(mongoURL)
  .then(() => {
    console.log("MongoDB connected for seeding");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const recipeSchema = mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  cookingTime: Number,
  difficulty: String,
  favorite: Boolean
});

const Recipe = mongoose.model("Recipe", recipeSchema);

async function seedDatabase() {
  try {
    await Recipe.deleteMany({});
    console.log("Cleared existing recipes");
    
    const recipe = new Recipe({
      title: "Pasta Carbonara",
      ingredients: ["200g spaghetti", "100g pancetta", "2 eggs", "50g parmesan", "black pepper"],
      instructions: "Cook pasta. Fry pancetta. Mix eggs and cheese. Combine all ingredients.",
      cookingTime: 20,
      difficulty: "Medium",
      favorite: true
    });
    
    await recipe.save();
    console.log("Recipe added:", recipe);
    
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

seedDatabase();