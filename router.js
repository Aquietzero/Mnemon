var loadDir = require('./utils').loadDir;

module.exports = function (app) {
    var Routers = loadDir('controllers', app);

    app.get('/', Routers.index.home);

    // Deck
    app.post('/decks', Routers.deck.all);
    app.post('/decks/update', Routers.deck.update);

    // Card
    app.post('/cards', Routers.card.all);
    app.post('/cards/detail', Routers.card.detail);
    app.post('/cards/update', Routers.card.update);
}
