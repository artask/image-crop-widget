(function ($) {
    
Drupal.behaviors.image_crop_widget = {
  attach: function (context, settings) {
    // wait till 'fadeIn' effect ends (defined in filefield_widget.inc)
    //setTimeout(attachJcrop, 1000, context);
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
            //console.log(widget);
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
            el.addEventListener('update', function (ev) {
                //console.log('vanilla update', ev);
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
                    //console.log(window.URL.createObjectURL(blob));
                    html = '<img src="' + window.URL.createObjectURL(blob) + '" />';
                    $(el).html(html);
                    $('.cropbox-crop').hide();
                    $('.cropbox-rotate').hide();
                });
            });
        });
    }
  }
};

})(jQuery);
