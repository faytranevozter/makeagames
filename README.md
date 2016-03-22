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

## Changelog

### v1.0.0 - 2016-03-22

- Release version
