//Imaginary javadoc:
//param pos: a paper.js Point
//param radius: a number (lol weak typing)
//param color: a color idk lol
function joystick(pos, radius, color) {
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

    //Changing graphical elements
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

    this.getThrottle = function() {
        return this.pos - bulb.position;
    };

    function onMouseDrag(event) {
        if(bounds.contains(event.point)) {
            this.setPt = event.point;
        } else {
            this.setPt = this.pos;
        }
    };

    function onMouseUp(event) {
        this.setPt = this.pos;
    }

    function onFrame(event) {
        var vector = joySetpoint - bulb.position;
        var delta = joyCenter - bulb.position;
        bulb.position += vector / 5;

        var xThrottle = -Math.round(delta.x / boundsRadius * 100);
        var yThrottle = Math.round(delta.y / boundsRadius * 100);

        xText.content = "x: " + xThrottle;
        yText.content = "y: " + yThrottle;
    }

}

var XYpos = new joystick(new Point(110, view.size.height - 110), 80, '#FF4444');

// var joyCenter = new Point(110, view.size.height - 110); //this.pos
//
// var joySetpoint = new Point(joyCenter);                 //this.setPt
//
// var boundsRadius = 80;                                  //this.radius
//
// var joyBounds = new Path.Circle({
//     center: joyCenter,
//     radius: boundsRadius,
//     strokeColor: 0.8,
//     strokeWidth: 5,
//     dashArray: [10,4]
// });
//
// var bulbShadow = new Path.Circle({
//     center: joyCenter,
//     radius: 10,
//     fillColor: 0.8
// });
//
// var bulb = new Path.Circle({
//     center: joyCenter,
//     radius: 10,
//     fillColor: '#FF4444'
// });
//
// var xText = new PointText({
//     point: [joyCenter.x + boundsRadius + 10,
//             joyCenter.y - boundsRadius],
//     fontSize: 20,
//     fillColor: 0.8
// });
//
// var yText = new PointText({
//     point: [joyCenter.x + boundsRadius + 10,
//             joyCenter.y - boundsRadius + 20],
//     fontSize: 20,
//     fillColor: 0.8
// });
//
// var dot = new Path.Circle({
//     center: view.size/2,
//     radius: 10,
//     fillColor: '#33B5E5'
// });
//
// function onMouseDrag(event) {
//     if(joyBounds.contains(event.point)) {
//         joySetpoint = event.point;
//     } else {
//         joySetpoint = joyCenter;
//     }
// }
//
// function onMouseUp(event) {
//     joySetpoint = joyCenter;
// }
//
// function onFrame(event) {
//     var vector = joySetpoint - bulb.position;
//     var delta = joyCenter - bulb.position;
//     bulb.position += vector / 5;
//
//     var xThrottle = -Math.round(delta.x / boundsRadius * 100);
//     var yThrottle = Math.round(delta.y / boundsRadius * 100);
//
//     xText.content = "x: " + xThrottle;
//     yText.content = "y: " + yThrottle;
//
//     //moving the thingy
//     dot.position -= delta/5;
// }
//
// function onResize(event) {
//     joyCenter = new Point(110, view.size.height - 110);
//     joyBounds.position = bulbShadow.position = joySetpoint = joyCenter;
//     xText.position = new Point(joyCenter.x + boundsRadius + 10, joyCenter.y - boundsRadius);
//     yText.position = new Point(joyCenter.x + boundsRadius + 10, joyCenter.y - boundsRadius + 20);
// }
