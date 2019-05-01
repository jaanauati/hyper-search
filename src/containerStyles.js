const { STYLE_CLASSES } = require('./constants');

const buttonStyles = (config) => {
  return `
    background: ${config.foregroundColor};
    border: none;
    color: ${config.backgroundColor};
    height: 100%;
    padding-bottom: 2px;
    opacity: 0.6;
    outline: none;
    position: relative;
    top: -2px;
    width: 12%;
  `
}


exports.decorateConfig = (config) => {
  const hyperSearchUI = Object.assign({
    inputBorderRadius: 10,
    buttonBorderRadius: 10,
    prevButton: '◀',
    nextButton: '▶',
    buttonMargin: 0
  }, config.hyperSearchUI)

  return Object.assign({}, config, {
    css: `
      ${config.css ? config.css : ''}
      .${STYLE_CLASSES.wrapper} {
        background: ${config.backgroundColor};
        border-radius: ${hyperSearchUI.inputBorderRadius}px;
        border: 1px solid ${config.foregroundColor};
        height: 30px;
        opacity: 0.6;
        padding: 5px 0 5px 10px;
        position: absolute;
        right: 10px;
        top: 5px;
        width: ${240 + hyperSearchUI.buttonMargin * 2 + 1}px;
        z-index: 9999;
      }

      .${STYLE_CLASSES.input} {
          background: none;
          border: none;
          color: ${config.foregroundColor};
          font-size: 0.8em;
          opacity: 1;
          outline: none;
      }

      .${STYLE_CLASSES.previousButton} {
        border-radius: ${hyperSearchUI.buttonBorderRadius}px 0 0 ${hyperSearchUI.buttonBorderRadius}px;
        ${buttonStyles(config)}
      }

      .${STYLE_CLASSES.previousButton}::after {
        content: "${hyperSearchUI.prevButton}";
      }

      .${STYLE_CLASSES.nextButton} {
        border-radius: 0 ${hyperSearchUI.buttonBorderRadius}px ${hyperSearchUI.buttonBorderRadius}px 0;
        margin-right: ${hyperSearchUI.buttonMargin}px;
        ${buttonStyles(config)}
      }

      .${STYLE_CLASSES.nextButton}::after {
        content: "${hyperSearchUI.nextButton}";
      }

      .${STYLE_CLASSES.caseButton} {
        margin-right: ${hyperSearchUI.buttonMargin}px;
      }

      .${STYLE_CLASSES.caseButton}::after {
        content: "⇪";
      }

      .${STYLE_CLASSES.caseButtonFocused} {
        border-radius: ${hyperSearchUI.buttonBorderRadius}px;
        ${buttonStyles(config)}
      }

      .${STYLE_CLASSES.caseButtonUnfocused} {
          background: ${config.backgroundColor};
          border: none;
          color: ${config.foregroundColor};
          height: 100%;
          padding-bottom: 2px;
          opacity: 0.6;
          outline: none;
          position: relative;
          top: -2px;
          width: 12%;
          border-radius: ${hyperSearchUI.buttonBorderRadius}px;
      }
    `
  });
};
