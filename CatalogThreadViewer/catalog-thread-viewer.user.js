// ==UserScript==
// @name        Catalog Thread Viewer
// @namespace   https://github.com/ryanml
// @description Allows you to load posts under the post preview in catalog view
// @include     *//boards.4chan.org/*/catalog
// @version     1
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest 
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
  const addDomAssets = ($item) => {
    var $loadButton = $(
      '<button class="ctv-b ctv-pl"></button>'
    );
    $loadButton.click(function() {
      var $thread = $(this).parent()
                           .parent();
      var id = $thread.attr('id')
                      .split('-')[1];
      var posts = fetchPosts(id);
      for (var p = 0; p < posts.length; p++) {
        $item.append(
          `<div class='ctv-p'>
             <div class='ctv-s'>
               <div class='ctv-n'>
                 <span class='nameBlock'>Anonymous</span>
               </div>
               <blockquote class='ctv-m'>${posts[p]}</blockquote>
            </div>
          </div>`
        );
      }
      $thread.addClass('ctv-ofy');  
      $thread.toggleClass('ctv-pl ctv-ml');
     });
    $item.addClass('ctv');
    $item.find('.meta').append($loadButton);
  };
  /* 
   * Adding CSS
   */
  const loadStyles = () => {
    GM_addStyle(
      `.ctv-b {
        height:20px;
        display:block;
        margin:5px auto;
        background-size:100% !important;
      }
      .ctv-pl {
        background:url(//s.4cdn.org/image/buttons/burichan/post_expand_plus@2x.png) no-repeat;
      }
      .ctv-ms {
        background:url(//s.4cdn.org/image/buttons/burichan/post_expand_minus@2x.png) no-repeat;
      }
      .ctv-ofy { 
        overflow-y:scroll 
      }
      .ctv-p {
        margin-top:5px;
        margin-bottom:5px;
        padding:0px 15px;
      }
      .ctv-s {
        padding:5px;
        display:block;
        overflow:hidden;
        background-color:#c9cde8;
        border-bottom:1px solid #B7C5D9;
      }
      .ctv-n {
        color:#117743;
        display:block;
        font-weight:bold;
        overflow-y:auto;
        text-align:left;
        padding:3px 3px;
        border-bottom:1px solid #B7C5D9;
      }
      .ctv-m {
        padding:3px 2px;
        text-align:left;
        background:#D6DAF0;
      } 
      .ctv-m > .quoteLink {
        color:#D00 !important;
        text-decoration:underline;
      }`
    );
  }
  /*
   * Program assembly on document load
   */
  $(document).ready(function () {
    loadStyles();
    var $threads = $('.thread');
    $threads.each(function () {
      addDomAssets($(this));
    });
  });
}) (jQuery);

