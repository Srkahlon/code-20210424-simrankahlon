FROM node:10.13.0-alpine
# Create directory for the container
WORKDIR /usr/src/app
# copy the package.json file to work dir
COPY package.json .
# install all packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app
# Expose the port
EXPOSE 8080
# Start the application
CMD [ "npm", "start" ]