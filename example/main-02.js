require.config({
	baseUrl: '',
	paths: {
		'angular': 'vendor/angular/angular',
		'sdiv': 'directive/sdiv',
		'jquery': 'vendor/jquery/jquery'
	},
	shim: {
		'sdiv': {
			deps: ['angular', 'jquery']
		},
		'angular': {
			deps: ['jquery']
		}
	}
});
require(['sdiv'], function() {
	var myApp = angular.module('my-app', ['ng-sdiv']);
	angular.bootstrap(document.body, ['my-app']);
});