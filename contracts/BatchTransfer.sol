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
        require(
            msg.value == amount * addresses.length,
            "BatchTransfer: insufficient funds"
        );

        for (uint256 i = 0; i < addresses.length; ) {
            (bool success, ) = addresses[i].call{value: amount}("");
            require(success, "transfer failed");

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

        for (uint256 i = 0; i < addresses.length; ) {
            (bool success, ) = addresses[i].call{value: amounts[i]}("");
            require(success, "BatchTransfer: transfer failed");

            unchecked {
                i++;
            }
        }
    }

    function transferToken(IERC20 token, address[] calldata addresses, uint256 amount) external {
        require(
            token.balanceOf(msg.sender) == amount * addresses.length,
            "BatchTransfer: insufficient funds"
        );
        require(
            token.allowance(msg.sender, address(this)) <
                amount * addresses.length,
            "BatchTransfer: insufficient allowance"
        );

        for (uint256 i = 0; i < addresses.length; ) {
            token.safeTransferFrom(msg.sender, addresses[i], amount);

            unchecked {
                i++;
            }
        }
    }

    function transferToken(IERC20 token, address[] calldata addresses, uint256[] calldata amounts) external {
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
