// @ts-check
const QueueService = require("moleculer-bull");
const axios = require("axios");

module.exports = {
  name: "shipment-routing",
  mixins: [QueueService("redis://redis-service:6379")],
  actions: {
    createJob: {
      async handler(ctx) {
        const { id: shipmentId, orderIdList } = ctx.params.shipment;
        const latLngList = await this.broker.call("orders.getOrdersLatLng", {
          orderIdList,
        });
        this.createJob(
          "routing-solver-queue",
          { shipmentId, latLngList },
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
          `http://directions-service:8989/route/?point=${p1.join(
            ","
          )}&point=${p2.join(",")}`
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
        "http://routing-solver-service:8080/solve",
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
