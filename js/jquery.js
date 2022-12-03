$(document).ready(function () {
    console.log("here");
    $(document.body).on("click", "tr[data-href]", function() {
        window.location.href = this.dataset.href;
    });
});