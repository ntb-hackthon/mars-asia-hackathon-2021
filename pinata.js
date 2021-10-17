const pinataSDK = require("@pinata/sdk");
const db = require("../modules/mongoose");
const pinataConfigModel = db.getModel("pinataConfig");
const pinataStoreModel = db.getModel("pinataStore");
const axios = require("axios");


const getConfig = async (userId) => {
  const one = await pinataConfigModel.findOne({ userId });
  return one;
};

exports.getConfig = getConfig;

exports.upsertConfig = async (query, data) => {
  return pinataConfigModel.findOneAndUpdate(query, { $set: data }, { upsert: true });
};

exports.testAuth = async ({ apiKey, apiSecret }) => {
  const pinata = pinataSDK(apiKey, apiSecret);
  return pinata.testAuthentication();
};


exports.upload = async ({ userId, url, name, guildId, channelId }) => {
  guildId = guildId + "";
  channelId = channelId + "";

  const { apiKey, apiSecret } = await getConfig(userId);
  const pinata = pinataSDK(apiKey, apiSecret);

  const rzStore = await pinataStoreModel.create({
    userId, url, name, guildId, channelId
  });

  const storeId = rzStore._id + "";

  const options = {
    pinataMetadata: {
      name,
      keyvalues: {
        guildId,
        channelId,
        storeId,
      }
    },
    pinataOptions: {
      cidVersion: 0
    }
  };

  try {
    const img = await axios({
      method: "get",
      url,
      responseType: "stream"
    });
    const rzPinata = await pinata.pinFileToIPFS(img.data, options);
    await pinataStoreModel.findByIdAndUpdate(storeId, { $set: { rzPinata } });

    return rzPinata;
  } catch (e) {
    console.log("====> e :", e);
    return { err: e.toString() };
  }

};
