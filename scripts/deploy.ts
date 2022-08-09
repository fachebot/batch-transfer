import { ethers } from "hardhat";

async function main() {
  const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
  const batchTransfer = await BatchTransfer.deploy();

  await batchTransfer.deployed();

  console.log("BatchTransfer deployed to:", batchTransfer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
