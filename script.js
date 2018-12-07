const SpeechRecognition = webkitSpeechRecognition;

const speaker = [
    "t", "s", "s", "o", "o", "s", "o", "s", "s", "y", "y", "s", "y", "s", "y", "s", "y", "s", "s", "y", "s", "y", "s", "y", "y", "s", "s", "y",
    "s", "o", "o", "o", "s", "s", "s", "s", "s", "o", "s", "o", "s", "s", "s", "s", "s"
];

const script2stt = {
    "hope for the flowers": "Hope for the Flowers",
    "Hello world": "Hello world",
    "Do you know what is happening": "Do you know what is/happening",
    "I just arrived myself": "I just arrived myself",
    "Nobody has time to explain They're so busy trying to go up there": "Nobody has time to explain/They are so busy trying to/go up there",
    "But what's at the top": "But what is at the top",
    "No one knows but it must be awfully good because everybody's rushing there Goodbye": "No one knows but it must/be awfully good because/everybody’s rushing there/Goodbye",
    "There's only one thing to do": "There is only one thing/to do",
    "Where are we going": "Where are we going",
    "You know I was wondering that myself but there is no way to find out": "You know I was wondering/that myself but there is/no way to find out",
    "How far are we from the top": "How far are we from the/top",
    "Since we’re not at the bottom and not at the top we must be in the middle": "Since we are not at the/bottom and not at the/top we must be in the/middle",
    "Oh Now when you look at me so kindly I know for sure I don't like this life": "Oh, Now when you look at me/so kindly I know for sure/I don’t like this life",
    "Same here": "Same here",
    "Let's go down": "           Let’s go down",
    "Okay": "Okay",
    "Hi Stripe": "            Hi Stripe",
    "Hi Yellow": "Hi Yellow",
    "Staying together like this is different from being crushed in that crowd": "Staying together like/this is different from/being crushed in that crowd",
    "It really is": "         It really is",
    "There must be still more to life": "There must be still more/to life",
    "Just think how much better this is than that awful mess we have left": "Just think how much better/this is than that awful/mess we have left",
    "But we don't know what's at the top": "But we don’t know what is/at the top",
    "Please my love": "        Please my love",
    "We can have a nice home and we love each other and that's enough": "We can have a nice home/and we love each other and/that’s enough",
    "I've got to know I must go and find out the secret of the top": "I’ve got to know./I must go and find out/the secret of the top",
    "Will you come and help me": "Will you come and help me",
    "No": "                 No",
    "Don't blame me if you don't succeed It's a tough life": "Don’t blame me if you/don’t succeed/It’s a tough life",
    "There's nothing here at all": "There’s nothing here at all",
    "Be quiet They can hear you down the pillar": "Be quiet./They can hear you down/the pillar",
    "Look over there There are so many other pillars": "Look over there./There are so many other/pillars",
    "My pillar only one of thousands 1000": "My pillar,/Only one of thousands",
    "Millions of caterpillars climbing nowhere": "Millions of caterpillars/climbing nowhere",
    "Maybe she was right I wish I stayed with her": "Maybe she was right./I wish I stayed with her...",
    "Yellow Is that you": "Yellow./Is that you",
    "I've been up There's nothing there": "I have been up./There is nothing there",
    "I bet he never made it to the top": "I bet he never made it/to the top",
    "There's nothing at the top and it doesn't matter": "There is nothing at the/top and it doesn’t matter",
    "Don't say it even if it's true What else can we do": "Don’t say it even if it’s/true. What else can we do",
    "Perhaps he's right I don't have any proof": "Perhaps he is right/I don’t have any proof",
    "I came down but what else can I do now": "I came down but what/should I do now",
    "Am I dreaming": "Am I dreaming",
    "The creature keeps on inserting her head then her tail into that sack": "The creature keeps on/inserting her head then/her tail into that sack",
    "I understand what to do": "I understand what to do",
    "next": "",
    "This is the end of the story": "The End",
    "Or Another Beginning": "Or Another Beginning",
    "Thank you": "STORY          Hope For The Flowers/               Trina Paulus//ILLUSTRATION   Alice Sun//JAVASCRIPT     Yeonhee Lee//MUSIC          Inside River/               Akira Kosemura"
};

const scripts = Object.keys(script2stt);
const stts = Object.values(script2stt);

let chars;

let line4print;

let scenes = [];
let scene = 0;
let line = 0;

let targetSpeech = [];

let charFrame = 0;
let drawFrames = [];
let currentLayer;

let isDrawingReady = true;
let isTxtReady = true;

let voice;
let vol;
let bgm;
let playStart = false;

const getSpeech = () => {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.interimResults = true;
    console.log('started rec');

    recognition.onresult = event => {
        const speechResult = event.results[0][0].transcript;

        console.log(speechResult);
        if (line < 49) {
            if (isThisLineCorrect(getWordsArray(speechResult), getWordsArray(scripts[line]))) {
                line4print = stts[line];
                // console.log(line4print);
                line++;
                charFrame = 0;
                if (line == 1) changeScene(1);
            }
        }

    };

    recognition.onend = () => {
        console.log('it is over');

        // for "endless" mode, comment out the next line and uncomment getSpeech()
        // recognition.stop();
        getSpeech();

    };

    recognition.onerror = event => {
        console.log('something went wrong: ' + event.error);
    };
};

function getWordsArray(s) {
    let arr = [];
    arr = s.split(' ');
    console.log(arr);
    return arr;
}

function isThisLineCorrect(speech, target) {
    let threshold = target.length / 2;
    if (threshold > 5) threshold -= 3;

    let score = 0;

    for (let i = 0; i < speech.length; i++) {
        for (let j = 0; j < target.length; j++) {
            if (speech[i].toLowerCase() == target[j].toLowerCase()) {
                score++;
                j = target.length;
            }
        }
        if (score >= threshold) return true;
    }
    return false;
}

function changeScene(s) {
    let bgVertices = [2743, 2248, 2159, 3418, 1288, 2409, 2467];

    line4print = '';

    if (s < 8) {
        currentLayer = 0;
        drawFrames = [];
        drawFrames.push(bgVertices[(s - 1)]);
        for (let i = 0; i < scenes[(s - 1)].length - 1; i++) {
            drawFrames.push(0);
        }
    }

    if (s > 1 && s < 8) {
        line--;
    }

    scene = s;

}

document.addEventListener('keydown', keypressed, false);

function keypressed(e) {
    if (isDrawingReady && isTxtReady) {
        if (e.keyCode == 32) {  // SPACE
            playStart = true;
            getSpeech();
        } else if (e.keyCode == 83 || e.keyCode == 39) {   // 's' or ArrowRight
            line4print = stts[line];
            line++;
            charFrame = 0
            if (line == 1) changeScene(1);
        }
    }
}

/***************************************************************
 * 
 * Print Lines
 * 
 ***************************************************************/

let dialogSketch = function (p) {
    p.preload = function () {
        chars = p.loadJSON("assets/char74k-normalized.json");
        // p.soundFormat('mp3', 'ogg');
        bgm = p.loadSound('assets/InsideRiver.mp3');
    };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        console.log(p.windowWidth + " " + p.windowHeight);

        p.frameRate(15);
    };

    p.draw = function () {

        if (playStart && !bgm.isPlaying()) {
            bgm.setVolume(1);
            bgm.play();
        }

        p.background(0, 64);


        let xoff = 0;
        let yoff = 0;

        // Title scene / The End / or Another Story
        if (line == 0 || (line > 45 && line < 49)) {
            p.stroke(190, 128);

            let title;

            // Title
            if (scene == 0) {
                title = "Hope for the Flowers";
            } else {
                title = stts[line - 1];
            }

            const charWidth = 60;
            const charHeight = 60;

            p.strokeWeight(7);
            p.translate(p.windowWidth / 2 - (((title.length - 1) * charWidth) / 2), p.windowHeight / 2 - (charHeight / 2));

            for (let ch of title) {
                if (chars.hasOwnProperty(ch)) {
                    let form = p.random(chars[ch]);
                    p.noFill();
                    for (let stroke of form) {
                        p.beginShape();
                        for (let coord of stroke) {
                            p.vertex(xoff + (coord[0] * 0.3),
                                yoff + (coord[1] * 0.3));
                        }
                        p.endShape();
                    }
                }
                xoff += charWidth;
            }
        }

        // Scene 1 – 7
        else if (line > 1 && line < 46) {
            p.strokeWeight(2);
            const charWidth = 20;
            const charHeight = 50;
            const margin = 100;

            let transX, transY;
            let lineBlockWidth = 500;

            switch (speaker[line - 1]) {
                case 's':
                    transX = margin;
                    transY = margin;
                    r = 220;
                    g = 220;
                    b = 220;
                    break;
                case 'y':
                    transX = p.windowWidth - lineBlockWidth - (margin / 2);
                    transY = margin;
                    r = 220;
                    g = 220;
                    b = 0;
                    break;
                default:
                    transX = p.windowWidth - lineBlockWidth - (margin / 2);
                    transY = margin;
                    r = 220;
                    g = 220;
                    b = 220;
                    break;
            }

            p.translate(transX, transY);
            p.stroke(r, g, b, 128);

            // No typing effect
            for (let ch of line4print) {
                if (chars.hasOwnProperty(ch)) {
                    let form = p.random(chars[ch]);
                    p.noFill();
                    for (let stroke of form) {
                        p.beginShape();
                        for (let coord of stroke) {
                            p.vertex(xoff + (coord[0] * 0.1),
                                yoff + (coord[1] * 0.1));
                        }
                        p.endShape();
                    }
                    xoff += charWidth;
                }

                if (ch == ' ') {
                    xoff += charWidth;
                }

                if (ch == '/') {
                    xoff = 0;
                    yoff += charHeight;
                }
            }

            // Typing effect
            /* for (let i = 0; i < charFrame; i++) {
                ch = line4print[i];
                if (chars.hasOwnProperty(ch)) {
                    let form = p.random(chars[ch]);
                    p.noFill();
                    for (let stroke of form) {
                        p.beginShape();
                        for (let coord of stroke) {
                            p.vertex(xoff + (coord[0] * 0.1),
                                yoff + (coord[1] * 0.1));
                        }
                        p.endShape();
                    }
                    xoff += charWidth;
                }

                if (ch == ' ') {
                    xoff += charWidth;
                }

                if (ch == '/') {
                    xoff = 0;
                    yoff += charHeight;
                }
            } 

            if (charFrame < line4print.length) {
                isTxtReady = false;
                charFrame++;
            }

            if (charFrame >= line4print.length) {
                isTxtReady = true;
            }*/

        } else if (line > 48) {    // The ending credit 
            p.strokeWeight(2);
            p.stroke(220, 128);
            const charWidth = 35;
            const charHeight = 80;

            let endingCredit = stts[48];

            p.translate(p.windowWidth / 2 - ((34 * charWidth) / 2), p.windowHeight / 2 - (8 * charHeight / 2));

            for (let ch of endingCredit) {
                if (chars.hasOwnProperty(ch)) {
                    let form = p.random(chars[ch]);
                    p.noFill();
                    for (let stroke of form) {
                        p.beginShape();
                        for (let coord of stroke) {
                            p.vertex(xoff + (coord[0] * 0.15),
                                yoff + (coord[1] * 0.15));
                        }
                        p.endShape();
                    }
                    xoff += charWidth;
                }
                if (ch == ' ') {
                    xoff += charWidth;
                }

                if (ch == '/') {
                    xoff = 0;
                    yoff += charHeight;
                }
            }

        }

    };
}

let dialogP5 = new p5(dialogSketch, 'dialog-canvas');


/***************************************************************
 * 
 * Live Drawing
 * 
 ***************************************************************/

let drawingSketch = function (p) {

    let jsons = [];

    let bgStrokeWeight = 1;
    let mainStrokeWeight = 1;

    let bgColor = 100;
    /*    let bgRed = 100;
       let bgGreen = 100;
       let bgBlue = 100; */

    let mainColor = 225;
    let prevLineColor = 30;
    let yellowColor = p.color(255, 255, 170);

    p.preload = function () {
        jsons.push(p.loadJSON("assets/scene1.json"));
        jsons.push(p.loadJSON("assets/scene2.json"));
        jsons.push(p.loadJSON("assets/scene3.json"));
        jsons.push(p.loadJSON("assets/scene4.json"));
        jsons.push(p.loadJSON("assets/scene5.json"));
        jsons.push(p.loadJSON("assets/scene6.json"));
        jsons.push(p.loadJSON("assets/scene7.json"));

    };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        p.noFill();

        voice = new p5.AudioIn();
        voice.start();

        // converts json data to a 3d array
        // 1st: scenes
        // 2nd: layers
        // 3rd: vertices 
        for (scnIdx in jsons) {
            let scn = jsons[scnIdx];
            let layers = [];
            for (layerIdx in scn) {
                let lyr = scn[layerIdx];
                let vtx = [];
                for (pntIdx in lyr) {
                    vtx.push(lyr[pntIdx]);
                }
                layers.push(vtx);
            }
            scenes.push(layers);
        }

        // prints out the array information
        console.log(scenes.length + " scenes in total.");

        for (let s = 0; s < scenes.length; s++) {
            let scn = scenes[s];
            console.log(scn.length + " layers in Scene #" + (s + 1));
            for (let l = 0; l < scn.length; l++) {
                let lyr = scn[l];
                console.log("--- " + lyr.length + " vertices in Layer #" + l);
            }
        }
    };

    p.draw = function () {

        vol = voice.getLevel() * 100;
        // console.log(vol);

        switch (scene) {
            case 1:
                drawScene1();
                break;
            case 2:
                drawScene2();
                break;
            case 3:
                drawScene3();
                break;
            case 4:
                drawScene4();
                break;
            case 5:
                drawScene5();
                break;
            case 6:
                drawScene6();
                break;
            case 7:
                drawScene7();
                break;
            default:
                break;
        }
    };

    function drawScene1() {
        const s1 = scenes[0];

        // console.log(vol);

        if (vol > 5) {
            bgColor = p.map(vol, 5, 15, 20, 255);
        }

        if (isDrawingReady && bgColor != 100) {
            if (bgColor < 100) {
                bgColor += 10;
                if (bgColor > 100) bgColor = 100;
            }
            else if (bgColor > 100) {
                bgColor -= 10;
                if (bgColor < 100) bgColor = 100;
            }
        }

        // layer 0 (background)
        p.stroke(bgColor);
        p.strokeWeight(bgStrokeWeight);
        const layer0 = s1[0];
        p.beginShape();
        for (let i = 0; i < layer0.length; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        p.strokeWeight(mainStrokeWeight);

        // "Hello world"
        if (currentLayer > 6) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(mainColor);
        }
        const layer1 = s1[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Do you know what is happening?"
        const layer2 = s1[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "I just arrived myself"
        const layer3 = s1[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Nobody has time to explain. They’re so busy trying to go up there"
        const layer4 = s1[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "But what’s at the top?"
        p.strokeWeight(bgStrokeWeight);
        if (currentLayer > 6) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(bgColor);
        }
        const layer5 = s1[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "No one knows but it must be awfully good because everybody’s rushing there. Goodbye."
        const layer6 = s1[6];
        p.beginShape();
        for (let i = 0; i < drawFrames[6]; i++) {
            let vtx = layer6[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "There’s only one thing to do"
        p.strokeWeight(mainStrokeWeight);
        p.stroke(mainColor);
        const layer7 = s1[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s1[currentLayer].length) {
            isDrawingReady = false;
            if (currentLayer == 1) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s1[currentLayer].length) {
                drawFrames[currentLayer] = s1[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s1[currentLayer].length) {

            isDrawingReady = true;

            switch (line) {
                // hello world
                case 2:
                    currentLayer = 1;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // do you know what is happening
                case 3:
                    currentLayer = 2;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // I just arrived myself
                case 4:
                    currentLayer = 3;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Nobody has time to explain. they're so busy trying to go up there
                case 5:
                    currentLayer = 4;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // But what's up there
                case 6:
                    currentLayer = 5;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // No one knows but it must be awfully good because everybody’s rushing there. Goodbye
                case 7:
                    currentLayer = 6;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // There’s only one thing to do
                case 8:
                    // p.clear();
                    currentLayer = 7;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                case 9:
                    p.clear();
                    changeScene(2);
                    break;

                default:
                    break;
            }
        }

    }

    function drawScene2() {
        const s2 = scenes[1];

        if (vol > 5) {
            bgColor = p.map(vol, 5, 15, 20, 255);
        }

        if (isDrawingReady && bgColor != 100) {
            if (bgColor < 100) {
                bgColor += 10;
                if (bgColor > 100) bgColor = 100;
            }
            else if (bgColor > 100) {
                bgColor -= 10;
                if (bgColor < 100) bgColor = 100;
            }
        }

        // background
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);
        const layer0 = s2[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();


        p.strokeWeight(mainStrokeWeight);
        p.stroke(mainColor);
        if (currentLayer > 7) {
            p.stroke(prevLineColor);
        }
        // stripe: "Where are we going"
        const layer1 = s2[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // yellow: "You know, I was wondering that myself but there is no way to find out"
        if (currentLayer > 6) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(yellowColor);
        }

        const layer2 = s2[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();


        // "How far are we from the top?""
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);

        const layer3 = s2[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Since we’re not at the bottom and not at the top we must be in the middle"
        const layer4 = s2[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        p.strokeWeight(mainStrokeWeight);

        // "Oh, now when you look at me so kindly, I know for sure I don’t like this life"
        if (currentLayer > 6) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(yellowColor);
        }
        const layer5 = s2[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Same here"
        if (currentLayer > 7) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(mainColor);
        }

        const layer6 = s2[6];
        p.beginShape();
        for (let i = 0; i < drawFrames[6]; i++) {
            let vtx = layer6[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Let’s go down"
        p.stroke(yellowColor);

        const layer7 = s2[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Okay"
        p.stroke(mainColor);

        const layer8 = s2[8];
        p.beginShape();
        for (let i = 0; i < drawFrames[8]; i++) {
            let vtx = layer8[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s2[currentLayer].length) {
            isDrawingReady = false;
            if (currentLayer == 1 || currentLayer == 4 || currentLayer == 8) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s2[currentLayer].length) {
                drawFrames[currentLayer] = s2[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s2[currentLayer].length) {

            isDrawingReady = true;
            switch (line) {
                // Where are we going
                case 9:
                    currentLayer = 1;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // You know, I was wondering that myself but there is no way to find out
                case 10:
                    currentLayer = 2;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // How far are we from the top
                case 11:
                    currentLayer = 3;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Since we’re not at the bottom and not at the top we must be in the middle
                case 12:
                    currentLayer = 4;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Oh, now when you look at me so kindly, I know for sure I don’t like this life
                case 13:
                    currentLayer = 5;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Same here
                case 14:
                    currentLayer = 6;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Let’s go down
                case 15:
                    // p.clear();
                    currentLayer = 7;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Okay
                case 16:
                    // p.clear();
                    currentLayer = 8;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                case 17:
                    p.clear();
                    changeScene(3);
                    break;

                default:
                    break;
            }
        }
    }

    function drawScene3() {
        const s3 = scenes[2];

        if (vol > 5) {
            bgColor = p.map(vol, 5, 15, 20, 255);
        }

        if (isDrawingReady && bgColor != 100) {
            if (bgColor < 100) {
                bgColor += 10;
                if (bgColor > 100) bgColor = 100;
            }
            else if (bgColor > 100) {
                bgColor -= 10;
                if (bgColor < 100) bgColor = 100;
            }
        }

        // layer0: background
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);
        const layer0 = s3[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        p.strokeWeight(mainStrokeWeight);

        // "Hi Stripe"
        p.stroke(yellowColor);
        const layer1 = s3[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Hi Yellow"
        p.stroke(mainColor);
        const layer2 = s3[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Staying together like this is different from being crushed in that crowd"
        const layer3 = s3[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "It really is"
        p.stroke(yellowColor);
        const layer4 = s3[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s3[currentLayer].length) {
            isDrawingReady = false;
            if (currentLayer == 2) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s3[currentLayer].length) {
                drawFrames[currentLayer] = s3[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s3[currentLayer].length) {

            isDrawingReady = true;
            switch (line) {
                // Hi Stripe
                case 17:
                    currentLayer = 1;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Hi Yellow
                case 18:
                    currentLayer = 2;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Staying together like this is different from being crushed in that crowd
                case 19:
                    currentLayer = 3;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // It really is
                case 20:
                    currentLayer = 4;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                case 21:
                    p.clear();
                    changeScene(4);
                    break;

                default:
                    break;
            }
        }
    }

    function drawScene4() {
        const s4 = scenes[3];

        if (vol > 5) {
            bgColor = p.map(vol, 5, 15, 20, 255);
        }

        if (isDrawingReady && bgColor != 100) {
            if (bgColor < 100) {
                bgColor += 10;
                if (bgColor > 100) bgColor = 100;
            }
            else if (bgColor > 100) {
                bgColor -= 10;
                if (bgColor < 100) bgColor = 100;
            }
        }

        // layer0: Background
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);
        const layer0 = s4[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        p.strokeWeight(mainStrokeWeight);

        // "There must be still more to life"
        p.stroke(mainColor);
        const layer1 = s4[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Just think how much better this is than that awful mess we have left"
        p.stroke(yellowColor);
        const layer2 = s4[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "But we don’t know what’s at the top"
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);
        const layer3 = s4[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Please, my love"
        p.strokeWeight(mainStrokeWeight);
        p.stroke(yellowColor);
        const layer4 = s4[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "We can have a nice home and we love each other and that’s enough"
        const layer5 = s4[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "I’ve got to know. I must go and find out the secret of the top."
        p.stroke(mainColor);
        const layer6 = s4[6];
        p.beginShape();
        for (let i = 0; i < drawFrames[6]; i++) {
            let vtx = layer6[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Will you come and help me"
        const layer7 = s4[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        //"No"
        const layer8 = s4[8];
        p.stroke(yellowColor);
        p.beginShape();
        for (let i = 0; i < drawFrames[8]; i++) {
            let vtx = layer8[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s4[currentLayer].length) {
            isDrawingReady = false;
            if (currentLayer == 1 || currentLayer == 3) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s4[currentLayer].length) {
                drawFrames[currentLayer] = s4[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s4[currentLayer].length) {

            isDrawingReady = true;
            switch (line) {
                // There must be still more to life
                case 21:
                    currentLayer = 1;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Just think how much better this is than that awful mess we have left
                case 22:
                    currentLayer = 2;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // But we don’t know what’s at the top
                case 23:
                    currentLayer = 3;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Please, my love
                case 24:
                    currentLayer = 4;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // We can have a nice home and we love each other and that’s enough
                case 25:
                    currentLayer = 5;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // I’ve got to know. I must go and find out the secret of the top.
                case 26:
                    currentLayer = 6;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Will you come and help me
                case 27:
                    currentLayer = 7;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // No
                case 28:
                    currentLayer = 8;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                case 29:
                    p.clear();
                    changeScene(5);
                    break;

                default:
                    break;
            }
        }

    }

    function drawScene5() {
        const s5 = scenes[4];

        if (vol > 5) {
            bgColor = p.map(vol, 5, 15, 20, 255);
        }

        if (isDrawingReady && bgColor != 100) {
            if (bgColor < 100) {
                bgColor += 10;
                if (bgColor > 100) bgColor = 100;
            }
            else if (bgColor > 100) {
                bgColor -= 10;
                if (bgColor < 100) bgColor = 100;
            }
        }

        // background
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);
        const layer0 = s5[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        p.strokeWeight(mainStrokeWeight);

        // "Don’t blame me if you don’t succeed! It’s a tough life"
        if (currentLayer > 4) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(mainColor);
        }
        const layer1 = s5[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "There’s nothing here at all"
        p.stroke(mainColor);
        const layer2 = s5[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Be quiet! They can hear you down the pillar."
        const layer3 = s5[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Look over there! There are so many other pillars"
        p.strokeWeight(bgStrokeWeight);
        if (currentLayer > 7) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(bgColor);
        }
        const layer4 = s5[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "My pillar, only one of thousands"
        p.strokeWeight(mainStrokeWeight);
        p.stroke(mainColor);
        const layer5 = s5[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Millions of caterpillars climbing nowhere"
        p.strokeWeight(bgStrokeWeight);
        if (currentLayer > 7) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(bgColor);
        }
        const layer6 = s5[6];
        p.beginShape();
        for (let i = 0; i < drawFrames[6]; i++) {
            let vtx = layer6[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Maybe she was right. I wish I stayed with her…"
        p.strokeWeight(mainStrokeWeight);
        if (currentLayer > 7) {
            p.stroke(prevLineColor);
        } else {
            p.stroke(yellowColor);
        }
        const layer7 = s5[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Yellow? Is that you?"
        p.stroke(yellowColor);
        const layer8 = s5[8];
        p.beginShape();
        for (let i = 0; i < drawFrames[8]; i++) {
            let vtx = layer8[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s5[currentLayer].length) {
            isDrawingReady = false;
            if (currentLayer == 1 || currentLayer == 4 || currentLayer == 5 || currentLayer == 8) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s5[currentLayer].length) {
                drawFrames[currentLayer] = s5[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s5[currentLayer].length) {

            isDrawingReady = true;
            switch (line) {
                // Don’t blame me if you don’t succeed! It’s a tough life
                case 29:
                    currentLayer = 1;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // There’s nothing here at all
                case 30:
                    currentLayer = 2;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Be quiet! They can hear you down the pillar.
                case 31:
                    currentLayer = 3;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Look over there! There are so many other pillars
                case 32:
                    currentLayer = 4;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // My pillar, only one of thousands
                case 33:
                    currentLayer = 5;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Millions of caterpillars climbing nowhere
                case 34:
                    currentLayer = 6;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Maybe she was right. I wish I stayed with her…
                case 35:
                    currentLayer = 7;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Yellow. Is that you
                case 36:
                    currentLayer = 8;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                case 37:
                    p.clear();
                    changeScene(6);
                    break;

                default:
                    break;
            }
        }
    }

    function drawScene6() {
        const s6 = scenes[5];

        if (vol > 5) {
            bgColor = p.map(vol, 5, 15, 20, 255);
        }

        if (isDrawingReady && bgColor != 100) {
            if (bgColor < 100) {
                bgColor += 10;
                if (bgColor > 100) bgColor = 100;
            }
            else if (bgColor > 100) {
                bgColor -= 10;
                if (bgColor < 100) bgColor = 100;
            }
        }

        // background
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);
        const layer0 = s6[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        p.strokeWeight(mainStrokeWeight);

        // "I’ve been up; there’s nothing there"
        p.stroke(mainColor);
        const layer1 = s6[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "I bet he never made it to the top"
        const layer2 = s6[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "There’s nothing at the top and it doesn’t matter"
        const layer3 = s6[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Don’t say it even if it’s true. What else can we do"
        const layer4 = s6[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Perhaps he’s right, I don’t have any proof"
        const layer5 = s6[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s6[currentLayer].length) {
            isDrawingReady = false;
            if (currentLayer == 1) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s6[currentLayer].length) {
                drawFrames[currentLayer] = s6[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s6[currentLayer].length) {

            isDrawingReady = true;
            switch (line) {
                // I’ve been up; there’s nothing there
                case 37:
                    currentLayer = 1;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // I bet he never made it to the top
                case 38:
                    currentLayer = 2;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // There’s nothing at the top and it doesn’t matter
                case 39:
                    currentLayer = 3;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Don’t say it even if it’s true. What else can we do
                case 40:
                    currentLayer = 4;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Perhaps he’s right, I don’t have any proof
                case 41:
                    currentLayer = 5;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                case 42:
                    p.clear();
                    changeScene(7);
                    break;

                default:
                    break;
            }
        }
    }

    function drawScene7() {
        const s7 = scenes[6];

        if (vol > 5) {
            bgColor = p.map(vol, 5, 15, 20, 255);
        }

        if (isDrawingReady && bgColor != 100) {
            if (bgColor < 100) {
                bgColor += 10;
                if (bgColor > 100) bgColor = 100;
            }
            else if (bgColor > 100) {
                bgColor -= 10;
                if (bgColor < 100) bgColor = 100;
            }
        }

        // background
        p.strokeWeight(bgStrokeWeight);
        p.stroke(bgColor);
        const layer0 = s7[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        p.strokeWeight(mainStrokeWeight);

        // "I came down, but what else can I do now"
        p.stroke(mainColor);
        const layer1 = s7[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "Am I dreaming"
        p.stroke(yellowColor);
        const layer2 = s7[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "The creature keeps on inserting her head, then her tail, into that sack"
        const layer3 = s7[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // "I understand what to do"
        p.stroke(mainColor);
        const layer4 = s7[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s7[currentLayer].length) {
            isDrawingReady = false;
            /* if (currentLayer == 1) {
                drawFrames[currentLayer] += 4;
            }
            else */ drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s7[currentLayer].length) {
                drawFrames[currentLayer] = s7[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s7[currentLayer].length) {

            isDrawingReady = true;

            switch (line) {
                // I came down, but what else can I do now
                case 42:
                    currentLayer = 1;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Am I dreaming
                case 43:
                    currentLayer = 2;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // The creature keeps on inserting her head, then her tail, into that sack
                case 44:
                    currentLayer = 3;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // I understand what to do
                case 45:
                    currentLayer = 4;
                    console.log("Start drawing layer #" + currentLayer);
                    break;

                // Hit the 'next' button
                case 46:
                    p.clear();
                    line4print = '';
                    changeScene(8);
                    break;

                default:
                    break;
            }
        }
    }
}

let drawingP5 = new p5(drawingSketch, 'drawing-canvas');