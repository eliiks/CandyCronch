// var. globales
let ctx = document.getElementById("canvas").getContext("2d")

let taille = 6
let controleur = new Controleur(taille, ctx)
controleur.vue.synchroModele();
controleur.vue.anime(ctx);

document.addEventListener("click", (event) => {
    controleur.gestionCapture(event);
})