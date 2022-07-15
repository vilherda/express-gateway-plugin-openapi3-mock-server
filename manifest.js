const { createLoggerWithLabel } = require("express-gateway/lib/logger");

const parser = require("./parsers/openapi");
const register = require("./router/register");
const schemes = require("./schemes");

module.exports = {
    version: "1.2.0",

    policies: ["mock"],

    schema: schemes.plugin,

    init: function (pluginContext) {
        const logger = createLoggerWithLabel('[EG:mock-policy]');
        logger.info('init process');

        // A really mock policy ;-)
        pluginContext.registerPolicy({
            name: "mock",
            schema: schemes.policy,
            policy: (actionParams) => (req, res, next) => null,
        });

        logger.info(`loading definition file '${pluginContext.settings.definitionFile}'`);
        const definition = parser(pluginContext.settings.definitionFile);

        logger.info(`digesting definition file '${pluginContext.settings.definitionFile}'`);
        register(definition.paths, definition.components, pluginContext, logger);
    }
};
