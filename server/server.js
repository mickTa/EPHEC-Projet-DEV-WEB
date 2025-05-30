const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const app = require("./app");
const server = http.createServer(app);
require("./utils/socket").init(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
