const { CURRENT_MATCH, TOGGLE_CASE_INSENSITIVE_ACTION, TOGGLE_SEARCH_INPUT, UPDATE_SEARCH_TEXT } = require('./actionTypes');

module.exports.setCurrentMatch = function setCurrentMatch(
  uid, row, startIndex, endIndex, endRow
) {
  return (dispatch) => {
    dispatch({ type: CURRENT_MATCH, data: { uid, row, startIndex, endIndex, endRow } });
  };
};

module.exports.resetCurrentMatch = function resetCurrentMatch(
  uid, term
) {
  const { buffer: { lines: { length: rows } } } = term;
  const row = 0;
  const startIndex = 0;
  const endRow = rows - 1;
  const endIndex = 0;
  return (dispatch) => {
    dispatch({
      type: CURRENT_MATCH,
      data: {
        uid, row, startIndex, endIndex, endRow, reset: true
      }
    });
  };
};

module.exports.toggleSearchInput = function toggleSearchInput(uid) {
  return (dispatch) => {
    dispatch({ type: TOGGLE_SEARCH_INPUT, uid });
  };
};

module.exports.toggleCaseInsensitiveAction = function toggleCaseInsensitiveAction(uid) {
  return (dispatch) => {
    dispatch({ type: TOGGLE_CASE_INSENSITIVE_ACTION, uid });
  };
};

module.exports.updateSearchText = function updateSearchText(uid, text) {
  return (dispatch) => {
    dispatch({ type: UPDATE_SEARCH_TEXT, uid, text });
  };
};
