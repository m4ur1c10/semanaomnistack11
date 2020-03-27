const connectionDb = require('../database/connection');

module.exports = {

    async create(request, response) {

        const { id } = request.body;

        const ong = await connectionDb('ongs')
            .where('id', id)
            .select('name')
            .first();

        if (!ong) {
            return response.status(400).json({ error: 'Not found ONG with this ID.' });
        }

        return response.json(ong);

    }

}