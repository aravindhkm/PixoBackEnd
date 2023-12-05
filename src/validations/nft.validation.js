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

const getNfts = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


module.exports = {
  getNftPrice,
  getNftBalance,
  getNftSaleDetails,
  getSingleNftBalance,
  isEligibleToMint
};
