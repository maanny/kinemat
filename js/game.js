//Imaginary javadoc:
//@param pos: a paper.js Point
//@param radius: a number (lol weak typing)
//@param color: a color idk lol
function Joystick(pos, radius, color) {
    this.pos = pos;
    this.radius = radius;
    this.color = color;
    this.setPt = new Point(pos);

    //Drawing unchanging graphical elements
    var bounds = new Path.Circle({
        center: this.pos,
        radius: this.radius,
        strokeColor: 0.8,
        strokeWidth: 5,
        dashArray: [10,4]
    });

    var bulbShadow = new Path.Circle({
        center: this.pos,
        radius: 10,
        fillColor: 0.8
    });

    //Drawing changing graphical elements
    var bulb = new Path.Circle({
        center: pos,
        radius: 10,
        fillColor: this.color
    });

    var xText = new PointText({
        point: [this.pos.x + this.radius + 10,
                this.pos.y - this.radius],
        fontSize: 20,
        fillColor: 0.8
    });

    var yText = new PointText({
        point: [this.pos.x + this.radius + 10,
                this.pos.y - this.radius + 20],
        fontSize: 20,
        fillColor: 0.8
    });

    //Getters and setters
    this.getX = function() {
        var delta = this.pos - bulb.position;
        return -Math.round(delta.x / this.radius * 100);
    };

    this.getY = function() {
        var delta = this.pos - bulb.position;
        return Math.round(delta.y / this.radius * 100);
    };

    this.getDelta = function() {
        return this.pos - bulb.position;
    };

    //Event handling workaround
    this.drag = function(point) {
        var extendedBounds = new Path.Circle(this.pos, this.radius + 50);

        if(bounds.contains(point)) {
            this.setPt = point;
        } else if(extendedBounds.contains(point)) {
            var theta = Math.atan2(point.x-this.pos.x,this.pos.y-point.y);
            var radPoint = new Point({
                x: this.pos.x + this.radius*Math.sin(theta),
                y: this.pos.y - this.radius*Math.cos(theta)
            });
            this.setPt = radPoint;
        } else {
            this.setPt = this.pos;
        }
    };

    this.mouseUp = function(point) {
        this.setPt = this.pos;
    };

    this.frame = function(point) {
        var vector = this.setPt - bulb.position;
        bulb.position += vector / 5;
        xText.content = "x: " + this.getX();
        yText.content = "y: " + this.getY();
    };

    this.keydown = function(key) {
        switch(key) {
            case 'w': this.setPt = new Point(this.pos.x, this.pos.y - this.radius / 2); break;
            case 'a': this.setPt = new Point(this.pos.x - this.radius / 2, this.pos.y); break;
            case 's': this.setPt = new Point(this.pos.x, this.pos.y + this.radius / 2); break;
            case 'd': this.setPt = new Point(this.pos.x + this.radius / 2, this.pos.y);
        }
    }

    this.keyup = function() {
        this.setPt = this.pos;
    }
}

//Imaginary javadoc:
//@param shoulder: a paper.js point that the base of the arm exists at
//@param reach: a number defining the reach of the arm (2* the seglen)
//@param color: the arm color
function Arm(shoulder, reach, color) {
    this.shoulder = shoulder;
    this.elbow = new Point(this.shoulder.x, this.shoulder.y + reach/2);
    this.wrist = new Point(this.shoulder.x, this.shoulder.y + reach);

    this.reach = reach;
    this.color = color;

    //Instantiating geometry helpers
    var shouldercirc = new Path.Circle(shoulder, this.reach/2);
    var wristcirc = new Path.Circle(this.wrist, this.reach/2);

    //Troubleshooting circles
    // shouldercirc.strokeWeight = 3;
    // wristcirc.strokeWeight = 3;
    // shouldercirc.strokeColor = 'black';
    // wristcirc.strokeColor = 'black';

    //Drawing unchanging graphical elements
    var range = new Path.Circle({
        center: shoulder,
        radius: reach,
        fillColor: this.color,
        opacity: 0.1,
    });

    range.removeSegment(1);
    range.segments[0].handleOut = [this.reach,0];
    range.segments[1].handleIn = [-this.reach,0];

    //Drawing changing graphical elements
    var bicep = new Path({
        segments: [this.shoulder, this.elbow],
        strokeColor: new Color(this.color) * 0.9,
        strokeWidth: 50,
        strokeJoin: 'round',
        strokeCap: 'round'
    })

    var forearm = new Path({
        segments: [this.elbow, this.wrist],
        strokeColor: this.color,
        strokeWidth: 50,
        strokeJoin: 'round',
        strokeCap: 'round'
    })

    //Event handling workaround

    this.frame = function(point, stick) {
        if(range.contains(this.wrist - stick.getDelta()/5)) {
            this.wrist -= stick.getDelta()/20;
        } else {
            this.wrist += stick.getDelta()/1000;
        }

        var elbows = shouldercirc.getIntersections(wristcirc);

        switch(elbows.length) {
            case 2:
                if(this.elbow.getDistance(elbows[0].point) < this.elbow.getDistance(elbows[1].point)) {
                    this.elbow = elbows[0].point;
                } else {
                    this.elbow = elbows[1].point;
                }
                break;
            case 1:
                this.elbow = elbows[0].point;
                break;
            default:
                break;
        }

        bicep.segments[0].point = this.shoulder;
        bicep.segments[1].point = this.elbow;
        forearm.segments[0].point = this.elbow;
        forearm.segments[1].point = this.wrist;

        wristcirc.position = this.wrist;
        shouldercirc.position = this.shoulder;
    };
}

var XYpos = new Joystick(new Point(110, view.size.height - 110), 70, '#FF4444');
var top = new Layer();
var arm = new Arm(new Point(view.center.x, view.size.height/20), 350, "#33B5E5");
var bot = new Layer();
top.bringToFront();

var print;

function onMouseDown(event) {
	print = new Path();
	print.strokeColor = '#FFBB33';
    print.strokeWidth = 5;
}

function onMouseDrag(event) {
    XYpos.drag(event.point);
    print.add(arm.wrist);
}

function onMouseUp(event) {
    XYpos.mouseUp(event.point);
}

function onFrame(event) {
    XYpos.frame(event.point);
    arm.frame(event.point, XYpos);
}

function onKeyDown(event) {
	XYpos.keydown(event.key);
}

function onKeyUp(event) {
	XYpos.keyup();
}
