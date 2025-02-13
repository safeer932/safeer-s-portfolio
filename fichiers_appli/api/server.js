require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 8080;

// 📌 Définition du chemin de base
const BASE_PATH = path.join(__dirname, ".."); // Monte du dossier `api` au projet principal

// ✅ Middleware pour parser les requêtes JSON et URL-encoded
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ✅ Servir les fichiers statiques correctement
app.use(express.static(path.join(BASE_PATH, "public"))); 
app.use("/images", express.static(path.join(BASE_PATH, "public", "images"))); 
app.use("/cv", express.static(path.join(BASE_PATH, "public", "cv")));

// ✅ Route principale (sert le fichier index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(BASE_PATH, "public", "index.html"));
});

// ✅ Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
    },
});

// ✅ Route pour le formulaire de contact
app.post("/submit-form", (req, res) => {
    // 📌 Vérifie si req.body est bien défini
    if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires !" });
    }

    const { name, email, message } = req.body;

    let formData = [];
    if (fs.existsSync(path.join(BASE_PATH, "api", "form-data.json"))) {
        const data = fs.readFileSync(path.join(BASE_PATH, "api", "form-data.json"), "utf8");
        formData = JSON.parse(data);
    }

    const newEntry = { name, email, message, date: new Date().toISOString() };
    formData.push(newEntry);

    fs.writeFileSync(
        path.join(BASE_PATH, "api", "form-data.json"),
        JSON.stringify(formData, null, 2),
        "utf8"
    );

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "ahsaf561@gmail.com",
        subject: "Nouveau message sur le portfolio",
        text: `Vous avez reçu un nouveau message :
        - Nom : ${name}
        - Email : ${email}
        - Message : ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Erreur lors de l'envoi de l'e-mail :", error);
            return res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail." });
        }
        console.log("✅ E-mail envoyé :", info.response);
        res.json({ message: "Votre message a été envoyé avec succès !" });
    });
});

// ✅ Démarrer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

