// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BatchTransfer {
    using SafeERC20 for IERC20;

    function transfer(address[] calldata addresses, uint256 amount)
        external
        payable
    {
        uint256 total = amount * addresses.length;
        require(msg.value <= total, "BatchTransfer: value is not equal");
        require(msg.value == total, "BatchTransfer: insufficient funds");

        for (uint256 i = 0; i < addresses.length; ) {
            (bool success, ) = addresses[i].call{value: amount}("");
            require(success, "BatchTransfer: transfer failed");

            unchecked {
                i++;
            }
        }
    }

    function transfer(address[] calldata addresses, uint256[] calldata amounts)
        external
        payable
    {
        require(
            addresses.length == amounts.length,
            "BatchTransfer: array length inconsistent"
        );

        uint256 value = msg.value;

        for (uint256 i = 0; i < addresses.length; ) {
            (bool success, ) = addresses[i].call{value: amounts[i]}("");
            require(success, "BatchTransfer: transfer failed");

            unchecked {
                value -= amounts[i];
                i++;
            }
        }

        require(value == 0, "BatchTransfer: value is not equal");
    }

    function transferToken(
        IERC20 token,
        address[] calldata addresses,
        uint256 amount
    ) external {
        uint256 total = amount * addresses.length;
        require(
            token.balanceOf(msg.sender) >= total,
            "BatchTransfer: insufficient funds"
        );
        require(
            token.allowance(msg.sender, address(this)) >= total,
            "BatchTransfer: insufficient allowance"
        );

        for (uint256 i = 0; i < addresses.length; ) {
            token.safeTransferFrom(msg.sender, addresses[i], amount);

            unchecked {
                i++;
            }
        }
    }

    function transferToken(
        IERC20 token,
        address[] calldata addresses,
        uint256[] calldata amounts
    ) external {
        require(
            addresses.length == amounts.length,
            "BatchTransfer: array length inconsistent"
        );

        for (uint256 i = 0; i < addresses.length; ) {
            token.safeTransferFrom(msg.sender, addresses[i], amounts[i]);

            unchecked {
                i++;
            }
        }
    }
}
