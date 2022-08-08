import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import type { BatchTransfer } from "../typechain-types/contracts/BatchTransfer";

let tokenAddress: string;
let batchTransfer: BatchTransfer;
let signers: SignerWithAddress[] = [];

describe("BatchTransfer", function () {
  beforeEach(async function () {
    signers = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("ERC20Token");
    const token = await ERC20.deploy("TEST", "TEST", "1000");
    tokenAddress = token.address;

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    tokenAddress = batchTransfer.address;
  });

  describe("Transfer Ether", function () {
    it("Insufficient funds", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transfer(address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await expect(
        method(addresses, amount, { value: amount.mul(2) })
      ).to.be.revertedWith("BatchTransfer: insufficient funds");
    });

    it("Transaction amount greater than transfer amount", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transfer(address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await expect(
        method(addresses, amount, { value: amount.mul(4) })
      ).to.be.revertedWith("BatchTransfer: value is not equal");
    });
  
    it("Batch transfer successful", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transfer(address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await method(addresses, amount, { value: amount.mul(3) });
    });
  });

  describe("Transfer Ether(Different amounts)", function () {
    it("The array length must be the same", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3), BigNumber.from(4)];

      await expect(
        method(addresses, amounts, { value: BigNumber.from(10) })
      ).to.be.revertedWith("BatchTransfer: array length inconsistent");
    });

    it("Insufficient funds", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await expect(
        method(addresses, amounts, { value: BigNumber.from(4) })
      ).to.be.revertedWith("BatchTransfer: transfer failed");
    });

    it("Transaction amount greater than transfer amount", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await expect(
        method(addresses, amounts, { value: BigNumber.from(10) })
      ).to.be.revertedWith("BatchTransfer: value is not equal");
    });
  
    it("Batch transfer successful", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await method(addresses, amounts, { value: BigNumber.from(6) });
    });
  });
});
