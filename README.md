#Make A Games

Create and Play a puzzle game with your settings. Uses CSS3 and Jquery to make it work.

[See Demo](http://www.elfay.id)


##Requirement
- jQuery library
- Makeagames Javascript
- Makeagames CSS stylesheet

##How to use
In the page `<head>` you'll need to load the requisite files
```html
<head>
<!-- ... -->
<script src="js/jquery.min.js"></script>
<script src="js/makeagames.min.js"></script>
<link rel="stylesheet" href="css/makeagames.min.css" type="text/css" />
<!-- ... -->
</head>
```
####HTML:
```html
<div id="example" data-image="path/to/your/images.jpg"></div>
```
####Basic usage:
```js
$('#example').makeagames();
```

####Or with your option:
```js
$('#example').makeagames({
	cols: 5,
	random: 100
});
```

####Or setting image from option:
```js
$('#example').makeagames({
	cols: 5,
	random: 100,
	imageLink: 'path/to/your/images.jpg'
});
```

####Or with onGameover handler:
```js
$('#example').makeagames({
    ...
   'onGameOver': function(seconds, step){
        alert('Game Oversss!! in ' + seconds + ' seconds and ' + step + ' steps.');
    },
    ...
});
```

####Or with keyboardPlay handler:
```js
$('#example').makeagames({
    ...
    'keyboardPlay': true,
    'keyboardCode': {
    	"up": 38, 
    	"down": 40, 
    	"right": 39, 
    	"left": 37
    },
    ...
});
```
See [Refference Keyboard Code](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)

####Or with imageSize handler:
```js
$('#example').makeagames({
    ...
    'imageSize': '500',
    'resizeImage': 'horizontal',
    ...
});
```
Note : 
**image** : adjust image size
**auto** : adjust size to parent width
**(n) px** : resize to (n) px

## The Options
| Preference      | Type            | Default Value                            | Options                           | Descriptions                                                                                       |
|-----------------|-----------------|------------------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------|
| cols            | number          | 3                                        | > 1 number                        | define the columns and rows                                                                        |
| random          | number          | 100                                      | infinity number                   | how much the puzzle shuffling                                                                      |
| imageLink       | string          | `$this.data('image')`                    | url of image                      | the image that will be used as puzzle. the default image is from `data-image` attribute of element |
| contentBox      | string          | ""                                       | string or element                 | the content of each slice box. use `{i}` to convert into ordinal number                            |
| onGameOver      | function        | ```function(){ alert('Game Over'); }```  | function                          | function that will called after puzzle solved                                                      |
| containerBorder | number          | 1                                        | number                            | border of container                                                                                |
| sliceBorder     | number          | 1                                        | number                            | border of each slice                                                                               |
| borderColor     | color           | #222                                     | hexa color, rgb, rgba, true color | color of the border                                                                                |
| borderType      | string          | solid                                    | solid                             | dashed                                                                                             |
| timerBox        | element         | $('#mag-timer')                          |                                   | Element to display a timer                                                                         |
| stepBox         | element         | $('#mag-step')                           |                                   | Element to display a step                                                                          |
| keyboardPlay    | boolean         | false                                    | true / false                      | use keyboard to play the game                                                                      |
| keyboardCode    | array / json    | {"up":38,"down":40,"right":39,"left":37} | keyboard number                   | what key to move the puzzle                                                                        |
| keyboardReverse | boolean         | false                                    | true / false                      | reverse movement                                                                                   |
| imageSize       | string / number | image                                    | image / auto / (n) px             | determine size the game.                                                                           |
| resizeImage     | string          | horizontal                               | horizontal / vertical             | direction to resize if imageSize is set to (n)px                                                   |

## Changelog

### v3.0.0 - 2016-10-17

- Play with keyboard
- Non Square Image
- Auto Resize Image
- Etc..
- Fixed Lot of Bug

### v2.0.0 - 2016-05-08

- Adding onGameOver handler
- Editable content of each slice

### v1.0.0 - 2016-03-22

- Release version
