"use client"

import DropFile from '@/components/DropFile'
import RecipeView from '@/components/RecipeView'
import React, { useState } from 'react'

const page = () => {
  const [recipe, setRecipe] = useState()

  return (
    <div>
      {recipe && recipe.length != 0 ? <RecipeView recipe={recipe} /> : <DropFile setRecipe={setRecipe} />}
    </div>
  )
}

export default page