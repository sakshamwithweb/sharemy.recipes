import React, { useEffect, useState } from 'react'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const RecipeView = ({ recipe }) => {
  const [content, setContent] = useState()

  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeDocument, { title: '🍪' })
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(recipe).then((md) => { setContent(md.toString()) })
  }, [])

  return (
    <div className='flex justify-center mt-16'>
      <div className='w-[70vw] bg-gray-100'>
        {content && <div dangerouslySetInnerHTML={{ __html: content }} className='prose'></div>}
      </div>
    </div>
  )
}

export default RecipeView