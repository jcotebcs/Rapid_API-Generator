declare module 'openapi-typescript' {
    export namespace OpenAPIV3 {
        interface Document {
            openapi: string;
            info: InfoObject;
            servers?: ServerObject[];
            paths: PathsObject;
            components?: ComponentsObject;
            security?: SecurityRequirementObject[];
            tags?: TagObject[];
            externalDocs?: ExternalDocumentationObject;
        }

        interface InfoObject {
            title: string;
            description?: string;
            termsOfService?: string;
            contact?: ContactObject;
            license?: LicenseObject;
            version: string;
        }

        interface ContactObject {
            name?: string;
            url?: string;
            email?: string;
        }

        interface LicenseObject {
            name: string;
            url?: string;
        }

        interface ServerObject {
            url: string;
            description?: string;
            variables?: { [variable: string]: ServerVariableObject };
        }

        interface ServerVariableObject {
            enum?: string[];
            default: string;
            description?: string;
        }

        interface ComponentsObject {
            schemas?: { [key: string]: ReferenceObject | SchemaObject };
            responses?: { [key: string]: ReferenceObject | ResponseObject };
            parameters?: { [key: string]: ReferenceObject | ParameterObject };
            examples?: { [key: string]: ReferenceObject | ExampleObject };
            requestBodies?: { [key: string]: ReferenceObject | RequestBodyObject };
            headers?: { [key: string]: ReferenceObject | HeaderObject };
            securitySchemes?: { [key: string]: ReferenceObject | SecuritySchemeObject };
            links?: { [key: string]: ReferenceObject | LinkObject };
            callbacks?: { [key: string]: ReferenceObject | CallbackObject };
        }

        interface PathsObject {
            [pattern: string]: PathItemObject;
        }

        interface PathItemObject {
            $ref?: string;
            summary?: string;
            description?: string;
            get?: OperationObject;
            put?: OperationObject;
            post?: OperationObject;
            delete?: OperationObject;
            options?: OperationObject;
            head?: OperationObject;
            patch?: OperationObject;
            trace?: OperationObject;
            servers?: ServerObject[];
            parameters?: (ReferenceObject | ParameterObject)[];
        }

        interface OperationObject {
            tags?: string[];
            summary?: string;
            description?: string;
            externalDocs?: ExternalDocumentationObject;
            operationId?: string;
            parameters?: (ReferenceObject | ParameterObject)[];
            requestBody?: ReferenceObject | RequestBodyObject;
            responses: ResponsesObject;
            callbacks?: { [key: string]: ReferenceObject | CallbackObject };
            deprecated?: boolean;
            security?: SecurityRequirementObject[];
            servers?: ServerObject[];
        }

        interface ExternalDocumentationObject {
            description?: string;
            url: string;
        }

        interface ParameterObject {
            name: string;
            in: string;
            description?: string;
            required?: boolean;
            deprecated?: boolean;
            allowEmptyValue?: boolean;
            style?: string;
            explode?: boolean;
            allowReserved?: boolean;
            schema?: ReferenceObject | SchemaObject;
            example?: any;
            examples?: { [key: string]: ReferenceObject | ExampleObject };
            content?: { [media: string]: MediaTypeObject };
        }

        interface RequestBodyObject {
            description?: string;
            content: { [media: string]: MediaTypeObject };
            required?: boolean;
        }

        interface MediaTypeObject {
            schema?: ReferenceObject | SchemaObject;
            example?: any;
            examples?: { [key: string]: ReferenceObject | ExampleObject };
            encoding?: { [key: string]: EncodingObject };
        }

        interface EncodingObject {
            contentType?: string;
            headers?: { [key: string]: ReferenceObject | HeaderObject };
            style?: string;
            explode?: boolean;
            allowReserved?: boolean;
        }

        interface ResponsesObject {
            [code: string]: ReferenceObject | ResponseObject;
        }

        interface ResponseObject {
            description: string;
            headers?: { [key: string]: ReferenceObject | HeaderObject };
            content?: { [media: string]: MediaTypeObject };
            links?: { [key: string]: ReferenceObject | LinkObject };
        }

        interface CallbackObject {
            [expression: string]: PathItemObject;
        }

        interface ExampleObject {
            summary?: string;
            description?: string;
            value?: any;
            externalValue?: string;
        }

        interface LinkObject {
            operationRef?: string;
            operationId?: string;
            parameters?: { [key: string]: any };
            requestBody?: any;
            description?: string;
            server?: ServerObject;
        }

        interface HeaderObject {
            description?: string;
            required?: boolean;
            deprecated?: boolean;
            allowEmptyValue?: boolean;
            style?: string;
            explode?: boolean;
            allowReserved?: boolean;
            schema?: ReferenceObject | SchemaObject;
            example?: any;
            examples?: { [key: string]: ReferenceObject | ExampleObject };
            content?: { [media: string]: MediaTypeObject };
        }

        interface TagObject {
            name: string;
            description?: string;
            externalDocs?: ExternalDocumentationObject;
        }

        interface ReferenceObject {
            $ref: string;
        }

        interface SchemaObject {
            title?: string;
            multipleOf?: number;
            maximum?: number;
            exclusiveMaximum?: boolean;
            minimum?: number;
            exclusiveMinimum?: boolean;
            maxLength?: number;
            minLength?: number;
            pattern?: string;
            maxItems?: number;
            minItems?: number;
            uniqueItems?: boolean;
            maxProperties?: number;
            minProperties?: number;
            required?: string[];
            enum?: any[];
            type?: string;
            allOf?: (ReferenceObject | SchemaObject)[];
            oneOf?: (ReferenceObject | SchemaObject)[];
            anyOf?: (ReferenceObject | SchemaObject)[];
            not?: ReferenceObject | SchemaObject;
            items?: ReferenceObject | SchemaObject;
            properties?: { [key: string]: ReferenceObject | SchemaObject };
            additionalProperties?: boolean | ReferenceObject | SchemaObject;
            description?: string;
            format?: string;
            default?: any;
            nullable?: boolean;
            discriminator?: DiscriminatorObject;
            readOnly?: boolean;
            writeOnly?: boolean;
            xml?: XMLObject;
            externalDocs?: ExternalDocumentationObject;
            example?: any;
            deprecated?: boolean;
        }

        interface DiscriminatorObject {
            propertyName: string;
            mapping?: { [key: string]: string };
        }

        interface XMLObject {
            name?: string;
            namespace?: string;
            prefix?: string;
            attribute?: boolean;
            wrapped?: boolean;
        }

        interface SecuritySchemeObject {
            type: string;
            description?: string;
            name?: string;
            in?: string;
            scheme?: string;
            bearerFormat?: string;
            flows?: OAuthFlowsObject;
            openIdConnectUrl?: string;
        }

        interface OAuthFlowsObject {
            implicit?: OAuthFlowObject;
            password?: OAuthFlowObject;
            clientCredentials?: OAuthFlowObject;
            authorizationCode?: OAuthFlowObject;
        }

        interface OAuthFlowObject {
            authorizationUrl?: string;
            tokenUrl?: string;
            refreshUrl?: string;
            scopes: { [key: string]: string };
        }

        interface SecurityRequirementObject {
            [name: string]: string[];
        }
    }
}