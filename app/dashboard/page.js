"use client"

import DropFile from '@/components/DropFile'
import RecipeView from '@/components/RecipeView'
import React, { useState } from 'react'

const page = () => {
  const [recipe, setRecipe] = useState()

  return (
    <div>
      <DropFile setRecipe={setRecipe} />
      {recipe && recipe.length != 0 && <RecipeView recipe={recipe} />}
    </div>
  )
}

export default page