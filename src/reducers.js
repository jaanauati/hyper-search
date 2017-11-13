const { TOGGLE_SEARCH_INPUT, UPDATE_SEARCH_TEXT, CURRENT_MATCH } = require('./actionTypes');

exports.reduceUI = (state, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH_INPUT: {
      const uid = action.uid;
      const { hyperSearchToggleInput = {} } = state;
      return state.set(
        'hyperSearchToggleInput',
        Object.assign({}, hyperSearchToggleInput, { [uid]: !hyperSearchToggleInput[uid] })
      );
    }
    case UPDATE_SEARCH_TEXT: {
      const { hyperSearchInputText = {} } = state;
      return state.set('hyperSearchInputText',
        Object.assign({}, hyperSearchInputText, { [action.uid]: action.text }));
    }
    case CURRENT_MATCH: {
      const { hyperSearchCurrentRow = {} } = state;
      const { uid, row, startIndex, endIndex, endRow } = action.data;
      return state.set('hyperSearchCurrentRow',
        Object.assign({}, hyperSearchCurrentRow, { [uid]: { row, startIndex, endIndex, endRow } }));
    }
    default:
      return state;
  }
};
