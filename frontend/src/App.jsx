import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    difficulty: 'Easy'
  })

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/recipes')
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewRecipe({
      ...newRecipe,
      [name]: name === 'ingredients' ? value.split(',') : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newRecipe,
          cookingTime: parseInt(newRecipe.cookingTime)
        })
      })
      
      if (response.ok) {
        setNewRecipe({
          title: '',
          ingredients: '',
          instructions: '',
          cookingTime: '',
          difficulty: 'Easy'
        })
        fetchRecipes()
      }
    } catch (error) {
      console.error('Error adding recipe:', error)
    }
  }

  const deleteRecipe = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchRecipes()
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-700">Recipe Manager -this is demo 1</h1>
      </header>

      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Recipe</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              name="title" 
              value={newRecipe.title} 
              onChange={handleInputChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ingredients (comma separated)</label>
            <textarea 
              name="ingredients" 
              value={newRecipe.ingredients} 
              onChange={handleInputChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea 
              name="instructions" 
              value={newRecipe.instructions} 
              onChange={handleInputChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">Cooking Time (minutes)</label>
              <input 
                type="number" 
                name="cookingTime" 
                value={newRecipe.cookingTime} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select 
                name="difficulty" 
                value={newRecipe.difficulty} 
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="md:col-span-2 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
          >
            Add Recipe
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Recipes</h2>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No recipes found. Add your first recipe above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <div key={recipe._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                <div className="bg-indigo-50 p-4">
                  <h3 className="text-xl font-semibold text-indigo-800">{recipe.title}</h3>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 px-4 py-2 bg-gray-50">
                  <p><span className="font-medium">Time:</span> {recipe.cookingTime} mins</p>
                  <p><span className="font-medium">Difficulty:</span> {recipe.difficulty}</p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-indigo-600 mb-2">Ingredients:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-indigo-600 mb-2">Instructions:</h4>
                    <p className="text-sm text-gray-700">{recipe.instructions}</p>
                  </div>
                  
                  <button 
                    onClick={() => deleteRecipe(recipe._id)}
                    className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200 text-sm font-medium"
                  >
                    Delete Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
