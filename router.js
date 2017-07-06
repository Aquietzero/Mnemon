const loadDir = require('./utils').loadDir;
const ACL = require('./app').ACL;

module.exports = (app) => {
    let Routers = loadDir('controllers', app);

    app.get('/', Routers.index.home);

    // Deck
    app.post('/decks', Routers.deck.all);
    app.post('/decks/update', Routers.deck.update);

    // Card
    app.post('/cards', Routers.card.all);
    app.post('/cards/detail', Routers.card.detail);
    app.post('/cards/update', Routers.card.update);

    // Review
    app.get('/review/:deck/setup', Routers.review.setup);
    app.get('/review/:deck/statistics', Routers.review.statistics);
    app.post('/review/pick', Routers.review.pick);
    app.post('/review/put', Routers.review.put);

    app.get('/review/:deck/efficiency', Routers.review.efficiency);
    app.get('/review/:deck/box_distribution', Routers.review.boxDistribution);
}
