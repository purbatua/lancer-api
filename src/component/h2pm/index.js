// import h2pm from 'h2pm'
import { Router } from 'express';


const h2pm = require('h2pm')
const router = Router();



// var html = "<p>123</p><p><br></p><p><strong>Lorem Ipsum</strong>&nbspis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen</p>"


function convertToPdfmake(html) {
  // html = "<p>123</p><p><br></p><p><strong>Lorem Ipsum</strong>&nbspis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen</p>"

  console.log(JSON.stringify(h2pm(html), null, 2))

  return h2pm(html)
}


router.post('/', (req, res) => {
  console.log(req.body.htmls)

  if(!req.body.htmls) {
    req.body.htmls = []
  }

  const results = req.body.htmls.map((html) => {
    return convertToPdfmake(html)
  })

  return res.status(200).send(results)

  // const pdfmakeContent = convertToPdfmake(req.body.html)

  // res.send(200, pdfmakeContent)
})


export default router