document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("profileForm");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const profile = {

            name: document.getElementById("name").value,
            surname: document.getElementById("surname").value,
            grade: document.getElementById("grade").value,
            province: document.getElementById("province").value,

            marks: {
                maths: Number(document.getElementById("maths").value),
                science: Number(document.getElementById("science").value || 0),
                english: Number(document.getElementById("english").value),
                lifeOrientation: Number(
                    document.getElementById("lifeOrientation").value || 0
                )
            },

            interest: document.getElementById("interest").value

        };


        localStorage.setItem(
            "brightPathProfile",
            JSON.stringify(profile)
        );


        window.location.href = "potential.html";

    });

});