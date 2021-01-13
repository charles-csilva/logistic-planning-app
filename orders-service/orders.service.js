const { v4: uuidv4 } = require('uuid');

const ordersData = [];

module.exports = {
    name: "orders",
    actions: {
        list(ctx) {
            return ordersData;
        },
        create(ctx) {
            ordersData.push({ id: uuidv4(), timestamp: Date.now(), address: this.getRandomPoint() });
        },
    },
    methods: {
        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
        },
        getRandomPoint() {
            return [
                `43.${this.getRndInteger(646013, 699651)}`,
                `-79.${this.getRndInteger(370728, 495697)}`,
            ];
        }
    },
    started() {
        setInterval(() => {
            this.broker.call('orders.create');
        }, 10000);
    }
}