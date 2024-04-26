'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Your account already exists',
        };
      }

      const saltRounds = 10;

      const passwordHash = bcrypt.hash(password, saltRounds);

      const newShop = await shopModel.create({
        name,
        email,
        passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userID: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: 'xxxx',
            message: 'publicKeyString error',
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );
        console.log(`Created Token Success::`, tokens);

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
