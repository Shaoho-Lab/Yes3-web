const html2svg = require('html2svg')
const input = '/Users/yan/Desktop/Lyon/Lyon-web/testPureHTML.html' // Or: http://google.com
const output = 'testoutput.svg'

;(async function () {
  try {
    let res = await html2svg({ input, output })

    console.log(res)
  } catch (err) {
    console.error(err)
  }
})()
