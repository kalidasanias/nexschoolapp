/**
 * Created by senthilPeriyasamy on 1/7/2017.
 */

var overlay = {

    openOverlay: function(event) {
        $this = event.target.dataset;
        if (event.target.parentElement.localName === 'a') {
            $this = event.target.parentElement;
            $this.toggle = $($this).data('toggle');
            $this.size = $($this).data('size');
            $this.id = $($this).data('id');
            $this.title = $($this).data('title');
        }
        var from = $this.toggle != null ? $this.toggle : 'from-right';
        $this.size = $this.size != null ? $this.size: '50%';
        this.setToggleSize($this);
        $($this.id).find('.simple-field-hf').text($this.title);
        $('.simple-field-hf').addClass('fc-title-400');
        $($this.id).show();
        $('body').addClass('hide-scrool');
        $($this.id).find('.cd-panel').addClass('is-visible ' + from);
        if (!$this.bgvisible) {
            this.disableBgVisibility($this)
        }
        if ($this.push) {
            this.dataPush($this);
        }
    },

    disableBgVisibility: function($this) {
        $($this.id).find('.cd-panel').css('width', '100%')
        $($this.id).find('.cd-panel').css('height', '100%')
    },

    setToggleSize: function($this) {
        $('.cd-panel-header').css('width', $this.size);
        $('.cd-panel-container').css('width', $this.size);
    },

    dataPush: function ($this) {
        setTimeout(function(){
            $('.navbar-top-md-md').css($this.toggle == 'from-left' ? 'margin-left' : 'margin-right', $this.size);
        }, 200);
    },

    closeOverlay: function (id) {
        setTimeout(function(){
            $('.navbar-top-md-md').css('margin-right', '0%');
            $('.navbar-top-md-md').css('margin-left', '0%');
        }, 300);
        $('body').removeClass('hide-scrool');
        $('body').removeClass('stop-scrolling');
        $(id).find('.cd-panel').removeClass('is-visible');
        $(".cd-panel-content, .ui-tree").scrollTop(0);
        /*$(id).find('.cd-panel-content').empty();*/
    }

}