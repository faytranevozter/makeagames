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
    onGameOver: function(){
        alert('You Made It!');
    }
    ...
});
```

## The Options
| Preference        | Type      | Default Value                           | Options                                                       | Descriptions                                                                                          |
|-----------------  |---------- |---------------------------------------  |-----------------------------------------------------------    |----------------------------------------------------------------------------------------------------   |
| cols              | number    | 3                                       | > 1 number                                                    | define the columns and rows                                                                           |
| random            | number    | 100                                     | infinity number                                               | how much the puzzle shuffling                                                                         |
| imageLink         | link      | `$this.data('image')`                   | url of image                                                  | the image that will be used as puzzle. the default image is from `data-image` attribute of element    |
| contentBox        | string    | number {i}                              | string or element                                             | the content of each slice box. use `{i}` to convert into ordinal number                               |
| onGameOver        | function  | ```function(){ alert('Game Over'); }``` | function                                                      | function that will called after puzzle solved                                                         |
| containerBorder   | number    | 1                                       | number                                                        | border of container                                                                                   |
| sliceBorder       | number    | 1                                       | number                                                        | border of each slice                                                                                  |
| borderColor       | color     | #222                                    | hexa color, rgb, rgba, true color                             | color of the border                                                                                   |
| borderType        | string    | solid                                   | solid | dashed | dotted | groove | outset | inset | ridge     | border type                                                                                           |

## Changelog

### v2.0.0 - 2016-05-08

- Adding onGameOver handler
- Editable content of each slice

### v1.0.0 - 2016-03-22

- Release version
