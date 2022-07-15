module.exports = {
    plugin: {
        $id: "http://express-gateway.io/schemas/plugins/mock.json",
        type: "object",
        properties: {
            definitionFile: {
                type: "string",
            },
        },
    },
    policy: {
        $id: "http://express-gateway.io/schemas/policies/example-policy.json",
    },
};
