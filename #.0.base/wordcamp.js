var Web = function()
{
    let recognition = {

        init: function() {
            document.getElementById("mic").addEventListener("click", function(event) {
                console.log("pulsado");
            });
        }

    };

    return {
        init: function () {
            recognition.init();
            console.log('init complete');
        }
    }
}();

jQuery(document).ready(function() {
    Web.init();
});
