const connectionDb = require('../database/connection');

module.exports = {

    async create(request, response) {

        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connectionDb('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });

    },

    async index(request, response) {

        const { page = 1, total = 5 } = request.query;

        const incidents = await connectionDb('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(total)
            .offset((page - 1) * total)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        const [count] = await connectionDb('incidents').count();

        const totalIncidents = count['count(*)'];

        response.header('X-Total-Count', totalIncidents);
        response.header('X-Total-Pages', Math.ceil(totalIncidents / total));

        return response.json(incidents);

    },

    async delete(request, response) {

        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connectionDb('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation not permited.' });
        }

        await connectionDb('incidents').where('id', id).delete();

        return response.status(200).send();

    }

}