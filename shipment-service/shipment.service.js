const { v4: uuidv4 } = require("uuid");

const shipmentData = [];

module.exports = {
  name: "shipment",
  actions: {
    list: {
      async handler() {
        const orders = await this.broker.call("orders.list");
        return shipmentData.map((shipment) => {
          return {
            ...shipment,
            points: shipment.orders.map(
              (orderId) => orders.find(o => o.id === orderId).address.latLng
            ),
          };
        });
      },
    },
    generateShipment: {
      async handler() {
        const orders = await this.broker.call("orders.list");
        const shipmentOrders = orders.filter(
          (o) => o.shipmentId == null
        );
        const shipmentId = uuidv4();
        await Promise.all(
          shipmentOrders.map((o) =>
            this.broker.call("orders.update", {
              id: o.id,
              shipmentId,
            })
          )
        );
        const shipment = {
          id: shipmentId,
          orders: shipmentOrders.map((o) => o.id),
          shipmentStatus: "PROCESSING",
        };
        shipmentData.push(shipment);
        return shipment;
      },
    },
  },
  started() {
    setInterval(() => {
      this.broker.call("shipment.generateShipment");
    }, 5000);
  },
};
