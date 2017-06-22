const { setCurrentMatch, toggleSearchInput, updateSearchText } = require('./actions');
const { DIRECTION_NEXT, DIRECTION_PREV, ENTER, ESCAPE } = require('./constants');

exports.mapTermsState = (state, map) => (
  Object.assign(map, {
    focussedSessionUid: state.sessions.activeUid,
    hyperSearchToggleInput: state.ui.hyperSearchToggleInput,
    hyperSearchInputText: state.ui.hyperSearchInputText,
    hyperSearchLastUserSearch: state.ui.hyperSearchLastUserSearch,
    hyperSearchCurrentRow: state.ui.hyperSearchCurrentRow,
  })
);

exports.passProps = (uid, parentProps, props) => (
  Object.assign(props, {
    focussedSessionUid: parentProps.focussedSessionUid,
    hyperSearchToggleInput: parentProps.hyperSearchToggleInput,
    hyperSearchInputText: parentProps.hyperSearchInputText,
    hyperSearchLastUserSearch: parentProps.hyperSearchLastUserSearch,
    hyperSearchCurrentRow: parentProps.hyperSearchCurrentRow,
  })
);

exports.getTermGroupProps = exports.passProps;
exports.getTermProps = exports.passProps;

exports.decorateTerm = (Term, { React }) => {
  class HyperSearchTerm extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.inputNode = null;
      this.handleSearchNext = this.handleSearchNext.bind(this);
      this.handleSearchPrev = this.handleSearchPrev.bind(this);
      this.handleToggleInput = this.handleToggleInput.bind(this);
      this.handleOnChange = this.handleOnChange.bind(this);
      this.handleOnFocus = this.handleOnFocus.bind(this);
      this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    componentDidMount() {
      window.rpc.on('hyper-search:seach:next', this.handleSearchNext);
      window.rpc.on('hyper-search:seach:prev', this.handleSearchPrev);
      window.rpc.on('hyper-search:toggle:input', this.handleToggleInput);
    }

    componentWillUnmount() {
      window.rpc.removeListener('hyper-search:seach:next', this.handleSearchNext);
      window.rpc.removeListener('hyper-search:seach:prev', this.handleSearchPrev);
      window.rpc.removeListener('hyper-search:toggle:input', this.handleToggleInput);
    }

    getContiguousRows(rowNr, direction) {
      const { term } = this.props;
      let node = term.getRowNode(rowNr);
      let rows = [node];
      let row = rowNr;
      if (direction === DIRECTION_NEXT) {
        const rowsCount = term.getRowCount();
        while (node.attributes['line-overflow'] && row < rowsCount - 1) {
          row++;
          node = term.getRowNode(row);
          rows.push(node);
        }
      } else {
        let keepGoing = true;
        while (keepGoing && row > 0) {
          const prevNode = term.getRowNode(--row);
          if (prevNode.attributes['line-overflow']) {
            rows.push(prevNode);
          } else {
            keepGoing = false;
          }
        }
        rows = rows.reverse();
      }
      return rows;
    }

    getLastMatchPosition() {
      const { hyperSearchCurrentRow = {}, uid } = this.props;
      return hyperSearchCurrentRow[uid] || {};
    }

    getInputText() {
      const { hyperSearchInputText = {}, uid } = this.props;
      return hyperSearchInputText[uid] || '';
    }

    toggleInput() {
      const { hyperSearchToggleInput = {}, uid } = this.props;
      return !!hyperSearchToggleInput[uid];
    }

    handleToggleInput() {
      const { term, uid, focussedSessionUid } = this.props;
      if (uid === focussedSessionUid) {
        // if input is visible, but terminal is focused we don't just focus
        // the input
        if (term.getDocument().hasFocus() && this.toggleInput()) {
          if (this.inputNode) this.inputNode.focus();
        } else {
          window.store.dispatch(toggleSearchInput(uid));
          // set focus on term if panel was just hidden.
          if (this.toggleInput() === false) {
            if (this.props.term) this.props.term.focus();
          }
        }
      }
    }

    handleOnFocus(event) {
      event.target.select();
    }

    handleOnChange(event) {
      const { uid, focussedSessionUid } = this.props;
      if (uid === focussedSessionUid) {
        window.store.dispatch(updateSearchText(uid, event.target.value));
        window.store.dispatch(setCurrentMatch(uid, 0, 0, 0));
      }
    }

    handleOnKeyDown(event) {
      const { uid, focussedSessionUid } = this.props;
      if (uid === focussedSessionUid) {
        if (event.key === ENTER) {
          this.handleSearchNext();
        } else if (event.key === ESCAPE) {
          window.store.dispatch(toggleSearchInput(uid));
          // set focus on term if panel was just hidden.
          if (this.toggleInput() === false) {
            if (this.props.term) this.props.term.focus();
          }
        }
      }
    }

    handleSearchPrev() {
      const { uid, focussedSessionUid } = this.props;
      if (uid === focussedSessionUid) {
        this.search(DIRECTION_PREV);
      }
    }

    handleSearchNext() {
      const { uid, focussedSessionUid } = this.props;
      if (uid === focussedSessionUid) {
        this.search(DIRECTION_NEXT);
      }
    }

    // TODO: multileline/row support (row.line-overflow=true)
    search(direction = DIRECTION_NEXT) {
      const { term, uid } = this.props;
      window.term = term;
      const input = this.getInputText();
      if (!input) return;
      const rowsCount = term.getRowCount();
      const increment = (direction === DIRECTION_NEXT) ? 1 : -1;
      let { row = (direction === DIRECTION_NEXT) ? 0 : rowsCount,
            startIndex = 0, endIndex = 0 } = this.getLastMatchPosition();
      while ((direction === DIRECTION_NEXT && row < rowsCount) ||
            (direction === DIRECTION_PREV && row >= 0)) {
        const nodes = this.getContiguousRows(row, direction);
        const children = [];
        for (const node of nodes) {
          for (const child of node.childNodes) {
            children.push(child);
          }
        }
        const childrenOffsets = [];
        let fullText = '';
        for (const child of children) {
          childrenOffsets.push(fullText.length);
          if (child.tagName !== undefined && child.tagName !== 'SPAN') {
            break;
          }
          fullText += child.innerHTML || child.textContent;
        }
        let sliceLeft = 0;
        let sliceRight = fullText.length;
        const indexOf = (direction === DIRECTION_NEXT) ? String.prototype.indexOf :
          String.prototype.lastIndexOf;
        if (startIndex !== endIndex) {
          if (direction === DIRECTION_NEXT) {
            sliceLeft = endIndex;
            sliceRight = undefined;
          } else {
            sliceLeft = 0;
            sliceRight = startIndex;
          }
        }
        startIndex = indexOf.call(fullText.slice(sliceLeft, sliceRight), input);
        if (startIndex !== -1) {
          startIndex += sliceLeft;
          endIndex = startIndex + input.length;
          let startNode = null;
          let endNode = null;
          let startNodeIdx = 0;
          let endNodeIdx = 0;
          let idx = 0;
          for (idx; idx < childrenOffsets.length; idx++) {
            if (startNode === null) {
              if (childrenOffsets[idx + 1] === undefined) {
                startNode = children[idx];
                break;
              } else if (childrenOffsets[idx] <= startIndex &&
                         childrenOffsets[idx + 1] > startIndex) {
                startNode = children[idx];
                break;
              }
            }
          }
          if (startNode !== null) startNodeIdx = idx;
          for (idx; idx < childrenOffsets.length; idx++) {
            if (endNode === null) {
              if (childrenOffsets[idx + 1] === undefined) {
                endNode = children[idx];
                break;
              } else if (childrenOffsets[idx] <= endIndex &&
                         childrenOffsets[idx + 1] > endIndex) {
                endNode = children[idx];
                break;
              }
            }
          }
          if (endNode !== null) endNodeIdx = idx;
          if (startNode !== null && endNode !== null) {
            term.scrollHome();
            // eslint-disable-next-line no-underscore-dangle
            term.scrollPort_.scrollRowToBottom(row + nodes.length);
            // eslint-disable-next-line no-loop-func
            setTimeout(() => {
              const termDocument = term.getDocument();
              const range = termDocument.createRange();
              const sel = termDocument.getSelection();
              range.selectNodeContents(termDocument);
              range.setStart(
                startNode.childNodes.length ? startNode.childNodes[0] : startNode,
                startIndex - childrenOffsets[startNodeIdx]
              );
              range.setEnd(
                endNode.childNodes.length ? endNode.childNodes[0] : endNode,
                endIndex - childrenOffsets[endNodeIdx]
              );
              window.lastRange = range;
              sel.removeAllRanges();
              sel.addRange(range);
              window.store.dispatch(setCurrentMatch(uid, row, startIndex, endIndex));
            }, 20);
            return;
          }
        }
        startIndex = 0;
        endIndex = 0;
        row += increment * nodes.length;
      }
      if (row >= 0) {
        window.store.dispatch(setCurrentMatch(uid, 0, 0, 0));
        // ßbeep
      }
    }
    render() {
      const style = Object.assign({}, this.props.style || {}, { height: '100%' });
      return React.createElement(
        'div',
        { style },
        this.toggleInput() &&
        React.createElement('div', {
          style: {
            height: '30px',
            position: 'absolute',
            right: '10px',
            top: '5px',
            width: '200px',
          },
        },
        React.createElement('input', {
          id: 'hyper-search-input',
          autoFocus: true,
          onChange: this.handleOnChange,
          onFocus: this.handleOnFocus,
          onKeyDown: this.handleOnKeyDown,
          placeholder: 'Search...',
          ref: (node) => { this.inputNode = node; },
          style: { fontSize: '0.8em', height: '100%' },
          value: this.getInputText(),
        }),
        React.createElement(
          'button', {
            style: { height: '100%', width: '12%' },
            onClick: this.handleSearchPrev,
          },
          '◀️'),
        React.createElement(
          'button', {
            style: { height: '100%', width: '12%' },
            onClick: this.handleSearchNext,
          },
          '▶️'
        )),
        React.createElement(Term, this.props)
      );
    }
  }
  return HyperSearchTerm;
};
