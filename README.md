# API Docs TS Converter

API Docs TS Converter is a powerful tool for bidirectional conversion between API documentation and TypeScript functions. It utilizes Babel to parse and generate code, making synchronization between API documentation and actual code simple and efficient.

## Features

- Convert TypeScript code to API documentation
- Generate TypeScript functions from API documentation
- Support for complex TypeScript types and interfaces
- Automatic generation of API classes and methods

## Installation

Ensure that Node.js (version 12 or higher) is installed on your system. Then, follow these steps to install the project:

1. Clone the repository

```bash
   git clone https://github.com/zzcyes/api-docs-ts-converter.git
   cd api-docs-ts-converter
```

2. Install dependencies
   
```bash
npm install
```

## Usage

1. Generate API Documentation
To generate API documentation from TypeScript code, run:

```bash
npm run generate-docs
```


This will analyze the src/index.ts file and generate JSON format API documentation in the babel directory.

2. Generate TypeScript API
To generate TypeScript API classes from API documentation, run:

```bash
    npm run generate-api
```
   

This will read the babel/docsList.json file and generate a generatedApi.ts file in the babel directory.

3. Build the Project
To build the entire project, run:

```bash
npm run build
```

This command will execute TypeScript compilation, then run Babel transformation, and finally generate API documentation.