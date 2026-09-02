document.addEventListener("DOMContentLoaded", function () {

    console.log("BrightPath loaded successfully.");

    const links = document.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", function () {

            const href = this.getAttribute("href");

            if (href && href.startsWith("#")) {
                return;
            }

            console.log("Navigating to:", href);
        });

    });

});