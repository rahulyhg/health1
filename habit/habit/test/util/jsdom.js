        (function () {
            'use strict';

            var jsdom = require('jsdom'),
                baseHTML,
                window;

            if (!global.window) {
                baseHTML = '<!DOCTYPE html><html><head lang="en"><meta charset="UTF-8"><title>Tests</title></head><body></body></html>';
                window = jsdom.jsdom(baseHTML).defaultView;

                global.window = window;
                global.document = window.document;
                global.navigator = window.navigator;
            }

        }());
