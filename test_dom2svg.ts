import { documentToSVG, elementToSVG, inlineResources } from 'dom-to-svg'

//const document = '/Users/yan/Desktop/Lyon/Lyon-web/testPureHTML.html'
//const input = document.getElementById('message') as HTMLInputElement
//Document document = '/Users/yan/Desktop/Lyon/Lyon-web/testPureHTML.html'

// Capture the whole document
const svgDocument = documentToSVG(document)

// Capture specific element
//const svgDocument = elementToSVG(document.querySelector('#my-element'))

// Inline external resources (fonts, images, etc) as data: URIs
await inlineResources(svgDocument.documentElement)

// Get SVG string
const svgString = new XMLSerializer().serializeToString(svgDocument)