document.addEventListener("DOMContentLoaded", function () {

    const user = BP.requireRole("learner");
    if (!user) return;

    const profileData =
        localStorage.getItem("brightPathProfile");

    const potential =
        localStorage.getItem("brightPathPotential");


    if (!profileData) {
        window.location.href = "profile.html";
        return;
    }


    const profile = JSON.parse(profileData);


    document.getElementById("welcome").textContent =
        `${profile.name}, here's your BrightPath`;


    const careerTitle =
        document.getElementById("careerTitle");

    const careerDescription =
        document.getElementById("careerDescription");


    const careers = {

        technology: {
            title: "Technology & Computing",
            description:
                "You show a strong interest in technology, problem-solving and building solutions."
        },

        people: {
            title: "People & Health",
            description:
                "Your responses suggest that helping people and making a positive impact may suit you."
        },

        business: {
            title: "Business & Entrepreneurship",
            description:
                "You show an entrepreneurial mindset and an interest in solving problems through business."
        },

        creative: {
            title: "Creative Industries",
            description:
                "You appear to have strong creative interests and may enjoy design, communication and storytelling."
        }

    };


    if (careers[potential]) {

        careerTitle.textContent =
            careers[potential].title;

        careerDescription.textContent =
            careers[potential].description;

    }

});