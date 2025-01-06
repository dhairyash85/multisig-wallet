const hre=require("hardhat")
async function main(){
    console.log("Deploying multisig wallet contract");
    const wallet=await hre.ethers.getContractFactory("MultisigWallet");
    console.log(wallet)
    const multisigWallet=await wallet.deploy();
    console.log(`multisigWallet contract deployed at ${multisigWallet.target}`);
    const factory=await hre.ethers.getContractFactory("MultisigFactory");
    const multisigFactory=await factory.deploy(multisigWallet.target);
    console.log(`multisigWallet contract deployed at ${multisigFactory.target}`);
}

main().then(()=>console.log("Success!!")).catch(err=>console.log("Error", err))