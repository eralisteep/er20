const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class DeviceController {
    async create(req, res, next) {
        try {
            const { name, brandId, info } = req.body;
    
            if (!name || !brandId) {
                return next(ApiError.badRequest("Некорректные данные"));
            }
    
            console.log("Полученные данные:", req.body);
    
            const device = await Device.create({ name, brandId });
    
            if (info) {
                let parsedInfo;
                try {
                    parsedInfo = JSON.parse(info); // ✅ Парсим строку в объект
                } catch (e) {
                    return next(ApiError.badRequest("Ошибка парсинга info"));
                }
    
                await Promise.all(parsedInfo.map(async i => {
                    await DeviceInfo.create({
                        title: i.title,
                        count: i.count,
                        rightAnswers: i.rightAnswers, // ✅ Превращаем в строку для БД
                        description1: i.description1,
                        description2: i.description2,
                        description3: i.description3,
                        description4: i.description4,
                        deviceId: device.id
                    });
                }));
            }
    
            return res.json(device);
        } catch (e) {
            console.error("Ошибка при создании устройства:", e);
            next(ApiError.badRequest("Ошибка сервера"));
        }
    };
    
    async getAll(req, res) {
        let {brandId} = req.query
        let devices;
        if (!brandId) {
            devices = await Device.findAndCountAll()
        }
        if (brandId) {
            devices = await Device.findAndCountAll({where:{brandId}})
        }
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            },
        )
        return res.json(device)
    }

}

module.exports = new DeviceController()
