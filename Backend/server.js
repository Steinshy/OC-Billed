const app = require("./app.js");
const { sequelize } = require("./models/index.js");
const { seedDatabase } = require("./seed.js");

// The frontend Store (Frontend/src/app/Store.js) targets this port.
const PORT = process.env.PORT || 5678;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database established");
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Billed backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
