require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Terminus API Documentation',
            version: '1.0.0',
            description: 'API documentation for Terminus application',
        },
        servers: [
            {
                url: process.env.DEPLOY_URL,
                description: 'Development server',
            },
        ],
        tags: [
            {
                name: 'B2C',
                description: 'Business to Customer APIs - User, Container, and Authentication services'
            },
            {
                name: 'B2B',
                description: 'Business to Business APIs - Admin and Developer services'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your API route files
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerServe: swaggerUi.serve,
    swaggerSetup: swaggerUi.setup(specs, { explorer: true }),
};
