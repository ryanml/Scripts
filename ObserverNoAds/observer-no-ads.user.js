// ==UserScript==
// @name         ObserverNoAds
// @namespace    https://github.com/ryanml
// @version      0.1
// @description  God forbid you want to read an Observer article, but if you do, and you have an ad-blocker,
//               this script will help you out. They don't try very hard...
// @author       ryanml
// @match        *://observer.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
     var adblockNot = document.getElementById('adb-notification');
     if (adblockNot !== null)
         adblockNot.remove();
})();
