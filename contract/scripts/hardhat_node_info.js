const { ethers, config } = require("hardhat");

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
  const node_accounts = await provider.listAccounts();

  console.log("Total Accounts: ", node_accounts.length);
  console.log("-----------------------------------------------------");

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

    const address = wallet_account.address;
    const privateKey = wallet_account.privateKey;
    const balance = ethers.formatEther(await provider.getBalance(address));

    console.log(`Account #${i}: ${address} (${balance} ETH)`);
    console.log(`Private Key: ${privateKey}`);
    console.log();
  }
  console.log("-----------------------------------------------------\n");
  console.log("SUCCESS: hardhat node info ... DONE");
}

fetchAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
