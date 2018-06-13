const {send, json} = require('micro');
const si = require('systeminformation');
/*
// promises style - new in version 3
si.cpu()
    .then(data => console.log(data))
    .catch(error => console.error(error));
*/
// full async / await example (node >= 7.6)
const healthcheck = async (req, res) => {
  try {
    const currentCpu = await si.currentLoad();
    const currentMem = await si.mem();
    send(res, 200, {currentCpu, currentMem});
  } catch (e) {
    send(res, 500, e);
  }
}

module.exports = {healthcheck}