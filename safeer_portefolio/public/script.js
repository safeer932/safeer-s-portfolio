function handleFormSubmit(event) {
    event.preventDefault(); // Empêche le rechargement de la page par défaut

    const form = document.getElementById("contact-form");
    const notification = document.getElementById("notification");

    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Envoyer les données au serveur
    fetch("/submit-form", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            // Afficher une notification
            notification.textContent = result.message || "Message envoyé avec succès !";
            notification.classList.remove("hidden");
            notification.classList.add("visible");

            // Masquer la notification après 3 secondes et revenir au portfolio
            setTimeout(() => {
                notification.classList.remove("visible");
                notification.classList.add("hidden");
                form.reset(); // Réinitialiser le formulaire
            }, 3000);
        })
        .catch((error) => {
            console.error("Erreur :", error);
            notification.textContent = "Une erreur est survenue. Veuillez réessayer.";
            notification.classList.remove("hidden");
            notification.classList.add("visible");
        });
}