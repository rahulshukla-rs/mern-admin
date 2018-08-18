/* 
    require build-in module
*/
const http = require("http");
/* 
    require the app.js
 */
const app = require("./app");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port);
console.log(`Server Started on port ${port}`);
