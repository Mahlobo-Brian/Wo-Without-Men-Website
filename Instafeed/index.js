// ----- Notes -----
// A maximum of 20 posts can be loaded due to the app being in sandbox mode on instagram

// How to get an access token:
// http://jelled.com/instagram/access-token

// API Endpoints:
// https://www.instagram.com/developer/endpoints/

// Model guide example:
// https://www.instagram.com/selcukcura/media/
// {{model.user.username}}, {{likes}} likes

// user data example using userId and accessToken:
// https://api.instagram.com/v1/users/4622774/?access_token=4622774.7cbaeb5.ec8c5041b92b44ada03e4a4a9153bc54

$( window ).on('load', function() {
  
  var feedHTML = 
   // posts
              '<div class="img-featured-container col-md-4">'+
                '<div class="img-backdrop"></div>'+
                '<div class="description-container">'+
                  
                '</div>'+
                '<img src="{{image}}" class="img-responsive">'+
              '</div>'+
    
    // modal
			'<div class="post-modal">'+
				'<div class="btn-close">'+
					'<div class="close-icon">&times;</div>'+
				'</div>'+
				'<img src="{{image}}">'+
			'</div>'
  
  var galleryFeed = new Instafeed({
    target: "instafeed-gallery-feed",
    get: "user",
    userId: 8288857576,
	accessToken: "8288857576.1677ed0.c1c905e60248442dbdeac65e8a660e5c",
    resolution: "standard_resolution",
    useHttp: "true",
    limit: 12,
    template: feedHTML,
    before: function(){
      
      // get user data
      var url = 'https://api.instagram.com/v1/users/' + this.options.userId + '/?access_token=' + this.options.accessToken;

      $.ajax({
        method: 'GET',
        url: url,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (response) {
          // currently being replaced on each 'load more' button click
          $('.post-count').html(response.data.counts.media);
          $('.follower-count').html(response.data.counts.follows);
          $('.following-count').html(response.data.counts.followed_by);
        }
      });

    },
    
    after: function() {
      console.log('after');

      var $headerContainer = $('.header-container'), 
          $imagePost = $('.img-featured-container'),
          totalImages = $imagePost.length,
          $postModalContainer = $('.post-modal-container'),
          $postModal = $('.post-modal'),
          $postModalBackdrop = $('.post-modal-backdrop'),
          counter = 0;
      
      console.log('totalImages', totalImages)
      
      // remove all $headerContainer except one from template function and move to header
      for (i=1; i < totalImages; i++) {
        console.log('remove', i)
        $headerContainer.eq(i).remove();
        $('.header').prepend($headerContainer.eq(0));
        $postModalContainer.prepend($postModal);
      }
      
      $imagePost.on('click', function() {
        var postIndex = $(this).index();
        console.log('clicked post', postIndex);
        $postModal.eq(postIndex).addClass('show');
        $postModalBackdrop.addClass('show');
      });
      
      $('.btn-close').on('click', function() {
        var postIndex = $(this).index();
        console.log('modal closed', postIndex)
        $(this).parent().removeClass('show');
        $postModalBackdrop.removeClass('show');
      });
      
      $postModalBackdrop.on('click', function() {
        $postModal.removeClass('show');
        $postModalBackdrop.removeClass('show');
      });
      
      $(document.documentElement).keydown(function(event) {
        if (event.keyCode == 37) { // left arrow key
          prevModal();
        }
        if (event.keyCode == 39) { // right arrow key
          nextModal();
        }
        if (event.keyCode == 27) { // escape key
          if ($postModal.hasClass('show')) { 
            $postModal.removeClass('show');
            $postModalBackdrop.removeClass('show');
          }
        }
      });
      
      TweenMax.staggerTo($imagePost, 0.5, {autoAlpha:1}, 0.02);
      
      // disable button if no more results to load
      if (!this.hasNext()) {
        console.log('no more posts to load')
        TweenMax.to($btnInstafeedLoad, 0.5, {opacity:0.5, onComplete: function(){
          $btnInstafeedLoad.attr('disabled', 'disabled');
        }}, 0)
      }
      
    }
  });
  
  galleryFeed.run(firstLoad());

  var $btnInstafeedLoad = $("#btn-instafeed-load");

  $btnInstafeedLoad.on('click', function() {
    console.log('btn clicked - load posts')
    galleryFeed.next();
  });

  function firstLoad() {
    console.log('first load');
    
    var tl = new TimelineMax();
    tl.to('body', 0.3, {autoAlpha:1}, 1);
    tl.to('.instafeed-gallery', 0.3, {autoAlpha:1}, 0.2);
    tl.staggerFrom('span', 0.5, {autoAlpha:0, y:10}, 0.05);
    tl.from('.btn', 0.5, {autoAlpha:0, y:20, ease:Power2.easeOut}, 1.5);
  }

  // modal 
  function prevModal() {
    console.log('prev modal')
  }
  
  function nextModal() {
    var postIndex = $('post-modal.show').index();
    counter = postIndex;
    counter++
    console.log('next modal: current index', counter)
  }

  
  
});