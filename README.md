## Requirements

- Node version - v10.19.0

## Installation

Use the package manager [npm] to install the dependencies.

```bash
npm install
```

## To Run the application

```bash
npm start
```

## To Run the Test

```bash
npm test
```

## Folder Structure

- The entry point of the application is the index.js file.
- All other files are present in the src folder.
- .env file contains environment related values.
- The Bucket names and AWS Access Key and Secret can be speficied in the .env file.
- The API details are specified in the api_specs.yml file.
- temporary folder is used to store input and output files.

## Request Details
- "useLocalFile" to be used as true if input file is stored locally, if its set to false, file stored on s3 will be used
- "file" contains either the local file name or the file key name stored on S3.
- "uploadToS3" is used to check whether the output file has to be written locally or uploaded to S3.
- A sample test.json file is available locally.