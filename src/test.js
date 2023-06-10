const mc = require('node-mcstatus');
const serverInfo = require("../serverStatusConfig.json");

mc.statusJava(
  `${serverInfo['server-ip']}`,
  serverInfo.port,
  {query : true}
).then((results) => {
  console.log(results)
})