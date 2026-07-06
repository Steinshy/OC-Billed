const { sequelize } = require("./models/index.js");
const fixtures = require("./tests/fixtures");

beforeEach(async () => {
  await fixtures.reset();
});

// Close the database connection so jest can exit cleanly.
afterAll(async () => {
  await sequelize.close();
});
