const hre=require('hardhat')
async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Example array of owners (addresses) and required signatures
  const owners = [deployer.address];
  const requiredSignatures = 1;

  // Getting the contract factory
  const Multisig = await ethers.getContractFactory("Multisig");
  console.log("a")

  // Deploy the contract and pass the required arguments
  const multisig = await Multisig.deploy();
  await multisig.waitForDeployment();
  console.log("b")

  // Initialize the contract with owners and required signatures
  await multisig.initialize(owners, requiredSignatures);
  console.log("c")

  console.log("Multisig deployed to:", multisig.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });