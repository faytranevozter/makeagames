function Puzzle(options) {

    this.defaults = {
        element        : '#myCanvas',
        cols           : 3,
        random         : 100,
        autoload       : true,
        width          : 'auto',
        height         : 'auto',
        border         : true,
        border_color   : '#FFFFFF',
        blank_color    : '#FFFF00',
        interval       : 5,
        increment      : 1
    };

    this.config = Object.assign(this.defaults, options);
    this.rules = [];
    this.block = [];
    this.current_block = [];
    this.block_image = [];

    if (typeof this.config.image === 'undefined') {
        return false;
    }

    if (this.config.autoload === true) {
        return this.init();
    }

    return this;
}

Puzzle.prototype = {

    init: function(callback){
        var _this = this;
        this.createImage(function(){
            _this.createCanvas(function(){
                // build the column
                _this.buildColumn(function(){
                    // increment animation override
                    while(_this.width_per_col % _this.config.increment != 0) {
                        _this.config.increment--;
                    }

                    // set active
                    _this.current_active = (_this.config.cols * _this.config.cols);

                    // randoming block
                    if (_this.config.random > 0) {
                        _this.randomize(_this.config.random, function(){
                            // click listener
                            _this.attachEvent();

                            // callback
                            if (typeof callback === 'function') {
                                return callback(_this);
                            } else {
                                return _this;
                            }
                        });
                    } else {
                        // click listener
                        _this.attachEvent();
                    }

                    // callback
                    if (typeof callback === 'function') {
                        return callback(_this);
                    } else {
                        return _this;
                    }

                });
            });
        });

        // callback
        if (typeof callback === 'function') {
            return callback(_this);
        } else {
            return _this;
        }
    },

    destroy: function(callback){
        // display the canvas
        var container = typeof this.config.element === 'string' ? document.querySelector(this.config.element) : this.config.element;
        // check if container exist
        if (container !== null) {
            container.removeChild(this.canvas);
        }

        // callback
        if (typeof callback === 'function') {
            return callback(this);
        } else {
            return this;
        }
    },

    createImage: function(callback){
        var _this = this;
        // generate image
        this.image = new Image();
        this.image.src = this.config.image;
        this.image.onload = function() {
            // assign variable
            _this.image.actual_width = this.width;
            _this.image.actual_height = this.height;
            _this.image.actual_col_width = Math.round(_this.image.actual_width / _this.config.cols);
            _this.image.actual_col_height = Math.round(_this.image.actual_height / _this.config.cols);
            // set this image width & height
            if (_this.config.width == 'auto' && _this.config.height == 'auto') {
                _this.config.width = this.width;
                _this.config.height = this.height;
            } else if (_this.config.height == 'auto') {
                _this.config.height = _this.config.width * this.height / this.width;
            } else if (_this.config.width == 'auto') {
                _this.config.width = _this.config.height * this.width / this.height;
            }

            console.log(_this.config.width)
            console.log(_this.config.height)
            
            // callback
            if (typeof callback === 'function') {
                return callback(this);
            } else {
                return _this;
            }
        }
    },

    createCanvas: function(callback){
        // generate canvas
        this.canvas = document.createElement('canvas');
        // this.canvas.style.border = '1px solid black';
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.context = this.canvas.getContext("2d");

        // display the canvas
        var container = typeof this.config.element === 'string' ? document.querySelector(this.config.element) : this.config.element;
        // check if container exist
        if (container !== null) {
            // remove the content
            container.innerHTML = '';
        }
        console.log(container)
        container.appendChild(this.canvas);

        // callback
        if (typeof callback === 'function') {
            return callback(this);
        } else {
            return this;
        }
    },

    drawLine: function(callback){
        this.context.strokeStyle = this.config.border_color;
        for (var i = 1; i <= (this.config.cols - 1); i++) {
            xCol = (i % (this.config.cols - 1) == 0) ? (this.config.cols - 1) : i % (this.config.cols - 1);
            this.context.beginPath();
            this.context.lineWidth = 2;
            this.context.moveTo(this.width_per_col * xCol, 0);
            this.context.lineTo(this.width_per_col * xCol, this.config.height);
            this.context.stroke();

            this.context.beginPath();
            this.context.lineWidth = 2;
            this.context.moveTo(0, this.height_per_col * xCol);
            this.context.lineTo(this.config.width, this.height_per_col * xCol);
            this.context.stroke();
        }

        // callback
        if (typeof callback === 'function') {
            return callback(this);
        } else {
            return this;
        }
    },

    attachEvent: function() {
        var _this = this;
        this.canvas.addEventListener('click', function(e){
            var rounded_x = Math.floor(e.offsetX / _this.width_per_col) * _this.width_per_col;
            var rounded_y = Math.floor(e.offsetY / _this.height_per_col) * _this.height_per_col;

            _this.last_click = _this.block[rounded_x + '-' + rounded_y];
            _this.move_to(_this.last_click, _this.current_active);
        });
    },

    buildColumn: async function(callback) {
        this.width_per_col = this.config.width / this.config.cols;
        this.height_per_col = this.config.height / this.config.cols;

        for (var i = 1; i <= (this.config.cols * this.config.cols); i++) {
            currentRow = Math.floor((i-1)/this.config.cols);
            currentCol = ((i % this.config.cols == 0 ? this.config.cols : i % this.config.cols)-1);
            
            offsetImageX = currentCol * this.image.actual_col_width;
            offsetImageY = currentRow * this.image.actual_col_height;

            offsetPosX = currentCol * this.width_per_col;
            offsetPosY = currentRow * this.height_per_col;

            // draw per piece
            this.block_image[i] = [[offsetImageX, offsetImageY, this.image.actual_col_width, this.image.actual_col_height, this.width_per_col, this.height_per_col], [offsetPosX, offsetPosY]];
            // the last
            if (i == (this.config.cols * this.config.cols)) {
                this.draw_image(this.block_image[i][1], this.block_image[i][0], true);
            }
            // other
            else {
                this.draw_image(this.block_image[i][1], this.block_image[i][0]);
            }

            // set the rule
            this.addRule(i);

            // set block (left top)
            this.block[offsetPosX + '-' + offsetPosY] = i;

        }

        // callback
        if (typeof callback === 'function') {
            return callback(this);
        } else {
            return this;
        }
    },

    draw_image: function(pos, args, blank, color){
        if (typeof blank === 'undefined') {
            this.context.drawImage(this.image, args[0], args[1], args[2], args[3], pos[0], pos[1], args[4], args[5]);
        } else {
            this.context.fillStyle = (typeof color === 'undefined') ? this.config.blank_color : color;
            this.context.fillRect(pos[0], pos[1], args[4], args[5]);
        }

        // draw the line
        if (this.config.border) {
            this.drawLine();
        }
    },

    addRule: function(i) {
        rule = [];
        // right move
        if (i % this.config.cols != 0) {
            rule.push(i + 1);
        }
        // left move
        if ((i - 1) % this.config.cols != 0) {
            rule.push(i - 1);
        }
        // bottom move
        if ( i <= ((this.config.cols * this.config.cols) - this.config.cols)) {
            rule.push(i + this.config.cols);
        }
        // top move
        if ( i > this.config.cols) {
            rule.push(i - this.config.cols);
        }
        // assign into the rules
        this.rules[i] = rule;
    },

    move_to: function(from, to){
        var moveable = this.rules[from].indexOf(to) >= 0 ? true : false;
        if (moveable) {
            // blank the clicked
            var _this = this;
            var animate;
            // animate
            function frame(data, callback) {
                if (x == x2 && y == y2) {
                    clearInterval(animate);
                    // callback
                    if (typeof callback === 'function') {
                        return callback(this);
                    } else {
                        return _this;
                    }
                } else {
                    if (x > x2) { x = x - _this.config.increment; x3 = x3 + _this.config.increment; } 
                    else if (x < x2) { x = x + _this.config.increment; x3 = x3 - _this.config.increment; }
                    
                    if (y > y2) { y = y - _this.config.increment; y3 = y3 + _this.config.increment; } 
                    else if (y < y2) { y = y + _this.config.increment; y3 = y3 - _this.config.increment; }
                    
                    var temp = data[1];
                    // for X
                    if (x3 >= x2) {
                        if ((x3 - _this.config.increment) == x2) {
                            temp[4] = _this.config.increment;
                        } else {
                            temp[4] = (x3 % _this.width_per_col) > 0 ? (x3 % _this.width_per_col) : _this.width_per_col;
                        }
                        blank_x_position = x2;
                    } else {
                        if ((x3 + _this.config.increment) == x2) {
                            temp[4] = _this.config.increment;
                        } else {
                            temp[4] = (x3 % _this.width_per_col) > 0 ? ((x2 - (x3 % _this.width_per_col)) % _this.width_per_col) : _this.width_per_col;
                        }
                        blank_x_position = _this.width_per_col + x3;
                    }
                    // for Y
                    if (y3 >= y2) {
                        if ((y3 - _this.config.increment) == y2) {
                            temp[5] = _this.config.increment;
                        } else {
                            temp[5] = (y3 % _this.height_per_col) > 0 ? (y3 % _this.height_per_col) : _this.height_per_col;
                        }
                        blank_y_position = y2;
                    } else {
                        if ((y3 + _this.config.increment) == y2) {
                            temp[5] = _this.config.increment;
                        } else {
                            temp[5] = (y3 % _this.height_per_col) > 0 ? ((y2 - (y3 % _this.height_per_col)) % _this.height_per_col) : _this.height_per_col;
                        }
                        blank_y_position = _this.height_per_col + y3;
                    }
                    _this.draw_image([blank_x_position, blank_y_position], temp, true);
                    _this.draw_image([x3, y3], data[0]);
                }
            }
            var x =_this.block_image[to][1][0];
            var y = _this.block_image[to][1][1];
            var x2 = _this.block_image[from][1][0];
            var y2 = _this.block_image[from][1][1];
            var x3 = x2;
            var y3 = y2;
            var img = [_this.block_image[from][0], _this.block_image[to][0]];
            return new Promise((resolve, reject) => {
                animate = setInterval(function(){
                    frame(img, function(){
                        _this.current_active = from;

                        // switch position
                        var temp = _this.block_image[from][0];
                        _this.block_image[from][0] = _this.block_image[to][0];
                        _this.block_image[to][0] = temp;

                        resolve('done')
                    });
                }, this.config.interval);
            });
            
        }
    },

    check_complete: function(){
        this.block_image.forEach(function(item, index){
            console.log(item);
        });
    },

    randomize: async function(n, callback){
        var _this = this;
        var current_rule = this.rules[this.current_active];
        var last_step = 0;
        var random = current_rule[Math.floor(Math.random() * current_rule.length)];
        for (var i = 1; i <= n; i++) {
            last_step = this.current_active;
            await this.move_to(random, this.current_active);
            current_rule = this.rules[random].filter(function(item) { 
                return item != last_step
            });
            random = current_rule[Math.floor(Math.random() * current_rule.length)];
        }
        // callback
        if (typeof callback === 'function') {
            return callback(this);
        } else {
            return this;
        }
    },

    wait: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

};

document.querySelectorAll('.demo').forEach(function(item, index) {
    console.log(item)
    var a = new Puzzle({
        element: item,
        image: item.getAttribute('data-image'),
        interval: 10,
        increment: 10,
        cols: 3,
        width: 300,
        height: 240,
        random: 10,
        // autoload: false,
        blank_color: 'red',
        border_color: 'blue',
    });
    console.log(a)
});