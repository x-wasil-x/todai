/* eslint-disable global-require */
const { handlers } = require('../../libs/auth');

module.exports = {
  init(app) {
    handlers.attach({ app, ...require('./request-profile') });
  },
};
