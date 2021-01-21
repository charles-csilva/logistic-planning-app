const { ServiceBroker } = require("moleculer");

const DOCKER_COMPOSE_EXECUTION = process.env.DOCKER_COMPOSE_EXECUTION == '1';

const broker = new ServiceBroker({
  transporter: `redis://${DOCKER_COMPOSE_EXECUTION ? 'redis-service' : 'localhost'}:6379`,
});
broker.loadServices("./");
broker.start();
