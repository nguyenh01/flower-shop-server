module.exports = (router) => {
  router.get('/', (req, res) => {
    res.send('This is index')
  })
}