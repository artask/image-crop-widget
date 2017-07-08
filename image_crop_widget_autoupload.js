/*
 * Behavior for the automatic file upload
 */

(function ($) {
  Drupal.behaviors.autoUpload = {
    attach: function(context, settings) {
        //$('.form-item .form-submit[value=Upload]', context).hide();
        $('.form-item .form-file', context).change(function() {
            $parent = $(this).closest('.form-item');
            console.log($('.form-submit[value=Upload]', $parent));
            $('.form-submit[value=Upload]', $parent).mousedown();

        });
    }
  };
})(jQuery);
