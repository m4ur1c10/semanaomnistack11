const crypto = require('crypto');
const connectionDb = require('../database/connection');

module.exports = {
    
    async index (request, response) {

        const ongs = await connectionDb('ongs').select('*');
    
        return response.json(ongs);
    
    },
    async create(request, response) {

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

    }
}