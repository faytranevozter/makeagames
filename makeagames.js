$.fn.makeAGames = function(options){

	// lists of variable
	var $this,imageWidth,imageHeight,containerSize,colSize,topN,leftN,currentRow,currentCol,box_content,gameOver,timer,startTimer,countdown,step;
	var rules = [];
	gameOver = false,startTimer = false,timer = 0,step = 0;
	
	// define variable this
	$this = $(this);

	var defaults = {
		'cols'  			: 4, // 3 for now
		'random'			: 100,
		'imageLink' 		: $this.data('image'),
		'animation' 		: true,
		'contentBox'		: "{i}",
		'onGameOver' 		: function(timer){ alert('Complete in ' + timer + ' seconds.'); },
		'containerBorder'	: 1,
		'sliceBorder'		: 1,
		'borderColor'		: '#222',
		'borderType'		: 'solid',
		'timerBox'  		: $('#mag-timer')
	};

	option = (typeof options == 'undefined') ? {} : options;

	var setting = $.extend(defaults, option);

	imgames = new Image();
	imgames.onerror = function() {
		show_("Image is not Found.", $this);
	};
	imgames.onload = function() {
		// set height and width
		imageWidth = imgames.width;
		imageHeight = imgames.height;
		// the container size
		containerSize = imageWidth+(setting.containerBorder*2)+(setting.sliceBorder*setting.cols*2);
		// column size
		colSize = Math.round(imageWidth/setting.cols);

		// create base container for slices image
		$this.css({width: containerSize, height: containerSize, border: setting.containerBorder + 'px ' + setting.borderType + ' ' + setting.borderColor });

		// adding the column style
		addStyle('.mag-slice {width:' + colSize + 'px; height:' + colSize + 'px; border: ' + setting.sliceBorder + 'px ' + setting.borderType + ' ' + setting.borderColor + '}');
		addStyle('.mag-bg {background-image: url(\'' + setting.imageLink + '\')}');

		// adding the column
		for (var i = 1; i <= (setting.cols*setting.cols); i++) {
			box_content = setting.contentBox ? setting.contentBox.replace("{i}", i) : '';
			addCol('<div mag-i="' + i + '" mag-p="' + i + '" class="mag-slice mag-bg mag-i-n-' + i + ' mag-bg-n-' + i + '">' + box_content + '</div>', $this);
			currentRow = Math.floor((i-1)/setting.cols);
			currentCol = ((i % setting.cols == 0 ? setting.cols : i % setting.cols)-1);
			leftN = currentCol*colSize;
			topN = currentRow*colSize;
			leftPosition = leftN+((currentCol)*2)+setting.containerBorder;
			topPosition = topN+((currentRow)*2)+setting.containerBorder;
			xBg = leftN;
			yBg = topN;
			addStyle('.mag-i-n-' + i + '{top:' + topPosition + 'px; left:' + leftPosition + 'px}');
			addStyle('.mag-bg-n-' + i + '{background-position-y:' + -yBg + 'px; background-position-x:' + -xBg + 'px}');
			
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

		// randoming
		var r_n_b = (setting.cols*setting.cols);
		var r_n_b_r = rules[r_n_b];
		var r_n_b_r_o = r_n_b_r[Math.floor(Math.random() * r_n_b_r.length)];
		for (var i = 1; i <= setting.random; i++) {
			moveTo($('.mag-slice.mag-i-n-' + r_n_b_r_o), $('.mag-slice.mag-blank'), {rules: rules});
			r_n_b_r = rules[r_n_b_r_o];
			r_n_b_r_o = r_n_b_r[Math.floor(Math.random() * r_n_b_r.length)];
		};

		$('.mag-slice').click(function(){
			// step
			step++;

			if ( ! startTimer) {
				startTimer = true;
				// start counting
				countdown = setInterval(counting, 1000);
			}
			if ( ! gameOver) {
				moveTo($(this), $('.mag-slice.mag-blank'), {rules: rules});
				if (checkIfComplete()) {
					// stop counting
					clearInterval(countdown);
					// call onGameOver function
					setting.onGameOver.call($this, timer, step);
					// disable the click event
					gameOver = true;
				};
			};
			return false;
		});
	};

	// image from url
	imgames.src = setting.imageLink;

	// timer 0
	$(setting.timerBox).text(0);
	
	function counting(){
		timer++;
		$(setting.timerBox).text(timer);
	}

}

function show_(errormsg,element,replace){
	if (typeof replace == 'undefined') { replace = false; } else { replace = replace; };
	if (replace) { $(element).html(errormsg); } else { $(element).append(errormsg); };
}

function addCol(content, to) {
	show_(content, to, false);
}

function addStyle(css) {
	if ( ! $('style#makeagames-style').length) {
		show_('<style id="makeagames-style" type="text/css"></style>', $('head'));
	}
	show_(css, $('style#makeagames-style'));
}

function moveTo(from, to, someoption){
	var defaultopt = {
		'rules' 			: [], 
		'uniqueAttr'		: 'mag-i',
		'classReverse'		: 'mag-i-n-'
	};
	myoption = (typeof someoption == 'undefined') ? {} : someoption;
	var mysetting = $.extend(defaultopt, myoption);

	var clicked = parseInt($(to).attr(mysetting.uniqueAttr));
	var blanked = $(from).attr(mysetting.uniqueAttr);
	var moveable = $.inArray(clicked, mysetting.rules[blanked]) >= 0 ? true : false ;
	if (moveable) {	
		$(to).attr(mysetting.uniqueAttr, blanked).removeClass(mysetting.classReverse + clicked).addClass(mysetting.classReverse + blanked);
		$(from).attr(mysetting.uniqueAttr, clicked).removeClass(mysetting.classReverse + blanked).addClass(mysetting.classReverse + clicked);
	}
}

function randomize(blank, some_o) {
	var default_o = {
		'rules' 			: [], 
		'uniqueAttr'		: 'mag-i',
		'classReverse'		: 'mag-i-n-'
	};
	my_o = (typeof some_o == 'undefined') ? {} : some_o;
	var my_s = $.extend(default_o, my_o);
}

function checkIfComplete()
{
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
