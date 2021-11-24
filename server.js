const app = require("./src/app");
const sequelize = require("./src/config/database");
const PORT = 3000;

sequelize.sync();

app.listen(PORT, () => {
    console.log("listening on ports", PORT);
});
