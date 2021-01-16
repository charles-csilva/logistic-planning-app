const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker({
  transporter: "redis://redis-service:6379",
});
broker.loadServices("./");
broker.start();
