const Router = require('express')
const router = new Router()
const testResultController = require('../controllers/testResultController')

router.post('/', testResultController.create)
router.get('/', testResultController.getAll)
router.get('/:id', testResultController.getOne)

module.exports = router