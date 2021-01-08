// generate a dialog based on the given settings
class Dialog {
  /*
  settings {
      parent:         dom object  # parent object to append the dialog
      type:           string      # type of notification, alert, prompt
      timeout:        int         # time in ms for autoclose the notification
      password:       boolean     # if the prompt input is hidden
      placeholder:    string      # placeholder value for prompt dialog
      title:          string      # title of the dialog
      content:        string      # content of the dialog
      onLoad:         function    # fired after dialog appended but before visible
      onUnload:       function    # fired before dialog detached from parent
      labelOk:        string      # label for the ok button
      onOk:           function    # fired on ok button
      labelCancel:    string      # label for the cancel button
      onCancel:       function    # fired on cancel button
      buttons:        array of objects
          # label:    string      # label of the button
          # function: function    # function of the button
  }
  */
  constructor({
    // prettier-ignore
    parent = document.body,
    type = 'notification',
    title = '',
    content = '',
    timeout = 1000,
    placeholder = '',
    password = false,
    onLoad = () => {
      return true;
    },
    onUnload = () => {
      return true;
    },
    labelOk = 'ok',
    onOk = () => {
      return true;
    },
    labelCancel = 'cancel',
    onCancel = () => {
      return true;
    },
    buttons = [],
    onCleanup = () => {
      onUnload(this);
      // add the hidden class to perform animation
      this.container.classList.add('hidden');
      setTimeout(() => {
        this.wrapper.remove();
      }, 200);
    },
  } = {}) {
    this.parent = parent;

    // check if valid type or show error notification
    if (!['notification', 'alert', 'confirm', 'prompt'].includes(type)) {
      type = 'notification';
      title = 'Error';
      content = 'unkown Dialog Type';
    }

    // create dom object
    this.wrapper = createElement({
      attributes: {
        id: 'dialog',
      },
      children: [
        (this.container = createElement({
          attributes: {
            class: 'container hidden',
          },
          children: [
            (this.header = createElement({
              content: title,
              attributes: {
                class: 'header',
              },
            })),
            (this.content = createElement({
              content: content,
              attributes: {
                class: 'content',
              },
            })),
            (this.footer = createElement({
              attributes: {
                class: 'footer',
              },
            })),
          ],
        })),
      ],
    });

    // append input field for prompt dialog
    if (type === 'prompt') {
      this.content.append(
        (this.input = createElement({
          type: 'input',
          attributes: {
            class: 'input',
            type: password ? 'password' : 'text',
            placeholder: placeholder,
          },
        }))
      );
      this.input.addEventListener('keyup', (e) => {
        switch (e.key) {
          case 'Enter':
            if (onOk(this)) {
              onCleanup();
            }
            break;
          case 'Escape':
            if (onCancel(this)) {
              onCleanup();
            }
            break;
          default:
            return;
        }
      });
    }

    // append ok button if not a notification dialog
    if (type != 'notification') {
      buttons.unshift({
        label: labelOk,
        function: onOk,
      });
    }

    // append cancel button if not a notification or alert dialog
    if (!['alert', 'notification'].includes(type)) {
      buttons.push({
        label: labelCancel,
        function: onCancel,
      });
    }

    // append basic and additional buttons to dialog footer
    for (let button of buttons) {
      let element = createElement({
        content: button.label,
        attributes: {
          class: 'button',
        },
      });
      this.footer.append(element);
      element.addEventListener('click', (e) => {
        if (button.function(this)) {
          onCleanup();
        }
      });
    }

    // invoke onLoad function
    onLoad(this);

    // append dialog to parent
    this.parent.append(this.wrapper);

    // remove the hidden class to perform animation
    setTimeout(() => {
      this.container.classList.remove('hidden');
    }, 100);

    // type specific functions
    switch (type) {
      // set timout for notification
      case 'notification':
        setTimeout(() => {
          onCleanup();
        }, timeout);
        break;
      // focus to input for prompt
      case 'prompt':
        setTimeout(() => {
          this.input.focus();
        }, 200);
        break;

      default:
        break;
    }
  }
}

// generate the settings options
class Settings {
  constructor({
    // prettier-ignore
    parent = document.body,
    option = {
      plus: true,
      minus: true,
      multiply: false,
      divide: false,
      minLimit: '1',
      maxLimit: '20',
      rounds: '20',
      funMode: true,
      hardMode: false,
    },
  } = {}) {
    this.parent = parent;
    this.option = option;

    this.inputs = {};

    // append options to parent
    this.parent.append(
      createElement({
        attributes: {
          class: 'operator',
        },
        children: [
          (this.inputs.plus = createElement({
            type: 'input',
            attributes: {
              class: 'plus',
              type: 'checkbox',
            },
            checked: this.option.plus,
          })),
          (this.inputs.minus = createElement({
            type: 'input',
            attributes: {
              class: 'minus',
              type: 'checkbox',
            },
            checked: this.option.minus,
          })),
          (this.inputs.multiply = createElement({
            type: 'input',
            attributes: {
              class: 'multiply',
              type: 'checkbox',
            },
            checked: this.option.multiply,
          })),
          (this.inputs.divide = createElement({
            type: 'input',
            attributes: {
              class: 'divide',
              type: 'checkbox',
            },
            checked: this.option.divide,
          })),
        ],
      }),
      createElement({
        attributes: {
          class: 'labeled-input',
        },
        children: [
          createElement({
            content: I18N[LANG].settingsfrom,
          }),
          (this.inputs.minLimit = createElement({
            type: 'input',
            attributes: {
              type: 'number',
              value: this.option.minLimit,
              min: 0,
              max: 1000,
            },
          })),
        ],
      }),
      createElement({
        attributes: {
          class: 'labeled-input',
        },
        children: [
          createElement({
            content: I18N[LANG].settingsto,
          }),
          (this.inputs.maxLimit = createElement({
            type: 'input',
            attributes: {
              type: 'number',
              value: this.option.maxLimit,
              min: 10,
              max: 1000,
            },
          })),
        ],
      }),
      createElement({
        attributes: {
          class: 'labeled-input',
        },
        children: [
          createElement({
            content: I18N[LANG].settingsrounds,
          }),
          (this.inputs.rounds = createElement({
            type: 'input',
            attributes: {
              type: 'number',
              value: this.option.rounds,
              min: 3,
              max: 50,
            },
          })),
        ],
      }),
      createElement({
        attributes: {
          class: 'labeled-input',
        },
        children: [
          createElement({
            content: I18N[LANG].settingsfunmode,
          }),
          (this.inputs.funMode = createElement({
            type: 'input',
            attributes: {
              type: 'checkbox',
            },
            checked: this.option.funMode,
          })),
        ],
      }),
      createElement({
        attributes: {
          class: 'labeled-input',
        },
        children: [
          createElement({
            content: I18N[LANG].settingshardmode,
          }),
          (this.inputs.hardMode = createElement({
            type: 'input',
            attributes: {
              type: 'checkbox',
            },
            checked: this.option.hardMode,
          })),
        ],
      }),
      createElement({
        attributes: {
          class: 'labeled-input',
        },
        children: [
          createElement({
            content: I18N[LANG].settingslanguage,
          }),
          (this.inputs.language = createElement({
            type: 'select',
            attributes: {
              id: 'language',
            },
            children: Object.keys(I18N).map((value) => {
              return createElement({
                type: 'option',
                content: value.toUpperCase(),
                attributes: {
                  value: value,
                },
              });
            }),
          })),
        ],
      }),
      createElement({
        content: `© ${new Date().getFullYear()} `,
        attributes: {
          class: 'copyright',
        },
        children: [
          createElement({
            type: 'a',
            content: 'MCHilli',
            attributes: {
              href: 'https://github.com/mchilli/einfach_rechnen',
              target: '_blank',
              rel: 'noreferrer',
            },
          }),
        ],
      })
    );
  }

  // restore settings from local storage
  restoreSettings(settings) {
    this.option = settings;
    for (const key in this.option) {
      if (Object.hasOwnProperty.call(this.option, key)) {
        const value = this.option[key];
        if (typeof value === 'boolean') {
          this.inputs[key].checked = value;
        } else {
          this.inputs[key].value = value;
        }
      }
    }
  }

  // update settings on change an store it
  updateSettings(key, value) {
    if (['plus', 'minus', 'multiply', 'divide'].includes(key)) {
      let operators = [
        this.option.plus,
        this.option.minus,
        this.option.multiply,
        this.option.divide,
      ];
      if (operators.filter(Boolean).length === 1 && !value) {
        this.inputs[key].checked = true;
        return;
      }
    }
    this.option[key] = value;
  }

  // enable all input options
  enableSettings() {
    for (const input in this.inputs) {
      this.inputs[input].disabled = false;
    }
  }

  // disable all input options
  disableSettings() {
    for (const input in this.inputs) {
      if (['language'].includes(input)) continue;
      this.inputs[input].disabled = true;
    }
  }
}

// calculation class
class Challenge {
  constructor({
    // prettier-ignore
    parent = document.body,
  } = {}) {
    this.parent = parent;

    // add a blink function to the parent to perform a visual feedback
    this.parent.classList.blink = (className) => {
      this.parent.classList.add(className);
      setTimeout(() => {
        this.parent.classList.remove(className);
      }, 100);
    };

    this.dom = {};
    this.calculation = {};

    // append options to parent
    this.parent.append(
      (this.dom.first = createElement()),
      (this.dom.operator = createElement()),
      (this.dom.second = createElement()),
      (this.dom.equal = createElement()),
      (this.dom.result = createElement()),
      (this.dom.input = createElement({
        type: 'input',
        attributes: {
          type: 'number',
          class: 'fake-input',
        },
      }))
    );

    this.displayMessage(I18N[LANG].greeting);
  }

  // display a message
  displayMessage(msg) {
    for (const element in this.dom) {
      if (Object.hasOwnProperty.call(this.dom, element)) {
        this.dom[element].innerHTML = '';
        this.dom[element].classList.remove('search');
      }
    }
    this.dom.second.innerHTML = msg;
  }

  // return a random integer between the values
  randomInteger(min, max) {
    return Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
  }

  // gernerate a new calculation
  newCalc(settings) {
    let operatorUnicode = {
      plus: '+',
      minus: '−',
      multiply: '×',
      divide: '÷',
    };
    let operators = ['plus', 'minus', 'multiply', 'divide'].filter((value) => {
      return settings[value];
    });
    let operator = operators[Math.floor(Math.random() * operators.length)];
    let first, second, result;

    do {
      first = this.randomInteger(settings.minLimit, settings.maxLimit);
      second = this.randomInteger(settings.minLimit, settings.maxLimit);
      switch (operator) {
        case 'plus':
          result = first + second;
          break;
        case 'minus':
          result = first - second;
          break;
        case 'multiply':
          result = first * second;
          break;
        case 'divide':
          result = first / second;
          break;
        default:
      }
    } while (
      result > settings.maxLimit ||
      result < 0 ||
      isNaN(result) ||
      result % 1 !== 0 ||
      (operator === 'divide' && (first === 0 || second < 2)) ||
      (operator === 'multiply' && (first < 2 || second < 2))
    );

    // write calculation in object
    this.calculation.first = first;
    this.calculation.operator = operatorUnicode[operator];
    this.calculation.second = second;
    this.calculation.equal = '=';
    this.calculation.result = result;

    // set the searched value
    let possibleSearches = ['first', 'second', 'result'];
    this.calculation.search = settings.hardMode
      ? possibleSearches[Math.floor(Math.random() * possibleSearches.length)]
      : 'result';

    this.updateCalculation();
  }

  // restore the last calculation from storage
  restoreCalc(data) {
    this.calculation = data;
    this.updateCalculation();
  }

  // print out the calculation to the dom
  updateCalculation() {
    for (const key in this.calculation) {
      if (this.dom.hasOwnProperty(key)) {
        // remove search class from all elements
        this.dom[key].classList.remove('search');

        if (key === this.calculation.search) {
          this.dom[key].innerText = SEARCHPLACEHOLDER;
          // add search class only to the searched element
          this.dom[key].classList.add('search');
        } else {
          this.dom[key].innerText = this.calculation[key];
        }
      }
    }
  }

  // check if the answer is correct
  isCorrect() {
    let input = this.dom[this.calculation.search];
    let inputValue = parseInt(input.innerHTML);
    let search = this.calculation[this.calculation.search];

    if (inputValue === search) {
      this.parent.classList.blink('correct');
      return true;
    } else {
      this.parent.classList.blink('failure');
      return false;
    }
  }

  // reset the input back to the placeholder
  resetInput() {
    let input = this.dom[this.calculation.search];
    input.innerHTML = SEARCHPLACEHOLDER;
  }

  // return the user input
  getInput() {
    let input = this.dom[this.calculation.search];
    let inputValue = parseInt(input.innerHTML);
    return inputValue;
  }
}

// history item class
class HistoryItem {
  constructor(data) {
    this.data = data;
    this.dom = createElement({
      attributes: {
        class: `item ${this.data.correct ? 'correct' : 'failure'}`,
      },
      children: [
        createElement({
          content: `${String(this.data.round + 1).padStart(2, '0')}`,
          attributes: {
            class: 'index',
          },
        }),
        createElement({
          children: this.data.calculation.map((value) => {
            let type = typeof value;
            let item = createElement({
              content: type === 'object' ? `${value[0]}` : `${value}`,
            });
            if (type === 'object') {
              item.classList.add('search');
            }
            return item;
          }),
          attributes: {
            class: 'calculation',
          },
        }),
      ],
    });
  }

  // return the html code for the element
  getHtml() {
    return this.dom;
  }

  // return the stored data
  getData() {
    return this.data;
  }
}

// history class
class History {
  constructor({
    // prettier-ignore
    parent = document.body,
  } = {}) {
    this.parent = parent;
    this.items = [];
  }

  // prepare the calculation data for use as history item
  prepareData(calculation, round, correct, input) {
    let calc = { ...calculation };
    calc[calc.search] = [input];
    return {
      correct: correct,
      index: this.items.length,
      round: round,
      calculation: [calc.first, calc.operator, calc.second, calc.equal, calc.result],
    };
  }

  // add a calculation the the history
  addItem(data) {
    let item = new HistoryItem(data);
    this.items.push(item);
    this.parent.prepend(item.getHtml());
  }

  // clear the whole history
  clearHistory() {
    this.items = [];
    this.parent.innerHTML = '';
  }

  // return the history data
  getHistory() {
    return this.items.map((item) => {
      return item.getData();
    });
  }
}

// main game class
class Game {
  constructor() {
    this.isStarted = false;
    this.endReached = false;
    this.round = 0;
    this.answers = 0;
    this.failures = 0;

    this.dom = {
      header: $('#header'),
      infos: {
        score: $('#header .score'),
        rounds: $('#header .rounds'),
      },
      buttons: {
        start: $('#header .start-btn'),
        menu: $('#header .menu-btn'),
      },
      options: $('#header .options'),
      calculation: $('#calculation'),
      history: $('#history .content'),
    };

    this.settings = new Settings({
      parent: this.dom.options,
    });

    this.challenge = new Challenge({
      parent: this.dom.calculation,
    });

    this.history = new History({
      parent: this.dom.history,
    });

    this.attachEvents();
    this.restoreGame();
    this.dom.buttons.start.innerText = this.isStarted ? I18N[LANG].reset : I18N[LANG].start;
    this.updateInfos();
  }

  // attach user events
  attachEvents() {
    // start button
    this.dom.buttons.start.addEventListener('click', (e) => {
      this.dom.header.classList.remove('open-options');
      if (this.isStarted) {
        if (this.settings.option.funMode) {
          this.reset();
        } else {
          this.parentalCheck();
        }
      } else {
        this.start();
      }
    });

    // menu button
    this.dom.buttons.menu.addEventListener('click', (e) => {
      this.dom.header.classList.toggle('open-options');
    });

    //option changed
    for (const input in this.settings.inputs) {
      this.settings.inputs[input].addEventListener('change', (e) => {
        let value;
        if (e.target.type === 'checkbox') {
          value = e.target.checked;
        } else {
          value = e.target.value;
        }
        this.settings.updateSettings(input, value);
        this.storeGame();
        if (e.target.id === 'language') {
          this.dom.header.classList.remove('open-options');
          return location.reload();
        }
        this.updateInfos();
      });
    }

    // keyboard interaction &
    // display the keyboard on mobile devices
    if (isMobileDevice()) {
      document.addEventListener('keyup', (e) => {
        // split from normal devices because of samsung input fix
        this.keyHandler(e.key);
      });
      this.dom.calculation.addEventListener('click', (e) => {
        this.challenge.dom.input.focus();
      });
    } else {
      document.addEventListener('keydown', (e) => {
        this.keyHandler(e.key);
      });
    }
  }

  // show a password dialog to prevent reset the game. for parental control
  parentalCheck() {
    new Dialog({
      type: 'prompt',
      title: I18N[LANG].parentalchecktitle,
      content: I18N[LANG].parentalcheckcontent,
      password: true,
      placeholder: I18N[LANG].parentalcheckplaceholder,
      labelCancel: I18N[LANG].parentalcheckcancel,
      onOk: (e) => {
        if (sha256(e.input.value) === PASSWORD) {
          this.reset();
          return true;
        } else {
          new Dialog({
            type: 'notification',
            title: I18N[LANG].parentalchecknotificationtitle,
            content: I18N[LANG].parentalchecknotificationcontent,
          });
          e.input.value = '';
          e.input.focus();
        }
      },
    });
  }

  // starts the game
  start() {
    this.settings.disableSettings();
    this.dom.buttons.start.innerText = I18N[LANG].reset;
    this.isStarted = true;
    this.challenge.newCalc(this.settings.option);
    this.updateInfos();
    this.storeGame();
    if (isMobileDevice()) {
      this.challenge.dom.input.focus();
    }
  }

  // reset the game
  reset() {
    this.round = 0;
    this.answers = 0;
    this.settings.enableSettings();
    this.dom.buttons.start.innerText = I18N[LANG].start;
    this.challenge.displayMessage(I18N[LANG].greeting);
    this.history.clearHistory();
    this.isStarted = false;
    this.endReached = false;
    this.updateInfos();
    this.storeGame();
  }

  // handle keyboard inputs
  keyHandler(key) {
    if (isMobileDevice() && key === 'Unidentified') {
      // fix for Samsung Mobile Devices, where the onscreen keyboard doesn't fire the right keycode
      // https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229
      key = this.challenge.dom.input.value;
      this.challenge.dom.input.value = '';
    }
    if (!this.isStarted || this.endReached || this.dom.header.classList.contains('open-options')) {
      return;
    }
    let input = this.challenge.dom[this.challenge.calculation.search];
    if (!isNaN(key) && key !== ' ') {
      if (input.innerHTML === '0') {
        return;
      }
      if (input.innerHTML === SEARCHPLACEHOLDER) {
        input.innerHTML = '';
      }
      input.innerHTML += key;
    } else {
      switch (key) {
        case 'Backspace':
          if (input.innerHTML.length > 1) {
            input.innerHTML = input.innerHTML.substring(0, input.innerHTML.length - 1);
          } else {
            input.innerHTML = SEARCHPLACEHOLDER;
          }
          break;
        case 'Enter':
          if (input.innerHTML !== SEARCHPLACEHOLDER) {
            this.answers++;
            let input = this.challenge.getInput();
            let correct = this.challenge.isCorrect();
            this.history.addItem(
              this.history.prepareData(this.challenge.calculation, this.round, correct, input)
            );
            if (correct) {
              this.round++;
              if (this.round === parseInt(this.settings.option.rounds)) {
                this.endReached = true;
              } else {
                this.challenge.newCalc(this.settings.option);
              }
            } else {
              this.challenge.resetInput();
            }
            this.updateInfos();
            this.storeGame();
          }
          if (isMobileDevice()) {
            this.challenge.dom.input.value = '';
          }
          break;
        default:
      }
    }
  }

  // update the header informations
  updateInfos() {
    this.failures = this.answers - this.round;
    let correctRate = 100;
    if (this.answers > 0) {
      correctRate = Math.floor((this.round * 100) / this.answers);
    }
    this.dom.infos.score.innerText = `${correctRate}%`;
    if (this.isStarted && !this.endReached) {
      this.dom.infos.rounds.innerText = `${this.round + 1}/${this.settings.option.rounds}`;
    } else {
      this.dom.infos.rounds.innerText = `${this.round}/${this.settings.option.rounds}`;
    }
    if (this.endReached) {
      let msg = `${this.failures} ${I18N[LANG].failure}`;
      this.challenge.displayMessage(msg);
    }
  }

  // remove the stored game data from local storage
  removeGame() {
    removeStorage('game');
  }

  // store the game data to local storage
  storeGame() {
    let data = {
      language: this.settings.inputs.language.value,
      game: {
        isStarted: this.isStarted,
        endReached: this.endReached,
        round: this.round,
        answers: this.answers,
        failures: this.failures,
      },
      settings: this.settings.option,
      challenge: this.challenge.calculation,
      history: this.history.getHistory(),
    };
    setStorage('game', JSON.stringify(data));
  }

  // restore the game from local storage
  restoreGame() {
    let saveGame = getStorage('game');
    if (saveGame) {
      let data = JSON.parse(saveGame);
      this.settings.restoreSettings(data.settings);
      this.settings.inputs.language.value = data.language;
      if (data.game.isStarted) {
        this.isStarted = data.game.isStarted;
        this.endReached = data.game.endReached;
        this.round = data.game.round;
        this.answers = data.game.answers;
        this.failures = data.game.failures;
        this.settings.disableSettings();
        this.challenge.restoreCalc(data.challenge);
        for (const item of data.history) {
          this.history.addItem(item);
        }
      }
    }
  }
}

// global constants
const SEARCHPLACEHOLDER = '?';
const PASSWORD = '217052ebd2fbb12ad200cc3b32665e212f145683d639c948260b7cd63df79582';

// internationalization and localization
const I18N = {
  de: {
    greeting: 'Einfach Rechnen',
    start: 'Start',
    reset: 'Neu',
    failure: 'Fehler',
    settingsfrom: 'von',
    settingsto: 'bis',
    settingsrounds: 'Runden',
    settingsfunmode: 'Elternfrei',
    settingshardmode: 'Schwer',
    settingslanguage: 'Sprache',
    parentalchecktitle: 'Elternpasswort',
    parentalcheckcontent: 'Du musst das Passwort wissen um neu zu starten.',
    parentalcheckplaceholder: 'Passwort eingeben',
    parentalcheckcancel: 'abbruch',
    parentalchecknotificationtitle: 'Oh Oh Oh',
    parentalchecknotificationcontent: 'falsches Passwort!',
  },
  en: {
    greeting: 'Simple Math',
    start: 'Start',
    reset: 'New',
    failure: 'Failure',
    settingsfrom: 'from',
    settingsto: 'to',
    settingsrounds: 'Rounds',
    settingsfunmode: 'Funmode',
    settingshardmode: 'Hardmode',
    settingslanguage: 'Language',
    parentalchecktitle: 'Parental Control',
    parentalcheckcontent: 'You must insert the password to restart.',
    parentalcheckplaceholder: 'insert password',
    parentalcheckcancel: 'cancel',
    parentalchecknotificationtitle: 'no no no',
    parentalchecknotificationcontent: 'wrong password!',
  },
};
const LANG = getLanguage();

//translate title based on language
document.title = I18N[LANG].greeting;

// load the pwa manifest
let manifestFile = `dist/${LANG}.manifest.webmanifest`;
fileExist(manifestFile).then((exist) => {
  if (!exist) {
    manifestFile = 'dist/en.manifest.webmanifest';
  }
  document.querySelector('link[rel="manifest"]').href = manifestFile;
});
// register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// start the game
const game = new Game();
