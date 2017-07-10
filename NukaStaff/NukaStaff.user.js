// ==UserScript==
// @name        NukaStaff
// @namespace   https://github.com/ryanml
// @include     http://fallout.wikia.com/wiki/Template:NukaStaff
// @version     1
// @grant       none
// ==/UserScript==
(function($) {

    var $staffBox = $('#staff-container');

    if (!$staffBox.length) { return; }

    // Grab all the placeholders
    var $placeholders = $('.img-placeholder')

    // Build an array of user names
    var users = [];
    $placeholders.each(function() {
        users.push($(this).attr('data-user'));
    });

    // Create a query string from user names
    var queryString = users.join(',');

    // Call to API to fetch images
    $.ajax({
        url: "http://fallout.wikia.com/api/v1/User/Details",
        data: { "ids": queryString },
        success: function(response) {
            var userItems = response.items;
            for (var i = 0; i < userItems.length; i++) {
                var $placeholder = $(".img-placeholder[data-user='" + userItems[i].name + "']");
                $placeholder.html("<img src='" + userItems[i].avatar + "'/>");
            }
        }, 
        dataType: "json"
    });

})(jQuery);
