// From http://stackoverflow.com/a/23806076/1322410
appDirectives.directive("keepScroll", function(){
  return {
    controller : function($scope){
      var element = null;

      this.setElement = function(el){
        element = el;
      }

      this.addItem = function(item){
        var oldTop = element.scrollTop;
        element.scrollTop = (oldTop + $(item).outerHeight());

        $('.post-image').one('load', function() {
          element.scrollTop = (oldTop + $(item).outerHeight());
        });
      };
    },

    link : function(scope,el,attr, ctrl) {
      ctrl.setElement(el[0]);
    }
  };
});

appDirectives.directive("scrollItem", function(){
  return{
    require : "^keepScroll",
    link : function(scope, el, att, scrCtrl){
      scrCtrl.addItem(el[0]);
    }
  }
});
