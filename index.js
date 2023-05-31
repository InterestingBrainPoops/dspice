var pcb_green;
var wires = [];
var junctions = [];
class Junction {
    constructor (x, y) {
        this.pos = createVector(x, y);
    }

    draw() {
        noStroke();
        fill(pcb_green);
        ellipse(this.pos.x - 2, this.pos.y - 2, 5, 5);
    }
}


// returns the nearest junction to the desired point, if there are no junctions within the radius then it makes one.
function find_closest_junction(point, radius) {
    let closest = -1;
    let distance = 1000000;
    for(var x = 0; x < junctions.length; x++) {
        let id = (p5.Vector.sub(junctions[x].pos, point)).mag();
        if(id < distance && id < radius) {
            closest = x;
        }
    }
    if(closest === -1) {
        // no junctions within the radius
        junctions.push(new Junction(point.x, point.y));
        return junctions.length - 1;
    }else {
        // return the closest one
        return x;
    }
}
class Wire {
    constructor(start_junc, end_junc) {
        this.start = start_junc;
        this.end = end_junc;
    }

    draw() {
        stroke(pcb_green);
        line(junctions[this.start].pos.x, junctions[this.start].pos.y, junctions[this.end].pos.x, junctions[this.end].pos.y);
    }
}
var Button = function(x, y, width, height, icallback, fill_color, text, text_color) {
    this.pos = createVector(x,y);
    this.dims = createVector(width, height);
    this.callback = icallback;
    this.fill_color = fill_color;
    this.text_color = text_color;
    this.text = text;
};

Button.prototype.draw = function() {
    fill(this.fill_color);
    stroke(0, 0, 0);
    rect(this.pos.x, this.pos.y, this.dims.x, this.dims.y);
    textAlign(CENTER, CENTER);
    fill(this.text_color);
    text(this.text, this.pos.x + this.dims.x / 2, this.pos.y + this.dims.y / 2);
};

Button.prototype.check = function() {
    let mx = mouseX;
    let my = mouseY;
    let check_x = (mx >= this.pos.x) && (mx <= this.pos.x + this.dims.x);
    let check_y = (my >= this.pos.y) && (my <= this.pos.y + this.dims.y);
    if( check_x && check_y) {

        this.callback();
    }
};
function setWire() {
    // invert the wire mode
    wire_mode = !wire_mode + 0;
    print("e");
}
var wire_mode = 0; 
var first_point;
var wire_button;
function setup() {
    
    createCanvas(800, 800);
    pcb_green = color(0, 140, 74);
    wire_button = new Button(50, 50, 200, 50, setWire, color(255, 224, 224), "Wire", color(255, 0, 0));
    first_point = createVector(0,0);
}
  
  function draw() {
    background(220);
    wire_button.draw();

    wires.forEach((wire) => {wire.draw();});
    junctions.forEach((junction) => {junction.draw();});
  }


mouseClicked = function() {
    print("clicked");
    wire_button.check();
    if(wire_mode === 1) {
        wire_mode = 2;
        first_point = find_closest_junction(createVector(mouseX, mouseY), 15);
        print(first_point);
    }else if (wire_mode === 2) {
        wire_mode = 1;
        let second_point = find_closest_junction(createVector(mouseX, mouseY), 15);
        wires.push(new Wire(first_point, second_point));
    }
};
