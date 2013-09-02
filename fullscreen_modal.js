(function(window, $) {

  var fs_timeout,
      modal,
      keyup_enable = false,
      fn = ( $.fn.bind ) ? 'bind' : 'on',
      _fs_modal = function(options) {

        var self = this;

        self.options = $.extend(self.reset_options, options);
        modal = create_modal(self.options);

        return self;

      },
      close = function() {

        if( keyup_enable ) {
          modal.fadeOut(300, function() {
            keyup_enable = false;

            if( fs_timeout ) {
              clearTimeout(fs_timeout);
            }
          });
        }

      },
      create_form = function() {

        var self = this;

      },
      create_confirm = function() {

        var buttons_container,
            self             = this,
            message          = $('.fsMessage', modal),
            confirm_button   = $('.fsConfirmButton', modal),
            cancel_button    = $('.fsCancelButton', modal),
            middle_container = $('.fsModalMiddle', modal);

        modal.unbind('click').css('cursor', 'default').addClass('confirm');
        $('body').unbind('keyup');

        if( ! message.length ) {
          message = $('<p class="fsMessage">' + self.options.message + '</p>').appendTo(middle_container);
        }

        if( ! confirm_button.length ) {
          buttons_container = $('<div class="fsButtonsContainer"></div>').appendTo(middle_container);
          confirm_button    = $('<button class="button fsConfirmButton">Confirmar</button>').appendTo(buttons_container);
          cancel_button     = $('<button class="button fsCancelButton">Cancelar</button>').appendTo(buttons_container);
        }

        confirm_button[fn]('click', $.proxy(self.confirm_trigger, self));
        cancel_button[fn]('click', $.proxy(self.cancel_confirm_trigger, self));

      },
      create_alert = function() {

        var self  = this,
            alert = $('.fsMessage', modal);

        modal[fn]('click', close);
        $('body')[fn]('keyup', self.close);

        if( ! alert.length ) {
          alert = $('<p class="fsMessage"></p>').find('.fsModalMiddle').appendTo(modal);
        }
        alert.html(self.options.message);

        return alert;

      },
      create_modal = function(options) {

        return $('<div class="fsModalContainer ' + options.type + '"><div class="fsModalMiddle"></div></div>').appendTo('body');

      },
      set_modal_type = function(modal_type, fsModal) {

        switch(modal_type) {
          case 'form':
            create_form.call(fsModal, []);
            break;
          case 'alert':
            create_alert.call(fsModal, []);
            break;
          case 'confirm':
            create_confirm.call(fsModal, []);
            break;
        }

      };

  _fs_modal.prototype.reset_options = function() {
    this.options = {
      message         : 'Insert text here.',
      type            : 'info', // [info, success, error, warning]
      autoclose       : true,
      timeoutFade     : 200,
      timeoutClose    : 2000,
      modalType       : 'alert',
      confirmCallback : false,
      cancelCallback  : false
    };
  };

  _fs_modal.prototype.open = function() {

    var self = this;

    $('input').blur();

    set_modal_type(self.options.modalType, self);

    modal.fadeIn(this.timeoutFade, function() {
      if( self.options.autoclose && self.options.modalType === 'alert' ) {
        fs_timeout = setTimeout(self.close, self.options.timeoutClose);
      }

      keyup_enable = true;
    });

  };

  _fs_modal.prototype.close = function() {

    close.call(modal, []);

  };

  _fs_modal.prototype.confirm_trigger = function(event) {

    var self = this;

    if( self.options.confirmCallback && typeof self.options.confirmCallback === 'function' ) {
      self.options.confirmCallback();
    }

    self.close();

  };

  _fs_modal.prototype.cancel_confirm_trigger = function(event) {

    var self = this;

    if( self.options.cancelCallback && typeof self.options.cancelCallback === 'function' ) {
      self.options.cancelCallback();
    }

    self.close();

  };

  _fs_modal.prototype.setOptions = function(options) {

    var self = this;

    self.reset_options();
    self.options = $.extend(self.options, options);

    if( modal.find('.fsButtonsContainer').length ) {
      modal.find('.fsButtonsContainer').remove();
    }

    $('.fsMessage', modal).html(self.options.message);
    modal.removeClass('info error warning success confirm').addClass(self.options.type);

    if( fs_timeout ) {
      clearTimeout(fs_timeout);
    }

    if( ! self.options.autoclose ) {
      fs_timeout = undefined;

      if( options.autoclose === undefined && self.options.modalType === 'alert') {
        self.options.autoclose = true;
      }
    } else if( self.options.autoclose && self.options.modalType === 'alert' ) {
      fs_timeout = setTimeout(self.close, self.options.timeoutClose);
    }

    return self;

  };

  window.fsModal = _fs_modal;

})(window, jQuery);