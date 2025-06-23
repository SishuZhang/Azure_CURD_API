const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    const container = client.database("shop").container("orders");

    const order = req.body;
    order.id = order.id || context.bindingData.orderId;

    const { resource } = await container.items.create(order);

    context.res = {
        status: 201,
        body: resource
    };
}; 