const fs = require('fs')
const express = require('express')
const path = require('path')

const BASE_DIR = './api'

// The name file that will be '/' path
const INDEX_FILE_NAME = 'index'

function isFile(parsedPath) {
  return !!parsedPath.ext
}

function isIndexFile(parsedPath) {
  return parsedPath.name === INDEX_FILE_NAME
}

function createRouterFromFile(filepath) {
  const setupRouter = require(filepath)

  if (!(setupRouter instanceof Function)) {
    console.warn(`${filepath} don't exports a function`)
    return undefined
  }

  const router = express.Router()
  setupRouter(router)
  return router
  
}

function createRouterFromDir (dirPath) {
  const router = express.Router()
  for (const content of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, content)
    const pathInfo = path.parse(fullPath)
    const subRouter = isFile(pathInfo) ? createRouterFromFile(fullPath) : createRouterFromDir(fullPath)
    if (!subRouter) continue
    const route = '/' + (isIndexFile(pathInfo) ? '' : pathInfo.name)
    router.use(route, subRouter)
  }
  return router
}


const router = createRouterFromDir(path.join(__dirname, BASE_DIR))

// Handle error
router.use((error, req, res, next) => {
  if (typeof error === 'array'){
     error = error.map(e => e.message)
  }
  else {
    error = error.message
  }
    res.json({error})
})

module.exports = router
