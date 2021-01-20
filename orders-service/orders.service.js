// @ts-check
const { v4: uuidv4 } = require("uuid");

const ordersData = [];

module.exports = {
  name: "orders",
  actions: {
    list: {
      handler(ctx) {
        const { idList } = ctx.params;
        if (idList) {
          return ordersData.filter(o => idList.includes(o.id));
        }
        return ordersData;
      },
    },
    getOrdersLatLng: {
      handler(ctx) {
        const { orderIdList } = ctx.params;
        return ordersData.filter(o => orderIdList.includes(o.id)).map(o => o.address.latLng);
      }
    },
    get: {
      handler(ctx) {
        const { id } = ctx.params;
        return ordersData.find(o => o.id === id);
      }
    },
    update: {
      handler(ctx) {
        const { id, shipmentId } = ctx.params;
        const order = ordersData.find(o => o.id === id);
        order.shipmentId = shipmentId;
      }
    },
    create: {
      visibility: 'protected',
      handler() {
        ordersData.push({
          id: uuidv4(),
          timestamp: Date.now(),
          address: { latLng: this.getRandomPoint() },
        });
      },
    },
  },
  methods: {
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomPoint() {
      return [
        `43.${this.getRndInteger(646013, 699651)}`,
        `-79.${this.getRndInteger(370728, 495697)}`,
      ];
    },
  },
  started() {
    setInterval(() => {
      this.broker.call("orders.create");
    }, 400);
  },
};
