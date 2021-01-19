// @ts-check
const { v4: uuidv4 } = require("uuid");

const shipmentData = [];

module.exports = {
  name: "shipment",
  actions: {
    list: {
      async handler() {
        const latLngList = await Promise.all(
          shipmentData.map((shipment) =>
            this.broker.call("orders.getOrdersLatLng", {
              orderIdList: shipment.orderIdList,
            })
          )
        );
        return shipmentData.map((shipment, index) => {
          return {
            ...shipment,
            points: latLngList[index],
          };
        });
      },
    },
    updateRoute: {
      handler(ctx) {
        const { shipmentId, route } = ctx.params;
        const shipment = shipmentData.find((s) => s.id === shipmentId);
        shipment.status = "SOLVED";
        shipment.route = route;
      },
    },
    generateShipment: {
      async handler() {
        const orders = await this.broker.call("orders.list");
        const shipmentOrders = orders.filter((o) => o.shipmentId == null);
        const shipmentId = uuidv4();
        await Promise.all(
          shipmentOrders.map((o) =>
            this.broker.call("orders.update", {
              id: o.id,
              shipmentId,
            })
          )
        );
        const orderIdList = shipmentOrders.map((o) => o.id);
        const shipment = {
          id: shipmentId,
          orderIdList,
          status: "ROUTING-PENDING",
        };
        shipmentData.push(shipment);
        await this.broker.call("shipment-routing.createJob", {
          shipment,
        });
      },
    },
  },
  started() {
    setInterval(async () => {
      await this.broker.call("shipment.generateShipment");
    }, 10000);
  },
};
