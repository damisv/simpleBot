export const ENV = {
    dev: 'development',
    prod: 'production',
    test: 'testing'
};

let config = {
    environment: process.env.NODE_ENV || ENV.dev,
    port: process.env.PORT || 8080,
    logging: true
};

// THIS IS A WORKAROUND BECAUSE AT BUILDING CANT FIND THE FILE PRODUCTION FOR SOME REASON
// SHOULD BE FIXED IN THE FUTURE
const configProduction = {
    logging: true
};

// merge environment specific config to default config.
config = { ...config, ...configProduction };

export default config;