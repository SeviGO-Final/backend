import swaggerJsDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";
import fs from "fs";
import path from "path";

interface SwaggerSpec {
    paths: { [key: string]: any };
    components?: { schemas?: { [key: string]: any } }
}

const swaggerDefinition: OAS3Definition = {
    openapi: "3.0.3",
    info: {
        title: "SeviGo API Documentation",
        description: "Description here!",
        version: "1.0.0"
    },
    servers: [
        {
            url: "http://localhost:3000/api"
        }
    ],
};

const options: OAS3Options = {
    swaggerDefinition,
    apis: []
};

const swaggerSpec = swaggerJsDoc(options) as SwaggerSpec;

const loadDocumentation = (filePath: string) => {
    const absolutePath = path.join(__dirname, '../../docs', filePath);
    const data = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(data);
}

// load file dokumentasi
const userDoc = loadDocumentation('user.json');

// gabungkan `paths`
swaggerSpec.paths = {
    ...userDoc.paths,
}

// gabungkan `components`
swaggerSpec.components = {
    schemas: {
        ...(userDoc.components?.schemas || {}),
    }
}

export default swaggerSpec;