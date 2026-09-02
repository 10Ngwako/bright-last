document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("assessmentForm");

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const answers = [

            document.querySelector(
                'input[name="q1"]:checked'
            ).value,

            document.querySelector(
                'input[name="q2"]:checked'
            ).value,

            document.querySelector(
                'input[name="q3"]:checked'
            ).value

        ];


        const scores = {

            technology: 0,
            people: 0,
            business: 0,
            creative: 0

        };


        answers.forEach(answer => {
            scores[answer]++;
        });


        const strongest = Object.keys(scores).reduce(
            (a, b) => scores[a] > scores[b] ? a : b
        );


        localStorage.setItem(
            "brightPathPotential",
            strongest
        );


        window.location.href = "results.html";

    });

});