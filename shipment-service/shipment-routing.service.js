// @ts-check
const QueueService = require("moleculer-bull");
const axios = require("axios");

const DOCKER_COMPOSE_EXECUTION = process.env.DOCKER_COMPOSE_EXECUTION == "1";

module.exports = {
  name: "shipment-routing",
  mixins: [
    QueueService(
      `redis://${DOCKER_COMPOSE_EXECUTION ? "redis-service" : "localhost"}:6379`
    ),
  ],
  actions: {
    createJob: {
      async handler(ctx) {
        const { shipmentId } = ctx.params;
        const shipment = await this.broker.call("shipment.get", {
          id: shipmentId,
        });
        this.createJob(
          "routing-solver-queue",
          { shipmentId, latLngList: shipment.points },
          { attempts: 18, delay: 10000, removeOnComplete: true }
        );
      },
    },
    getDistance: {
      cache: true,
      params: {
        p1: { type: "array", items: "string" },
        p2: { type: "array", items: "string" },
      },
      async handler(ctx) {
        const { p1, p2 } = ctx.params;
        const response = await axios.default.get(
          `http://${
            DOCKER_COMPOSE_EXECUTION ? "directions-service" : "localhost"
          }:8989/route/?point=${p1.join(",")}&point=${p2.join(",")}`
        );
        return parseInt(response.data.paths[0].distance);
      },
    },
  },
  queues: {
    async "routing-solver-queue"(job) {
      const { shipmentId, latLngList } = job.data;
      const distanceMatrix = [];
      latLngList.forEach(() => distanceMatrix.push([]));
      for (let i = 0; i < latLngList.length; ++i) {
        for (let j = 0; j < latLngList.length; ++j) {
          distanceMatrix[i][j] = await this.broker.call(
            "shipment-routing.getDistance",
            {
              p1: latLngList[i],
              p2: latLngList[j],
            }
          );
        }
      }
      const response = await axios.default.post(
        `http://${
          DOCKER_COMPOSE_EXECUTION ? "routing-solver-service" : "localhost"
        }:8080/solve`,
        distanceMatrix
      );
      await this.broker.call("shipment.updateRoute", {
        shipmentId,
        route: response.data,
      });
      return this.Promise.resolve({
        done: true,
        id: job.data.id,
        worker: process.pid,
      });
    },
  },
};
