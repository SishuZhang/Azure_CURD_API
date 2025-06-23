const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    const container = client.database("shop").container("orders");

    const orderId = context.bindingData.orderId;
    try {
        const { resource } = await container.item(orderId, orderId).read();
        if (!resource) {
            context.res = { status: 404, body: "Order not found" };
        } else {
            context.res = { status: 200, body: resource };
        }
    } catch (err) {
        context.res = { status: 404, body: "Order not found" };
    }
}; 