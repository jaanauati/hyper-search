const { STYLE_CLASSES } = require('./constants');

const buttonStyles = config => `
    background: ${config.foregroundColor};
    border: none;
    color: ${config.backgroundColor};
    opacity: 0.6;
    outline: none;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;


exports.decorateConfig = (config) => {
  const hyperSearchUI = Object.assign({
    inputBorderRadius: 10,
    buttonBorderRadius: 10,
    prevButton: '◀',
    nextButton: '▶',
  }, config.hyperSearchUI);

  return Object.assign({}, config, {
    css: `
      ${config.css ? config.css : ''}
      .${STYLE_CLASSES.wrapper} {
        background: ${config.backgroundColor};
        border-radius: ${hyperSearchUI.inputBorderRadius}px;
        border: 1px solid ${config.foregroundColor};
        height: 40px;
        opacity: 0.6;
        position: absolute;
        right: 10px;
        top: 5px;
        z-index: 9999;
        display: flex;
        align-items: center;
      }

      .${STYLE_CLASSES.input} {
          background: none;
          border: none;
          color: ${config.foregroundColor};
          font-size: 0.8em;
          opacity: 1;
          outline: none;
          flex: 1;
          padding: 0 8px;
          align-self: stretch;
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
        ${buttonStyles(config)}
      }

      .${STYLE_CLASSES.nextButton}::after {
        content: "${hyperSearchUI.nextButton}";
      }

      .${STYLE_CLASSES.caseButton} {
        border-radius: ${hyperSearchUI.buttonBorderRadius}px;
        margin: 0 4px;
        ${buttonStyles(config)}
      }

      .${STYLE_CLASSES.caseButton}::after {
        content: "⇪";
      }

      .${STYLE_CLASSES.caseButtonFocused} {
        ${buttonStyles(config)}
      }

      .${STYLE_CLASSES.caseButtonUnfocused} {
        background: ${config.backgroundColor};
        color: ${config.foregroundColor};
      }
    `
  });
};
