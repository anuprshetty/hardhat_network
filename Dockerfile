FROM node:16

ARG PROJECT_ROOT_FOLDER=hardhat_node

WORKDIR /developer/projects/$PROJECT_ROOT_FOLDER
RUN echo "Current working directory: $(pwd)"

# install Hardhat globally
RUN npm install --global hardhat

# expose the default Hardhat network port
EXPOSE 8545

# setup Hardhat network
CMD npx hardhat node
