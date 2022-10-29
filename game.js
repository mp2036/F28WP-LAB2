function Bear() {
    this.dBear = 100;
    this.htmlElement = document.getElementById("bear");
    this.id = this.htmlElement.id;
    this.x = this.htmlElement.offsetLeft;
    this.y = this.htmlElement.offsetTop;
    this.move = function(xDir, yDir) {
        this.fitBounds();
        this.x += this.dBear * xDir;
        this.y += this.dBear * yDir;
        this.display();
    };
    this.display = function() {
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.display = "block";
    };
    this.fitBounds = function() {
        let parent = this.htmlElement.parentElement;
        let iw = this.htmlElement.offsetWidth;
        let ih = this.htmlElement.offsetHeight;
        let l = parent.offsetLeft;
        let t = parent.offsetTop;
        let w = parent.offsetWidth;
        let h = parent.offsetHeight;
        if (this.x < 0) this.x = 0;
        if (this.x > w - iw) this.x = w - iw;
        if (this.y < 0) this.y = 0;
        if (this.y > h - ih) this.y = h - ih;
    };
}
// Handle keyboad events
// to move the bear
function moveBear(e) {
    //codes of the four keys
    const KEYUP = 38;
    const KEYDOWN = 40;
    const KEYLEFT = 37;
    const KEYRIGHT = 39;
    if (e.keyCode == KEYRIGHT) {
        bear.move(1, 0)
    } // right key
    if (e.keyCode == KEYLEFT) {
        bear.move(-1, 0)
    } // left key
    if (e.keyCode == KEYUP) {
        bear.move(0, -1)
    } // up key
    if (e.keyCode == KEYDOWN) {
        bear.move(0, 1)
    } // down key
}
function start() {
    clearTimeout(updateTimer); //reinit update timer
    //reset score and duration
    document.getElementById("hits").innerHTML = 0;
    document.getElementById("duration").innerHTML = "0"; //delete all existing bees //delete exisiting bees
    if (typeof bees !== 'undefined') {
        deleteBees();
    }
    //create bear
    bear = new Bear();
    // Add an event listener to the keypress event.
    document.addEventListener("keydown", moveBear, false);
    //create new array for bees
    bees = new Array();
    //create bees
    makeBees();
    //create a timer for updating position of bees
    updateBees();
    //take start time
    lastStingTime = new Date();
}
class Bee {
    constructor(beeNumber) {
        //the HTML element corresponding to the IMG of the bee
        this.htmlElement = createBeeImg(beeNumber);
        //iits HTML ID
        this.id = this.htmlElement.id;
        //the left position (x)
        this.x = this.htmlElement.offsetLeft;
        //the top position (y)
        this.y = this.htmlElement.offsetTop;
        this.move = function(dx, dy) {
            //move the bees by dx, dy
            this.x += dx;
            this.y += dy;
            this.display();
        };
        this.display = function() {
            //ajust position of bee and display it
            this.fitBounds();
            this.htmlElement.style.left = this.x + "px";
            this.htmlElement.style.top = this.y + "px";
            this.htmlElement.style.display = "block";
        };
        this.fitBounds = function() {
            //check and make sure the bees stays in the board space
            let parent = this.htmlElement.parentElement;
            let iw = this.htmlElement.offsetWidth;
            let ih = this.htmlElement.offsetHeight;
            let l = parent.offsetLeft;
            let t = parent.offsetTop;
            let w = parent.offsetWidth;
            let h = parent.offsetHeight;
            if (this.x < 0)
                this.x = 0;
            if (this.x > w - iw)
                this.x = w - iw;
            if (this.y < 0)
                this.y = 0;
            if (this.y > h - ih)
                this.y = h - ih;
        };
        this.remove = function() {
            //remove the bee and delete its IMG
            if (typeof bees !== 'undefined') {
                //remove element from bees array
                const index = bees.indexOf(this);
                if (index > -1) {
                    bees.splice(index, 1);
                }
            }
            //remove element from div
            this.htmlElement.parentNode.removeChild(this.htmlElement);
        };
    }
}
function createBeeImg(wNum) {
    //get dimension and position of board div
    let boardDiv = document.getElementById("board");
    let boardDivW = boardDiv.offsetWidth;
    let boardDivH = boardDiv.offsetHeight;
    let boardDivX = boardDiv.offsetLeft;
    let boardDivY = boardDiv.offsetTop;
    //create the IMG element
    let img = document.createElement("img");
    img.setAttribute("src", "Images/bee.gif");
    img.setAttribute("width", "100");
    img.setAttribute("alt", "A bee!");
    img.setAttribute("id", "bee" + wNum);
    img.setAttribute("class", "bee"); //set class of html tag img
    //add the IMG element to the DOM as a child of the board div
    img.style.position = "absolute";
    boardDiv.appendChild(img);
    //set initial position  
    let x = getRandomInt(boardDivW);
    let y = getRandomInt(boardDivH);
    img.style.left = (boardDivX + x) + "px";
    img.style.top = (y) + "px";
    //retrun the img object
    return img;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function makeBees() {
    //get number of bees specified by the user
    let nbBees = document.getElementById("nbBees").value;
    nbBees = Number(nbBees);
    if (isNaN(nbBees)) {
        window.alert("Invalid number of bees");
        return;
    }
    //create bees
    let i = 1;
    while (i <= nbBees) {
        var num = i;
        //create object and its IMG element
        var bee = new Bee(num);
        bee.display(); //display the bee
        bees.push(bee); ////store the bee object in the bees array
        i++;
    }
}
function deleteBees() {
    //delete all bees
    while (bees[0]) {
        bees[0].remove();
    }
}
function moveBees() {
    //get speed input field value
    let speed = document.getElementById("speedBees").value;
    //move  each bee to a random location
    for (let i = 0; i < bees.length; i++) {
        let dx = getRandomInt(2 * speed) - speed;
        let dy = getRandomInt(2 * speed) - speed;
        bees[i].move(dx, dy);
        isHit(bees[i], bear); //we add this to count stings
    }
}
function updateBees() { // update the position of the bees periodically
    //move the bees randomly
    moveBees();
    //use a fixed update period
    let period = 10;
    //update the timer for the next move
    updateTimer = setTimeout('updateBees()', period);
}
function isHit(defender, offender) {
    if (overlap(defender, offender)) { //check if the two image overlap
        let score = hits.innerHTML;
        score = Number(score) + 1; //increment the score
        hits.innerHTML = score; //display the new score
        //calculate the longest duration
        let newStingTime = new Date();
        let thisDuration = newStingTime - lastStingTime;
        lastStingTime = newStingTime;
        let longestDuration = Number(duration.innerHTML);
        if (longestDuration === 0) {
            longestDuration = thisDuration;
        } else {
            if (longestDuration < thisDuration) longestDuration = thisDuration;
        }
        document.getElementById("duration").innerHTML = longestDuration;
    }
}
function overlap(element1, element2) {
    //consider the two rectangles wrapping the two elements
    //rectangle of the first element
    left1 = element1.htmlElement.offsetLeft; //e1x
    top1 = element1.htmlElement.offsetTop; //e1y
    right1 = element1.htmlElement.offsetLeft + element1.htmlElement.offsetWidth; //r1x
    bottom1 = element1.htmlElement.offsetTop + element1.htmlElement.offsetHeight; //r1y
    //rectangle of the second element
    left2 = element2.htmlElement.offsetLeft; //e2x
    top2 = element2.htmlElement.offsetTop; //e2y
    right2 = element2.htmlElement.offsetLeft + element2.htmlElement.offsetWidth; //r2x
    bottom2 = element2.htmlElement.offsetTop + element2.htmlElement.offsetHeight; //r2y
    //calculate the intersection of the two rectangles
    x_intersect = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
    y_intersect = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2));
    intersectArea = x_intersect * y_intersect;
    //if intersection is nil no hit
    if (intersectArea == 0 || isNaN(intersectArea)) {
        return false;
    }
    return true;
}
function addBee() {
    let nbBees = document.getElementById("nbBees").value; //get number of bees
    nbBees = Number(nbBees);
    if (isNaN(nbBees)) {
        window.alert("Invalid number of bees");
        return;
    }
    nbBees++; //increment the number of bees
    document.getElementById("nbBees").value = nbBees; //display number of bees
    let bee = new Bee(nbBees); //create the bee object and its img element
    bee.display();
    bees.push(bee); //add the bee in the array of bees
}