
const { decorateTerm, mapTermsState, passProps, getTermGroupProps, getTermProps } = require('./containers');
const { decorateMenu } = require('./menu');
const { reduceUI } = require('./reducers');

exports.reduceUI = reduceUI;
exports.decorateMenu = decorateMenu;
exports.decorateTerm = decorateTerm;
exports.mapTermsState = mapTermsState;
exports.passProps = passProps;
exports.getTermGroupProps = getTermGroupProps;
exports.getTermProps = getTermProps;
