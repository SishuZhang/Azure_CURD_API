const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    const container = client.database("shop").container("orders");

    const querySpec = {
        query: "SELECT * FROM c"
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    context.res = {
        status: 200,
        body: resources
    };
}; 