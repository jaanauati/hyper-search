
# Hyper-search &middot; [![](https://img.shields.io/npm/dm/hyper-search.svg?label=DL)]() [![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/jaanauati/hyper-search)

Extension for [Hyper](https://hyper.is) that allows you to search text in your terminal.

## How to use

Install [Hyper](https://hyper.is) and add `hyper-search`
to `plugins` in `~/.hyper.js` and restart hyper.js.

Usage:
 - A new 'find' submenu should be available in the 'Edit' menu.
 - Type ```<Cmd>+F``` to toggle the search controls.
 - Hit ```<Cmd>+G``` to find the next occurrence.
 - Hit ```<Shift>+<Cmd>+G``` to find the previous occurrence.
 - Hit ```<Tab>``` or ```<Shift>+<Tab>``` to expand the selection to the right or left (see Mouseless Copy: https://www.iterm2.com/features.html).
 - Hit ```<Esc>``` to hide the search dialog.

![demo](https://media.giphy.com/media/7SEQJPH0dqgErNF8Zq/giphy.gif)

## Config

hyper-search supports various style modifications.

In `~/.hyper.js`:

### Change Search Box Border Radius

```javascript
module.exports = {
  config: {
    ...
      hyperSearchUI: {
        inputBorderRadius: 2
      }
    ...
  }
}
````

![input border radius](https://i.imgur.com/POliDqP.png)

### Change Previous/Next Button Border Radius

```javascript
module.exports = {
  config: {
    ...
      hyperSearchUI: {
        buttonBorderRadius: 2,
      }
    ...
  }
}
````

![navigation button border radius](https://i.imgur.com/YSam2Ph.png)

### Change Button Margins

```javascript
module.exports = {
  config: {
    ...
      hyperSearchUI: {
        buttonMargin: 2,
      }
    ...
  }
}
````

![button margin](https://i.imgur.com/ZKk0mO8.png)

### Change Prev/Next Button Text

```javascript
module.exports = {
  config: {
    ...
      hyperSearchUI: {
        prevButton: '←',
        nextButton: '→'
      }
    ...
  }
}
````

![change prev/next button](https://i.imgur.com/ORRuvvw.png)


## TODO:
- regular expressions.

## Credits
Jonatan Anauati (barakawins@gmail.com)

## Contributors
- Aaron Markey (https://github.com/aaronmarkey)
- Alek Zdziarski (https://github.com/aldudalski)
- Emmanuel Salomon (https://github.com/ManUtopiK)
- Hai Nguyen (https://github.com/ng-hai)
- Samuel Yeung (https://github.com/samuelyeungkc)
- Timo Sand (https://github.com/deiga)
- Will Stern (https://github.com/willrstern)
- Yanir (https://github.com/yanir3)


## License

ISC
