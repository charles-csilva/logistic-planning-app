const { ServiceBroker } = require("moleculer");
const ApiGatewayService = require("moleculer-web");

const DOCKER_COMPOSE_EXECUTION = process.env.DOCKER_COMPOSE_EXECUTION == '1';

const broker = new ServiceBroker({
  transporter: `redis://${DOCKER_COMPOSE_EXECUTION ? 'redis-service' : 'localhost'}:6379`,
});
broker.createService({
  mixins: [ApiGatewayService],
  settings: {
    port: 9000,
    routes: [
      {
        path: "/api",
      },
    ],
    cors: {
      methods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
      origin: "*",
    },
  },
});

broker.start();
