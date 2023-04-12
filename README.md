# ClickDealer - Technical test

## Assignment

Create a simple API using  AWS Lambda (Node/TypeScript) + AWS DynamoDb  OR Node/MongoDb to create then retrieve a vehicle record.  Be creative in what data is stored but we want to see the API allowing someone to save a vehicle record, then retrieve it from the database.  Consider validation and unit testing.The AWS free tier should make this a no cost process if available in your region.

by vehicle record we simply mean a database entry about a vehicle i.e.

Make: Ford

Model FiestaReg: AB22 ABC

RegistrationDate: 23/12/22Create/Read/ and possibly Update/Delete via an API.

## Project Specification Document

### Project title

REST API Development using AWS CDK, TypeScript, AWS Serverless, API Gateway with Custom Authorizer and CI/CD Pipelines with DynamoDB data storage

### Project Description

The aim of this project is to develop a REST API for saving cars with various attributes. This API will be built using AWS CDK, TypeScript, AWS Serverless, API Gateway with Custom Authorizer and CI/CD Pipelines with DynamoDB data storage. The API will provide endpoints for GET, POST, PUT and DELETE operations.

Zod is used for request validation and Jest as a testing library.

### Car attributes

The following attributes will be saved for each car:

- Registration number
- Dealer
- Make
- Model
- Year
- Color
- Price
- Mileage
- Description
- RegisteredAt
- Status
- UpdatedAt

### DynamoDB table design:

The following data access patterns will be considered while planning the API:

1. Get car details by Registration number
2. Get cars in the database in the order of created date
3. Get cars of a particular dealer
4. Get cars in the database of make and model
5. Get cars which have registration date in a particular range
6. Get cars which has make, model and price-wise sorting

### Endpoints

- GET /cars: Search cars we can provide dealer, make, model, registeredAfter, registeredBefore, limit, nextPageOffset, sortBy as parameters
- GET /cars/{id}: Get a specific car details
- POST /cars: Create a new car to the inventory
- PUT /cars/{id}: Update an existing car inventory
- DELETE /cars/{id}: Delete a specific car

### API Gateway Custom Authorizer

All endpoints except GET /cars are secured using the token **`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`**. This token will be added as an Authorization header.

### CI/CD Pipeline

The CI/CD pipeline will be set up to automatically fetch the code from the CodeCommit repository and deploy it using AWS CDK.

### Conclusion

The REST API for car inventory management will be developed using AWS CDK, TypeScript, AWS Serverless, API Gateway with Custom Authorizer and CI/CD Pipelines. The API will provide various endpoints for GET, POST, PUT and DELETE operations to manage cars. The data will be stored in DynamoDB with proper data access patterns. The endpoints will be secured using a custom authorizer and CI/CD pipelines will be set up for automatic deployment.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
