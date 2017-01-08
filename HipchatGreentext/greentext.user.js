// ==UserScript==
// @name        HipChat Greentext
// @namespace   https://github.com/ryanml
// @description Properly Greentexts quoted text
// @include     *//laneterralever.hipchat.com/chat/room/*
// @version     1
// @grant       none
// ==/UserScript==
(function () {
  const refreshInt = 20;
  const quoteTexts = () => {
    var greenReg = /^&gt;.*$/;
    var messages = document.getElementsByClassName('msg-line');
    for (var i = 0; i < messages.length; i++) {
      var msgText = messages[i].innerHTML;
      if (!msgText.match(greenReg)) {
        continue;
      }
      messages[i].innerHTML = `<span style="color:#9BC56A">${msgText}</span>`;
    }
  };
  setInterval(quoteTexts, refreshInt);
}) ();
