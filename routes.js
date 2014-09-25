var router = require("express").Router();

module.exports = function(app) {
    var NaspController = require("./nasp");

    router.post('/nasp', NaspController.update);
    router.get('/nasp/:email', NaspController.get);

    return router;
};

