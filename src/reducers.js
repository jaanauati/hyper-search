const { TOGGLE_SEARCH_INPUT, TOGGLE_CASE_INSENSITIVE, UPDATE_SEARCH_TEXT, CURRENT_MATCH } = require('./actionTypes');

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

    case TOGGLE_CASE_INSENSITIVE: {
      const uid = action.uid;
      const { hyperSearchToggleCaseInsensitive = {} } = state;
      return state.set(
        'hyperSearchToggleCaseInsensitive',
        Object.assign({}, hyperSearchToggleCaseInsensitive, { [uid]: !hyperSearchToggleCaseInsensitive[uid] })
      );
    }

    case UPDATE_SEARCH_TEXT: {
      const { hyperSearchInputText = {} } = state;
      return state.set('hyperSearchInputText',
        Object.assign({}, hyperSearchInputText, { [action.uid]: action.text }));
    }

    case CURRENT_MATCH: {
      const { hyperSearchCurrentRow = {} } = state;
      const { uid, row, startIndex, endIndex, endRow, reset } = action.data;
      return state.set('hyperSearchCurrentRow',
        Object.assign({}, hyperSearchCurrentRow, {
          [uid]: { row, startIndex, endIndex, endRow, reset }
        }));
    }
    default:
      return state;
  }
};
