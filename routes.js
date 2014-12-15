var router = require("express").Router();

module.exports = function(app) {
    var NaspController = require("./nasp");

    router.post('/nasp', NaspController.update);
    router.get('/nasp/:email', NaspController.get);

  var StatsController = require("./stats");


  router.get('/stats/active-users', StatsController.getActiveUsers);
  router.get('/stats/active-users-length', StatsController.getActiveUsersLength);
    return router;
};

