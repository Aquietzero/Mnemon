var loadDir = require('./utils').loadDir;

module.exports = function (app) {
    var Routers = loadDir('controllers', app);

    app.get('/', Routers.index.home);

    // Card
    app.post('/cards/detail', Routers.card.detail);
    app.post('/cards/create', Routers.card.create);
}
