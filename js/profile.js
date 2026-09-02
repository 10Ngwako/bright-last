document.addEventListener("DOMContentLoaded", function () {

    const user = BP.requireRole("learner");
    if (!user) return;

    const form = document.getElementById("profileForm");

    const existing = JSON.parse(localStorage.getItem("brightPathProfile"));
    if (existing) {
        document.getElementById("name").value = existing.name || "";
        document.getElementById("surname").value = existing.surname || "";
        document.getElementById("grade").value = existing.grade || "";
        document.getElementById("province").value = existing.province || "";
        document.getElementById("maths").value = existing.marks?.maths || "";
        document.getElementById("science").value = existing.marks?.science || "";
        document.getElementById("english").value = existing.marks?.english || "";
        document.getElementById("lifeOrientation").value = existing.marks?.lifeOrientation || "";
        document.getElementById("interest").value = existing.interest || "";
    }

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

        BP.syncLearnerRecord(user);

        window.location.href = "potential.html";

    });

});