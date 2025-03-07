const {Count} = require('../models/models')

class CountController {
    async create(req, res) {
        const {name} = req.body
        const count = await Count.create({name})
        return res.json(count)
    }

    async getAll(req, res) {
        const counts = await Count.findAll()
        return res.json(counts)
    }

}

module.exports = new CountController()
