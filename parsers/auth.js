"use strict";

const { header, oneOf } = require("express-validator/check");
const { ucfirst } = require("../helpers/string");

/**
 * Sets the validation rule for a security specification based on HTTP
 * @param securityScheme - The security scheme definition from the API specification on the YML path `components/securitySchemes/SOMESCHEMENAME`
 * @param validationGroup - The validation group for the given endpoint
 * @param logger - The logger to add a debug trace
 */
 const _SECURITY_SCHEME_HTTP = (securityScheme, validationGroup, logger) => {
    const schemeName = ucfirst(securityScheme.scheme);
    logger.debug(`adding validation based on HTTP header 'Authorization' matching '${schemeName}.*'`);
    validationGroup.push(header("Authorization").matches(schemeName + " .*"));
};

/**
 * Sets the validation rule for a security specification based on a header
 * @param securityScheme - The security scheme definition from the API specification on the YML path `components/securitySchemes/SOMESCHEMENAME`
 * @param validationGroup - The validation group for the given endpoint
 * @param logger - The logger to add a debug trace
 */
 const _SECURITY_SCHEME_HEADER = (securityScheme, validationGroup, logger) => {
    if (securityScheme.in === "header") {
        logger.debug(`adding validation based on HTTP header '${securityScheme.name}'`);
        validationGroup.push(header(securityScheme.name).isLength({ min: 1 }));
    }
};

const _SECURITY_SCHEMES = {
    http: _SECURITY_SCHEME_HTTP,
    apiKey: _SECURITY_SCHEME_HEADER
}

/**
 * Builds the validation chain for a given endpoint
 * @param methodSecurity - The method's security definition
 * @param securitySchemes - The specified security schemes' list from `components/securitySchemes` in the API YML
 * @param logger - The logger to add a debug trace
 * @returns {*}
 */
module.exports.getAuthValidationRules = (methodSecurity, securitySchemes, logger) => {
    let validationRules = [];

    logger.debug(`evaluating auth validation rules to apply...`);

    for (let securitySchemeOption of methodSecurity) {
        let validationGroup = [];
        for (let securitySchemeName in securitySchemeOption) {
            let securityScheme = securitySchemes[securitySchemeName];
            _SECURITY_SCHEMES[securityScheme.type](securityScheme, validationGroup, logger);
        }

        if (validationGroup.length > 0) {
            validationRules.push(validationGroup);
        }
    }

    switch (validationRules.length) {
        case 0:
            return null;
        case 1:
            return validationRules[0];
    }
    return oneOf(validationRules);
};
