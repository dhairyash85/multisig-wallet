const hre=require('hardhat');
async function main(){
  // const [deployer]=await hre.ethers.getSigners();
  console.log("Starting")
  const MultisigFactory=await hre.ethers.getContractFactory("MultisigFactory")
  console.log("deploying")
  const multisigFactory=await MultisigFactory.deploy('0x4F2430cB28DD1E4f1e444AdD96252BB7f89f9e84')
  
  // await multisigFactory.waitForDeployment()
  console.log("wait deploying")
  console.log("MultsigFactory deployed to ~ ", multisigFactory.target);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  // 0x0D74447715706aeFe39F99C16B0d90c811F551bA