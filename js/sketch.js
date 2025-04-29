"use strict";
const W=800;
const H=900;
const SCREENS={
    LOADING:0,
    MENU:1,
    FIRSTLEVEL:2,
    SECONDLEVEL:3,
    LEADERBOARD:4
}
let currentScreen = 0;
let menuImage;
let knifeImage;
let menuBtn;
let firstlevelBtn;
let isFirstReady=false;
let isSecondReady=false;
let brownBricks;
let bottombrownBricks;
let topbrownBricks;
let brownbrickImage;
let brownRocks;
let brownrocksTop;
let brownrockImage;
let greenBricks;
let greenbrickImage;
let greenrockLeft;
let greenrockRight;
let greenrocksLeft;
let greenrocksRight;
let floatRock;
let floatRocks;
let tree;
let treeImage;
let grassleft;
let grassright
let fVelocity=[];
let cliffImage;
let cliffs;
let cliffTop;
let clifftopImage;
let fireSprite;
let lavaSprite;
let objects;
let doorImage;
let door;
let guideImage;
let guideSprite
let sharpSprite;
let sharp1;
let sharp2;
let sharp3;
let lavarock;
let lavaRiver;
let lavaImage;
let girlSprite;
let girlSprite2;
let girlDeadSprite;
let girls={
    run:null,
    stand:null,
    jump:null,
    attack:null,
    dead:null
};
let death;
let diamond;
let diamonds;
let diamondImage;
let dia=[];
let coi=[];
let coin;
let coins;
let coinsSecondLevel;
let coinImage;
let ghosts={
    walk:null,
    dead:null
}
let ghostTopSprite;
let ghostBottomSprite;
let gtVelocity=2;
let gbVelocity=1;
let leadersRecord;
let boardBgImage;
let boardImage;
let bgSound;
let attackSound;
let collectSound;
let loadingGif;
let isLoaded = false;
let boardBtn;

function preload(){
    menuImage=loadImage('images/menuimage.png');
    knifeImage=loadImage('images/knife.png');
    brownbrickImage=loadImage('images/brownbrick.png');
    brownrockImage=loadImage('images/rock2.png');
    greenbrickImage=loadImage('images/greenbrick.png');
    greenrockLeft=loadImage('images/greenrockleft.png');
    greenrockRight=loadImage('images/greenrockright.png');
    floatRock=loadImage('images/floatrock.png');
    cliffImage=loadImage('images/cliff.png');
    clifftopImage=loadImage('images/clifftop.png');
    floatRock=loadImage('images/floatrock.png');
    treeImage=loadImage('images/tree.png');
    grassleft=loadImage('images/grassleft.png');
    grassright=loadImage('images/grassright.png');
    doorImage=loadImage('images/door.png');
    guideImage=loadImage('images/guide.png');
    sharp1=loadImage('images/sharp1.png');
    sharp2=loadImage('images/sharp3.png');
    lavaImage=loadImage('images/lava.png');
    lavarock=loadImage('images/lavarock.png');
    girls.run=loadAni('images/run2.png',8);
    girls.stand=loadAni('images/stand1.png',7);
    girls.jump=loadAni('images/jump1.png',10);
    girls.attack=loadAni('images/attack1.png',7);
    girls.dead=loadAni('images/dead1.png',10);
    girls.dead.noLoop();
    ghosts.walk=loadAni('images/walk1.png',9);
    ghosts.dead=loadAni('images/gdead1.png',12);
    ghosts.dead.noLoop();
    diamondImage=loadImage('images/diamond.png');
    coinImage=loadImage('images/coin.png');
    leadersRecord=loadJSON('./leaders.json');
    boardImage=loadImage('./images/leaderboard.png');
    boardBgImage=loadImage('./images/menuimage.png');
    bgSound=loadSound('backgroundsound.mp3');
    attackSound=loadSound('attacksound.wav');
    collectSound=loadSound('collectsound.wav');
    loadingGif=createImg('./images/loading.gif');
}

function setup(){
    let cnv=createCanvas(W,H);
    menuBtn=createButton('Start');
    menuBtn.position(W/2-20,H/2+150);
    menuBtn.mouseClicked(firstLevel);
    cnv.mouseClicked(bgsoundPlay);
    bgSound.setVolume(0.2);
    attackSound.setVolume(0.5);
    collectSound.setVolume(0.2);
}

function bgsoundPlay(){
    if(bgSound.isPlaying()===false){
        bgSound.play();
    }
}

function attacksoundPlay(){
    if(attackSound.isPlaying()===false){
        attackSound.play();
    }
}

function collectsoundPlay(){
    collectSound.play();
}

function makeLava(x,y){
    let lava=new Sprite(x,y);
    lava.addAni('images/lava1.png',5);
    lava.collider='s';
    lava.scale=0.8;
    return lava;
}

function makeGirl(x,y){
    let girl=new Sprite(x,y);
    girl.addAni('run',girls.run);
    girl.addAni('stand',girls.stand);
    girl.addAni('jump',girls.jump);
    girl.addAni('attack',girls.attack);
    girl.addAni('dead',girls.dead);
    girl.changeAni('stand');
    girl.scale=0.08;
    girl.collider='d';
    girl.rotationLock=true;
    world.gravity.y=14;
    return girl;
}

function makeGirlDead(x,y){
    let girlDead=new Sprite(x,y);
    girlDead.addAni('dead',girls.dead);
    girlDead.scale=0.08;
    girlDead.collider='d';
    girlDead.rotationLock=true;
    world.gravity.y=14;
    return girlDead;
}

function makeFire(x,y){
    let fire=new Sprite(x,y);
    fire.addAni('images/fire1.png',4);
    fire.collider='s';
    fire.scale=1.5;
    return fire;
}

function makeObjects(x,y,objectImage,objectSize){
    let object=new Sprite(x,y);
    object.collider='s';
    object.img=objectImage;
    object.scale=objectSize;
    return object;
}

function changeCollider(girlSprite,object){
    if(girlSprite.y > object.y){
    object.collider='k';
    object.velocity.x=5;
    object.velocity.y=3;
    };
}

function collect(girlSprite,object){
    collectsoundPlay();
    object.remove();
}

function makeGhost(x,y){
    let ghost=new Sprite(x,y);
    ghost.addAni('walk',ghosts.walk);
    ghost.addAni('dead',ghosts.dead)
    ghost.changeAni('walk',ghosts.walk);
    ghost.scale=0.09;
    ghost.collider='s';
    ghost.rotationLock=true;
    return ghost;
}

function gameLoad() {
    setTimeout(() => {
        isLoaded = true;
    }, 7800)
}

let knifex=W/2-180;let knifey=H/2-60;
function keyPressed(){
    if(keyCode==UP_ARROW){
        knifey-=50;
    }
    if(keyCode==DOWN_ARROW){
        knifey+=50;
    }   
}

function clearSprites(){
    for(let i = allSprites.length; i--;){
        allSprites[i].remove();
    }
}

function loadingScreen(){
    currentScreen=SCREENS.LOADING; 
    loadingGif.size(900,800)
    loadingGif.position(-50,0);
    gameLoad(); 
}

function menuScreen(){ 
    currentScreen=SCREENS.MENU;  
    clearSprites();
    isFirstReady = false;   
    isSecondReady = false;   
}

function goTomenuScreen(){
    menuScreen();
}

function firstLevel(){
    currentScreen=SCREENS.FIRSTLEVEL;
    if(isFirstReady===false){
        let blockcount=40;
        let rockcount=2;
        let lavacount=11;
        brownBricks=new Group();
        for(let level=0;level<2;level++){    
            for(let i=0;i<blockcount;i++){
               brownBricks.push(makeObjects(i*32+15,level*150+670,brownbrickImage,0.5));
            }
        }    
        brownRocks=new Group();
            for(let i=0;i<rockcount;i++){
                brownRocks.push(makeObjects(i*745+30,H-160,brownrockImage,0.7));
            }       
        greenBricks=new Group();
            for(let i=0;i<7;i++){
               greenBricks.push(makeObjects(i*33+20,520,greenbrickImage,0.5));
            }
            for(let j=0;j<5;j++){
               greenBricks.push(makeObjects(j*33+370,520,greenbrickImage,0.5));
            }
            for(let h=0;h<6;h++){
                greenBricks.push(makeObjects(h*33+635,520,greenbrickImage,0.5));
            }
            for(let k=0;k<3;k++){
                greenBricks.push(makeObjects(k*33+710,200,greenbrickImage,0.9));
            }
        greenrocksRight=makeObjects(650,200,greenrockRight,1);
    
        lavaRiver=new Group();
        for(let i=0;i<lavacount;i++){
            lavaRiver.push(makeObjects(i*76+20,H-40,lavaImage,1.2));
        }
        floatRocks = new Group();
        for(let i=0;i<2;i++){
            let floatx=i*250+250;
            let floaty=i*110+300;
            floatRocks.push(makeObjects(floatx,floaty,floatRock,1)); 
            fVelocity[i]=2;  
        }
        diamonds=new Group();
        coins=new Group();
            for(let level=0;level<3;level++){
                dia[level]=random(150,500);
                coi[level]=random(250,650);
                diamonds.push(makeObjects(dia[level],790-level*150,diamondImage,1));
                coins.push(makeObjects(coi[level],790-level*150,coinImage,1));
            } 
        coin = makeObjects(90,325,coinImage,1);
        tree=makeObjects(740,460,treeImage,1.5);
        cliffs=new Group();
        for(let level=0;level<2;level++){
            cliffs.push(makeObjects(40,level*64+410,cliffImage,1));
        }  
        cliffTop=makeObjects(44,368,clifftopImage,1);
        greenrocksLeft=makeObjects(102,368,greenrockLeft,1);
        fireSprite=makeFire(300,H-120);
        lavaSprite=makeLava(685,H-285);
        guideSprite=makeObjects(770,H-752,guideImage,1.1);
        sharpSprite=makeObjects(670,H-130,sharp1,1);
        girlSprite=makeGirl(150,H-150);
        girlDeadSprite=makeGirlDead(900,900);
        girlSprite.collides(brownBricks,changeCollider);
        girlSprite.collides(diamonds,collect);
        girlSprite.collides(coin,collect);
        girlSprite.collides(coins,collect);
        isFirstReady=true;
    }
}

function goTosecondLevel(){
    girlSprite.remove();
    brownBricks.removeAll();
    greenBricks.removeAll();
    diamonds.removeAll(); 
    floatRocks.removeAll();
    fireSprite.remove();
}

function guideTosecondLevel(){
    secondLevel();
}

function secondLevel(){
    goTosecondLevel();
    if(isSecondReady === false){
        girlSprite=makeGirl(150,H-150);
        girlDeadSprite=makeGirlDead(900,900);
        girlSprite.collides(brownBricks,changeCollider);
        girlSprite.collides(diamonds,collect);
        girlSprite.collides(coin,collect);
        ghostTopSprite=makeGhost(350,H-420);
        ghostBottomSprite=makeGhost(95,H-265);  
        bottombrownBricks=new Group();  
            for(let i=0;i<11;i++){
               bottombrownBricks.push(makeObjects(i*32+15,820,brownbrickImage,0.5));
            }
            for(let j=0;j<12;j++){
                bottombrownBricks.push(makeObjects(j*32+460,820,brownbrickImage,0.5));
             }
        topbrownBricks=new Group();
            for(let i=0;i<26;i++){
                topbrownBricks.push(makeObjects(i*32+15,670,brownbrickImage,0.5));
            }
        greenBricks=new Group();
            for(let i=0;i<7;i++){
               greenBricks.push(makeObjects(i*33+20,520,greenbrickImage,0.5));
            }
            for(let j=0;j<7;j++){
               greenBricks.push(makeObjects(j*33+340,520,greenbrickImage,0.5));
            }
            for(let h=0;h<5;h++){
                greenBricks.push(makeObjects(h*33+650,520,greenbrickImage,0.5));
            }
            for(let k=0;k<3;k++){
                greenBricks.push(makeObjects(k*33+710,200,greenbrickImage,0.9));
            }
        coinsSecondLevel=new Group();
            for(let level=0;level<3;level++){
                coi[level]=random(250,650);
                coins.push(makeObjects(coi[level],790-level*150,coinImage,1));
            }
        floatRocks = new Group();
        for(let i=0;i<2;i++){
            let floatx=i*250+250;
            let floaty=i*110+300;
            floatRocks.push(makeObjects(floatx,floaty,floatRock,1)); 
            fVelocity[i]=3;  
        }
        fireSprite=makeFire(300,H-120);
        girlSprite.collides(topbrownBricks,changeCollider);
        girlSprite.collides(coin,collect);
        girlSprite.collides(coins,collect);
        girlSprite.collides(coinsSecondLevel,collect);
        isSecondReady = true;
        currentScreen=SCREENS.SECONDLEVEL;
    }
}

function goToleaderboard(){
    currentScreen=SCREENS.LEADERBOARD;  
    clearSprites();
}

function leaderboard(){ 
    currentScreen=SCREENS.LEADERBOARD;  
    isFirstReady = false;   
    isSecondReady = false;  
}

function draw(){
    background('black');
    if(currentScreen===0){
        if (isLoaded === true) {
            loadingGif.remove();
        }
        loadingScreen();
        menuBtn.hide(); 
        setTimeout(goTomenuScreen,8800);
    }
    if(currentScreen===1){
        image(menuImage,0,0,800,800);
        fill('white');
        textFont('BM Kirang Haerang');
        textAlign(CENTER,CENTER);
        textSize(100);
        text('ROCK',W/2,H/2-250);
        text('CLIMBER',W/2,H/2-150);
        textSize(30);
        text('1 PLAYER GAME',W/2,H/2-50);
        text('2 PLAYER GAME',W/2,H/2);
        image(knifeImage,knifex,knifey,80,20);
        text('LEVEL 01',W/2,H/2+50);
        menuScreen();
        menuBtn.show(); 
        }
    if(currentScreen===2){
        if(kb.pressing('right')){
            girlSprite.mirror.x=false;
            girlSprite.changeAni('run');
            girlSprite.velocity.x=2;
            girlSprite.velocity.y=0;
            girlSprite.speed=5;   
        }else if(kb.pressing('left')){
            girlSprite.mirror.x=true;
            girlSprite.changeAni('run');
            girlSprite.velocity.x=-2;
            girlSprite.velocity.y=0;
            girlSprite.speed=5; 
        }else if(kb.pressed('up')){
            attacksoundPlay();
            girlSprite.changeAni('jump');
            girlSprite.velocity.x=0;
            girlSprite.velocity.y=-1; 
            girlSprite.speed=10;    
        }
        else{
            girlSprite.changeAni('stand'); 
            girlSprite.velocity.x=0;   
        }
        if(girlSprite.collides(fireSprite)){
            girlSprite.changeAni('dead');
            girlSprite.remove();
            girlDeadSprite.x=fireSprite.x-60;
            girlDeadSprite.y=fireSprite.y;
            location.reload();    
        } 
        if(girlSprite.collides(lavaSprite)){
            girlSprite.changeAni('dead');
            girlSprite.remove();
            girlDeadSprite.x=girlSprite.x+440;
            girlDeadSprite.y=girlSprite.y-160;
            location.reload(); 
        }
        for(let i=0;i<floatRocks.length;i++){
            floatRocks[i].x+=fVelocity[i];
            floatRocks[i].y=i*110+300; 
                if(floatRocks[i].x<200 || floatRocks[i].x>600){
                    fVelocity[i]=-fVelocity[i];
                }
        } 
        image(sharp2,660,H-255);
        image(doorImage,30,H-348);
        image(lavarock,640,510,85,85);
        image(grassleft,60,460,70,60);
        image(grassright,100,460,70,60);
        girlSprite.collides(guideSprite, guideTosecondLevel);
        menuBtn.hide(); 
    }
    if(currentScreen === 3){ 
        if(kb.pressing('right')){
            girlSprite.mirror.x=false;
            girlSprite.changeAni('run');
            girlSprite.velocity.x=2;
            girlSprite.velocity.y=0;
            girlSprite.speed=5;   
        }else if(kb.pressing('left')){
            girlSprite.mirror.x=true;
            girlSprite.changeAni('run');
            girlSprite.velocity.x=-2;
            girlSprite.velocity.y=0;
            girlSprite.speed=5; 
        }else if(kb.pressed('up')){
            girlSprite.changeAni('jump');
            girlSprite.velocity.x=0;
            girlSprite.velocity.y=-1; 
            girlSprite.speed=10;    
        }
        else{
            girlSprite.changeAni('stand'); 
            girlSprite.velocity.x=0;   
        }
        if(girlSprite.collides(fireSprite)){
            girlSprite.changeAni('dead');
            girlSprite.remove();
            girlDeadSprite.x=fireSprite.x-60;
            girlDeadSprite.y=fireSprite.y;
            location.reload();    
        } 
        if(girlSprite.collides(lavaSprite)){
            girlSprite.changeAni('dead');
            girlSprite.remove();
            girlDeadSprite.x=girlSprite.x+440;
            girlDeadSprite.y=girlSprite.y-160;
            location.reload(); 
        }
        ghostBottomSprite.x+=gbVelocity;
        if(ghostBottomSprite.x>650 || ghostBottomSprite.x<85){
           gbVelocity=-gbVelocity;    
        }
        if(gbVelocity>0){
            ghostBottomSprite.mirror.x=false;
        }else{
            ghostBottomSprite.mirror.x=true;
        }
        ghostTopSprite.x+=gtVelocity;
        if(ghostTopSprite.x>540 || ghostTopSprite.x<350){
            gtVelocity=-gtVelocity;    
        }
        if(gtVelocity>0){
            ghostTopSprite.mirror.x=false;
        }else{
            ghostTopSprite.mirror.x=true;
        }
        if(girlSprite.collides(ghostBottomSprite)){
            girlSprite.changeAni('attack');
            attacksoundPlay();
            gbVelocity=0;
            ghostBottomSprite.changeAni('dead');
        }

        if(ghostBottomSprite.collides(girlSprite)){
            girlSprite.changeAni('attack');
            attacksoundPlay();
            gbVelocity=0;
            ghostBottomSprite.changeAni('dead');
        }
        
        if(girlSprite.collides(ghostTopSprite)){
            girlSprite.changeAni('attack');
            attacksoundPlay();
            gtVelocity=0;
            ghostTopSprite.changeAni('dead');
        }

        if(ghostTopSprite.collides(girlSprite)){
            girlSprite.changeAni('attack');
            attacksoundPlay();
            gtVelocity=0;
            ghostTopSprite.changeAni('dead');
        }

        for(let i=0;i<2;i++){
            floatRocks[i].x+=fVelocity[i];
            floatRocks[i].y=i*110+300;
                if(floatRocks[i].x<200 || floatRocks[i].x>600){
                    fVelocity[i]=-fVelocity[i];
                }
        } 
        image(sharp2,660,H-255);
        image(doorImage,30,H-348);
        image(lavarock,640,510,85,85);
        image(grassleft,60,460,70,60);
        image(grassright,100,460,70,60);
        girlSprite.collides(guideSprite, goToleaderboard);
        menuBtn.hide(); 
    } 
    if(currentScreen===4){
        rectMode(CENTER);
        fill('black')
        image(boardBgImage,0,0,800,800);
        filter(BLUR,5);
        stroke('0');
        rect(400,400,600,500,10);
        rect(400,150,450,100,10);
        image(boardImage,200,100,400,100);
        textSize(30);
        textAlign(CENTER,CENTER);
        fill('white');
            for(let i = 0; i < leadersRecord.record.length; i++){ 
                text(leadersRecord.record[i].id, 200, 60*i+320);
                text(leadersRecord.record[i].name, 400, 60*i+320);
                text(leadersRecord.record[i].score, 560, 60*i+320);
                }
                text('Ranking',200,250);
                text('Name',400,250);
                text('Score',560,250);
                menuBtn.hide();
            }
        
}



