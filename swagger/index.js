const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const app = express();

let swagger, jsonDoc;
try {
    jsonDoc = yaml.safeLoad(fs.readFileSync(__dirname + '/openapi.yaml', 'utf8'));

    //-- redefine server uri 
    jsonDoc.servers[0].url = process.env.AUTH_API_URI || "http://localhost:3000";
    jsonDoc.servers[1].url = process.env.API_PRODUCT_URI || "http://localhost:8888/api/products";
    //------------
    
    swagger = app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(jsonDoc));
} catch (e) {
    console.log(e);
}

module.exports = swagger;
