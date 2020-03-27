const express = require('express');
const crypto = require('crypto');
const connectionDb = require('./database/connection');

const routes = express.Router();

routes.get('/ongs', async (request, response) => {

    const ongs = await connectionDb('ongs').select('*');

    return response.json(ongs);

})

routes.post('/ongs', async (request, response) => {

    const { name, email, whatsapp, city, uf } = request.body;
    const id = crypto.randomBytes(4).toString('HEX');

    await connectionDb('ongs').insert({
        id,
        name,
        email,
        whatsapp,
        city,
        uf
    });

    response.json({ id });
});

module.exports = routes;