"use client"

import DropFile from '@/components/DropFile'
import RecipeView from '@/components/RecipeView'
import React, { useState } from 'react'

const page = () => {
  const [recipe, setRecipe] = useState(`# 🍽️ One-Pot Pasta

## 🧂 Ingredients
*   **Onion** — chopped
*   **Garlic** — chopped
*   **Oil** — (quantity not specified)
*   **Chili flakes** — (quantity not specified)
*   **Mixed herbs** — (quantity not specified)
*   **Milk** — 1 cup
*   **Tomato puree** — (quantity not specified)
*   **Raw pasta** — (fusilli or spaghetti, quantity not specified)
*   **Salt** — to taste
*   **Pepper** — to taste

## 🔧 Equipment
*   **Pan**
*   **Gas stove**
*   **Spatula**
*   **Lid for pan**
*   **Wooden spoon**

## 👩‍🍳 Instructions
1.  **Heat** oil in a pan on a gas stove.
2.  **Sauté** onion and garlic in the hot oil.
3.  **Add** chili flakes and mixed herbs to the sautéing mixture.
4.  **Pour** in 1 cup of milk and tomato puree.
5.  **Add** raw pasta (fusilli or spaghetti) to the pan.
6.  **Season** with salt and pepper.
7.  **Cover** the pan and **cook** on medium-low heat for 7-10 minutes.
8.  **Stir** the mixture intermittently during cooking.
9.  (Optional) **Add** chopped garlic during the cooking phase.
10. Once cooked, **mix** all ingredients thoroughly with a wooden spoon.`)

  return (
    <div>
      {recipe && recipe.length != 0 ? <RecipeView recipe={recipe} /> : <DropFile setRecipe={setRecipe} />}
    </div>
  )
}

export default page