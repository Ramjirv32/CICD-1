import supertest from "supertest";
import { app, server } from "../server.js";
import mongoose from "mongoose";

// Set the test environment
process.env.NODE_ENV = 'test';

const request = supertest(app);

beforeAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const Recipe = mongoose.model("Recipe");
  await Recipe.deleteMany({});
  
  const seedRecipe = new Recipe({
    title: "Test Pasta",
    ingredients: ["pasta", "sauce", "cheese"],
    instructions: "Mix everything together and cook",
    cookingTime: 15,
    difficulty: "Easy",
    favorite: false
  });
  
  await seedRecipe.save();
  console.log("Seed data added:", seedRecipe);
});

describe("testing the root file", () => {
  it("this will show 200 success", async () => {
    const response = await request.get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("testing get api recipes", () => {
  it("it will return array", async () => {
    const response = await request.get("/api/recipes");
    console.log("GET /api/recipes response:", response.body);
    expect(Array.isArray(response.body)).toBe(true);
  }, 15000);  
});

describe("testing post api recipes", () => {
  it("it will add a recipe", async () => {
    const newRecipe = {
      title: "Test Recipe",
      ingredients: ["ingredient1", "ingredient2"],
      instructions: "Test instructions",
      cookingTime: 30,
      difficulty: "Easy"
    };
    const response = await request.post("/api/recipes").send(newRecipe);
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe("Recipe added");
    
    const getResponse = await request.get("/api/recipes");
    console.log("Recipes after adding:", getResponse.body);
  }, 15000); 
});

describe("testing delete api recipes", () => {
  it("it will delete a recipe", async () => {
    const newRecipe = {
      title: "Recipe to Delete",
      ingredients: ["ingredient1", "ingredient2"],
      instructions: "Instructions to delete",
      cookingTime: 20,
      difficulty: "Medium"
    };
    const postResponse = await request.post("/api/recipes").send(newRecipe);
    expect(postResponse.statusCode).toBe(201);

    const getResponse = await request.get("/api/recipes");
    const addedRecipe = getResponse.body.find(
      (recipe) => recipe.title === "Recipe to Delete"
    );
    expect(addedRecipe).toBeDefined();
    console.log("Recipe to delete:", addedRecipe);

    const deleteResponse = await request.delete(`/api/recipes/${addedRecipe._id}`);
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.text).toBe(`Recipe with id ${addedRecipe._id} deleted`);
    
    const afterDeleteResponse = await request.get("/api/recipes");
    console.log("Recipes after deletion:", afterDeleteResponse.body);
  }, 20000); 
});


afterAll(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
  } catch (error) {
    console.error("Error in afterAll:", error);
  }
}, 15000);