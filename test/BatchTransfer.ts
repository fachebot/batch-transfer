import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import type { ERC20Token } from "../typechain-types/contracts/test/ERC20Token";
import type { BatchTransfer } from "../typechain-types/contracts/BatchTransfer";

let token: ERC20Token;
let tokenAddress: string;
let batchTransfer: BatchTransfer;
let signers: SignerWithAddress[] = [];

describe("BatchTransfer", function () {
  beforeEach(async function () {
    signers = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("ERC20Token");
    token = await ERC20.deploy("TEST", "TEST", "1000");
    tokenAddress = token.address;

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.connect(signers[0]).deploy();
  });

  describe("Transfer Ether", function () {
    it("Should revert with the right error if insufficient funds", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transfer(address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await expect(
        method(addresses, amount, { value: amount.mul(2) })
      ).to.be.revertedWith("BatchTransfer: insufficient funds");
    });

    it("Should revert with the right error if amount is not equal", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transfer(address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await expect(
        method(addresses, amount, { value: amount.mul(4) })
      ).to.be.revertedWith("BatchTransfer: value is not equal");
    });
  
    it("Should batch transfer successful", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transfer(address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await method(addresses, amount, { value: amount.mul(3) });
    });
  });

  describe("Transfer Ether(Different amounts)", function () {
    it("Should revert with the right error if array length must be the same", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3), BigNumber.from(4)];

      await expect(
        method(addresses, amounts, { value: BigNumber.from(10) })
      ).to.be.revertedWith("BatchTransfer: array length inconsistent");
    });

    it("Should revert with the right error if insufficient funds", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await expect(
        method(addresses, amounts, { value: BigNumber.from(4) })
      ).to.be.revertedWith("BatchTransfer: transfer failed");
    });

    it("Should revert with the right error if tx value greater than transfer amount", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await expect(
        method(addresses, amounts, { value: BigNumber.from(10) })
      ).to.be.revertedWith("BatchTransfer: value is not equal");
    });
  
    it("Should batch transfer successful", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transfer(address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await method(addresses, amounts, { value: BigNumber.from(6) });
    });
  });

  describe("Transfer ERC20", function () {
    it("Should revert with the right error if insufficient funds", async function () {
      const sender = signers[1];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transferToken(address,address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await expect(
        method(tokenAddress, addresses, amount)
      ).to.be.revertedWith("BatchTransfer: insufficient funds");
    });

    it("Should revert with the right error if insufficient allowance", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);
      const method = batchTransfer.connect(sender)["transferToken(address,address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      await expect(
        method(tokenAddress, addresses, amount)
      ).to.be.revertedWith("BatchTransfer: insufficient allowance");
    });

    it("Should batch transfer successful", async function () {
      const sender = signers[0];
      const amount = BigNumber.from(1);

      await token.connect(sender).approve(batchTransfer.address, BigNumber.from(3));
    
      const method = batchTransfer.connect(sender)["transferToken(address,address[],uint256)"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];

      expect(await token.balanceOf(addresses[0])).to.equal(BigNumber.from(0));
      expect(await token.balanceOf(addresses[1])).to.equal(BigNumber.from(0));
      expect(await token.balanceOf(addresses[2])).to.equal(BigNumber.from(0));

      await method(tokenAddress, addresses, amount);

      expect(await token.balanceOf(addresses[0])).to.equal(amount);
      expect(await token.balanceOf(addresses[1])).to.equal(amount);
      expect(await token.balanceOf(addresses[2])).to.equal(amount);
    });
  });

  describe("Transfer ERC20(Different amounts)", function () {
    it("Should revert with the right error if array length must be the same", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transferToken(address,address[],uint256[])"]

      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3), BigNumber.from(4)];

      await expect(
        method(tokenAddress, addresses, amounts)
      ).to.be.revertedWith("BatchTransfer: array length inconsistent");
    });

    it("Should revert with the right error if insufficient funds", async function () {
      const sender = signers[1];

      await token.connect(sender).approve(batchTransfer.address, BigNumber.from(6));

      const method = batchTransfer.connect(sender)["transferToken(address,address[],uint256[])"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await expect(
        method(tokenAddress, addresses, amounts)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should revert with the right error if insufficient allowance", async function () {
      const sender = signers[0];
      const method = batchTransfer.connect(sender)["transferToken(address,address[],uint256[])"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      await expect(
        method(tokenAddress, addresses, amounts)
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Should batch transfer successful", async function () {
      const sender = signers[0];

      await token.connect(sender).approve(batchTransfer.address, BigNumber.from(6));
    
      const method = batchTransfer.connect(sender)["transferToken(address,address[],uint256[])"]
      const addresses = [signers[1].address, signers[2].address, signers[3].address];
      const amounts = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)];

      expect(await token.balanceOf(addresses[0])).to.equal(BigNumber.from(0));
      expect(await token.balanceOf(addresses[1])).to.equal(BigNumber.from(0));
      expect(await token.balanceOf(addresses[2])).to.equal(BigNumber.from(0));

      await method(tokenAddress, addresses, amounts);

      expect(await token.balanceOf(addresses[0])).to.equal(amounts[0]);
      expect(await token.balanceOf(addresses[1])).to.equal(amounts[1]);
      expect(await token.balanceOf(addresses[2])).to.equal(amounts[2]);
    });
  });
});
