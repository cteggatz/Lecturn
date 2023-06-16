

const mc = require('node-mcstatus');
const serverInfo = require("../serverStatusConfig.json");

mc.statusJava(
  `eastHigh.minecraftr.us`,
  serverInfo.port,
  {query : true}
).then((results) => {
  console.log(results.players)
})
