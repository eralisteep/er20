const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.TEXT, unique: true, allowNull: false},
})

const Count = sequelize.define('count', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})

const DeviceInfo = sequelize.define('device_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    count: { 
        type: DataTypes.ENUM('несколько вариантов ответа', 'один вариант ответа'), 
        allowNull: true,
        defaultValue: 'один вариант ответа',
      },
    rightAnswers: {type: DataTypes.JSON, allowNull: false},
    description1: {type: DataTypes.STRING, allowNull: true},
    description2: {type: DataTypes.STRING, allowNull: true},
    description3: {type: DataTypes.STRING, allowNull: true},
    description4: {type: DataTypes.STRING, allowNull: true},
})

const TestResult = sequelize.define('test_result', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    deviceId: {type: DataTypes.INTEGER, },
    userId: {type: DataTypes.INTEGER, },
    answers: {type: DataTypes.JSON, },
})

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(DeviceInfo, {as: 'info'});
DeviceInfo.belongsTo(Device)

module.exports = {
    User,
    Device,
    Brand,
    Count,
    DeviceInfo,
    TestResult
}




