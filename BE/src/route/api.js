const express = require('express')
const routeApi = express.Router()
const testController = require('../controller/test');

routeApi.get('/', (req, res) => {
    //   res.send('API is working!')
    res.status(200).json({
        message: 'API KLTN cua do hiep hieu is working!',
        status: 'success',
        code: 200,
        data: null
    });
})

routeApi.get('/tests', testController.getAll);



module.exports = routeApi