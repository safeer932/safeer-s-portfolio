const express = require ("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer"); // Importer Nodemailer
const app = express();
const PORT = 8080;

// Middleware pour analyser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers HTML, CSS et images
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/cv", express.static(path.join(__dirname, "cv")));

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Utilise Gmail pour l'envoi d'e-mails
  auth: {
    user: "ahsaf561@gmail.com", // Ton adresse Gmail
    pass: "******", // Ton mot de passe ou ton "App Password" Gmail
  },
});

// Endpoint pour traiter le formulaire
app.post("/submit-form", (req, res) => {
  const { name, email, message } = req.body;

  // Charger les données existantes ou initialiser un tableau vide
  let formData = [];
  if (fs.existsSync("form-data.json")) {
    const data = fs.readFileSync("form-data.json", "utf8");
    formData = JSON.parse(data);
  }

  // Ajouter les nouvelles données
  const newEntry = {
    name,
    email,
    message,
    date: new Date().toISOString(),
  };
  formData.push(newEntry);

  // Enregistrer dans le fichier JSON
  fs.writeFileSync("form-data.json", JSON.stringify(formData, null, 2), "utf8");

  // Envoyer une notification par e-mail
  const mailOptions = {
    from: "tonemail@gmail.com",
    to: "ahsaf561@gmail.com", // L'adresse où tu souhaites recevoir la notification
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
    console.log("E-mail envoyé :", info.response);
    res.json({ message: "Votre message a été envoyé." });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://0.0.0.0:${PORT}`);
});

