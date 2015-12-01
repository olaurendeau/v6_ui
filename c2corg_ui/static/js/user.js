goog.provide('app.UserController');
goog.provide('app.userDirective');

goog.require('app');


/**
 * This directive is used to display the user tools if authenticated or
 * the sign up button if not.
 *
 * @return {angular.Directive} The directive specs.
 * @ngInject
 */
app.userDirective = function() {
  return {
    restrict: 'E',
    scope: {
      'loginUrl': '@appUserLoginUrl'
    },
    controller: 'AppUserController',
    controllerAs: 'userCtrl',
    bindToController: true,
    templateUrl: '/static/partials/user.html'
  };
};


app.module.directive('appUser', app.userDirective);



/**
 * @param {angular.$http} $http
 * @param {app.Authentication} appAuthentication
 * @param {string} apiUrl Base URL of the API.
 * @constructor
 * @export
 * @ngInject
 */
app.UserController = function($http, appAuthentication, apiUrl) {

  /**
   * @type {angular.$http}
   * @private
   */
  this.http_ = $http;

  /**
   * @type {app.Authentication}
   * @export
   */
  this.auth = appAuthentication;

  /**
   * @type {string}
   * @private
   */
  this.apiUrl_ = apiUrl;
};


/**
 * @export
 */
app.UserController.prototype.showLogin = function() {
  window.location.href = this['loginUrl'];
};


/**
 * @export
 */
app.UserController.prototype.logout = function() {
  this.http_.post(this.apiUrl_ + '/users/logout', null, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json'
    }
  }).then(
      goog.bind(this.successLogout_, this),
      goog.bind(this.errorLogout_, this)
  );
};


/**
 * @param {Object} response Response from the API server.
 * @private
 */
app.UserController.prototype.successLogout_ = function(response) {
  this.auth.removeUserData();
  // TODO: show logout confirmation?
};


/**
 * @param {Object} response Response from the API server.
 * @private
 */
app.UserController.prototype.errorLogout_ = function(response) {
  // TODO
  alert('logout error');
  console.log('logout error');
  console.log(response);
};


app.module.controller('AppUserController', app.UserController);
