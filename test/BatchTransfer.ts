import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

describe("BatchTransfer", function () {
  let signers: SignerWithAddress[] = [];
    
  beforeEach(async function () {
    signers = await ethers.getSigners();
    console.info('Signers:', signers.length);

    const ERC20 = await ethers.getContractFactory("ERC20Token");
    const token = await ERC20.deploy("TEST", "TEST", "1000000000000000000000000");
    console.info('ERC20 Address:', token.address);

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const batchTransfer = await BatchTransfer.deploy();
    console.info('BatchTransfer Address:', batchTransfer.address);
  });

  describe("Transfer", function () {
    it("Should set the right owner", async function () {
    });
  });
});
