// ==UserScript==
// @name        ThreadSpeak
// @namespace   MangaMom
// @description Markov chain fun
// @include     *//boards.4chan.org/*/thread/*
// @version     1
// @grant       none
// ==/UserScript==
(function() {
  'use strict';
  // Needed dom elements
  var textBlocks = document.getElementsByClassName('postMessage');
  var postForm = document.getElementsByTagName('tbody')[0];
  var comment = document.getElementsByName('com')[0];
  // Data structures
  var posts = [];
  var startingWords = [];
  var endingWords = {};
  var uniqueWords = {};
  var postFormAddOn = addGenPostOption();
  // Function to return random element
  const randomElement = (list) => list[Math.floor(Math.random() * list.length)];
  // This can be changed, the lower it is, the less interesting results though
  const MIN_LENGTH = 4;
  // Strip text content from posts and put in posts array
  for (var t = 0; t < textBlocks.length; t++) {
    var childs = textBlocks[t].childNodes;
    for (var c = 0; c < childs.length; c++) {
      if (!childs[c].tagName || childs[c].tagName === 'SPAN') {
        posts.push(childs[c].textContent);
      }
    }
  }
  // Remove links from posts
  posts = posts.filter((post) => {
    if (!post.match(/http/i)) {
      return post.trim();
    }
  });
  // Loop through posts to fill needed structures
  for (var p = 0; p < posts.length; p++) {
    var words = posts[p].split(' ');
    //Push first and last word to starting and ending words
    startingWords.push(words[0]);
    endingWords[words[words.length - 1]] = true;
    // Ignoring the last word, loop through words and push to unique structures
    for (var w = 0; w < words.length - 1; w++) {
      // If the word is over 20 characters, ignore it (probably part of a link)
      if (words[w].length < 20) {
      // If word exists already, add the preceding word to the array
        if (uniqueWords.hasOwnProperty(words[w])) {
          uniqueWords[words[w]].push(words[w + 1]);
        } else {
          uniqueWords[words[w]] = [words[w + 1]];
        }
      }
    }
  }
  // Creates a phrase with our data
  function generatePhrase() {
    // Start off with a random starting word
    var curWord = randomElement(startingWords);
    var phrase = [curWord];
    // While there exists a following word, add a random following word to the phrase array
    while (uniqueWords.hasOwnProperty(curWord)) {
      var potentialNext = uniqueWords[curWord];
      curWord = randomElement(potentialNext);
      phrase.push(curWord);
      if (phrase.length > MIN_LENGTH && endingWords.hasOwnProperty(curWord)) {
        break;
      }
    }
    // Recurse if we have not met the minimum length
    if (phrase.length <= MIN_LENGTH) {
      return generatePhrase();
    }
    return phrase.join(' ');
  }
  // Adds on to post form
  function addGenPostOption() {
    var genRow = document.createElement('tr');
    genRow.id = 'gen-row';
    genRow.innerHTML = '<td>ThreadSpeak</td><td><button id="gen-post" type="button">Generate Post</button</td>';
    postForm.insertBefore(genRow, postForm.childNodes[postForm.childNodes.length - 1]);
    document.getElementById('gen-post').onclick = () => {
      comment.value = generatePhrase();
    };
  }
})();
