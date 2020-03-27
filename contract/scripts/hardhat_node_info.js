const hre = require("hardhat");

async function fetchAccounts() {
  let provider = hre.ethers.provider;

  const hardhat_network_info = {
    name: provider._networkName,
    url:
      "url" in hre.config.networks[provider._networkName]
        ? hre.config.networks[provider._networkName].url
        : "",
    chainId: parseInt((await provider.getNetwork()).chainId),
  };

  console.log("---------------- Hardhat Network Info ----------------");
  console.log(`${JSON.stringify(hardhat_network_info, null, 2)}\n`);

  // fetching wallet_metadata from hardhat.config.js file
  const wallet_info = hre.config.networks.hardhat.accounts;

  console.log("-------------------- Wallet Info --------------------");
  console.log(`${JSON.stringify(wallet_info, null, 2)}\n`);

  provider = new ethers.JsonRpcProvider(hardhat_network_info.url);
  const node_accounts = await provider.listAccounts();

  console.log("------------------- Accounts Info -------------------");
  console.log("Total Accounts: ", node_accounts.length);
  console.log("-----------------------------------------------------");

  const wallet_mnemonic = hre.ethers.Mnemonic.fromPhrase(wallet_info.mnemonic);

  for (let i = 0; i < node_accounts.length; i++) {
    const node_account = node_accounts[i];

    const wallet_account = hre.ethers.HDNodeWallet.fromMnemonic(
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
    const balance = hre.ethers.formatEther(await provider.getBalance(address));

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
