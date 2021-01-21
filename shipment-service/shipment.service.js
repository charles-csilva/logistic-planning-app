// @ts-check
const { v4: uuidv4 } = require("uuid");

const distributionCenterLatLng = ["43.63682057801007", "-79.39939498901369"];
const shipmentData = [];

module.exports = {
  name: "shipment",
  actions: {
    list: {
      async handler() {
        const ordersLatLngList = await Promise.all(
          shipmentData.map((shipment) =>
            this.broker.call("orders.getOrdersLatLng", {
              orderIdList: shipment.orderIdList,
            })
          )
        );
        const latLngList = ordersLatLngList.map((item) => [distributionCenterLatLng, ...item]);
        return shipmentData.map((shipment, index) => {
          return {
            ...shipment,
            points: latLngList[index],
          };
        });
      },
    },
    get: {
      async handler(ctx) {
        const { id } = ctx.params;
        const shipmentList = await this.broker.call('shipment.list');
        return shipmentList.find(s => s.id === id);
      }
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
        if (shipmentOrders.length > 0) {
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
            shipmentId: shipment.id,
          });
        }
      },
    },
  },
  started() {
    setInterval(async () => {
      await this.broker.call("shipment.generateShipment");
    }, 10000);
  },
};
