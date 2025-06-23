const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    const container = client.database("shop").container("orders");

    const orderId = context.bindingData.orderId;
    try {
        await container.item(orderId, orderId).delete();
        context.res = { status: 204 };
    } catch (err) {
        context.res = { status: 404, body: "Order not found" };
    }
}; 