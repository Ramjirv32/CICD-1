import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const mongoURL = process.env.NODE_ENV === 'test' 
  ? "mongodb://localhost:27017/recipes_test" 
  : "mongodb://localhost:27017/recipes";

const recipeSchema = mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  cookingTime: Number,
  difficulty: String,
  favorite: Boolean
});

// Create the Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Sample recipe data
const sampleRecipes = [
  {
    title: "Pasta Carbonara",
    ingredients: [
      "200g spaghetti",
      "100g pancetta or bacon, diced",
      "2 large eggs",
      "50g Parmesan cheese, grated",
      "2 cloves garlic, minced",
      "Salt and black pepper to taste",
      "Fresh parsley, chopped"
    ],
    instructions: "1. Cook pasta until al dente. Reserve 1/2 cup pasta water before draining.\n2. In a pan, cook pancetta until crispy.\n3. In a bowl, whisk eggs and cheese.\n4. Add drained hot pasta to the pancetta, remove from heat.\n5. Quickly stir in the egg mixture, adding pasta water as needed to create a creamy sauce.\n6. Season with salt and pepper, garnish with parsley.",
    cookingTime: 20,
    difficulty: "Medium",
    favorite: false
  },
  {
    title: "Classic Margherita Pizza",
    ingredients: [
      "Pizza dough",
      "1/2 cup tomato sauce",
      "200g fresh mozzarella, sliced",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "Salt to taste"
    ],
    instructions: "1. Preheat oven to 475°F (245°C).\n2. Roll out pizza dough on a floured surface.\n3. Spread tomato sauce evenly over the dough.\n4. Arrange mozzarella slices on top.\n5. Bake for 10-12 minutes until crust is golden.\n6. Remove from oven, add fresh basil leaves, drizzle with olive oil, and season with salt.",
    cookingTime: 25,
    difficulty: "Easy",
    favorite: true
  },
  {
    title: "Chicken Stir Fry",
    ingredients: [
      "500g chicken breast, sliced",
      "1 bell pepper, sliced",
      "1 carrot, julienned",
      "1 broccoli head, cut into florets",
      "3 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 cloves garlic, minced",
      "1 tbsp ginger, grated",
      "2 tbsp vegetable oil",
      "Spring onions for garnish"
    ],
    instructions: "1. Heat vegetable oil in a wok or large pan over high heat.\n2. Add chicken and cook until golden, about 5-6 minutes.\n3. Add garlic and ginger, stir for 30 seconds.\n4. Add all vegetables and stir-fry for 4-5 minutes until crisp-tender.\n5. Pour in soy sauce and sesame oil, toss to combine.\n6. Garnish with sliced spring onions and serve hot with rice.",
    cookingTime: 20,
    difficulty: "Easy",
    favorite: false
  },
  {
    title: "Chocolate Lava Cake",
    ingredients: [
      "200g dark chocolate",
      "100g butter",
      "100g sugar",
      "3 eggs",
      "1 tsp vanilla extract",
      "50g all-purpose flour",
      "Pinch of salt",
      "Powdered sugar for dusting"
    ],
    instructions: "1. Preheat oven to 425°F (220°C). Butter and flour four ramekins.\n2. Melt chocolate and butter together in a microwave or double boiler.\n3. Whisk in sugar, then add eggs one at a time, whisking well.\n4. Stir in vanilla extract, then fold in flour and salt gently.\n5. Pour batter into ramekins and bake for 12-14 minutes until edges are firm but center is soft.\n6. Let stand for 1 minute, then invert onto plates. Dust with powdered sugar and serve immediately.",
    cookingTime: 25,
    difficulty: "Medium",
    favorite: true
  },
  {
    title: "Greek Salad",
    ingredients: [
      "1 cucumber, diced",
      "4 tomatoes, diced",
      "1 red onion, thinly sliced",
      "1 green bell pepper, diced",
      "200g feta cheese, cubed",
      "100g kalamata olives",
      "3 tbsp olive oil",
      "1 tbsp red wine vinegar",
      "1 tsp dried oregano",
      "Salt and pepper to taste"
    ],
    instructions: "1. Combine cucumber, tomatoes, onion, and bell pepper in a large bowl.\n2. Add olives and feta cheese.\n3. In a small bowl, whisk together olive oil, vinegar, oregano, salt, and pepper.\n4. Pour dressing over the salad and toss gently.\n5. Let it sit for 10 minutes before serving to allow flavors to meld.",
    cookingTime: 15,
    difficulty: "Easy",
    favorite: false
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB for seeding');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Insert sample recipes
    const createdRecipes = await Recipe.insertMany(sampleRecipes);
    console.log(`Added ${createdRecipes.length} recipes to the database`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedDatabase();
