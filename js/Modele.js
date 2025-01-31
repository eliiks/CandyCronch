/**
 * Cette classe va gérer le stockage, la modification et la vérification des données du jeu.
 * Dans les données du jeu, on retrouve principalement la grille de bonbon et le score
 * @Author : Louis-Xavier Godet
 */
class Modele{

    /**
     * Constructeur du modèle
     */
    constructor(taille) {
        if(taille > 0){
            this.taille = taille;
            this.grille = new Array(this.taille);
            this.score = 0;
            this.compterScore = false;

            //Init. de la grille (vide pour le moment)
            for(let i = 0; i < this.taille; i++){
                this.grille[i] = new Array(this.taille);

                for(let j = 0; j < this.taille; j++) {
                    this.grille[i][j] = ""
                }
            }

            //Remplissement complet de la grille
            for(let i = 0; i < this.taille; i++){
                for(let j = 0; j < this.taille; j++) {
                    this.ajouterBonbon(i,j);
                }
            }
        }
    }

    /**
     * Retourne une copie de la grille.
     */
    getGrille(){return JSON.parse(JSON.stringify(this.grille));}

    /**
     * Ajoute le bonbon à la case (x,y).
     */
    ajouterBonbon(x,y){this.grille[x][y] = Math.floor(1 + (Math.random() * (6-1)));}

    /**
     * Verifie les voisins de la case (x,y)
     * pour vérifier un alignement.
     */
    verifierAlignement1Bonbon(x, y){
        let alignement = false;

        // 1 - Liste des valeurs voisines de (x,y) (jusqu'a 2 cases)
        let lHorizontals = [y-2, y-1, y+1, y+2].filter((c) => c >= 0 && c < this.taille).map((c) => this.grille[x][c]);
        let lVerticals = [x-2, x-1, x+1, x+2].filter((c) => c >= 0 && c < this.taille).map((c) => this.grille[c][y]);

        let i = 0;
        let combo = 0;
        while(i < lHorizontals.length && combo < 2){
            if(lHorizontals[i] === this.grille[x][y]){
                combo += 1;
            }else{
                combo = 0;
            }
            i += 1
        }

        if(combo >= 2){alignement = true}
        else{
            i = 0;
            combo = 0;
            while(i < lVerticals.length && combo < 2){
                if(lVerticals[i] === this.grille[x][y]){
                    combo += 1;
                }else{
                    combo = 0;
                }
                i += 1
            }
        }
        if(combo >= 2){alignement = true}

        return alignement;
    }

    /**
     * Vérifie, si en échangeant de place "bonbon 0" et "bonbon 1", il y a un alignement.
     * Si oui, l'échange des deux bonbons est fait dans la grille.
     * Si non, l'échange est annulé.
     */
    verifierAlignement(x0,y0,x1,y1){
        let alignement;

        // 1 - Echange (annulable si pas d'alignement)
        [this.grille[x0][y0], this.grille[x1][y1]] = [this.grille[x1][y1], this.grille[x0][y0]];

        // 2 - Verif. alignement de chaque bonbon.
        alignement = this.verifierAlignement1Bonbon(x0,y0);
        if(!alignement){alignement = this.verifierAlignement1Bonbon(x1,y1);}

        // 3 - Annuler l'échange si aucuns alignements possible.
        if(!alignement){
            [this.grille[x0][y0], this.grille[x1][y1]] = [this.grille[x1][y1], this.grille[x0][y0]]
        }

        return alignement
    }

    /**
     * Verifie les alignements de chaque bonbon dans la grille.
     */
    verifierTousAlignements(){
        for(let i = 0; i < this.taille; i++){
            for(let j = 0; j < this.taille; j++){
                if(this.verifierAlignement1Bonbon(i,j)){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Elimine les alignements dans la grille.
     */
    eliminerAlignements(){
        // Copie de la grille pour travailler avec l'original sans la modifier.
        let nouvelleGrille = this.getGrille();

        for(let i = 0; i < this.taille; i++){
            for(let j = 0; j < this.taille; j++){
                if(this.verifierAlignement1Bonbon(i,j)){
                    nouvelleGrille[i][j] = "" //Explosion du bonbon
                    if(this.compterScore){this.score += 1}
                }
            }
        }

        // Désignation de la nouvelle grille après explosions.
        this.grille = nouvelleGrille;
    }
}