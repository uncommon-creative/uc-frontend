/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */



const path = require("path");
const fs = require("fs-extra");

module.exports = (on, config) => {
    
    function getConfigurationByFile(file) {
        const pathToConfigFile = path.resolve("cypress/config", `${file}.json`);

        const result = fs.readJson(pathToConfigFile);
        // console.log('with config result: ', pathToConfigFile, result);
        return result;
    }
    const file = config.env.configFile || "local";

    return getConfigurationByFile(file);
};