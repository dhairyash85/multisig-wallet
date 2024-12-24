require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks:{

    holesky: {
    url: "https://1rpc.io/holesky",
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  
};
