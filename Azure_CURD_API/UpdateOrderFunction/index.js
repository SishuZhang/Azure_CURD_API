const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    const container = client.database("shop").container("orders");

    const orderId = context.bindingData.orderId;
    const updatedOrder = req.body;

    try {
        const { resource: existingOrder } = await container.item(orderId, orderId).read();
        if (!existingOrder) {
            context.res = { status: 404, body: "Order not found" };
            return;
        }
        // Merge updates
        const mergedOrder = { ...existingOrder, ...updatedOrder };
        const { resource } = await container.items.upsert(mergedOrder);

        context.res = { status: 200, body: resource };
    } catch (err) {
        context.res = { status: 404, body: "Order not found" };
    }
}; 