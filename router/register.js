"use strict";

const { getAuthValidationRules } = require("../parsers/auth");
const { validationResult } = require("express-validator/check");

/**
 * Registers a method endpoint.
 * @param method      HTTP method - 'GET', 'POST', ...
 * @param requestPath Request path
 * @param validate    Validation chain
 * @param example     Example response
 * @param context     Express Gateway plugin context
 * @param logger      The logger to add debug traces
 */
function registerMethod(method, requestPath, validate, example, context, logger) {
    if (validate === null) {
        logger.debug(`registering route for method '${method}', path '${requestPath}' without validations and an example: ${JSON.stringify(example)}`);

        context.registerGatewayRoute((app) =>
            app[method](requestPath, (req, res, next) => {
                logger.debug(`sending response for method '${method}' with example: '${JSON.stringify(example)}'`);
                res.json(example);
                next();
            })
        );
    } else {
        logger.debug(`registering route for method '${method}', path '${requestPath}' with validations (${validate}) and an example: ${JSON.stringify(example)}`);

        context.registerGatewayRoute((app) => {
            app[method](requestPath, validate, (req, res, next) => {
                const errors = validationResult(req);

                if (errors.isEmpty()) {
                    logger.debug(`sending response for validated method '${method}' with example: '${JSON.stringify(example)}'`);
                    res.json(example);
                } else {
                    logger.debug(`sending response for validated method '${method}' with error: '${JSON.stringify(errors)}'`);
                    res.status(422).json({ errors: errors.mapped() });
                }
                next();
            });
        });
    }
}

/**
 * The route registration.
 * @param paths      All the specified request paths with their complete specification
 * @param components All the components from the API YML
 * @param context    Express Gateway plugin context
 * @param logger     The logger to add debug traces
 */
module.exports = (paths, components, context, logger) => {
    let path;
    let method;
    logger.debug(`evaluation of paths [${Object.keys(paths)}]...`);
    for (path in paths) {
        for (method in paths[path]) {
            let requestPath = path;
            let methodDefinition = paths[path][method];
            let responseCode = Object.keys(methodDefinition.responses)[0];
            let examples =
                methodDefinition.responses[responseCode].content[
                    "application/json"
                ].examples;
            let firstExampleKey = Object.keys(examples)[0];
            let example = examples[firstExampleKey].value;
            let validate = null;

            if (methodDefinition["security"] !== undefined) {
                validate = getAuthValidationRules(
                    methodDefinition["security"],
                    components["securitySchemes"],
                    logger
                );
            }

            registerMethod(method, requestPath, validate, example, context, logger);
        }
    }
};
