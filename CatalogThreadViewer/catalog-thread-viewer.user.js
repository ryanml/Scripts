// ==UserScript==
// @name        Catalog Thread Viewer
// @namespace   https://github.com/ryanml
// @description Allows you to load posts under the post preview in catalog view
// @include     *//boards.4chan.org/*/catalog
// @version     1
// @grant GM_xmlhttpRequest 
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==
(function ($) {
  /* 
   * Strict and no conflict mode
   */
  'use strict';
  $.noConflict();
  var WIND = window;
  var PROT = WIND.location.protocol; 
  var BOARD = $('body').attr('class')
                       .split('board_')[1];
  var ENDP = `${PROT}//a.4cdn.org/${BOARD}/thread/`;
  /* 
   * Fetches all replies to a thread given its id
   */
  const fetchPosts = (id) => {
    var endPoint = `${ENDP}${id}.json`;
    console.log(endPoint);
    var results = JSON.parse(
      GM_xmlhttpRequest({
        method: 'GET',
        url: endPoint,
        synchronous: true
      }).responseText
    );
    var postsObjs = results.posts;
    return postsObjs.map(p => p.com);
  };
  /*
   * Adds needed dom assets to thread block
   */
  const addAssets = ($item) => {
    var $loadButton = $(
      '<button class="load-posts">+</button>'
    );
    $loadButton.click(function() {
      var $thread = $(this).parent();
      var id = $thread.attr('id')
                      .split('-')[1];
      var posts = fetchPosts(id);
      for (var p = 0; p < posts.length; p++) {
        $item.append(
          `<div class='sub-reply'>${posts[p]}</div>`
        );
      }  
     });
    $item.append($loadButton);
  };
  /*
   * Program assembly on document load
   */
  $(document).ready(function () {
    var $threads = $('.thread');
    $threads.each(function () {
      addAssets($(this));
    });
  });
}) (jQuery);

