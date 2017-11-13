const { CURRENT_MATCH, TOGGLE_SEARCH_INPUT, UPDATE_SEARCH_TEXT } = require('./actionTypes');

module.exports.setCurrentMatch = function setCurrentMatch(
  uid, row, startIndex, endIndex, endRow
) {
  return (dispatch) => {
    dispatch({ type: CURRENT_MATCH, data: { uid, row, startIndex, endIndex, endRow } });
  };
};

module.exports.toggleSearchInput = function toggleSearchInput(uid) {
  return (dispatch) => {
    dispatch({ type: TOGGLE_SEARCH_INPUT, uid });
  };
};

module.exports.updateSearchText = function updateSearchText(uid, text) {
  return (dispatch) => {
    dispatch({ type: UPDATE_SEARCH_TEXT, uid, text });
  };
};
