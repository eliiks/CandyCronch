/**
 * Cette classe représente un bonbon dans la grille du jeu
 * @Author : Louis-Xavier Godet
 */
class Bonbon {

    /**
     * Constructeur de bonbon.
     */
    constructor(x, y, type) {
        this.positionCourante = [x,y];
        this.positionCible = [x,y];
        this.type = type;
        this.selectionne = false;
        this.mouvement = false;
        this.imgBonbon = new Image();

        //Sélection de l'image source selon le type
        switch(type){
            case 1:
                this.imgBonbon.src = "./images/Yellow.png";
                break;
            case 2:
                this.imgBonbon.src = "./images/Red.png";
                break;
            case 3:
                this.imgBonbon.src = "./images/Orange.png";
                break;
            case 4:
                this.imgBonbon.src = "./images/Green.png";
                break;
            case 5:
                this.imgBonbon.src = "./images/Blue.png";
                break;
            default:
                break;
        }
    }

    /**
     * Change l'état de sélection du bonbon.
     * etat = true : le bonbon est sélectionné
     * etat = false : le bonbon n'est plus selectionné
     */
    marquerSelection(etat){this.selectionne = etat;}

    /**
     * Indique si le bonbon est en train de chuter dans la grille.
     * @returns {boolean} : vrai s'il se déplace, faux sinon.
     */
    enMouvement(){return this.mouvement;}

    /**
     * Dessine le bonbon sur le canvas sur sa position courante.
     * @param contexte -> le canvas sur lequel dessiner
     */
    dessiner(contexte){
        contexte.drawImage(this.imgBonbon, this.positionCourante[0], this.positionCourante[1]);

        if(this.selectionne){
            //Si bonbon sélectionné => carré noir légérement transparent apparait au-dessus de l'image.
            contexte.fillStyle="rgba(0,0,0,0.5)";
            contexte.fillRect(this.positionCourante[0],this.positionCourante[1],88,88);
        }
    }

    /**
     * Etablit une position cible que le bonbon doit atteindre progressivement
     * Ne change pas la position courante du bonbon.
     * @param x -> coordonée sur l'axe horizontal du canvas ciblée
     * @param y -> coordonée sur l'axe vertical du canvas ciblée
     */
    seDeplacerVers(x,y){
        this.positionCible = [x,y];
        if(x !== this.positionCourante[0] || y!==this.positionCourante[1]){
            this.mouvement = true;
        }
    }

    /**
     * Met à jour la position courante du bonbon (incrémentée de 2).
     * Mise à jour uniquement si le bonbon n'a pas encore atteint la position cible.
     */
    misAJour(){
        if(this.mouvement) {
            if((this.positionCourante[0] !== this.positionCible[0]) || (this.positionCourante[1] !== this.positionCible[1])){
                if(this.positionCible[0] > this.positionCourante[0]) { this.positionCourante[0] += 4;}
                if(this.positionCible[0] < this.positionCourante[0]) { this.positionCourante[0] -= 4;}
                if(this.positionCible[1] > this.positionCourante[1]) { this.positionCourante[1] += 4;}
                if(this.positionCible[1] < this.positionCourante[1]) { this.positionCourante[1] -= 4;}
            }else{
                this.mouvement = false;
            }
        }
    }
}