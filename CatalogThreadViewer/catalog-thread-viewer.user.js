// ==UserScript==
// @name        Catalog Thread Viewer
// @namespace   https://github.com/ryanml
// @description Allows you to load posts under the post preview in catalog view
// @include     *//boards.4chan.org/*/catalog
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==
(function ($) {
  'use strict';
  $.noConflict();
  var catThreadWorker = {
  };
  $(document).ready(function () {
    var $threads = $('.thread');
    $threads.each(function () {
      console.log($(this));
    });
  });
}) (jQuery);

