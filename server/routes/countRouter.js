const Router = require('express')
const router = new Router()
const countController = require('../controllers/countController')

router.post('/', countController.create)
router.get('/', countController.getAll)

module.exports = router
