Raphael.fn.connection = function (obj1, obj2, line, bg, obj1_point, obj2_point) {
    var bb1 = obj1.getBBox(), // box of obj1
        bb2 = obj2.getBBox(), // box of obj2
        p = [
                { // obj1 top
                    x: bb1.cx,
                    y: bb1.y - 1,
                },
                { // obj1 bottom
                    x: bb1.cx,
                    y: bb1.y2 + 1,
                },
                { // obj1 left
                    x: bb1.x - 1,
                    y: bb1.cy,
                },
                { // obj1 right
                    x: bb1.x2 + 1,
                    y: bb1.cy,
                },
                { // obj2 top
                    x: bb2.cx,
                    y: bb2.y - 1,
                },
                { // obj2 bottom
                    x: bb2.cx,
                    y: bb2.y2 + 1,
                },
                { // obj2 left
                    x: bb2.x - 1,
                    y: bb2.cy,
                },
                { // obj2 right
                    x: bb2.x2 + 1,
                    y: bb2.cy,
                },
            ],
        d = {},
        dis = [];

    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if (
                    (i == j - 4) // same direction of points - top-top, left-left, ...
                    ||
                    (
                        (
                            (i != 3 && j != 6) // points not right-left
                            ||
                            p[i].x < p[j].x
                        )
                        &&
                        (
                            (i != 2 && j != 7) // points not left-right
                            ||
                            p[i].x > p[j].x
                        )
                        &&
                        (
                            (i != 0 && j != 5) // points not top-bottom
                            ||
                            p[i].y > p[j].y
                        )
                        &&
                        (
                            (i != 1 && j != 4) // points not bottom-top
                            ||
                            p[i].y < p[j].y
                        )
                    )
                )
            {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    // choose what points of objects will be connected
    var res = [0, 4]
    if (obj1_point && obj2_point)
    {
        switch(obj1_point)
        {
            case "top":
                res[0] = 0;
                break;
            case "bottom":
                res[0] = 1;
                break;
            case "left":
                res[0] = 2;
                break;
            case "right":
                res[0] = 3;
                break;
        };
        switch(obj2_point)
        {
            case "top":
                res[1] = 4;
                break;
            case "bottom":
                res[1] = 5;
                break;
            case "left":
                res[1] = 6;
                break;
            case "right":
                res[1] = 7;
                break;
        };
    }
    else
    {
        if (dis.length == 0) {
            res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
    };

    // select start and end points of line
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;

    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);

    // compute two middle points for line
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

    // generate path for svg for line
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");

    var color = typeof line == "string" ? line : "#000";
    return {
        bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
        line: this.path(path).attr({stroke: color, fill: "none"}),
        from: obj1,
        to: obj2
    };
};



function render_into(element_id) {
    var  r = Raphael(element_id, 800, 600);
    // connections = [],
    // shapes = [ r.ellipse(190, 100, 30, 20),
    // r.rect(290, 80, 60, 40, 10),
    // r.rect(290, 180, 60, 40, 2),
    // r.ellipse(450, 100, 20, 20)
    // ];

    // connections.push(r.connection(shapes[0], shapes[1], "#fff"));
    // connections.push(r.connection(shapes[1], shapes[2], "#fff", "#fff|5"));
    // connections.push(r.connection(shapes[1], shapes[3], "#000", "#fff"));


    var cylinder = {
        "path":" a50 10 0 0 0 100 0 a50 10 0 0 0 -100 0 v100 a50 10 0 0 0 100 0 v-100",
        "label_offset":{
            "x":50,
            "y":50,
        },
    };
    var square = {
        "path":" v100 s 0 5 5 5 h100 s 5 0 5 -5 v-100 s 0 -5 -5 -5 h-100 s -5 0 -5 5 z",
        "label_offset":{
            "x":55,
            "y":50,
        },
    };

    var render = function(raphael) {
        if (this.shape != undefined) {
            this.rendered = raphael.path("M" + this.origin + " " + this.shape.path);
        } else if (this.type == "ellipse") {
            var pos = this.origin.split(" ");
            var x = parseInt(pos[0]);
            var y = parseInt(pos[1]);
            var size = this.size.split(" ");
            var width = parseInt(size[0]);
            var height = parseInt(size[1]);
            this.rendered = raphael.ellipse(x, y, width, height);
        }
        return this.rendered;
    }

    var labelize = function(raphael) {
        if (this.label != undefined) {
            var pos = this.origin.split(" ");
            if (this.shape != undefined) {
                var offset_x = this.shape.label_offset.x;
                var offset_y = this.shape.label_offset.y;
            } else {
                var offset_x = 0;
                var offset_y = 0;
            }
            var x = parseInt(pos[0]) + offset_x;
            var y = parseInt(pos[1]) + offset_y;
            this.rendered_label = raphael.text(x, y, this.label);
            var label_color = this.label_color || "black";
            var label_size = this.label_size || "20px";
            this.rendered_label.attr({font: label_size +" Source Sans Pro,Helvetica,sans-serif",
                                      fill: label_color});
        }
        return this;
    }

    var colorize = function() {
        if (this.color != undefined) {
            this.rendered.attr({"fill":this.color});
        }
        if (this.border != undefined) {
            this.rendered.attr({"stroke": this.border, "stroke-width": "3"});
        }
    }

    var change_color = function() {
        if (this.color != undefined) {
            this.rendered.animate({"fill": this.target_color}, 1500);
        }
        return this;
    };

    var reset_color = function() {
        if (this.color != undefined) {
            this.rendered.animate({"fill": this.color}, 1);
        }
        if (this.border != undefined) {
            this.rendered.animate({"stroke": this.border}, 1);
        }
        return this;
    };


    var components = {
        "cinder":{
            "label":"cinder",
            "origin":"430 150",
            "color":"#CC9922",
            "target_color":"grey",
            "shape":cylinder,
        },
        "swift":{
            "label":"swift",
            "origin":"430 400",
            "color":"#EEAA22",
            "target_color":"grey",
            "shape":cylinder,
        },
        "glance":{
            "label":"glance",
            "origin":"510 280",
            "color":"#CC6622",
            "target_color":"grey",
            "shape":cylinder,
        },
        "neutron":{
            "label":"neutron",
            "origin":"215 280",
            "color":"#99CCCC",
            "target_color":"grey",
            "shape":square,
        },
        "nova":{
            "label":"nova",
            "origin":"300 150",
            "color":"#33FFFF",
            "target_color":"grey",
            "shape":square,
        },
        "keystone":{
            "label":"keystone",
            "origin":"300 400",
            "color":"#66DDDD",
            "target_color":"grey",
            "shape":square,
        },
        "heat":{
            "label":"heat",
            "origin":"540 30",
            "color":"#33CCCC",
            "target_color":"grey",
            "shape":square,
        },
        "dashboard":{
            "label":"dashboard",
            "origin":"190 25",
            "color":"#33FF33",
            "target_color":"grey",
            "shape":square,
        },
        "ironic":{
            "label":"ironic",
            "origin":"50 90",
            "color":"#33AAEE",
            "target_color":"grey",
            "shape":square,
        },
        "sahara":{
            "label":"sahara",
            "origin":"30 260",
            "color":"#EE6600",
            "target_color":"grey",
            "shape":square,
        },
        "trove":{
            "label":"trove",
            "origin":"100 450",
            "color":"#FF3300",
            "target_color":"grey",
            "shape":cylinder,
        },
        "ceilometer":{
            "label":"ceilometer",
            "origin":"670 200",
            "color":"#66CCFF",
            "target_color":"grey",
            "shape":square,
        },
        "manila":{
            "label":"manila",
            "origin":"680 380",
            "color":"#DD3311",
            "target_color":"grey",
            "shape":cylinder,
        },
        "ellipseset":{
            "label":"Core Services",
            "label_color": "white",
            "label_size": "30px",
            "origin":"420 330",
            "size": "248 215",
            "border":"white",
            "type": "ellipse",
        }
    };

    var connections = [
        ["cinder", "nova", "left", "right"],
        ["swift", "glance", "right", "bottom"],
        ["glance", "nova", "left", "bottom"],
        ["neutron", "nova", "top", "bottom"],
        ["keystone", "glance", "top", "left"],
        ["keystone", "nova", "top", "bottom"],
        ["keystone", "neutron", "left", "bottom"],
        ["keystone", "swift", "right", "left"],
        ["keystone", "cinder", "top", "bottom"],
        ["heat", "ellipseset", "right", "right"],
        ["heat", "sahara", "left", "top"],
        ["dashboard", "ellipseset", "right", "top"],
        ];

    for (var component in components) {
        components[component].render = render;
        components[component].labelize = labelize;
        components[component].colorize = colorize;
        components[component].change_color = change_color;
        components[component].reset_color = reset_color;
    };

    var render_all = function() {
        for (var component in components) {
            if (components.hasOwnProperty(component)) {
                components[component].render(r);
                components[component].labelize(r);
                components[component].colorize();
            };
        };
        /*
        for(var i = 0; i < connections.length; i++) {
            first = components[connections[i][0]].rendered;
            second = components[connections[i][1]].rendered;
            first_point = connections[i][2] || null;
            second_point = connections[i][3] || null;
            r.connection(first, second, "#fff", null, first_point, second_point);
        };
        */
        return this;
    };

    var reset_all_colors = function() {
        for (var component in components) {
            if (components.hasOwnProperty(component)) {
                components[component].reset_color();
            };
        };
    };

    r.components = components;
    //r.connections = connections;
    r.render_all = render_all;
    r.reset_all_colors = reset_all_colors;

    return r;
};

