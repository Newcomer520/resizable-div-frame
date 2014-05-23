Angular Directive: resizable-div-frame
===================

A resizabe container, the container could be divided into several resizable divs.

Example
==================
see the [example](https://rawgit.com/Newcomer520/resizable-div-frame/master/example/test-sdivs.html)
(I use Require.js to build this example.)

Dependencies
===================
Angular, Jquery and the custom style(custom.css)

I didn't remove the dependency of jquery at this moment. Maybe I will do it later.

Usage
===================
###Javascript

```javascript
	var myApp = angular.module('my-app', ['ng-sdiv']);
	angular.bootstrap(document.body, ['my-app']);
```
###Html Markup
Set direction-way to the direction of the container.<br>
the simple resizable sdivs
```html
				<sdiv-container direction-way="horizontal" style="height:150px;width: 97%">
					<sdiv style="width:50%">
						<div>spdiv1</div>
						<div>spdiv1-2</div>
					</sdiv>
					<sdiv style="width:20%;">sdiv2sdiv2sdiv2sdiv2sdiv2sdiv2sdiv2s<br>div2sdiv2sdiv2sdiv2sdiv2sdiv2s<br>div2sdiv2sdiv2sdiv2sdiv2</sdiv>
					<sdiv style="width:10%">sdiv3</sdiv>
					<sdiv style="width:20%">sdiv5</sdiv>
				</sdiv-container>	
```
Nested sdivs
```html
		<sdiv-container direction-way="horizontal" style="height:300px;width:1000px;margin-left:10px;">
			<sdiv style="width:50%">
				<div>spdiv1</div>
				<div>spdiv1-2</div>
			</sdiv>
			<sdiv style="width:20%;">sdiv2sdiv2s</sdiv>
			<sdiv style="width:10%">sdiv3</sdiv>
			<sdiv style="width:20%;">
				<sdiv-container direction-way="vertical" style="height:100%;width:100%;">
					<sdiv style="height:50%">
						<div>vertical 01</div>
						<div>vertical 02</div>
					</sdiv>
					<sdiv style="height:30%;">vertical 03</sdiv>
					<sdiv style="height:19%">vertical 05</sdiv>
				</sdiv-container>
			</sdiv>
		</sdiv-container>
```
