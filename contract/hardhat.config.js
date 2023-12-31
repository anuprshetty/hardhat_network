require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-ethernal");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  ethernal: {
    apiToken: process.env.ETHERNAL_API_TOKEN,
    disableSync: true, // If set to true, plugin will not sync blocks & txs
    disableTrace: false, // If set to true, plugin won't trace transaction
    workspace: process.env.ETHERNAL_WORKSPACE, // Set the workspace to use, will default to the default workspace (latest one used in the dashboard). It is also possible to set it through the ETHERNAL_WORKSPACE env variable
    /*
     * Abstract Syntax Trees (ASTs) are data structures that represent the structure of source code in an abstract and hierarchical manner.
     * They are commonly used in programming language analysis, compiler design, code transformation and verification.
     * They are a fundamental tool in programming language processing and related tooling.
     * the uploadAst option used to upload ASTs (Abstract Syntax Trees) during compilation.
     */
    uploadAst: true, // If set to true, plugin will upload AST, and you'll be able to use the storage feature (longer sync time though)
    disabled: false, // If set to true, the plugin will be disabled, nohting will be synced, ethernal.push won't do anything either
    resetOnStart: process.env.ETHERNAL_WORKSPACE, // Pass a workspace name to reset it automatically when restarting the node, note that if the workspace doesn't exist it won't error
    serverSync: false, // Only available on public explorer plans - If set to true, blocks & txs will be synced by the server. For this to work, your chain needs to be accessible from the internet. Also, trace won't be synced for now when this is enabled.
    skipFirstBlock: false, // If set to true, the first block will be skipped. This is mostly useful to avoid having the first block synced with its tx when starting a mainnet fork
    verbose: false, // If set to true, will display this config object on start and the full error object
  },
};
