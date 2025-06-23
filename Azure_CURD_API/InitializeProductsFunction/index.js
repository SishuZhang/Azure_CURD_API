const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    const container = client.database("shop").container("products");

    const products = [
        { productName: "Apple", price: 1.0 },
        { productName: "Banana", price: 0.5 }
        // ...add more products as needed
    ];

    const results = [];
    for (const product of products) {
        const { resource } = await container.items.upsert(product);
        results.push(resource);
    }

    context.res = {
        status: 201,
        body: results
    };
}; 