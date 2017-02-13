// ==UserScript==
// @name        Catalog Thread Viewer
// @namespace   https://github.com/ryanml
// @description Allows you to load posts under the post preview in catalog view
// @include     *//boards.4chan.org/*/catalog*
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
  /* 
   * URL pieces
   */
  var WIND  = window;
  var PROT  = WIND.location.protocol; 
  var BOARD = $('body').attr('class')
                       .split('board_')[1];
  var ENDP  = `${PROT}//a.4cdn.org/${BOARD}/thread/`;
  /* 
   * Style values for dynamic themes
   */
  var isWS  = $('body').hasClass('ws');
  var theme = isWS ? 'burichan' : 'futaba';
  var primC = isWS ? '#C9CDE8' : '#EAD6CA'; 
  var secnC = isWS ? '#D6DAF0' : '#F0E0D6';
  var bordC = isWS ? '#B7C5D9' : '#D9BFB7';
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
    var posts = results.posts;
    return posts.map((p) => 
        [p.name, p.no, 
         p.com, p.ext]
    ).slice(1, posts.length);
  };
  /*
   * Adds needed dom assets to thread block
   */
  const addDomAssets = ($item) => {
    var $loadButton = $(
      '<button class="ctv-b ctv-pl"></button>'
    );
    $loadButton.click(function(e) {
      var $ctv = $item.find('.ctv-w');
      $(this).toggleClass('ctv-pl ctv-ms');
      if ($ctv.length > 0) {
        e.preventDefault();
        $ctv.toggleClass('ctv-d ctv-h');
        return false;
      }
      var id = $item.attr('id')
                      .split('-')[1];
      var posts = fetchPosts(id);
      var html = `<div class='ctv-w ctv-d'>`;
      for (var p = 0; p < posts.length; p++) {
        var name = posts[p][0];
        var no   = posts[p][1];
        var com  = posts[p][2] || '';
        var file = posts[p][3] || false;
        com = file ? `[i]<br/>${com}` : com;
        html +=
          `<div id='p${no}' class='ctv-p'>
             <div class='ctv-s'>
               <div class='ctv-n'>
                 <span class='ctv-t'>
                   ${name}
                 </span>
                 <span class='ctv-i'>
                   No.${no}
                 </span>
               </div>
               <blockquote class='ctv-m'>
                 ${com}
               </blockquote>
             </div>
           </div>`;
      }
      html += `</div>`;
      $item.append(html);
      $item.addClass('ctv-ofy');  
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
        background:url(//s.4cdn.org/image/buttons/${theme}/post_expand_plus@2x.png) no-repeat;
      }
      .ctv-ms {
        background:url(//s.4cdn.org/image/buttons/${theme}/post_expand_minus@2x.png) no-repeat;
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
        background:${primC};
        border-bottom:1px solid ${bordC};
      }
      .ctv-n {
        color:#117743;
        display:block;
        font-weight:bold;
        overflow-y:auto;
        text-align:left;
        padding:3px 3px;
        border-bottom:1px solid ${bordC};
      }
      .ctv-t {
        float:left;
        font-size:11px;
        text-align:left;
      }
      .ctv-i {
        float:right;
        color:#000000;
        font-size:9px;
        margin-top:1px;
        text-align:right;
      }
      .ctv-m {
        padding:3px 2px;
        text-align:left;
        background:${secnC};
      } 
      .ctv-m .quotelink {
        color:#D00 !important;
        text-decoration:underline;
      }
      .ctv-d {
        display:block;
      }
      .ctv-h {
        display:none;
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

