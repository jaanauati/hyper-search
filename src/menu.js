const { EDIT, LEAD_KEY } = require('./constants');

exports.decorateMenu = (menu) => {
  for (const menuItem of menu) {
    if (menuItem.label === EDIT) {
      menuItem.submenu = menuItem.submenu.concat({
        label: 'Find',
        submenu: [
          {
            label: 'Toggle Find Bar',
            accelerator: `${LEAD_KEY}+F`,
            click(item, focusedWindow) {
              if (focusedWindow !== null) {
                focusedWindow.rpc.emit('hyper-search:toggle:input', { focusedWindow });
              }
            },
          },
          {
            label: 'Toggle Case Sensitive',
            accelerator: `${LEAD_KEY}+Alt+C`,
            click(item, focusedWindow) {
              if (focusedWindow !== null) {
                focusedWindow.rpc.emit('hyper-search:toggle:case', { focusedWindow });
              }
            },
          },
          {
            label: 'Find Next',
            accelerator: `${LEAD_KEY}+G`,
            click(item, focusedWindow) {
              if (focusedWindow !== null) {
                focusedWindow.rpc.emit('hyper-search:seach:next', { focusedWindow });
              }
            },
          },
          {
            label: 'Find Previous',
            accelerator: `${LEAD_KEY}+Shift+G`,
            click(item, focusedWindow) {
              if (focusedWindow !== null) {
                focusedWindow.rpc.emit('hyper-search:seach:prev', { focusedWindow });
              }
            },
          },
        ],
      });
      break;
    }
  }
  return menu;
};
