const db = require("../modules/mongoose");
const ethers = require("ethers");
const polygonNFTModel = db.getModel("polygonNFT");
const mintErrLogModel = db.getModel("mintErrLog");

const { JSON_RPC_PROVIDER, WALLET_PRIVATE_KEY, CONTRACT_ADDRESS, TX_DOMAIN, OPENSEA_PREFIX } = process.env;

const ABI = [
  "function mint(address user, string memory tokenURI)",
  "function ownerOf(uint256 tokenId) public view returns (address)"
];

const defaultProvider = new ethers.providers.JsonRpcProvider(JSON_RPC_PROVIDER);

const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);
const signer = wallet.connect(defaultProvider);
const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

exports.mint = async ({ userId, metaUrl, walletAddress, name, guildId, channelId }) => {
  const rz = await polygonNFTModel.create({
    userId, metaUrl, name, guildId, channelId
  });

  const _id = rz._id + "";

  try {
    const transactionResponse = await nftContract.mint(walletAddress, metaUrl);
    await polygonNFTModel.findByIdAndUpdate(_id, { $set: { transactionResponse } });
    const { hash } = transactionResponse;

    return {
      _id,
      hash
    };
  } catch (err) {
    await mintErrLogModel.create({ userId, metaUrl, walletAddress, name, guildId, channelId });
    console.log("====> err :", err);
    return { err };
  }
};

exports.getLink = hash => `${TX_DOMAIN}/tx/${hash}`;

// https://testnets.opensea.io/assets/mumbai/0xd7f8fd88193bbd31bef70c52519a71f756f0f85c/7
exports.getOpenSeaLink = tokenId => `${OPENSEA_PREFIX}${CONTRACT_ADDRESS}/${tokenId}`;


exports.getMintResult = async ({ _id, hash }) => {
  const transactionReceipt = await defaultProvider.waitForTransaction(hash);
  await polygonNFTModel.findByIdAndUpdate(_id, { $set: { transactionReceipt } });
  return transactionReceipt;
};
