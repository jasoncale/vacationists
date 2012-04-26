// Bloody simple event broadcaster / callback machine. - Jase

var LoudMouth = (function($) {

  var LoudMouth = function (ns) {
    this.namespace = ns;
    this.registeredCallbacks = [];
  }

  LoudMouth.prototype = {
    fireEvent: function (event) {
      // grab any extra parameters
      var args = Array.prototype.slice.call(arguments, 1, arguments.length);

      // fire events that are bound to a dom element
      this.subscribers().trigger(event + "." + this.namespace, args);

      // fire any registered callbacks
      if (this.registeredCallbacks[event] && this.registeredCallbacks[event].length > 0) {

        for (var i=0; i < this.registeredCallbacks[event].length; i++) {
          if (this.registeredCallbacks[event][i] && this.registeredCallbacks[event][i].call)
            this.registeredCallbacks[event][i].apply(this, args);
        };
      };

      return event;
    },

    subscribers: function () {
      return $('.subscriber.' + this.namespace);
    },

    registerCallback: function (event, callback) {
      if (!this.registeredCallbacks[event]) {
        this.registeredCallbacks[event] = [];
      }

      var alreadyRegistered = false;
      for (var i = this.registeredCallbacks[event].length - 1; i >= 0; i--){
        if (this.registeredCallbacks[event][i] === callback) {
          alreadyRegistered = true;
          break;
        }
      };

      if (!alreadyRegistered) {
        this.registeredCallbacks[event].push(callback);
      };
    }
  }

  return LoudMouth;

})(jQuery);