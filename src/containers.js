const { resetCurrentMatch, setCurrentMatch, toggleSearchInput,
        updateSearchText } = require('./actions');
const { wrapperStyles, inputStyles, previousButtonStyles,
  nextButtonStyles } = require('./containerStyles');
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

    //legacy code for version <= 1.4.8
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
        window.store.dispatch(toggleSearchInput(uid));
        if (this.toggleInput()) {
          if (this.inputNode) {
            this.inputNode.focus();
          }
        } else if (term) {
          this.props.term.focus();
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
        if (event.key === ENTER && event.shiftKey) {
          this.handleSearchPrev();
        } else if (event.key === ENTER) {
          this.handleSearchNext();
        } else if (event.key === ESCAPE) {
          window.store.dispatch(toggleSearchInput(uid));
          if (this.props.term) this.props.term.focus();
        }
      }
    }

    handleSearch(direction) {
      const { term } = this.props;
      if (!term.selectionManager) {
        this.legacySearch(direction);
      } else {
        this.search(direction);
      }
    }

    handleSearchPrev() {
      const { uid, focussedSessionUid } = this.props;
      if (uid === focussedSessionUid) {
        this.handleSearch(DIRECTION_PREV);
      }
    }

    handleSearchNext() {
      const { uid, focussedSessionUid } = this.props;
      if (uid === focussedSessionUid) {
        this.handleSearch(DIRECTION_NEXT);
      }
    }

    highlightLine(startRow, startIdx, endRow, endIdx) {
      let _startRow;
      let _startIdx;
      let _endRow;
      let _endIdx;
      if ((startRow * 1000) + startIdx <= (endRow * 1000) + endIdx) {
        _startRow = startRow;
        _endRow = endRow;
        _startIdx = startIdx;
        _endIdx = endIdx;
      } else {
        _startRow = endRow;
        _endRow = startRow;
        _startIdx = endIdx;
        _endIdx = startIdx;
      }
      const { term, uid } = this.props;
      term.selectionManager._model.selectionStart = [_startIdx, _startRow];
      term.selectionManager._model.selectionEnd = [_endIdx + 1, _endRow];
      term.selectionManager.refresh();
      term.scrollLines(_startRow - term.buffer.ydisp);
      window.store.dispatch(
        setCurrentMatch(uid, _startRow, _startIdx, _endIdx, _endRow)
      );
    }

    getLine(lineNr) {
      let line = null;
      const { term } = this.props;
      const { buffer: { lines } } = term;
      const { length: rows } = lines;
      if (lineNr >= 0 && lineNr < rows) {
        line = lines.get(lineNr)
          .reduce((acc, el) => acc + el[1], '');
      }
      return line;
    }
    // toodo: refactor this method and write some tests
    search(direction = DIRECTION_NEXT) {
      const { term, uid } = this.props;
      const { buffer: { lines: { length: rows } } } = term;
      const input = this.getInputText();
      const lastMatch = this.getLastMatchPosition();
      const { reset: initialState } = lastMatch;
      let {
        row: startRow = 0,
        startIndex: startIdx = 0,
        endRow = rows - 1,
        endIndex: endIdx = 0,
      } = lastMatch;
      let _startRow = startRow;
      let increment;
      let initialInputIdx;
      let lastInputIdx;
      let rowNr;
      let _startIdx;
      if (direction === DIRECTION_NEXT) {
        increment = 1;
        initialInputIdx = 0;
        lastInputIdx = input.length - 1;
        rowNr = startRow;
        _startIdx = startIdx;
      } else {
        increment = -1;
        initialInputIdx = input.length - 1;
        lastInputIdx = 0;
        rowNr = endRow;
        _startIdx = endIdx;
      }
      if (initialState !== true) {
        _startIdx += increment;
      }
      let currentLine = this.getLine(rowNr);
      if (currentLine === null) {
        window.store.dispatch(
          resetCurrentMatch(uid, term)
        );
        return;
      }
      let currentLineLenght = currentLine.length;
      let currentLineLastIdx = (direction === DIRECTION_NEXT) ? currentLineLenght : -1;
      if (endIdx === 0) {
        endIdx = currentLine.length - 1;
      }
      let rewind = false;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        let inputIdx = initialInputIdx;
        let lineIdx = _startIdx;
        while (lineIdx !== currentLineLastIdx) {
          if (inputIdx === initialInputIdx) {
            _startRow = rowNr;
            _startIdx = lineIdx;
          }
          if (input[inputIdx] !== currentLine[lineIdx]) {
            inputIdx = initialInputIdx;
            // if match started in a different row we rewind to it.
            _startIdx += increment;
            if (_startRow !== rowNr) {
              rewind = true;
              rowNr = _startRow;
              break;
            }
          } else if (inputIdx === lastInputIdx) {
            // match found
            break;
          } else {
            inputIdx += increment;
          }
          lineIdx += increment;
        }
        // match found. we set variables, hightlight the result, save
        // state into reducer and stop the iteration.
        if (inputIdx === lastInputIdx) {
          startRow = _startRow;
          startIdx = _startIdx;
          endRow = rowNr;
          endIdx = lineIdx;
          this.highlightLine(startRow, startIdx, endRow, endIdx);
          return;
        }
        if (!rewind) {
          rowNr += increment;
          startIdx = -1;
        }
        currentLine = this.getLine(rowNr);
        if (currentLine === null) {
          window.store.dispatch(
            resetCurrentMatch(uid, term, direction)
          );
          return;
        }
        currentLineLenght = currentLine.length;
        if (rewind) {
          // have var pointing the right index.
          _startIdx += increment;
          rewind = false;
          break;
        } else {
          // reset pointer
          _startIdx = (direction === DIRECTION_NEXT) ? 0 : currentLineLenght - 1;
          currentLineLastIdx = (direction === DIRECTION_NEXT) ? currentLineLenght : -1;
        }
      }
    }

    //legacy code for version <= 1.4.8
    legacySearch(direction = DIRECTION_NEXT) {
      const { term, uid } = this.props;
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
          className: 'hyper-search-wrapper',
          style: wrapperStyles(this.props),
        },
        React.createElement('input', {
          id: 'hyper-search-input',
          autoFocus: true,
          onChange: this.handleOnChange,
          onFocus: this.handleOnFocus,
          onKeyDown: this.handleOnKeyDown,
          placeholder: 'Search...',
          ref: (node) => { this.inputNode = node; },
          style: inputStyles(this.props),
          value: this.getInputText(),
        }),
        React.createElement(
          'button', { 
            style: previousButtonStyles(this.props),
            onClick: this.handleSearchPrev,
          },
          '◀️'),
        React.createElement(
          'button', { 
            style: nextButtonStyles(this.props),
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
