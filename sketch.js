//
// by oran collins
// github.com/wisehackermonkey
// oranbusiness@gmail.com
// 20200624

let max_width = 27;
let max_height = 27;

let position_pattern = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
];

let align_pattern = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
];

let grid = InitialArray2D(max_width, max_height);
let bit_mask = InitialArray2D(max_width, max_height);
let mask = InitialArray2D(max_width, max_height);
let formate = InitialArray2D(max_width, max_height);
let timing = InitialArray2D(max_width, max_height);

let current_pattern_algorithm = 0;
function setup() {
    createCanvas(280, 280);
    copy_to_array(grid, position_pattern, 0, 0);
    copy_to_array(grid, position_pattern, 20, 0);
    copy_to_array(grid, position_pattern, 0, 20);
    copy_to_array(grid, align_pattern, 18, 18);

    // copy_vertical_line(grid, [1, 1, 0, 0, 1, 1, 1, 1], 8, 0);
    // copy_horizontal_line(grid, [1, 1, 1, 0, 1, 1, 1, 0, 1], 0, 8);

    // copy_vertical_line(grid, [1, 1, 0, 0, 1, 1, 1, 1], 21, 8);

    copy_vertical_line(formate, [1, 1, 0, 0, 1, 1, 1, 1], 8, 0);
    copy_horizontal_line(formate, [1, 1, 1, 0, 1, 1, 1, 0], 0, 8);

    copy_horizontal_line(
        formate,
        [1, 1, 0, 1, 0, 0, 1, 1, 0],
        18,
        8,
        "reverse"
    );

    mask_pattern(mask);
    gen_pattern(bit_mask, mask);

    combine(grid, formate);
    xor(grid, bit_mask);

    timing_pattern(grid, 6, 7, 12, "down");
    timing_pattern(grid, 7, 6, 12, "left");
}

function draw() {
    background(50);

    if(frameCount % 40 === 0){
        current_pattern_algorithm++;
    if (current_pattern_algorithm >= algo.length) {
        current_pattern_algorithm = 0;
    }
    }
    grid = InitialArray2D(max_width, max_height);
    copy_to_array(grid, position_pattern, 0, 0);
    copy_to_array(grid, position_pattern, 20, 0);
    copy_to_array(grid, position_pattern, 0, 20);
    copy_to_array(grid, align_pattern, 18, 18);

    // copy_vertical_line(grid, [1, 1, 0, 0, 1, 1, 1, 1], 8, 0);
    // copy_horizontal_line(grid, [1, 1, 1, 0, 1, 1, 1, 0, 1], 0, 8);

    // copy_vertical_line(grid, [1, 1, 0, 0, 1, 1, 1, 1], 21, 8);

    copy_vertical_line(formate, [1, 1, 0, 0, 1, 1, 1, 1], 8, 0);
    copy_horizontal_line(formate, [1, 1, 1, 0, 1, 1, 1, 0], 0, 8);

    copy_horizontal_line(
        formate,
        [1, 1, 0, 1, 0, 0, 1, 1, 0],
        18,
        8,
        "reverse"
    );

    mask_pattern(mask);
    gen_pattern(bit_mask, mask);

    combine(grid, formate);
    xor(grid, bit_mask);

    timing_pattern(grid, 6, 7, 12, "down");
    timing_pattern(grid, 7, 6, 12, "left");

    render_qr_code(grid, max_width, max_height);

    render_qr_code_debug(
        bit_mask,
        max_width,
        max_height,
        color(0, 255, 0, 155),
        color(0, 255, 0, 0)
    );
    render_qr_code_debug(
        formate,
        max_width,
        max_height,
        color(0, 0, 255, 155),
        color(0, 255, 255, 0)
    );
}

function render_qr_code_debug(
    target,
    max_x,
    max_y,
    color_ = false,
    color2_ = false
) {
    let pixel_size = 10;
    fill(color("white"));
    // strokeWeight(2);
    push();
    noStroke();
    let is_true_color = color(255, 0, 0, 100);
    if (color_ !== false) {
        is_true_color = color_;
    }

    let is_true_color2 = color(0, 255, 255, 100);
    if (color2_ !== false) {
        is_true_color2 = color2_;
    }

    for (let x = 0; x < max_x; x += 1) {
        for (let y = 0; y < max_y; y += 1) {
            fill(target[x][y] == 1 ? is_true_color : is_true_color2);
            rect(x * pixel_size, y * pixel_size, pixel_size, pixel_size);
        }
    }
    pop();
}

function render_qr_code(target, max_x, max_y) {
    let pixel_size = 10;
    fill(color("white"));
    // strokeWeight(2);
    push();
    noStroke();
    for (let x = 0; x < max_x; x += 1) {
        for (let y = 0; y < max_y; y += 1) {
            fill(target[x][y] == 1 ? 100 : 255);
            rect(x * pixel_size, y * pixel_size, pixel_size, pixel_size);
        }
    }
    pop();
}

function copy_to_array(target, source, start_x, start_y) {
    for (var x = 0; x < source.length; x++) {
        for (var y = 0; y < source[0].length; y++) {
            // initial value:
            target[x + start_x][y + start_y] = source[x][y];
        }
    }
}
function copy_horizontal_line(target, source, start_x, start_y, direction) {
    if (direction === "reverse") {
        let temp = source.reverse();
        for (var x = 0; x < source.length; x++) {
            target[x + start_x][start_y] = source[x];
        }
    } else {
        for (var x = 0; x < source.length; x++) {
            target[x + start_x][start_y] = source[x];
        }
    }
}
function copy_vertical_line(target, source, start_x, start_y, direction) {
    for (var y = 0; y < source.length; y++) {
        target[start_x][y + start_y] = source[y];
    }
}
function copy_to_bit_mask(target, source, start_x, start_y) {
    for (var x = 0; x < source.length; x++) {
        for (var y = 0; y < source[0].length; y++) {
            // initial value:
            target[x + start_x][y + start_y] = source[x][y];
        }
    }
}

function timing_pattern(target, start_x, start_y, length, direction) {
    if (direction === "left") {
        for (var x = 0; x <= length; x++) {
            target[x + start_x][start_y] = x % 2;
        }
    } else if (direction === "down") {
        for (var y = 0; y < length; y++) {
            target[start_x][y + start_y] = y % 2;
        }
    }
}

algo = [
    (i, j) => {
        return i % 2;
    },
    (i, j) => {
        return (((i * j) % 3) + i * j) % 2;
    },
    (i, j) => {
        return (i + j) % 3;
    },
    (i, j) => {
        return (((i * j) % 3) + i + j) % 2;
    },
    (i, j) => {
        return (i / 2 + j / 3) % 2;
    },
    (i, j) => {
        return ((i * j) % 2) + ((i * j) % 3);
    },
    (i, j) => {
        return j % 3;
    },

];
function gen_pattern(target, _mask) {
    //make bit mask user changeable would make great
    //1  (x + y) % 3
    //2 ((x * y) % 3 +x*y)%2

    for (var x = 0; x < target.length; x++) {
        for (var y = 0; y < target[0].length; y++) {
            // initial value:
            target[x][y] = algo[current_pattern_algorithm](x, y) & !_mask[x][y];
        }
    }
}
function mask_pattern(target) {
    let size_r = 8;

    draw_rect(target, 0, 0, size_r);
    draw_rect(target, max_width - size_r, 0, size_r);
    draw_rect(target, 0, max_width - size_r, size_r);
    draw_rect(target, 18, 18, 5);
}

function draw_rect(target, start_x, start_y, positioning) {
    for (var x = 0; x < positioning; x++) {
        for (var y = 0; y < positioning; y++) {
            target[x + start_x][y + start_y] = 1;
        }
    }
}

function xor(target, source) {
    for (var x = 0; x < target.length; x++) {
        for (var y = 0; y < target[0].length; y++) {
            // initial value:
            target[x][y] = target[x][y] ^ source[x][y];
        }
    }
}

function combine(target, source) {
    for (var x = 0; x < target.length; x++) {
        for (var y = 0; y < target[0].length; y++) {
            // initial value:
            target[x][y] = target[x][y] | source[x][y];
        }
    }
}
// helper functions
function Array2D(w, h, initial = 0) {
    result = new Array(w);
    for (var i = 0; i < w; i++) {
        result[i] = new Array(h);
    }
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            // initial value:
            result[x][y] = initial;
        }
    }
    return result;
}

function InitialArray2D(w, h, initial = 0) {
    result = new Array(w);
    for (var i = 0; i < w; i++) {
        result[i] = new Array(h);
    }
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            // initial value:
            result[x][y] = initial;
        }
    }
    return result;
}

function mousePressed() {
    current_pattern_algorithm++;
    if (current_pattern_algorithm >= algo.length) {
        current_pattern_algorithm = 0;
    }
    print(current_pattern_algorithm);
}
