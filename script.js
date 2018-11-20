const SpeechRecognition = webkitSpeechRecognition;

const speaker = [
    "t", "s", "s", "o", "o", "s", "o", "s", "s", "f", "f", "s", "f", "s", "f", "s", "f", "s", "s", "f", "s", "f", "s", "f", "f", "s", "s", "f",
    "s", "o", "o", "o", "s", "s", "s", "s", "s", "o", "s", "o", "s", "s", "s", "s", "s"
];

const fullScript = [
    "hope for the flowers",
    "Hello world",
    "Do you know what is happening",
    "I just arrived myself",
    "Nobody has time to explain. They’re so busy trying to go up there",
    "But what’s at the top",
    "No one knows but it must be awfully good because everybody’s rushing there. Goodbye.",
    "There’s only one thing to do",
    "Where are we going",
    "You know, I was wondering that myself but there is no way to find out",
    "How far are we from the top",
    "Since we’re not at the bottom and not at the top we must be in the middle",
    "Oh, Now when you look at me so kindly, I know for sure I don’t like this life",
    "Same here",
    "Let’s go down",
    "Okay",
    "Hi Stripe",
    "Hi Fluffy",
    "Staying together like this is different from being crushed in that crowd",
    "It really is",
    "There must be still more to life",
    "Just think how much better this is than that awful mess we have left",
    "But we don’t know what’s at the top",
    "Please my love",
    "We can have a nice home and we love each other and that’s enough",
    "I’ve got to know. I must go and find out the secret of the top",
    "Will you come and help me",
    "No",
    "Don’t blame me if you don’t succeed. It’s a tough life",
    "There’s nothing here at all",
    "Be quiet. They can hear you down the pillar",
    "Look over there. There are so many other pillars",
    "My pillar, only one of thousands",
    "Millions of caterpillars climbing nowhere",
    "Maybe she was right. I wish I stayed with her...",
    "Fluffy. Is that you",
    "I’ve been up. There’s nothing there",
    "I bet he never made it to the top",
    "There’s nothing at the top and it doesn’t matter",
    "Don’t say it even if it’s true. What else can we do",
    "Perhaps he’s right, I don’t have any proof",
    "I came down but what should I do now",
    "Am I dreaming",
    "The creature keeps on inserting her head then her tail into that sack",
    "I understand what to do",
    "The End",
    "Or Another Beginning"
];


let chars;

// let detectedSpeech;
let refinedSpeech;

let scenes = [];
let scene = 0;
let line = 0;

let targetSpeech = [];

let charFrame = 0;
let drawFrames = [];
let currentLayer;

const getSpeech = () => {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.interimResults = true;
    console.log('started rec');

    recognition.onresult = event => {
        const speechResult = event.results[0][0].transcript;
        // console.log('result: ' + speechResult);
        // console.log('confidence: ' + event.results[0][0].confidence);
        // detectedSpeech = speechResult;

        console.log(speechResult);
        if (isThisLineCorrect(getWordsArray(speechResult), getWordsArray(fullScript[line]))) {
            refinedSpeech = fullScript[line];
            console.log(refinedSpeech);
            line++;
            charFrame = 0;
            if (line == 1) changeScene(1);
            // checkCurrentScene();
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
    return arr;
}

function isThisLineCorrect(speech, target) {
    let threshold = target.length / 2;
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

    scene = s;
    refinedSpeech = '';

    if (s < 8) {
        currentLayer = 0;
        drawFrames = [];
        drawFrames.push(bgVertices[(s - 1)]);
        for (let i = 0; i < scenes[(s - 1)].length - 1; i++) {
            drawFrames.push(0);
        }
    }

}

document.addEventListener('keydown', keypressed, false);

function keypressed(e) {
    if (e.keyCode == 32) {
        getSpeech();
    } else if (e.keyCode == 83) {
        refinedSpeech = fullScript[line];
        line++;
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
    };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        console.log(p.windowWidth + " " + p.windowHeight);

        p.frameRate(15);
    };

    p.draw = function () {

        p.background(255, 64);


        let xoff = 0;
        let yoff = 0;

        if (line == 0 || line > 45) {
            p.stroke(0, 0, 90, 128);

            let title;

            if (scene == 0) {
                title = "Hope for the Flowers";
            } else if (scene == 8) {
                title = refinedSpeech;
            }

            const charWidth = 60;
            const charHeight = 60;

            p.strokeWeight(7);
            p.translate(p.windowWidth / 2 - ((title.length * charWidth) / 2), p.windowHeight / 2 - (charHeight / 2));

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
        } else if (line > 1 && line < 46) {   // don't show the title in the dialog box
            p.strokeWeight(2);
            const charWidth = 20;
            const charHeight = 50;
            const margin = 100;

            let transX, transY;
            let r, g, b;
            let lineBlockWidth = 500;

            switch (speaker[line - 1]) {
                case 's':
                    transX = margin;
                    transY = margin;
                    r = 0;
                    g = 0;
                    b = 90;
                    break;
                case 'f':
                    transX = p.windowWidth - lineBlockWidth - (margin / 2);
                    transY = margin;
                    r = 90;
                    g = 0;
                    b = 90;
                    break;
                default:
                    transX = p.windowWidth - lineBlockWidth - (margin / 2);
                    transY = margin;
                    r = 100;
                    g = 100;
                    b = 100;
                    break;
            }

            p.translate(transX, transY);
            p.stroke(r, g, b, 128);

            for (let ch of refinedSpeech) {
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
                }
                xoff += charWidth;
                if (xoff > lineBlockWidth) {
                    xoff = 0;
                    yoff += charHeight;
                }
            }

            // typing ...
            /* for (let i = 0; i < charFrame; i++) {
                ch = refinedSpeech[i];
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
                }
                xoff += charWidth;
                if (xoff > lineBlockWidth) {
                    xoff = 0;
                    yoff += charHeight;
                }
            } 

            if (charFrame < refinedSpeech.length) {
                charFrame++;
            }
            */
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

    let waitShort = 2000;
    let waitLong = 3000;

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
        p.stroke(150, 150, 150);
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        p.strokeWeight(2);
        p.noFill();

        // converts json data to a 3d array
        // 1st: scenes
        // 2nd: layers
        // 3rd: vertices 
        for (scnIdx in jsons) {
            // console.log(jsons[1]);
            let scn = jsons[scnIdx];
            let layers = [];
            for (layerIdx in scn) {
                // console.log(scn[layerIdx]);
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
        // p.background(255);
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
        // console.log(s1);

        // p.push();
        // p.translate(-100, 0);


        // layer 0 (background)
        const layer0 = s1[0];
        p.beginShape();
        for (let i = 0; i < layer0.length; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (currentLayer < 7) {

            // layer 1 (Stripe)
            const layer1 = s1[1];
            p.beginShape();
            for (let i = 0; i < drawFrames[1]; i++) {
                let vtx = layer1[i];
                p.vertex(vtx.x, vtx.y);
            }
            p.endShape();

            // layer 2 (Fluffy)
            const layer2 = s1[2];
            p.beginShape();
            for (let i = 0; i < drawFrames[2]; i++) {
                let vtx = layer2[i];
                p.vertex(vtx.x, vtx.y);
            }
            p.endShape();

            // layer 3
            const layer3 = s1[3];
            p.beginShape();
            for (let i = 0; i < drawFrames[3]; i++) {
                let vtx = layer3[i];
                p.vertex(vtx.x, vtx.y);
            }
            p.endShape();

            const layer4 = s1[4];
            p.beginShape();
            for (let i = 0; i < drawFrames[4]; i++) {
                let vtx = layer4[i];
                p.vertex(vtx.x, vtx.y);
            }
            p.endShape();

            const layer5 = s1[5];
            p.beginShape();
            for (let i = 0; i < drawFrames[5]; i++) {
                let vtx = layer5[i];
                p.vertex(vtx.x, vtx.y);
            }
            p.endShape();

            const layer6 = s1[6];
            p.beginShape();
            for (let i = 0; i < drawFrames[6]; i++) {
                let vtx = layer6[i];
                p.vertex(vtx.x, vtx.y);
            }
            p.endShape();

        }

        const layer7 = s1[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // p.pop();


        if (drawFrames[currentLayer] < s1[currentLayer].length) {
            if (currentLayer == 1) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s1[currentLayer].length) {
                drawFrames[currentLayer] = s1[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s1[currentLayer].length) {

            // if this is the last layer, change the scene
            if (currentLayer == (s1.length - 1)) {
                setTimeout(() => {
                    p.clear();
                    changeScene(2);
                }, waitLong);
            }
            else {
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
                        // p.background(255);
                        p.clear();
                        currentLayer = 7;
                        console.log("Start drawing layer #" + currentLayer);
                        break;

                    default:
                        break;
                }
            }
        }

    }

    function drawScene2() {
        const s2 = scenes[1];

        const layer0 = s2[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer1 = s2[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer2 = s2[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer3 = s2[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer4 = s2[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer5 = s2[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer6 = s2[6];
        p.beginShape();
        for (let i = 0; i < drawFrames[6]; i++) {
            let vtx = layer6[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer7 = s2[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer8 = s2[8];
        p.beginShape();
        for (let i = 0; i < drawFrames[8]; i++) {
            let vtx = layer8[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // p.pop();

        if (drawFrames[currentLayer] < s2[currentLayer].length) {
            if (currentLayer == 1 || currentLayer == 8) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;
            // p.constrain(drawFrames[currentLayer], 0, s1[currentLayer].length);
            if (drawFrames[currentLayer] > s2[currentLayer].length) {
                drawFrames[currentLayer] = s2[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s2[currentLayer].length) {

            // if this is the last layer, change the scene
            if (currentLayer == (s2.length - 1)) {
                setTimeout(() => {
                    p.clear();
                    changeScene(3);
                }, waitShort);
            }
            else {
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
                        currentLayer = 7;
                        console.log("Start drawing layer #" + currentLayer);
                        break;

                    // Okay
                    case 16:
                        // p.clear();
                        currentLayer = 8;
                        console.log("Start drawing layer #" + currentLayer);
                        break;

                    default:
                        break;
                }
            }
        }
    }

    function drawScene3() {
        const s3 = scenes[2];

        // layer0: background
        const layer0 = s3[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer1 = s3[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer2 = s3[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer3 = s3[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer4 = s3[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // p.pop();

        if (drawFrames[currentLayer] < s3[currentLayer].length) {
            if (currentLayer == 2) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s3[currentLayer].length) {
                drawFrames[currentLayer] = s3[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s3[currentLayer].length) {

            // if this is the last layer, change the scene
            if (currentLayer == (s3.length - 1)) {
                setTimeout(() => {
                    p.clear();
                    changeScene(4);
                }, waitShort);
            }
            else {
                switch (line) {
                    // Hi Stripe
                    case 17:
                        currentLayer = 1;
                        console.log("Start drawing layer #" + currentLayer);
                        break;

                    // Hi Fluffy
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

                    default:
                        break;
                }
            }
        }
    }

    function drawScene4() {
        const s4 = scenes[3];

        const layer0 = s4[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer1 = s4[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer2 = s4[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer3 = s4[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer4 = s4[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer5 = s4[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer6 = s4[6];
        p.beginShape();
        for (let i = 0; i < drawFrames[6]; i++) {
            let vtx = layer6[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer7 = s4[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer8 = s4[8];
        p.beginShape();
        for (let i = 0; i < drawFrames[8]; i++) {
            let vtx = layer8[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // p.pop();

        if (drawFrames[currentLayer] < s4[currentLayer].length) {
            if (currentLayer == 1) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s4[currentLayer].length) {
                drawFrames[currentLayer] = s4[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s4[currentLayer].length) {

            // if this is the last layer, change the scene
            if (currentLayer == (s4.length - 1)) {
                setTimeout(() => {
                    p.clear();
                    changeScene(5);
                }, waitShort);
            }
            else {
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
                        // p.clear();
                        currentLayer = 8;
                        console.log("Start drawing layer #" + currentLayer);
                        break;

                    default:
                        break;
                }
            }
        }

    }

    function drawScene5() {
        const s5 = scenes[4];

        const layer0 = s5[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer1 = s5[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer2 = s5[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer3 = s5[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer4 = s5[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer5 = s5[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer6 = s5[6];
        p.beginShape();
        for (let i = 0; i < drawFrames[6]; i++) {
            let vtx = layer6[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer7 = s5[7];
        p.beginShape();
        for (let i = 0; i < drawFrames[7]; i++) {
            let vtx = layer7[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer8 = s5[8];
        p.beginShape();
        for (let i = 0; i < drawFrames[8]; i++) {
            let vtx = layer8[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        // p.pop();

        if (drawFrames[currentLayer] < s5[currentLayer].length) {
            if (currentLayer == 1 || currentLayer == 5 || currentLayer == 8) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s5[currentLayer].length) {
                drawFrames[currentLayer] = s5[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s5[currentLayer].length) {

            // if this is the last layer, change the scene
            if (currentLayer == (s5.length - 1)) {
                setTimeout(() => {
                    p.clear();
                    changeScene(6);
                }, waitLong);
            }
            else {
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

                    // Fluffy. Is that you
                    case 36:
                        // p.clear();
                        currentLayer = 8;
                        console.log("Start drawing layer #" + currentLayer);
                        break;

                    default:
                        break;
                }
            }
        }
    }

    function drawScene6() {
        const s6 = scenes[5];

        const layer0 = s6[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer1 = s6[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer2 = s6[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer3 = s6[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer4 = s6[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer5 = s6[5];
        p.beginShape();
        for (let i = 0; i < drawFrames[5]; i++) {
            let vtx = layer5[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s6[currentLayer].length) {
            if (currentLayer == 1) {
                drawFrames[currentLayer] += 4;
            }
            else drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s6[currentLayer].length) {
                drawFrames[currentLayer] = s6[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s6[currentLayer].length) {

            // if this is the last layer, change the scene
            if (currentLayer == (s6.length - 1)) {
                setTimeout(() => {
                    p.clear();
                    changeScene(7);
                }, waitLong);
            }
            else {
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

                    default:
                        break;
                }
            }
        }
    }

    function drawScene7() {
        const s7 = scenes[6];

        const layer0 = s7[0];
        p.beginShape();
        for (let i = 0; i < drawFrames[0]; i++) {
            let vtx = layer0[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer1 = s7[1];
        p.beginShape();
        for (let i = 0; i < drawFrames[1]; i++) {
            let vtx = layer1[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer2 = s7[2];
        p.beginShape();
        for (let i = 0; i < drawFrames[2]; i++) {
            let vtx = layer2[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer3 = s7[3];
        p.beginShape();
        for (let i = 0; i < drawFrames[3]; i++) {
            let vtx = layer3[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        const layer4 = s7[4];
        p.beginShape();
        for (let i = 0; i < drawFrames[4]; i++) {
            let vtx = layer4[i];
            p.vertex(vtx.x, vtx.y);
        }
        p.endShape();

        if (drawFrames[currentLayer] < s7[currentLayer].length) {
            /* if (currentLayer == 1) {
                drawFrames[currentLayer] += 4;
            }
            else */ drawFrames[currentLayer] += 2;

            if (drawFrames[currentLayer] > s7[currentLayer].length) {
                drawFrames[currentLayer] = s7[currentLayer].length;
            }
        }

        if (drawFrames[currentLayer] == s7[currentLayer].length) {

            // if this is the last layer, change the scene
            if (currentLayer == (s7.length - 1)) {
                setTimeout(() => {
                    p.clear();
                    changeScene(8);
                }, waitLong);
            }
            else {
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

                    default:
                        break;
                }
            }
        }
    }
}

let drawingP5 = new p5(drawingSketch, 'drawing-canvas');