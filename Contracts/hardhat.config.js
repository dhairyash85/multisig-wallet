require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    holesky:{
      url:"https://1rpc.io/holesky",
      accounts:["0x730a75039d93d81b892ddcb3939304e5166ec530d7b63c9d72a49f6336e744f0"]
    }
  }
};
