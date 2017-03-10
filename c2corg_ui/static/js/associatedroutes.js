goog.provide('app.AssociatedRoutesController');

goog.require('app');

/**
 * @param {!angular.Scope} $scope Scope.
 * @constructor
 * @ngInject
 */
app.AssociatedRoutesController = function($scope, $element) {

  /**
   * @type {Object} activities
   * @export
   */
  this.activities = {};

  /**
   * @type {string} associationsPath
   * @private
   */
  var associationsPath = $element.attr('associations');

  /**
   * @type {Array} associations
   * @export
   */
  this.visibleDocuments = [];

  $scope.$watch(associationsPath, function(){
    $scope.$eval(associationsPath).forEach(function(document, key) {
      angular.forEach(document.activities, function(activity, key) {
        if (this.activities[activity] === undefined) {
          this.activities[activity] = true;
        }
      }, this);
    }, this);
    this.updatevisibleDocuments();
  }.bind(this));

  this.toggleActivity = function(activity) {
    this.activities[activity] = !this.activities[activity];
    this.updatevisibleDocuments();
  };

  this.updatevisibleDocuments = function() {
    this.visibleDocuments = [];
    $scope.$eval(associationsPath).forEach(function(document, key) {
      angular.forEach(document.activities, function(activity, key) {
        if (this.activities[activity] == true) {
          if (this.visibleDocuments.indexOf(document) == -1) {
            this.visibleDocuments.push(document);
          }
        }
      }, this);
    }, this);
  };

};

app.module.controller('AppAssociatedRoutesController', app.AssociatedRoutesController);
