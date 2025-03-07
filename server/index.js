require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`localhost:${PORT}/`))
    } catch (e) {
        console.log(e)
    }
}


start()

//дальше count-ы добавляется в базу данных

const { Count } = require('./models/models'); // Подключаем модель

async function initializeCounts() {
    const defaultCounts = ["несколько вариантов ответа", "один вариант ответа"];

    for (const countName of defaultCounts) {
        const existing = await Count.findOne({ where: { name: countName } });
        if (!existing) {
            await Count.create({ name: countName });
            console.log(`Добавлен тип: ${countName}`);
        }
    }
}

initializeCounts().catch(err => console.error("Ошибка инициализации counts:", err));
