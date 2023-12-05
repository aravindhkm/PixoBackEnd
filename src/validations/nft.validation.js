const Joi = require('joi');

const getNftBalance = {
  query: Joi.object().keys({
    account: Joi.string().required(),
  }),
};

const getSingleNftBalance = {
  query: Joi.object().keys({
    account: Joi.string().required(),
    tokenId: Joi.string().required(),
  }),
};

const getNftPrice = {
  query: Joi.object().keys({
    tokenId: Joi.string().required(),
  }),
};

const getNftSaleDetails = {
  query: Joi.object().keys({
    tokenId: Joi.string().required(),
  }),
};

const isEligibleToMint = {
  query: Joi.object().keys({
    account: Joi.string().required(),
    tokenId: Joi.string().required(),
  }),
};

const pixoErc20Balance = {
  query: Joi.object().keys({
    account: Joi.string().required(),
  }),
};


module.exports = {
  getNftPrice,
  getNftBalance,
  pixoErc20Balance,
  getNftSaleDetails,
  getSingleNftBalance,
  isEligibleToMint
};
