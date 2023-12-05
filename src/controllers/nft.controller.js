const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { nftService } = require('../services');
const { Web3 } = require("web3");
const pixoNft = require('../config/pixoNft');
const pixoToken = require('../config/pixoToken');
const nftIds = require('../config/nftId');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const currentWeb3 = new Web3(new Web3.providers.HttpProvider(config.rpcUrl));
const nftInstance = new currentWeb3.eth.Contract(pixoNft,config.pixoNft);
const tokenInstance = new currentWeb3.eth.Contract(pixoToken,config.pixoToken);

const getNftBalance = catchAsync(async (req, res) => {
  const result = await nftInstance.methods.balanceOfTokenBatch(req.query.account.toString(),nftIds).call();
  let balance = [];

  for (let i = 0; i < result.length; i++) {
    if(Number(result[i].tokenBalance) != 0) {
      balance.push({
        "tokenId": Number(result[i].tokenId),
        "tokenBalance": Number(result[i].tokenBalance)
      })
    }
  }

  res.status(httpStatus.OK).send({
      "status": true,
      "data": balance 
  });
});

const getSingleNftPrice = catchAsync(async (req, res) => {
  const result = await nftInstance.methods.balanceOf(req.query.account,req.query.tokenId).call();

  res.status(httpStatus.OK).send({
      "status": true,
      "data": Number(result) 
  });
});

const getNftPrice = catchAsync(async (req, res) => {
  const result = Number(await nftInstance.methods.getNftPrice(req.query.tokenId).call()) * 1e18;

  res.status(httpStatus.OK).send({
      "status": true,
      "data": (result).toLocaleString('fullwide', {useGrouping: false}) 
  });
});

const getNftSaleDetails = catchAsync(async (req, res) => {
  const nftMaxSupply = Number(await nftInstance.methods.nftMaxSupply().call());
  const result = Number(await nftInstance.methods.totalSupply(req.query.tokenId).call());

  res.status(httpStatus.OK).send({
      "status": true,
      "data": {
        "maxSupply": nftMaxSupply,
        "leftOverNft": (nftMaxSupply - result)
      }
  });
});

const isEligibleToMint = catchAsync(async (req, res) => {
  const pixoBalance = Number(await tokenInstance.methods.balanceOf(req.query.account).call());
  const pixoAllowance = Number(await tokenInstance.methods.allowance(req.query.account,config.pixoNft).call());
  const nftPrice = Number(await nftInstance.methods.getNftPrice(req.query.tokenId).call()) * 1e18;

  let result = "";

  if(pixoBalance < nftPrice) {
    result = `Insufficient Pixo Balance. Please buy ${(nftPrice - pixoBalance) / 1e18} Pixo`;
  } else if(pixoAllowance < nftPrice) {
    result = "Insufficient Allowance";
  } else {
    result = "Eligible to MINT"
  }

  res.status(httpStatus.OK).send({
      "status": true,
      "data": result
  });
});

const pixoErc20Balance = catchAsync(async (req, res) => {
  const pixoBalance = Number(await tokenInstance.methods.balanceOf(req.query.account).call());
  const pixoAllowance = Number(await tokenInstance.methods.allowance(req.query.account,config.pixoNft).call());

  res.status(httpStatus.OK).send({
      "status": true,
      "data": {
        "pixoErc20Balance": pixoBalance,
        "pixoAllowance": pixoAllowance
      }
  });
});

const getTokenUri = catchAsync(async (req, res) => {
  const folderPath = 'src/metadata'; // Replace this with the path to your folder containing JSON files
  const fileName = `${req.query.tokenId}.json`; // Replace this with the name of the JSON file you want to read
  
  const filePath = path.join(folderPath, fileName);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${fileName}: ${err}`);
    } else {
      try {
        const jsonData = JSON.parse(data);
        // console.log(`Contents of ${fileName}:`, jsonData);
        
        res.status(httpStatus.OK).send({
          "status": true,
          "data": {
            "tokenId": req.query.tokenId,
            "tokenUri": jsonData,
          }
        });
      } catch (parseError) {
        console.error(`Error parsing JSON in file ${fileName}: ${parseError}`);
      }
    }
  });
});

const getAllTokenUri = catchAsync(async (req, res) => {  
  const folder = 'src/metadata';
  const files = fs.readdirSync(folder);
  const readFileAsync = promisify(fs.readFile);
  const tokenUri = [];

  const filePromises = files.map(async (file) => {
    const filePath = path.join(folder, file);
    const fileExt = path.extname(filePath);

    if (fileExt === '.json') {
      try {
        const data = await readFileAsync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        const updatedString = file.replace('.json', '');

        tokenUri.push({
          "tokenId": updatedString,
          "tokenUri": jsonData
        });
      } catch (error) {
        console.error(`Error processing file ${file}: ${error}`);
      }
    }
  });

  await Promise.all(filePromises);

  res.status(httpStatus.OK).send({
    "status": true,
    "data": tokenUri
  });

});

module.exports = {
  getTokenUri,
  getNftPrice,
  getNftBalance,
  getAllTokenUri,
  pixoErc20Balance,
  getSingleNftPrice,
  getNftSaleDetails,
  isEligibleToMint
};
