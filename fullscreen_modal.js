(function(window, $){

  var fs_timeout,
      keyup_enable = false,
      fs_timeout_counter = 2000,
      _fs_modal = function(options) {

        this.options = $.extend({
          message   : 'Insert text here.',
          type      : 'info', // [info, success, error, warning]
          autoclose : true,
          timeout   : 200
        }, options);

        var elements = create(this.options);

        this.modal = elements.modal;
        this.message = elements.message;

        var fn = ($.fn.bind) ? 'bind' : 'on';
        this.modal[fn]('click', close);
        $('body')[fn]('keyup', close);

        return this;

      },
      close = function() {

        if( keyup_enable ) {
          var self = $('.fsModalContainer');

          self.fadeOut(300, function() {
            keyup_enable = false;

            if( fs_timeout ) {
              clearTimeout(fs_timeout);
            }
          });
        }

      },
      create = function(options) {
        var modal = $('<div class="fsModalContainer '+ options.type +'"></div>').appendTo('body'),
            message = $('<p class="fsMessage">'+ options.message +'</p>').appendTo(modal);

        return {
          modal: modal,
          message: message
        };
      };

  _fs_modal.prototype.open = function() {

    var self = this;

    $('input').blur();

    this.modal.fadeIn(300, function() {

      if( self.options.autoclose ) {
        fs_timeout = setTimeout(self.close, fs_timeout_counter);
      }

      keyup_enable = true;
    });

  };

  _fs_modal.prototype.close = function() {
    close.call(this.modal, []);
  };

  _fs_modal.prototype.setOptions = function(options) {

    this.options = $.extend(this.options, options);

    $('.fsMessage', this.modal).text(this.options.message)
                               .parent()
                               .removeClass('info error warning success')
                               .addClass(this.options.type);

    if( fs_timeout ) {
      clearTimeout(fs_timeout);
    }

    if( ! this.options.autoclose ) {
      fs_timeout = undefined;
      if( options.autoclose === undefined ) {
        this.options.autoclose = true;
      }
    } else if( this.options.autoclose ) {
      fs_timeout = setTimeout(this.close, fs_timeout_counter);
    }

  };

  window.fsModal = _fs_modal;

})(window, jQuery);