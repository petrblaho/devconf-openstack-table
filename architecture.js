Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
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
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
    y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
    y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
                to: obj2
        };
    }
};



function render_into(element_id) {
    var  r = Raphael(element_id, 1024, 768);
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
        this.rendered = raphael.path("M" + this.origin + " " + this.shape.path);
        return this.rendered;
    }

    var labelize = function(raphael) {
        var pos = this.origin.split(" ");
        var x = parseInt(pos[0]) + this.shape.label_offset.x;
        var y = parseInt(pos[1]) + this.shape.label_offset.y;
        this.rendered_label = raphael.text(x, y, this.label);
        this.rendered_label.attr({font: "20px Source Sans Pro,Helvetica,sans-serif"});
        return this;
    }

    var colorize = function() {
        this.rendered.attr({"fill":this.color});
    }

    var change_color = function() {
        this.rendered.animate({"fill": this.target_color}, 1500);
        return this;
    };

    var reset_color = function() {
        this.rendered.animate({"fill": this.color}, 1);
        return this;
    };


    var components = {
        "cinder":{
            "label":"cinder",
            "origin":"500 325",
            "color":"#CC9900",
            "target_color":"grey",
            "shape":cylinder,
        },
        "swift":{
            "label":"swift",
            "origin":"500 175",
            "color":"#CC9900",
            "target_color":"grey",
            "shape":cylinder,
        },
        "glance":{
            "label":"glance",
            "origin":"350 250",
            "color":"#CC9900",
            "target_color":"grey",
            "shape":cylinder,
        },
        "neutron":{
            "label":"neutron",
            "origin":"50 250",
            "color":"violet",
            "target_color":"grey",
            "shape":square,
        },
        "nova":{
            "label":"nova",
            "origin":"200 250",
            "color":"blue",
            "target_color":"grey",
            "shape":square,
        },
        "dashboard":{
            "label":"dashboard",
            "origin":"350 50",
            "color":"lime",
            "target_color":"grey",
            "shape":square,
        },
        "heat":{
            "label":"heat",
            "origin":"650 250",
            "color":"lime",
            "target_color":"grey",
            "shape":square,
        },
        "keystone":{
            "label":"keystone",
            "origin":"350 450",
            "color":"lime",
            "target_color":"grey",
            "shape":square,
        },
    };

    var connections = [
        ["dashboard", "cinder"],
        ["dashboard", "swift"],
        ["dashboard", "glance"],
        ["dashboard", "neutron"],
        ["dashboard", "nova"],
        ["dashboard", "heat"],
        ["cinder", "nova"],
        ["swift", "glance"],
        ["glance", "nova"],
        ["neutron", "nova"],
        ["heat", "nova"],
        ["heat", "neutron"],
        ["heat", "glance"],
        ["keystone", "glance"],
        ["keystone", "nova"],
        ["keystone", "neutron"],
        ["keystone", "heat"],
        ["keystone", "swift"],
        ["keystone", "cinder"],
        ["keystone", "dashboard"],
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
        for(var i = 0; i < connections.length; i++) {
            first = components[connections[i][0]].rendered;
            second = components[connections[i][1]].rendered;
            r.connection(first, second, "#fff");
        };
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
    r.connections = connections;
    r.render_all = render_all;
    r.reset_all_colors = reset_all_colors;

    return r;
};

