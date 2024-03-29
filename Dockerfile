FROM node:18

ARG PROJECT_ROOT_FOLDER=hardhat_network

WORKDIR /developer/projects/$PROJECT_ROOT_FOLDER
RUN echo "Current working directory: $(pwd)"

# copy source code
COPY . .

WORKDIR /developer/projects/$PROJECT_ROOT_FOLDER/contract
RUN echo "Current working directory: $(pwd)"

# install project dependencies
RUN npm install

# expose the default Hardhat network port
EXPOSE 8545

# setup Hardhat network:
# - starts HTTP and WebSocket JSON-RPC server
CMD npx hardhat node --hostname 0.0.0.0 --port 8545
