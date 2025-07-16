import { ethers } from "hardhat";


async function main() {
   const contract = await ethers.getContractFactory("Fund");

   // Start deployment, returning a promise that resolves to a contract object
   const contractTransaction = await contract.deploy("construct");
   
   console.log("Contract deployed to address:", contractTransaction.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
