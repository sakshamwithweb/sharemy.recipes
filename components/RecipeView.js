import React, { useEffect, useRef, useState } from 'react'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { Button } from './ui/button'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

const RecipeView = ({ recipe }) => {
  const [content, setContent] = useState()
  const contentRef = useRef()

  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeDocument, { title: '🍪' })
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(recipe).then((md) => { setContent(md.toString()) })
  }, [recipe])

  const generatePDF = async () => {
    const element = contentRef.current
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save('recipe.pdf')
  }


  const shareRecipe = async () => {
    // Store the recipe in DB and copy the URL
  }

  return (
    <div className='flex flex-col items-center mt-16 gap-4'>
      <div className='flex gap-8'>
        <Button size={"sm"} onClick={generatePDF}>Print</Button>
        <Button size={"sm"} onClick={shareRecipe}>Share</Button>
      </div>
      <div className='w-[70vw] bg-gray-200 rounded-xl' ref={contentRef}>
        {content && <div dangerouslySetInnerHTML={{ __html: content }} className='prose'></div>}
      </div>
    </div>
  )
}

export default RecipeView