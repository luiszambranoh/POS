const { getMonitor } = require("consulta-dolar-venezuela");

const getDolarAPI = async () => {
  const bcv = await getMonitor("BCV", "lastUpdate"); 
  const monitor = await getMonitor("EnParaleloVzla", "price", false);

  return {bcv: bcv.bcv, monitor: monitor.enparalelovzla}
}

module.exports = {
  getDolarAPI
};