// 1. APPARITION AU DÉFILEMENT (.reveal)
const elementsReveal = document.querySelectorAll(".reveal");

const observateurReveal = new IntersectionObserver(function (entrees) {
  entrees.forEach(function (entree) {
    if (entree.isIntersecting) {
      entree.target.classList.add("visible");
      observateurReveal.unobserve(entree.target);
    }
  });
}, { threshold: 0.15 });

elementsReveal.forEach(function (el) {
  observateurReveal.observe(el);
});


// 2. COMPTEUR « 3+ »
const compteur = document.getElementById("compteur");

function lancerCompteur() {
  const cible = Number(compteur.dataset.cible);
  let valeur = 0;
  compteur.textContent = "0";

  const minuteur = setInterval(function () {
    valeur++;
    compteur.textContent = valeur;
    if (valeur >= cible) {
      clearInterval(minuteur);
      compteur.textContent = cible + "+";
    }
  }, 300);
}

const observateurCompteur = new IntersectionObserver(function (entrees) {
  if (entrees[0].isIntersecting) {
    lancerCompteur();
    observateurCompteur.disconnect();
  }
}, { threshold: 0.6 });

observateurCompteur.observe(compteur);


// 3. FORMULAIRE DE CONTACT (Formspree)
const formulaire = document.getElementById("contact-form");
const boutonEnvoyer = document.getElementById("bouton-envoyer");
const statut = document.getElementById("form-statut");

function afficherStatut(texte, type) {
  statut.textContent = texte;
  statut.className = "form-statut " + type;
}

formulaire.addEventListener("submit", async function (evenement) {
  evenement.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (nom === "" || email === "" || message === "") {
    afficherStatut("Merci de remplir tous les champs.", "erreur");
    return;
  }
  if (!emailValide) {
    afficherStatut("L'adresse e-mail n'est pas valide.", "erreur");
    return;
  }

  boutonEnvoyer.disabled = true;
  afficherStatut("Envoi en cours…", "");

  try {
    const reponse = await fetch(formulaire.action, {
      method: "POST",
      body: new FormData(formulaire),
      headers: { "Accept": "application/json" }
    });

    if (reponse.ok) {
      afficherStatut("Message envoyé ✓", "succes");
      formulaire.reset();
    } else {
      afficherStatut("Oups, l'envoi a échoué. Réessaie plus tard.", "erreur");
    }
  } catch (erreur) {
    afficherStatut("Problème de connexion. Réessaie plus tard.", "erreur");
  }

  boutonEnvoyer.disabled = false;
});


// 4. MENU MOBILE : fermer le burger après un clic sur un lien
const menu = document.getElementById("menu");
const liensMenu = menu.querySelectorAll("a");

liensMenu.forEach(function (lien) {
  lien.addEventListener("click", function () {
    if (menu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});


// 5. COPYRIGHT : année automatique
document.getElementById("annee").textContent = new Date().getFullYear();


// 6. IMAGE DE PROJET MANQUANTE : on la cache (le fond sauge reste)
const imagesProjets = document.querySelectorAll(".projet-image img");

imagesProjets.forEach(function (img) {
  if (img.complete && img.naturalWidth === 0) {
    img.style.display = "none";
  }
  img.addEventListener("error", function () {
    img.style.display = "none";
  });
});
