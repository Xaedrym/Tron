"use strict";

/**
 *  TRON - version 2021 pour les L3 INFO
 */
document.addEventListener("DOMContentLoaded", function() {

    /** Récupération des informations liées au canvas */
    let canvas = document.getElementById("cvs");
    // Largeur et Hauteur
    const WIDTH = canvas.width = window.innerWidth;
    const HEIGHT = canvas.height = window.innerHeight;

    let playing = false;
    let pausing = false;

    let approximation = 0.075;

    let ctx = canvas.getContext("2d");

    class Joueur{
        // Constructeur
        constructor(x,y,vec_y,color){
            this.x = x;
            this.y = y;
            this.size = 0;
            this.speed = 0.2;
            this.vec_x = 0;
            this.vec_y = vec_y;
            this.trainee = [{x:this.x, y:this.y}];
            this.color = color;
            this.loose = false;
        }

        /**
         * Méthode permettant de savoir si le joueur a touché la bordure ou non,
         * dans ce cas, il perd alors la partie
         */
        border_hit(){
            // Gauche de l'écran
            if(this.x <= 0){
                this.loose = true;
            }
            // Droite de l'écran
            if((this.x + this.size) >= WIDTH){
                this.loose = true;
            }
            // Haut de l'écran
            if(this.y <= 0){
                this.loose = true;
            }
            // Bas de l'écran
            if((this.y + this.size) >= HEIGHT){
                this.loose = true;
            }
        }

                /**
         * Méthode permettant de savoir si le joueur a touché sa propre trainée ou non,
         * dans ce cas, il perd alors la parti
         */
        self_trainee_hit(){
            if(this.trainee.length > 1){
                for(let i = 1; i < this.trainee.length; i++){
                    let pos_i_m1 = this.trainee[i-1];
                    let pos_i = this.trainee[i];
                    let dist_segment = Math.sqrt(Math.pow(pos_i_m1.x - pos_i.x, 2) + Math.pow(pos_i_m1.y - pos_i.y, 2));
                    let dist_courrant_i_m1 = Math.sqrt(Math.pow(pos_i_m1.x - this.x, 2) + Math.pow(pos_i_m1.y - this.y, 2));
                    let dist_courrant_i = Math.sqrt(Math.pow(this.x - pos_i.x, 2) + Math.pow(this.y - pos_i.y, 2));

                    if(dist_courrant_i + dist_courrant_i_m1 <= dist_segment + approximation && dist_courrant_i + dist_courrant_i_m1 >= dist_segment - approximation){
                        this.loose = true;
                        return;
                    }
                }
            }
        }

        /**
         * Méthode permettant de savoir si le joueur a touché la trainée du joueur en paramètre ou non,
         * dans ce cas, il perd alors la parti
         */
        other_trainee_hit(joueur){
            if(joueur.trainee.length > 1){
                for(let i = 1; i < joueur.trainee.length; i++){
                    let pos_i_m1 = joueur.trainee[i-1];
                    let pos_i = joueur.trainee[i];
                    let dist_segment = Math.sqrt(Math.pow(pos_i_m1.x - pos_i.x, 2) + Math.pow(pos_i_m1.y - pos_i.y, 2));
                    let dist_courrant_i_m1 = Math.sqrt(Math.pow(pos_i_m1.x - this.x, 2) + Math.pow(pos_i_m1.y - this.y, 2));
                    let dist_courrant_i = Math.sqrt(Math.pow(this.x - pos_i.x, 2) + Math.pow(this.y - pos_i.y, 2));

                    if(dist_courrant_i + dist_courrant_i_m1 <= dist_segment + approximation && dist_courrant_i + dist_courrant_i_m1 >= dist_segment - approximation){
                        this.loose = true;
                        return;
                    }
                }
            }

            // Pour gérer le dernier segment
            let dist_last_segment = Math.sqrt(Math.pow(joueur.trainee.at(-1).x - joueur.x, 2) + Math.pow(joueur.trainee.at(-1).y - joueur.y, 2));
            let dist_courrant_i_m1 = Math.sqrt(Math.pow(joueur.trainee.at(-1).x - this.x, 2) + Math.pow(joueur.trainee.at(-1).y - this.y, 2));
            let dist_courrant_i = Math.sqrt(Math.pow(this.x - joueur.x, 2) + Math.pow(this.y - joueur.y, 2));
            if(dist_courrant_i + dist_courrant_i_m1 <= dist_last_segment + approximation && dist_courrant_i + dist_courrant_i_m1 >= dist_last_segment - approximation){
                this.loose = true;
            }
        }

        trainee_print(){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;  
            ctx.lineWidth = this.size;
            ctx.moveTo(this.trainee[0].x+this.size/2, this.trainee[0].y+this.size/2);
            for(let point of this.trainee){
                ctx.lineTo(point.x+this.size/2, point.y+this.size/2);
            }
            ctx.lineTo(this.x+this.size/2, this.y+this.size/2);
            ctx.stroke();
            ctx.closePath();
        }
    }


    // Initialisation des motos; point de départ, taille, vitesse et directions
    let rectangle_bleu = new Joueur(WIDTH/2, 0, 1, "lightblue");
    let rectangle_rouge = new Joueur(WIDTH/2, HEIGHT-1, -1, "orange");

    // use keycode.info
    // Changer la direction des motos
    document.addEventListener("keydown", function(e){
        // ------------     BLEU     ------------
        // Droite bleu
        if(e.key == "d"){
            if(rectangle_bleu.vec_x == 0 && rectangle_bleu.vec_y != 0){
                rectangle_bleu.vec_x = 1;
                rectangle_bleu.vec_y = 0;
                rectangle_bleu.trainee.push({x:rectangle_bleu.x, y:rectangle_bleu.y});
            }
        }
        // Gauche bleu
        if(e.key == "q"){
            if(rectangle_bleu.vec_x == 0 && rectangle_bleu.vec_y != 0){
                rectangle_bleu.vec_x = -1;
                rectangle_bleu.vec_y = 0;
                rectangle_bleu.trainee.push({x:rectangle_bleu.x, y:rectangle_bleu.y});
            }
        }
        // Bas bleu
        if(e.key == "s"){
            if(rectangle_bleu.vec_x != 0 && rectangle_bleu.vec_y == 0){
                rectangle_bleu.vec_x = 0;
                rectangle_bleu.vec_y = 1;
                rectangle_bleu.trainee.push({x:rectangle_bleu.x, y:rectangle_bleu.y});
            }
        }
        // Haut bleu
        if(e.key == "z"){
            if(rectangle_bleu.vec_x != 0 && rectangle_bleu.vec_y == 0){
                rectangle_bleu.vec_x = 0;
                rectangle_bleu.vec_y = -1;
                rectangle_bleu.trainee.push({x:rectangle_bleu.x, y:rectangle_bleu.y});
            }
        }

        // ------------     ROUGE     ------------
        // Droite rouge
        if(e.key == "ArrowRight"){
            if(rectangle_rouge.vec_x == 0 && rectangle_rouge.vec_y != 0){
                rectangle_rouge.vec_x = 1;
                rectangle_rouge.vec_y = 0;
                rectangle_rouge.trainee.push({x:rectangle_rouge.x, y:rectangle_rouge.y});
            }
        }
        // Gauche rouge
        if(e.key == "ArrowLeft"){
            if(rectangle_rouge.vec_x == 0 && rectangle_rouge.vec_y != 0){
                rectangle_rouge.vec_x = -1;
                rectangle_rouge.vec_y = 0;
                rectangle_rouge.trainee.push({x:rectangle_rouge.x, y:rectangle_rouge.y});
            }
        }
        // Bas rouge
        if(e.key == "ArrowDown"){
            if(rectangle_rouge.vec_x != 0 && rectangle_rouge.vec_y == 0){
                rectangle_rouge.vec_x = 0;
                rectangle_rouge.vec_y = 1;
                rectangle_rouge.trainee.push({x:rectangle_rouge.x, y:rectangle_rouge.y});
            }
        }
        // Haut rouge
        if(e.key == "ArrowUp"){
            if(rectangle_rouge.vec_x != 0 && rectangle_rouge.vec_y == 0){
                rectangle_rouge.vec_x = 0;
                rectangle_rouge.vec_y = -1;
                rectangle_rouge.trainee.push({x:rectangle_rouge.x, y:rectangle_rouge.y});
            }
        }
        //Pause
        if(e.key == " "){
            if(!playing && (rectangle_bleu.loose || rectangle_rouge.loose)){
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                playing = true;
                rectangle_bleu = new Joueur(WIDTH/2, 0, 1,"lightblue");
                rectangle_rouge = new Joueur(WIDTH/2, HEIGHT, -1, "orange");
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
            }
            else if(!playing){
                playing = true;
            }else{
                if(pausing){
                    pausing = false;
                }else{
                    pausing = true;
                }
            }
        }

    });

    /** Dernière mise à jour de l'affichage */
    let last = Date.now();

    /** Dernière mise à jour */
    function update(now) {
        // delta de temps entre deux mises à jour 
        let dt = now - last;
        last = now;

        if(playing && !pausing){
            // joueur bleu
            rectangle_bleu.x += rectangle_bleu.vec_x * dt * rectangle_bleu.speed;
            rectangle_bleu.y += rectangle_bleu.vec_y * dt * rectangle_bleu.speed;
            // joueur orange
            rectangle_rouge.x += rectangle_rouge.vec_x * dt * rectangle_rouge.speed;
            rectangle_rouge.y += rectangle_rouge.vec_y * dt * rectangle_rouge.speed;
            // pour le joueur bleu
            rectangle_bleu.border_hit();
            rectangle_bleu.self_trainee_hit();
            rectangle_bleu.other_trainee_hit(rectangle_rouge);
            // pour le joueur orange
            rectangle_rouge.border_hit();
            rectangle_rouge.self_trainee_hit();
            rectangle_rouge.other_trainee_hit(rectangle_bleu);
            if(rectangle_bleu.loose || rectangle_rouge.loose){
                playing = false;
            }
        }else{ return; }
    }

    /** Réaffichage du contenu du canvas */
    function render() {
        if(!playing && !rectangle_bleu.loose && !rectangle_rouge.loose){
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = "24px helvetica";
            ctx.fillText("A vous de jouer. Appuyer sur la touche :\n \"Space\"\n pour lancer la partie.", WIDTH / 2, HEIGHT / 2);
        }else if(!playing && rectangle_rouge.loose && rectangle_bleu.loose){
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = "24px helvetica";
            ctx.fillText("Partie terminée !", WIDTH / 2, HEIGHT / 2 - 100);
            ctx.fillStyle = "lightblue";
            ctx.fillText("Choc", WIDTH / 2 - 35, HEIGHT / 2);
            ctx.fillStyle = "orange";
            ctx.fillText("Frontal", WIDTH / 2 + 35, HEIGHT / 2);
            ctx.fillStyle = "white";
            ctx.fillText("Appuyer sur la touche :\n \"Space\"\n pour recommencer.", WIDTH / 2, HEIGHT / 2 + 100);
        }
        else if(!playing && rectangle_bleu.loose){
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = "24px helvetica";
            ctx.fillText("Partie terminée !", WIDTH / 2, HEIGHT / 2 - 100);
            ctx.fillStyle = "orange";
            ctx.fillText("Le joueur orange à gagné.", WIDTH / 2, HEIGHT / 2);
            ctx.fillStyle = "white";
            ctx.fillText("Appuyer sur la touche :\n \"Space\"\n pour recommencer.", WIDTH / 2, HEIGHT / 2 + 100);
        }else if(!playing && rectangle_rouge.loose){
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = "24px helvetica";
            ctx.fillText("Partie terminée !", WIDTH / 2, HEIGHT / 2 - 100);
            ctx.fillStyle = "lightblue";
            ctx.fillText("Le joueur bleu à gagné.", WIDTH / 2, HEIGHT / 2);
            ctx.fillStyle = "white";
            ctx.fillText("Appuyer sur la touche :\n \"Space\"\n pour recommencer.", WIDTH / 2, HEIGHT / 2 + 100);
        }
        else if(pausing){
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = "24px helvetica";
            ctx.fillText("Le jeu est actuellement en pause.\n Appuyer sur la touche :\n \"Space\"\n pour continuer.", WIDTH / 2, HEIGHT / 2);
        }else{
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            rectangle_bleu.trainee_print();
            rectangle_rouge.trainee_print();
        }
    }


    /** Boucle de jeu */
    (function loop() {
        requestAnimationFrame(loop);
        update(Date.now());
        render();
    })();

});

