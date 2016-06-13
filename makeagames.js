$.fn.makeAGames = function(options){

	// lists of variable
	var $this,imageWidth,imageHeight,containerSize,colSize,topN,leftN,currentRow,currentCol,box_content,gameOver,timer,startTimer,countdown,step;
	var rules = [];
	gameOver = false,startTimer = false,timer = 0,step = 0;
	
	// define variable this
	$this = $(this);

	var defaults = {
		'cols'  		: 4, // 3 for now
		'random'		: 100,
		'imageLink' 		: $this.data('image'),
		'animation' 		: true,
		'contentBox'		: "{i}",
		'onGameOver' 		: function(timer, step){ alert('Complete in ' + timer + ' seconds and ' + step + ' steps.'); },
		'containerBorder'	: 1,
		'sliceBorder'		: 1,
		'borderColor'		: '#222',
		'borderType'		: 'solid',
		'timerBox'  		: $('#mag-timer'),
		'stepBox'		: $('#mag-step'),
		'keyboardPlay'		: false,
		'keyboardCode'		: {"up": 38, "down": 40, "right": 39, "left": 37},
		'keyboardReverse'	: false
	};

	option = (typeof options == 'undefined') ? {} : options;

	var setting = $.extend(defaults, option);

	imgames = new Image();

	imgames.onerror = function() {
		$this.show_("Image is not Found.", $this);
	};
	
	imgames.onload = function() {
		// set height and width
		imageWidth = imgames.width;
		imageHeight = imgames.height;
		// the container size
		containerSize = imageWidth+(setting.containerBorder*2)+(setting.sliceBorder*setting.cols*2);
		// column size
		colSize = Math.round(imageWidth/setting.cols);

		$this.cssify(containerSize,containerSize,colSize,colSize,setting.imageLink,setting.containerBorder,setting.sliceBorder,setting.borderType,setting.borderColor);

		$this.buildColumn();

		// randoming
		$this.randomize(setting.random);

		// timer,step = 0
		$this.countTo(timer);
		$this.stepTo(step);

		$('.mag-slice').click(function(){

			if ( ! gameOver) {

				if ($this.moveTo($(this), $('.mag-slice.mag-blank')) != false) {

					if ( ! startTimer) {
						startTimer = true;
						// start counting
						countdown = setInterval($this.counting, 10);
					}

					// steping
					$this.stepping();
					
					if ($this.checkIfComplete()) {
						// stop the game
						$this.stopGame();
					};
				};
			};
			return false;
		});

		if (setting.keyboardPlay) {
			// reverse key
			if (setting.keyboardReverse) {
				dump = setting.keyboardCode;
				setting.keyboardCode = {"up": dump.down, "down": dump.up, "right": dump.left, "left": dump.right};
				delete dump;
			}

			$(document).keydown(function(e){
				var key = e.which || e.keyCode || 0;
				var blanked = $('.mag-slice.mag-blank');
				var blanked_i = parseInt(blanked.attr('mag-i'));
				if(key == setting.keyboardCode.up){
					var move_to = (blanked_i-setting.cols) > 0 ? blanked_i-setting.cols : false;
				} else if(key == setting.keyboardCode.right) {
					var move_to = (blanked_i % setting.cols) != 0 ? blanked_i+1 : false; 
				} else if(key == setting.keyboardCode.down) {
					var move_to = (blanked_i+setting.cols) <= (setting.cols*setting.cols) ? (blanked_i+setting.cols) : false;
				} else if(key == setting.keyboardCode.left) {
					var move_to = ((blanked_i-1) % setting.cols) != 0 ? blanked_i-1 : false;
				} else {
					var move_to = false;
				}
				

				if (move_to) {
					
					if ( ! gameOver) {

						if ($this.moveTo(blanked, $('.mag-slice[mag-i='+move_to+']')) != false) {

							if ( ! startTimer) {
								startTimer = true;
								// start counting
								countdown = setInterval($this.counting, 10);
							}

							// steping
							$this.stepping();
							
							if ($this.checkIfComplete()) {
								// stop the game
								$this.stopGame();
							};
						};
					};

					return false;
				}
			});
		}

	};

	// image from url
	imgames.src = setting.imageLink;

	$this.cssify = function(w,h,cw,ch,i,bzc,bzs,bs,bc){
		// create base container for slices image
		$this.css({width: w, height: h, border: bzc + 'px ' + bs + ' ' + bc });

		$this.addClass('makeagames_wrapper');

		// adding the column style
		$this.addStyle('.mag-slice {width:' + cw + 'px; height:' + ch + 'px; border: ' + bzs + 'px ' + bs + ' ' + bc + '}');
		$this.addStyle('.mag-bg {background-image: url(\'' + i + '\')}');
	}

	$this.countTo = function(n){
		n = (n/100).toFixed(2);
		$(setting.timerBox).text(n);
	}

	$this.stepTo = function(n){
		// show in step box
		$(setting.stepBox).text(n);
	}
	
	$this.stepping = function(){
		step++;
		$this.stepTo(step);
	}
	
	$this.counting = function(){
		timer++;
		$this.countTo(timer);
	}

	$this.stopCounting = function(){
		// stop counting
		clearInterval(countdown);
	}

	$this.stopGame = function(){
		// stop counting
		$this.stopCounting();
		// call onGameOver function
		timer = (timer/100).toFixed(2);
		setting.onGameOver.call($this, timer, step);
		// disable the click event
		gameOver = true;
	}

	$this.buildColumn = function(){
		// adding the column
		for (var i = 1; i <= (setting.cols*setting.cols); i++) {
			box_content = setting.contentBox ? setting.contentBox.replace("{i}", i) : '';
			$this.addCol('<div mag-i="' + i + '" mag-p="' + i + '" class="mag-slice mag-bg mag-i-n-' + i + ' mag-bg-n-' + i + '">' + box_content + '</div>', $this);
			currentRow = Math.floor((i-1)/setting.cols);
			currentCol = ((i % setting.cols == 0 ? setting.cols : i % setting.cols)-1);
			leftN = currentCol*colSize;
			topN = currentRow*colSize;
			leftPosition = leftN+((currentCol)*2)+setting.containerBorder;
			topPosition = topN+((currentRow)*2)+setting.containerBorder;
			xBg = leftN;
			yBg = topN;
			$this.addStyle('.mag-i-n-' + i + '{top:' + topPosition + 'px; left:' + leftPosition + 'px}');
			$this.addStyle('.mag-bg-n-' + i + '{background-position-y:' + -yBg + 'px; background-position-x:' + -xBg + 'px}');
			
			// set the rule
			rule = [];
			// i-cols (1-3, 2-3, 3-3, 4-3, ... , 9-3)
			// right rule
			if (i % setting.cols != 0) {
				rule.push(i+1);
			};
			// left rule
			if ((i-1) % setting.cols != 0) {
				rule.push(i-1);
			};
			// bottom
			if (i<=((setting.cols*setting.cols)-setting.cols)) {
				rule.push(i+setting.cols);
			};
			// top
			if (i>setting.cols) {
				rule.push(i-setting.cols);
			};
			rules[i] = rule;
		}

		// remove the last slice
		$('.mag-i-n-' + (setting.cols*setting.cols)).removeClass('mag-bg').addClass('mag-blank');
	}

	$this.randomize = function(rand){
		var r_n_b = $this.find('.mag-blank').attr('mag-p');
		var r_n_b_r = rules[r_n_b];
		var r_n_b_r_o = r_n_b_r[Math.floor(Math.random() * r_n_b_r.length)];
		for (var i = 1; i <= rand; i++) {
			$this.moveTo($('.mag-slice.mag-i-n-' + r_n_b_r_o), $('.mag-slice.mag-blank'));
			r_n_b_r = rules[r_n_b_r_o];
			r_n_b_r_o = r_n_b_r[Math.floor(Math.random() * r_n_b_r.length)];
		};
	}

	$this.checkIfComplete = function() {
		var countslice = $('.mag-slice').length;
		var countbyone = 0;
		$('.mag-slice').each(function(_k,_v){
			// current position
			var cup = $(_v).attr('mag-i');
			// should position
			var shup = $(_v).attr('mag-p');

			if (cup == shup) {
				countbyone++;
			}
		});

		if (countbyone == countslice) {
			return true;
		} else {
			return false;
		};
	}

	$this.restartGame = function(){
		$this.stopCounting();
		$this.randomize(setting.random);

		startTimer = false;
		timer = 0;
		step = 0;
		$this.countTo(timer);
		$this.stepTo(step);
		gameOver = false;
	}

	$this.moveTo = function(from, to){
		var mysetting = {
			'uniqueAttr'		: 'mag-i',
			'classReverse'		: 'mag-i-n-'
		}

		var clicked = parseInt($(to).attr(mysetting.uniqueAttr));
		var blanked = $(from).attr(mysetting.uniqueAttr);
		var moveable = $.inArray(clicked, rules[blanked]) >= 0 ? true : false ;
		if (moveable) {	
			$(to).attr(mysetting.uniqueAttr, blanked).removeClass(mysetting.classReverse + clicked).addClass(mysetting.classReverse + blanked);
			$(from).attr(mysetting.uniqueAttr, clicked).removeClass(mysetting.classReverse + blanked).addClass(mysetting.classReverse + clicked);
		} else {
			return false;
		}
	}

	$this.show_ = function(errormsg,element,replace){
		if (typeof replace == 'undefined') { replace = false; } else { replace = replace; };
		if (replace) { $(element).html(errormsg); } else { $(element).append(errormsg); };
	}

	$this.addStyle = function(css) {
		if ( ! $('style#makeagames-style').length) {
			$this.show_('<style id="makeagames-style" type="text/css"></style>', $('head'));
		}
		$this.show_(css, $('style#makeagames-style'));
	}

	$this.addCol = function(content, to) {
		// column slice
		$this.show_(content, to, false);
	}

	return $this;
}
