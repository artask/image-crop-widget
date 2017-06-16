(function ($) {
    
Drupal.behaviors.image_crop_widget = {
  attach: function (context, settings) {
    // wait till 'fadeIn' effect ends (defined in filefield_widget.inc)
    //setTimeout(attachJcrop, 1000, context);
    //attachJcrop(context);
      attachCroppie(context);
      
    function attachCroppie(context) {
        if ($('.cropbox', context).length == 0) {
            return;
        }
        
        $('.cropbox', context).once(function() {
            var self = $(this);
            var deg = 0;
            //alert("found a cropbox" + self.attr('id'));

            // get the id attribute for multiple image support
            var self_id = self.attr('id');
            var id = self_id.substring(0, self_id.indexOf('-cropbox'));
            // get the name attribute for imagefield name
            var widget = self.parent().parent();
            console.log(widget);
            var el = document.getElementById(self_id);
            var vanilla = new Croppie(el, {
                viewport: { 
                    width: Drupal.settings.image_crop_widget[id].box.box_width, 
                    height: Drupal.settings.image_crop_widget[id].box.box_height 
                },
                boundary: { width: 400, height: 400 },
                showZoomer: true,
                enableOrientation: true,
                size: 'original'
            });
            vanilla.bind({
                url: Drupal.settings.image_crop_widget[id].file,
            });
            el.addEventListener('update', function (ev) {
                $(widget).find(".edit-image-crop-x").val(ev.detail.points[0]);
                $(widget).find(".edit-image-crop-y").val(ev.detail.points[1]);
                $(widget).find(".edit-image-crop-width").val(ev.detail.points[2]-ev.detail.points[0]);
                $(widget).find(".edit-image-crop-height").val(ev.detail.points[3]-ev.detail.points[1]);
                $(widget).find(".edit-image-crop-changed").val(1);
            });
            //on button click
            vanilla.result('blob').then(function(blob) {
                // do something with cropped blob
            });
            
            $('.cropbox-rotate').on('click', function(ev) {
                vanilla.rotate(parseInt($(this).data('deg')));
                deg += parseInt($(this).data('deg'));
                $(widget).find(".edit-image-crop-rotate").val(deg);
            });
            
            $('.cropbox-crop').on('click', function(ev) {
                vanilla.result({
				    type: 'blob',
                    size: {
                        'width': 250
                    }
                }).then(function (blob) {
                    console.log(window.URL.createObjectURL(blob));
                    html = '<img src="' + window.URL.createObjectURL(blob) + '" />';
                    $(el).html(html);
                    $('.cropbox-crop').hide();
                    $('.cropbox-rotate').hide();
                });
            });
        });
    }

    function attachJcrop(context) {
      if ($('.cropbox', context).length == 0) {
        // no cropbox, probably an image upload (http://drupal.org/node/366296)
        return;
      }
      // add Jcrop exactly once to each cropbox
      $('.cropbox', context).once(function() {
        var self = $(this);

        //alert("found a cropbox" + self.attr('id'));

        // get the id attribute for multiple image support
        var self_id = self.attr('id');
        var id = self_id.substring(0, self_id.indexOf('-cropbox'));
        // get the name attribute for imagefield name
        var widget = self.parent().parent();

          if ($(".edit-image-crop-changed", widget).val() == 1) {
              $('.preview-existing', widget).css({display: 'none'});
              $('.jcrop-preview', widget).css({display: 'block'});
          }

        $(this).Jcrop({
          onChange: function(c) {
            $('.preview-existing', widget).css({display: 'none'});
            var preview = $('.imagefield-crop-preview', widget);
            // skip newly added blank fields
            if (undefined == settings.image_crop_widget[id].preview) {
              return;
            }
            var rx = settings.image_crop_widget[id].preview.width / c.w;
            var ry = settings.image_crop_widget[id].preview.height / c.h;
            $('.jcrop-preview', preview).css({
              width: Math.round(rx * settings.image_crop_widget[id].preview.orig_width) + 'px',
              height: Math.round(ry * settings.image_crop_widget[id].preview.orig_height) + 'px',
              marginLeft: '-' + Math.round(rx * c.x) + 'px',
              marginTop: '-' + Math.round(ry * c.y) + 'px',
              display: 'block'
            });
            // Crop image even if user has left image untouched.
            $(widget).siblings('.preview-existing').css({display: 'none'});
            $(widget).siblings(".edit-image-crop-x").val(c.x);
            $(widget).siblings(".edit-image-crop-y").val(c.y);
            if (c.w) $(widget).siblings(".edit-image-crop-width").val(c.w);
            if (c.h) $(widget).siblings(".edit-image-crop-height").val(c.h);
            $(widget).siblings(".edit-image-crop-changed").val(1);
          },
          onSelect: function(c) {
            $(widget).siblings('.preview-existing').css({display: 'none'});
            $(widget).siblings(".edit-image-crop-x").val(c.x);
            $(widget).siblings(".edit-image-crop-y").val(c.y);
            if (c.w) $(widget).siblings(".edit-image-crop-width").val(c.w);
            if (c.h) $(widget).siblings(".edit-image-crop-height").val(c.h);
            $(widget).siblings(".edit-image-crop-changed").val(1);
          },
          aspectRatio: settings.image_crop_widget[id].box.ratio,
          boxWidth: settings.image_crop_widget[id].box.box_width,
          boxHeight: settings.image_crop_widget[id].box.box_height,
          minSize: [Drupal.settings.image_crop_widget[id].minimum.width, Drupal.settings.image_crop_widget[id].minimum.height],
          keySupport: false,
          /*
           * Setting the select here calls onChange event, and we lose the original image visibility
          */
          setSelect: [
            parseInt($(widget).siblings(".edit-image-crop-x").val()),
            parseInt($(widget).siblings(".edit-image-crop-y").val()),
            parseInt($(widget).siblings(".edit-image-crop-width").val()) + parseInt($(widget).siblings(".edit-image-crop-x").val()),
            parseInt($(widget).siblings(".edit-image-crop-height").val()) + parseInt($(widget).siblings(".edit-image-crop-y").val())
          ]
        });
      });
    };
  }
};

})(jQuery);
