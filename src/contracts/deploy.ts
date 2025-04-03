import { ethers } from "hardhat";

async function main() {
  const HashditContract = await ethers.getContractFactory("HashditContract");
  console.log("Deploying HashditContract...");
  
  const contract = await HashditContract.deploy();
  await contract.deployed();

  console.log("HashditContract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
