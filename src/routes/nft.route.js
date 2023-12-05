const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const nftValidation = require('../validations/nft.validation');
const nftController = require('../controllers/nft.controller');

const router = express.Router();

router.get('/getNftBalance', validate(nftValidation.getNftBalance) , nftController.getNftBalance);
router.get('/getSingleNftPrice', validate(nftValidation.getSingleNftBalance) , nftController.getSingleNftPrice);
router.get('/getNftPrice', validate(nftValidation.getNftPrice) , nftController.getNftPrice);
router.get('/getNftSaleDetails', validate(nftValidation.getNftSaleDetails) , nftController.getNftSaleDetails);
router.get('/isEligibleToMint', validate(nftValidation.isEligibleToMint) , nftController.isEligibleToMint);
router.get('/pixoErc20Balance', validate(nftValidation.pixoErc20Balance) , nftController.pixoErc20Balance);


module.exports = router;
