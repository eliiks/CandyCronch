/**
 * Cette classe va gérer l'affichage des bonbons ainsi que des animations.
 * @Author : Louis-Xavier Godet
 */
class Vue{
    constructor(taille, controleur, modele) {
        this.taille = taille;
        this.controleur = controleur;
        this.modele = modele;

        //Init. grille bonbons
        this.grilleBonbons = new Array(taille);
        for(let i = 0; i < taille; i++){
            this.grilleBonbons[i] = new Array(taille);

            for(let j = 0; j < taille; j++){
                this.grilleBonbons[i][j] = "";
            }
        }

        this.vueLargeur = this.taille*88;
        this.vueHauteur = (this.taille*88)+60;
    }

    /**
     * Dessine la grille en demandant à chaque bonbon de s'afficher.
     * Dessine aussi le score.
     * @param contexte
     */
    dessinGrille(contexte){


        // Effacement
        contexte.fillStyle = "white";
        contexte.fillRect(0,0,this.vueLargeur,this.vueHauteur);

        // Bordure
        contexte.beginPath();
        contexte.strokeStyle="black";
        contexte.lineWidth="2";
        contexte.rect(0,0,this.vueLargeur,this.vueHauteur);
        contexte.stroke();

        // Score
        contexte.fillStyle = "black";
        contexte.font="45px chewy";
        contexte.textAlign="center";
        contexte.fillText("Score = " + this.modele.score, 528 / 2, this.vueHauteur - 15);

        //Grille
        this.grilleBonbons.forEach((ligne) => ligne.forEach((bonbon) => {if(bonbon!=="")bonbon.dessiner(contexte)}));
    }

    /**
     * Fonction récursive d'animation
     */
    anime(contexte){
        this.grilleBonbons.forEach((ligne) => ligne.forEach((bonbon) => {if(bonbon!=="")bonbon.misAJour()}));
        this.dessinGrille(contexte);
        let bonbonsEnMouvement = this.grilleBonbons.flatMap((ligne) => ligne.filter((bonbon) => {if(bonbon!=="") return bonbon.enMouvement()}));

        if(bonbonsEnMouvement.length > 0) {
            var that = this;
            setTimeout(() => that.anime(contexte), 10); // Refresh toutes les 10ms
        } else {
            // Plus de bonbons qui bouge -> fin d'animation -> on reveille le controleur
            this.controleur.finAnimation();
        }
    }

    /**
     * Ajoute un bonbon à la vue.
     */
    ajouterBonbon(x,y,type){
        this.grilleBonbons[x][y] = new Bonbon(y*88, (x*88)-440, type);
        this.grilleBonbons[x][y].seDeplacerVers(y*88, x*88);
    }

    /**
     * Demande au modèle sa grille et se synchronise avec lui
     */
    synchroModele() {
        let grilleDuModele = this.modele.getGrille();

        for(let i = 0; i < this.taille; i++){
            for(let j = 0; j < this.taille; j++){
                if(grilleDuModele[i][j] !== "" && this.grilleBonbons[i][j] === ""){
                    this.ajouterBonbon(i,j,grilleDuModele[i][j]);
                }else if(grilleDuModele[i][j] === "" && this.grilleBonbons[i][j] !== ""){
                    this.grilleBonbons[i][j] = "";
                }
            }
        }
    }

    /**
     * Selectionne le bonbon ou le deselectionne selon état.
     */
    selectionnerBonbon(x,y,etat){
        this.grilleBonbons[x][y].marquerSelection(etat);
    }

    /**
     * Echange la position de deux sprites bonbons dans la grille
     */
    echangerVue(x0, y0, x1, y1){
        [this.grilleBonbons[x0][y0], this.grilleBonbons[x1][y1]] = [this.grilleBonbons[x1][y1], this.grilleBonbons[x0][y0]];

        if(this.grilleBonbons[x0][y0] !== "" && this.grilleBonbons[x1][y1] !== ""){
            this.grilleBonbons[x0][y0].seDeplacerVers(this.grilleBonbons[x1][y1].positionCourante[0],this.grilleBonbons[x1][y1].positionCourante[1]);
            this.grilleBonbons[x1][y1].seDeplacerVers(this.grilleBonbons[x0][y0].positionCourante[0],this.grilleBonbons[x0][y0].positionCourante[1]);
        }else if(this.grilleBonbons[x0][y0] === ""){
            this.grilleBonbons[x1][y1].seDeplacerVers(y0*88,x0*88);
        }else{
            this.grilleBonbons[x0][y0].seDeplacerVers(y1*88,x0*88);
        }
    }
}