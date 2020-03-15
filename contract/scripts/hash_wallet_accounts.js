const { ethers, config } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function fetchAccounts() {
  const hardhat_node_url = config.networks.localhost.url;

  // fetching wallet_metadata from hardhat.config.js file
  const wallet_info = config.networks.hardhat.accounts;

  console.log(`\nHardhat Local Network: ${hardhat_node_url}\n`);

  console.log("-------------------- Wallet Info --------------------");

  console.log(wallet_info);

  console.log("-----------------------------------------------------");

  const wallet_mnemonic = ethers.Mnemonic.fromPhrase(wallet_info.mnemonic);

  const provider = new ethers.JsonRpcProvider(hardhat_node_url);
  const hardhat_network_info = await provider.getNetwork();
  const node_accounts = await provider.listAccounts();

  console.log("Chain ID: ", parseInt(hardhat_network_info.chainId));
  console.log("Total Accounts: ", node_accounts.length);
  console.log("-----------------------------------------------------");

  var hash_wallet_accounts = [];
  for (let i = 0; i < node_accounts.length; i++) {
    const node_account = node_accounts[i];

    const wallet_account = ethers.HDNodeWallet.fromMnemonic(
      wallet_mnemonic,
      wallet_info.path + `/${i}`
    );

    if (node_account.address !== wallet_account.address) {
      throw new Error(
        "Error: node_account.address is not equal to wallet_account.address"
      );
    }

    const name = "hardhat_" + `${i}`;
    const address = wallet_account.address;
    const privateKey = wallet_account.privateKey;
    const balance = ethers.formatEther(await provider.getBalance(address));

    hash_wallet_accounts.push({ name, address, privateKey });

    console.log(`Account #${i}: ${address} (${balance} ETH)`);
    console.log(`Private Key: ${privateKey}`);
    console.log();
  }

  console.log("-----------------------------------------------------\n");

  hash_wallet_accounts = JSON.stringify(hash_wallet_accounts, null, 2);

  const filePath = path.join(__dirname, "..", "hash_wallet_accounts.json");
  fs.writeFileSync(filePath, hash_wallet_accounts, "utf8");

  console.log(`File Path: ${filePath}\n`);

  console.log("SUCCESS: hash wallet accounts generation ... DONE");
}

fetchAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
