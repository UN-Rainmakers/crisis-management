$(document).ready(function() {
     setInterval(function() {
     $("#container").load("/get_last");
}, 2000);
});
