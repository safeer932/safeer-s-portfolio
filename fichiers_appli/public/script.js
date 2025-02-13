function handleFormSubmit(event) {
    event.preventDefault(); // 🚀 Empêche le rechargement de la page

    const form = document.getElementById("contact-form");
    const notification = document.getElementById("notification");

    const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };

    fetch("/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(result => {
        // ✅ Afficher la notification avec un message en français
        notification.textContent = result.message || "Votre message a été envoyé avec succès !";
        notification.classList.remove("hidden");
        notification.classList.add("visible");

        // ✅ Cacher la notification après 3 secondes et réinitialiser le formulaire
        setTimeout(() => {
            notification.classList.remove("visible");
            notification.classList.add("hidden");
            form.reset();
        }, 3000);
    })
    .catch(error => {
        console.error("Erreur :", error);
        notification.textContent = "Une erreur est survenue. Veuillez réessayer.";
        notification.classList.remove("hidden");
        notification.classList.add("visible");
    });
}

// 📌 Attacher l'événement au formulaire
document.getElementById("contact-form").addEventListener("submit", handleFormSubmit);

