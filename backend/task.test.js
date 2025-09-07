import supertest from "supertest";
import { app, server } from "./index.js";
import mongoose from "mongoose";

const request = supertest(app);

beforeAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
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
    expect(Array.isArray(response.body)).toBe(true);
  });
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
  });
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

    const deleteResponse = await request.delete(`/api/recipes/${addedRecipe._id}`);
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.text).toBe(`Recipe with id ${addedRecipe._id} deleted`);
  });
});


afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => server.close(resolve));
});