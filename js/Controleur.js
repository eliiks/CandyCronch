/**
 * Cette classe va gérer l'intelligence du jeu
 * @Author : Louis-Xavier Godet
 */
class Controleur{
    constructor(taille, ctx){
        this.taille = taille;
        this.interactionAutorise = false;
        this.bonbonSelectionne = "";
        this.modele = new Modele(taille, this);
        this.vue = new Vue(taille, this, this.modele);
        this.contexte = ctx;
    }

    gestionCapture(event){
        if(this.interactionAutorise){
            this.modele.compterScore=true;
            var x = event.pageX - event.target.offsetLeft;
            var y = event.pageY - event.target.offsetTop;

            // Quel bonbon a été touché ?
            let yCase = Math.floor(x / 88); //Quelle colonne ?
            let xCase = Math.floor(y / 88); //Quelle ligne ?

            if((xCase >= 0) && (xCase < taille) && (yCase >= 0) && (yCase < taille)){
                this.interactionAutorise = false;

                if(this.bonbonSelectionne === ""){
                    this.bonbonSelectionne = [xCase, yCase];
                    this.vue.selectionnerBonbon(xCase, yCase, true);
                    this.vue.anime(this.contexte);
                }else{
                    //Verifier que les deux bonbons sont voisins
                    let vHorizontal = [yCase-1, yCase+1].filter((c) => (xCase === this.bonbonSelectionne[0]) && (c === this.bonbonSelectionne[1]));
                    let vVertical = [xCase-1, xCase+1].filter((c) => (yCase === this.bonbonSelectionne[1]) && (c === this.bonbonSelectionne[0]));

                    if(vHorizontal.length > 0 || vVertical.length > 0){
                        if(this.modele.verifierAlignement(xCase, yCase, this.bonbonSelectionne[0], this.bonbonSelectionne[1])){
                            //Si alignement possible
                            this.vue.selectionnerBonbon(this.bonbonSelectionne[0], this.bonbonSelectionne[1], false);
                            this.vue.echangerVue(xCase, yCase, this.bonbonSelectionne[0], this.bonbonSelectionne[1]);
                        }
                    }

                    // FIN : marquer déselection, mise à jour vue + animation
                    this.vue.selectionnerBonbon(this.bonbonSelectionne[0], this.bonbonSelectionne[1], false);
                    this.bonbonSelectionne = "";
                    this.vue.anime(this.contexte);
                }
            }
        }
    }

    /**
     * Fonction appelée par la vue à la fin de son traitement d'animation
     */
    finAnimation(){
        let bonbonAjoute = this.comblerGrille();

        if(bonbonAjoute){
            //Chute de bonbons.
            this.vue.anime(this.contexte);
        }else{
            if(this.modele.verifierTousAlignements()){
                this.modele.eliminerAlignements();
                this.vue.synchroModele(); //Eclatement des bonbons
                this.vue.anime(this.contexte);
            }else{
                this.interactionAutorise = true;
            }
        }
    }

    /**
     * Comble chaque colonne de la grille du modèle
     * Echange la position de deux sprites de bonbons si besoin.
     * N'ajoute pas de bonbons à la vue, cela sera fait après.
     */
    comblerGrille(){
        let bonbonAjoute = false;
        for(let j = 0; j < this.taille; j++){
            for(let i = this.taille-1; i >= 0; i--){
                if(this.modele.grille[i][j] === "") {
                    bonbonAjoute = true;

                    // 1 - Recherche d'un bonbon au-dessus de la case courante pour le faire chuter
                    let trouve = false;
                    let k = i-1;
                    while(k >= 0 && !trouve) {
                        if (this.modele.grille[k][j] !== "") {
                            trouve = true;

                            // Bonbon au-dessus du vide -> chute
                            this.modele.grille[i][j] = this.modele.grille[k][j];
                            this.vue.echangerVue(i, j, k, j);

                            // Actualisation du modèle
                            this.modele.grille[k][j] = "";
                        }
                        k--;
                    }

                    // 2 - Si aucuns bonbons au-dessus, on ajoute un nouveau pour compléter
                    if (!trouve) {
                        this.modele.ajouterBonbon(i,j);
                    }
                }
            }
        }
        if(bonbonAjoute){
            this.vue.synchroModele();
        }
        return bonbonAjoute;
    }
}