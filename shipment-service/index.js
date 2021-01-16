const { ServiceBroker } = require("moleculer");
const ApiGatewayService = require("moleculer-web");

const broker = new ServiceBroker({
  transporter: "redis://redis-service:6379",
});
broker.createService({
  mixins: [ApiGatewayService],
  settings: {
    port: 9001,
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

broker.loadServices("./");
broker.start();
