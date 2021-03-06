'use strict';
describe('angular-typeaheadjs e2e tests: ', function() {
  browser.manage().window().setSize(600, 800);
  browser.manage().window().setPosition(600, 0);
  beforeEach(function() {
    browser.get('/tests/e2e/test.html');
  });

  var UseCase = function( number ) {

    browser.executeScript('if (window.localStorage) {window.localStorage.clear();}');

    var selectorUseCase = 'div.usecase' + number,
      selectorPath = selectorUseCase + ' span.twitter-typeahead',
      selectorInput = selectorPath + ' > input[id="usecase' + number + '"].tt-input',
      selectorHint = selectorPath + ' > input.tt-hint';

    this.input = element(by.css(selectorInput)),
    this.hint = element(by.css(selectorHint));
    this.dropdown = element(by.css(selectorPath + ' > div.tt-menu'));
    this.triggerEvents = element(by.css(selectorUseCase + ' span.trigger'));

    this.bodyClick = function() {
      //console.log(element(by.tagName('body')));
      element(by.tagName('body')).click();
    };
    this.inputClick = function() {
      this.input.click();
    };
    this.inputExists = function() {
      expect(browser.isElementPresent(this.input)).toBeTruthy();
    };
    this.hintExists = function() {
      expect(browser.isElementPresent(this.hint)).toBeTruthy();
    };
    this.dropdownExists = function() {
      expect(browser.isElementPresent(this.dropdown)).toBeTruthy();
    };
    this.inputSendKeys = function( keys ) {
      this.input.sendKeys(keys);
    };
    this.inputValueIs = function( value ) {
      expect(this.input.getAttribute('value')).toBe(value);

    };
    this.hintValueIs = function( value ) {
      expect(this.hint.getAttribute('value')).toBe(value);

    };
    this.triggerEventsValueIs = function( value ) {
      expect(this.triggerEvents.getText()).toBe(value);
    };
    this.numberOfSuggestionsIs = function( number ) {
      var suggestions = element.all(by.css(selectorPath + ' .tt-suggestion'));
      expect(suggestions.count()).toBe(number);
    };
    this.firstSuggestionClick = function() {
      //element(by.css(selectorUseCase + ' .tt-suggestion:first-child')).click();
      element.all(by.css(selectorPath + ' .tt-suggestion')).first().click();
    };
  };

  describe('[Use Case 1]: prefetch|remote /', function() {
    var useCase;

    beforeEach(function() {
      useCase = new UseCase(1);
    });
    //        xit('/==>should have a title', function () {
    //            expect(browser.getTitle()).toBe('Test e2e angular-typeaheadjs');
    //        });
    it('/==>should have an input with typeahead applied', function() {
      browser.sleep(250).then(function() {
        useCase.inputExists();
      });

    });
    it('/==>should open dropdown with 3 suggestions and correct hint when typing "uni"', function() {
      useCase.inputExists();
      useCase.hintExists();
      useCase.inputSendKeys('uni');
      browser.sleep(250).then(function() {
        useCase.dropdownExists();
        useCase.hintValueIs('united Arab Emirates');
        useCase.numberOfSuggestionsIs(3);
      });

    });
    it('/==>should open dropdown with 1 suggestion and correct hint when typing "uto"', function() {
      useCase.inputExists();
      useCase.hintExists();
      useCase.inputSendKeys('uto');
      browser.sleep(250).then(function() {
        useCase.dropdownExists();
        useCase.hintValueIs('utopia');
        useCase.numberOfSuggestionsIs(1);
      });

    });
  });
  describe('[Use Case 2]: prefetch|remote /trigger all events on scope', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(2);
    });
    it('/==>should trigger events when onfocus and and loose focus', function() {
      useCase.inputExists();
      useCase.inputClick();
      useCase.bodyClick();
      browser.sleep(500).then(function() {
        useCase.triggerEventsValueIs('[1,1,1,1,0,0,0,0,0,0,0,0]');
      });

    });
    it('/==>should trigger events when typing "uni"', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('500').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,0,0,2,0,0,0,1,0,1]');
      });

    });
    it('/==>should trigger events when typing "uni" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('250');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('500').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,0,0,4,0,1,0,2,0,2]');
      });
    });
    it('/==>should trigger events when typing "uni" and select suggestion (with Enter)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      //browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,1,0,2,1,0,1,1,0,1]');
      });

    });
    it('/==>should trigger events when typing "uni" and select suggestion (with Enter) and loose focus', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.ENTER);
      browser.sleep('150');
      useCase.bodyClick();
      browser.sleep('500').then(function() {
        useCase.triggerEventsValueIs('[1,1,1,1,1,2,1,0,1,1,0,1]');
      });
    });
    it('/==>should trigger events when typing "uni" and scroll suggestions', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.UP);
      browser.sleep('100').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,0,0,2,0,0,3,1,0,1]');
      });

    });
  });
  describe('[Use Case 3]: prefetch|remote /trigger all events on scope emitOnlyIfPresent', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(3);
    });
    it('/==>should trigger only autocomplete event when typing "uni" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('250');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,0,1,0,0,0,0]');
      });

    });
    it('/==>should trigger only select event when typing "uni" and select suggestion (with Enter)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
      });
    });

    //this is not very beatiful.. but well.. IE is not also...
    //see:https://code.google.com/p/selenium/wiki/InternetExplorerDriver#Clicking_<option>_Elements_or_Submitting_Forms_and_alert()
    if ( process.env.BROWSER + process.env.BROWSERVERSION !== 'ie10' ) {
      it('/==>should trigger only select event when type "uni" and click first suggestion', function() {
        useCase.inputExists();
        useCase.inputSendKeys('uni');
        browser.sleep('150').then(function() {
          useCase.firstSuggestionClick();
          browser.sleep('150');
          useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
        });
      });
    }

  });
  describe('[Use Case 4]: prefetch|remote /trigger events on scope select,autocomplete /selectOnAutocomplete/clear', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(4);
    });
    it('/==>should trigger select and autocomplete events when typing "uni" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,1,0,0,0,0]');
      });

    });
    if ( process.env.BROWSER + process.env.BROWSERVERSION !== 'ie10' ) {
      it('/==>should clear input on select suggestion', function() {
        useCase.inputExists();
        useCase.inputSendKeys('uni');
        browser.sleep('50');
        useCase.inputValueIs('uni');
        useCase.firstSuggestionClick();
        browser.sleep('50');
        useCase.inputValueIs('');
      });
    }

    it('/==>should clear input on autocomplete (selectOnAutocomplete is true)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputValueIs('uni');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('150').then(function() {
        useCase.inputValueIs('');
      });
    });

  });
  describe('[Use Case 5]: prefetch|remote /trigger all events callbacks', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(5);
    });
    it('/==>should trigger events when onfocus and and loose focus', function() {
      useCase.inputExists();
      useCase.inputClick();
      useCase.bodyClick();
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[1,1,1,1,0,0,0,0,0,0,0,0]');
      });
    });
    it('/==>should trigger events when typing "uni"', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('250').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,0,0,2,0,0,0,1,0,1]');
      });

    });
    it('/==>should trigger events when typing "uni" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('250');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('500').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,0,0,4,0,1,0,2,0,2]');
      });
    });
    it('/==>should trigger events when typing "uni" and select suggestion (with Enter)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,1,0,2,1,0,1,1,0,1]');
      });

    });
    it('/==>should trigger events when typing "uni" and select suggestion (with Enter) and loose focus', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      useCase.bodyClick();
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[1,1,1,1,1,2,1,0,1,1,0,1]');
      });

    });
    it('/==>should trigger events when typing "uni" and scroll suggestions', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.UP);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[1,0,1,0,0,2,0,0,3,1,0,1]');
      });

    });
  });
  describe('[Use Case 6]: prefetch|remote /calbacks emitOnlyIfPresent', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(6);
    });
    it('/==>should trigger only autocomplete event when typing "uni" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,0,1,0,0,0,0]');
      });
    });
    it('/==>should trigger only select event when typing "uni" and select suggestion (with Enter)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
      });
    });
    if ( process.env.BROWSER + process.env.BROWSERVERSION !== 'ie10' ) {
      it('/==>should trigger only select event when type "uni" and click first suggestion', function() {
        useCase.inputExists();
        useCase.inputSendKeys('uni');
        browser.sleep('150');
        useCase.firstSuggestionClick();
        browser.sleep('150').then(function() {
          useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
        });
      });
    }

  });
  describe('[Use Case 7]: prefetch|remote /callbacks mixed emit scope emitOnlyIfPresent', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(7);
    });
    it('/==>should trigger only autocomplete event when typing "uni" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,0,1,0,0,0,0]');
      });
    });
    it('/==>should trigger only select event when typing "uni" and select suggestion (with Enter)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
      });
    });
    if ( process.env.BROWSER + process.env.BROWSERVERSION !== 'ie10' ) {
      it('/==>should trigger only select event when type "uni" and click first suggestion', function() {
        useCase.inputExists();
        useCase.inputSendKeys('uni');
        browser.sleep('150');
        useCase.firstSuggestionClick();
        browser.sleep('150').then(function() {
          useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
        });
      });
    }
  });
  describe('[Use Case 8]: prefetch|remote /trigger events callbacks select,autocomplete /selectOnAutocomplete/clear', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(8);
    });
    it('/==>should trigger select and autocomplete events when typing "uni" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,1,0,0,0,0]');
      });
    });
    if ( process.env.BROWSER + process.env.BROWSERVERSION !== 'ie10' ) {
      it('/==>should clear input on select suggestion', function() {
        useCase.inputExists();
        useCase.inputSendKeys('uni');
        browser.sleep('250');
        useCase.inputValueIs('uni');
        useCase.firstSuggestionClick();
        browser.sleep('250').then(function() {
          useCase.inputValueIs('');
          useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
        });
      });
    }
    it('/==>should clear input on autocomplete (selectOnAutocomplete is true)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('250');
      useCase.inputValueIs('uni');
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('250').then(function() {
        useCase.inputValueIs('');
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,1,0,0,0,0]');
      });
    });

  });
  describe('[Use Case 9]: datasets useOwnDefaults = false', function() {
    var useCase;

    beforeEach(function() {
      useCase = new UseCase(9);
    });

    it('/==>should have an input with typeahead applied', function() {
      useCase.inputExists();
    });
    it('/==>should open dropdown with 5 suggestions and correct hint when typing "new"', function() {
      useCase.inputExists();
      useCase.hintExists();
      useCase.inputSendKeys('new');
      browser.sleep('150');
      useCase.dropdownExists();
      useCase.hintValueIs('new York Knicks');
      browser.sleep('50').then(function() {
        useCase.numberOfSuggestionsIs(5);
      });
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0]');
        useCase.inputValueIs('New York Rangers');
      });

    });
  });
  describe('[Use Case 10]: bhfunctions|prefetch|remote /trigger events callbacks select,autocomplete /selectOnAutocomplete/clear', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(10);
    });
    it('/==>should trigger select and autocomplete events when typing "xun" and autocomplete', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('350').then(function() {
        useCase.inputSendKeys(protractor.Key.TAB);
        browser.sleep('350').then(function() {
          useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,1,0,0,0,0,2,1]');
        });
      });
    });
    if ( process.env.BROWSER + process.env.BROWSERVERSION !== 'ie10' ) {
      it('/==>should clear input on select suggestion', function() {
        useCase.inputExists();
        useCase.inputSendKeys('uni');
        browser.sleep('350').then(function() {
          useCase.inputValueIs('uni');
          useCase.firstSuggestionClick();
          browser.sleep('350').then(function() {
            useCase.inputValueIs('');
            useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,0,0,0,0,0,2,1]');
          });
        });
      });
    }
    it('/==>should clear input on autocomplete (selectOnAutocomplete is true)', function() {
      useCase.inputExists();
      useCase.inputSendKeys('uni');
      browser.sleep('350').then(function() {
        useCase.inputValueIs('uni');
        useCase.inputSendKeys(protractor.Key.TAB);
        browser.sleep('350').then(function() {
          useCase.inputValueIs('');
          useCase.triggerEventsValueIs('[0,0,0,0,0,0,1,1,0,0,0,0,2,1]');
        });
      });
    });

  });
  describe('[Use Case 11]: events | prefetch|remote /trigger events callbacks select,autocomplete /selectOnAutocomplete', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(11);
    });
    it('/==>should trigger events angtty:init and angtty:setval', function() {
      useCase.inputExists();
      browser.sleep('1000').then(function() {
        useCase.inputValueIs('Angola');
        useCase.inputClick();
        browser.sleep('300').then(function(){
          useCase.firstSuggestionClick();
          browser.sleep('300').then(function(){
            useCase.inputValueIs('Angola Angola');
          });
        });



      });
    });


  });
  describe('[Use Case 12]: prefetch|remote before event handlers', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(12);
    });
    it('/==>should trigger all handlers', function() {
      useCase.inputExists();
      useCase.inputClick();
      useCase.inputSendKeys('ang');
      browser.sleep('150');
      useCase.inputSendKeys(protractor.Key.TAB);
      useCase.inputSendKeys(protractor.Key.DOWN);
      useCase.inputSendKeys(protractor.Key.ENTER);
      useCase.inputSendKeys(protractor.Key.TAB);
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[1,1,1,1,1,1,1]');
      });
    });

  });
  describe('[Use Case 13]: prefetch|remote before event handlers with setSameListenerEventBefore=true', function() {
    var useCase;
    beforeEach(function() {
      useCase = new UseCase(13);
    });
    it('/==>should trigger some handler twice', function() {
      useCase.inputExists();
      useCase.inputClick();
      browser.sleep('150').then(function() {
        useCase.triggerEventsValueIs('[2]');
      });
    });

  });
});
