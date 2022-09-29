# Batch Transfer
Token Batch Transfer Smart Contract

## Contracts

---

### BatchTransfer
* BatchTransfer contract is to enable token owner to perform a batch transfer of the native currency and ERC20 tokens.

## Software Requirements
* [Npm](https://www.npmjs.com/package/npm)
* [Node.js](https://github.com/nodejs/node) (14+)

## Install

### Dependencies
```shell
npm install
```

### Compile 
```shell
npx hardhat compile
```

### Test 
```shell
npx hardhat test
```

Report Gas:

```shell
REPORT_GAS=true npx hardhat test
```

## Deploy
Preparation:
- Set `NODE_URL` in `.env`
- Set `PRIVATE_KEY` in `.env`

```shell
npx hardhat run scripts/deploy.ts --network <network>
```
