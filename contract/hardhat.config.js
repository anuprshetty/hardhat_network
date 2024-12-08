require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-ethernal");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.23",
  },
  networks: {
    hardhat: {
      chainId: parseInt(process.env.CHAIN_ID),
      initialBaseFeePerGas: 0,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    dockerhost: {
      url: "http://host.docker.internal:8545/",
    },
    remote: {
      url: "https://hardhat-network.onrender.com",
    },
    eth_local_net_1: {
      url: "http://127.0.0.1:<PORT>/",
    },
    eth_local_net_2: {
      url: "http://127.0.0.1:<PORT>/",
    },
    ganache: {
      url: "http://127.0.0.1:7545/", // Update the URL to match your Ganache network configuration
      accounts: {
        mnemonic:
          "unaware noodle timber pepper hard hold fatigue thumb curve prosper good journey", // Update with the Ganache mnemonic phrase
      },
    },
  },
  defaultNetwork: "hardhat",
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

// Hardhat Tasks:
// - command to run any hardhat task --> npx hardhat <hardhat_task_name>
task("networks", "Prints the list of hardhat networks", async () => {
  const networks = config.networks;
  const network_names = Object.keys(networks);

  network_names.forEach((network_name) => {
    console.log(network_name);
  });
});

task("account_nonce", "Prints the transaction count (nonce) of an account")
  .addParam("address", "Account address")
  .setAction(async (taskArgs) => {
    // Nonce:
    // - A scalar value equal to the number of transactions sent from an Externally Owned Account (EOA) OR the number of contract-creations made by an account with associated code (Contract Account).
    // - The nonce is an attribute of the originating address. i.e., it only has meaning in the context of the sending address. However, the nonce is not stored explicitly as part of an account’s state on the blockchain. Instead, it is calculated dynamically, by counting the number of confirmed transactions that have originated from an address.
    // - The nonce is a zero-based counter, meaning the first transaction has nonce 0. For example, if we have a transaction count (nonce) of 40, which means that nonces 0 through 39 have been seen. The next transaction’s nonce will need to be 40.

    const provider = hre.ethers.provider;

    const account_nonce_info = {
      network: provider._networkName,
      account_address: taskArgs.address,
      account_nonce: await provider.getTransactionCount(taskArgs.address),
    };

    console.log(
      `account_nonce_info = ${JSON.stringify(account_nonce_info, null, 2)}\n`
    );
  });
