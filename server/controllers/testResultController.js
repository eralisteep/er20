const {TestResult} = require('../models/models')
const ApiError = require('../error/ApiError')

class TestResultController {
    async create(req, res, next) {
        try {
            const {deviceId, userId, answers} = req.body
            const testResult = await TestResult.create({deviceId, userId, answers})
            return res.json(testResult)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const testResults = await TestResult.findAll()
        return res.json(testResults)
    }

    async getOne(req, res) {
        const {id} = req.params
        const testResult = await TestResult.findOne(
            {
                where: {id},
            },
        )
        return res.json(testResult)
    }
}

module.exports = new TestResultController()