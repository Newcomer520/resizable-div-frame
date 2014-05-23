(function(window, angular){
	var drtvModuleName = 'ng-sdiv';

	var templateModule = angular.module('templateMd', []);
	templateModule.run(['$templateCache', function($templateCache) {
		$templateCache.put('template/sdivContainer.html', 
			'<div ng-transclude="" ng-mousemove="resizebarMousemove($event)" class="sdiv-container">\n' +
			'</div>'
		);
		$templateCache.put('template/sdiv.html',
			'<div ng-class="{\'is-last-one\': true}" ng-mouseup="mouseup($event)" ng-mousemove="resizebarMousemove($event)" class="sdiv">\n' + 
			'	<div ng-transclude=""></div><div ng-show="isLastOne==false" ng-mousedown="resizebarMousedown($event)" class="sdiv-resize-region">\n' + 
			'	</div>\n' + 
			'</div>'
		);
	}]);

	angular.module(drtvModuleName, [templateModule.name])
	//.controller('sdivCtrl', sdivCtrlFactory)
	.directive('sdivContainer', sdivContainerFactory)
	.directive('sdiv', sdivFactory);

	sdivCtrlFactory.$inject = ['$scope'];
	function sdivCtrlFactory($scope) {
		var ctrl = this;
		$scope.sdivs = [];
		$scope.direction = undefined;
		ctrl.isMousedown = $scope.isMousedown = false;
		ctrl.currentMovingSdiv = $scope.currentMovingSdiv = undefined;

		ctrl.setDirection = function(direction) {
			$scope.direction = direction;
			angular.forEach($scope.sdivs, function(sdiv) {
				sdiv.direction = direction;
			});
			if (!angular.isDefined(direction))
				alert('eerrrr:\n' + direction + '\n' + $scope.sdivs.length);
		}
		ctrl.addSdiv = function(sdivScope) {
			$scope.sdivs.push(sdivScope);
			
			angular.forEach($scope.sdivs, function(sdiv) {
				sdiv.isLastOne = false;
				sdiv.resize.sdivsLength = $scope.sdivs.length;
			});
			//prevent from direction == undefined
			sdivScope.direction = $scope.direction;
			sdivScope.isLastOne = true;			
			if($scope.sdivs.length > 1) {							
				//前一個的sibling記住自己
				$scope.sdivs[$scope.sdivs.length - 2].nextSibling = sdivScope;
			}

		};
		ctrl.onMousedown = function(sdivScope) {
			document.getSelection().removeAllRanges();
			ctrl.isMousedown = $scope.isMousedown = true;
			ctrl.currentMovingSdiv = sdivScope;
		};
		ctrl.onMouseup = function() {
			ctrl.currentMovingSdiv = undefined;
			ctrl.isMousedown = $scope.isMousedown = false;
		};
	}

	//sdivContainerFactory.$inject = [];
	function sdivContainerFactory()
	{
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'template/sdivContainer.html',
			//templateUrl: './scripts/directive/template/sdiv-container.html',
			scope: {
				directionWay: '@'
			},
			replace: true,
			controller: ['$scope', sdivCtrlFactory],
			compile: function(tElement, tAttrs, $transclude) {
				/*$transclude(scope, function(sdivs) {
					element.empty();
					angular.forEach(sdivs, function(node, idx) {
						element.append(node);
					});
				});*/
				return {
					post: function postLink(scope, element, attrs, ctrl, transclude) {

						var direction = scope.directionWay;

						//attrs.direction = attrs.direction || 'horizontal';
						ctrl.setDirection(direction);
						//scope.containerHeight = angular.element(element).height();
						switch(direction) {
							case 'horizontal':
							default:
								element.addClass('horizontal');
								break;
							case 'vertical':
								element.addClass('vertical');
								break;
						}
						scope.$watch('isMousedown', function(s) {
							//$(document.body).toggleSelection();
							if (!angular.isDefined(ctrl.currentMovingSdiv))
								return false;
							var resize = ctrl.currentMovingSdiv.resize;
							var nResize = ctrl.currentMovingSdiv.nextSibling.resize;
							resize.isUndo = nResize.isUndo = false;
						});
						scope.resizebarMousemove = function(e) {
							if (ctrl.isMousedown !== true)
								return false;
							var resize = ctrl.currentMovingSdiv.resize,
							    nResize = ctrl.currentMovingSdiv.nextSibling.resize;
							//check the minimum width or height
							var offsetX = e.clientX - resize.previous.x,
							    offsetY = e.clientY - resize.previous.y
							switch(attrs.direction) {
								case 'vertical':
									if ((resize.height > resize.height + offsetY && resize.height + offsetY < 50) || (nResize.height > nResize.height - offsetY && nResize.height - offsetY  < 50))
										resize.isUndo = nResize.isUndo = true;
									else
										resize.isUndo = nResize.isUndo = false;
									break;
								case 'horizontal':
								default:
									if ((resize.width > resize.width + offsetX && resize.width + offsetX < 100) || (nResize.width > nResize.width - offsetX && nResize.width - offsetX  < 100))
										resize.isUndo = nResize.isUndo = true;
									else
										resize.isUndo = nResize.isUndo = false;
									break;
							}
							
							nResize.offset.x = -offsetX;
							nResize.offset.y = -offsetY;
							resize.offset.x = offsetX;
							resize.offset.y = offsetY;

							resize.previous.x = e.clientX;
							resize.previous.y = e.clientY;
						};
					}
				};				
			}
			
		};
	}

	//sdivFactory.$inject = [];
	function sdivFactory()
	{
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				isLastOne: '=?'
			},
			require: '^sdivContainer',
			templateUrl: 'template/sdiv.html',
			compile: function(tElement, tAttrs, $transclude) {
				return function postLink (scope, element, attrs, sdivCtrl, transclude) {
					//element.width(element[0].getBoundingClientRect().width);
					//element.height(element[0].getBoundingClientRect().height);
					scope.nextSibling = undefined;
					scope.direction = undefined;
					scope.resize = {					
						offset: {},
						previous: {},
						width: element[0].getBoundingClientRect().width,
						height: element[0].getBoundingClientRect().height,
						sdivsLength: 1,
						windowResize: false
					};
					sdivCtrl.addSdiv(scope);

					scope.$watchCollection('resize.offset', function() {

						if (!angular.isDefined(scope.resize.offset) || !angular.isDefined(scope.resize.offset.x) || !angular.isDefined(scope.resize.offset.y))
							return false;

						var resize = scope.resize;
						//console.log(resize.isUndo);
						if (resize.isUndo == true)					
							return false;
						//console.log('x: ' + resize.offset.x + ', y: ' + resize.offset.y);
						switch (scope.direction) {
							case 'vertical':
								element.height(element[0].getBoundingClientRect().height + resize.offset.y);
								scope.resize.height = element[0].getBoundingClientRect().height;
								break;
							case 'horizontal':
							default:
								element.width(element[0].getBoundingClientRect().width + resize.offset.x);
								scope.resize.width = element[0].getBoundingClientRect().width;
								break;
						}						
					});

					scope.resizebarMousedown = function(e) {
						sdivCtrl.onMousedown(scope);

						scope.resize.previous = {
							x: e.clientX,
							y: e.clientY
						}
						scope.resize.offset = {
							x: 0,
							y: 0
						}
						if (angular.isDefined(scope.nextSibling)) {

							scope.nextSibling.offset = {
								x: 0,
								y: 0
							};
						}
					}
					
					scope.mouseup = function(e) {

						sdivCtrl.onMouseup();
						var resize = scope.resize;
						resize.offset = {};
						resize.previous = {};
					};
					//wataching resize
					angular.element(window).on('resize', function() {
						scope.resize.width = element[0].getBoundingClientRect().width;
						scope.resize.height = element[0].getBoundingClientRect().height;


						var resize = scope.resize;
						if (!angular.isDefined(resize.sdivsLength) || !angular.isDefined(resize.windowResize))
							return false;
						switch (scope.direction) {
							case 'vertical':
								element.height((1 / resize.sdivsLength * 100) + '%' );
								break;
							case 'horizontal':
								element.width((1 / resize.sdivsLength * 100) + '%' );
								break;
						}

						//console.log('window resize');
					});
					angular.element(window).on('mouseup', scope.mouseup);
				};
			}
			
		};
	}
})
(window, window.angular);