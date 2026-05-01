// Single source of truth for the DB pool. Routes through the shared pool
// so /db-ping and the workouts/meals services use the same database.
module.exports = require('../db/pool');
