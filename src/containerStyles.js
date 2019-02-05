exports.wrapperStyles = (props) => {
  return {
    background: props.backgroundColor,
    borderRadius: '10px',
    border: `1px solid ${props.foregroundColor}`,
    height: '30px',
    opacity: 0.6,
    padding: "5px 0 5px 10px",
    position: 'absolute',
    right: '10px',
    top: '5px',
    width: '240px',
    zIndex: '9999',
  };
};

exports.inputStyles = (props) => {
  return {
    background: "none",
    border: "none",
    color: props.foregroundColor,
    fontSize: '0.8em',
    opacity: 1,
    outline: "none",
  };
};

const buttonStyles = (props) => {
  return {
    background: props.foregroundColor,
    border: 'none',
    color: props.backgroundColor,
    height: '100%',
    paddingBottom: '2px',
    opacity: 0.6,
    outline: 'none',
    position: 'relative',
    top: '-2px',
    width: '12%',
  }
}

exports.caseButtonOffStyles = (props) => {
  return Object.assign({}, buttonStyles(props), {
    borderRadius: '12px 12px 12px 12px',
  });
};

exports.caseButtonStyles = (props) => {
  return {
    background: props.backgroundColor,
    border: 'none',
    color: props.foregroundColor,
    height: '100%',
    paddingBottom: '2px',
    opacity: 0.6,
    outline: 'none',
    position: 'relative',
    top: '-2px',
    width: '12%',
    borderRadius: '12px 12px 12px 12px',
  }
};

exports.previousButtonStyles = (props) => {
  return Object.assign({}, buttonStyles(props), {
    borderRadius: '10px 0 0 10px',
  });
};

exports.nextButtonStyles = (props) => {
  return Object.assign({}, buttonStyles(props), {
    borderRadius: '0 10px 10px 0',
  });
};
