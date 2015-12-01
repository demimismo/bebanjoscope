bebanjoscope = {
    coords: [],
    count: 0,
    playAudio: function(sound) {
      var audio = document.createElement('audio');
      audio.src = '/assets/'+sound+'.mp3';
      audio.play();
    },

    initialize_reveal: function() {
        Reveal.initialize({
            controls: true,
            progress: false,
            slideNumber: false,
            history: true,
            keyboard: true,
            center: false,
            touch: true,
            loop: false,
            fragments: false,
            embedded: false,
            transition: 'none',
            viewDistance: 1,
            width: 500,
            height: 900,
            minScale: 1,
            maxScale: 1
        });
        Reveal.addEventListener('slidechanged', bebanjoscope.update_map);
    },

    update_map: function(event) {
        var count = 0;
        var cartodb_id = $('section.present').data('cartodb-id');
        var lat = $('section.present').data('lat');
        var lng = $('section.present').data('lng');
        // Reposition the map
        bebanjoscope.map.setView([lat, lng], 4);
        // Move marker
        bebanjoscope.marker.setLatLng(new L.LatLng(lat, lng));

        // Play audio
        if (bebanjoscope.count === 0) {
          bebanjoscope.playAudio('imac');
        } else {
          bebanjoscope.playAudio('woosh');    
        }
        bebanjoscope.count++;
    },

    load_data: function() {
        var sql = new cartodb.SQL({ user: 'maloshumos' });
        // Get slide data from CartoDB and generate slides
        sql.execute("SELECT bebanjoscope.cartodb_id, ST_X(bebanjoscope.the_geom) as lng, ST_Y(bebanjoscope.the_geom) as lat, description, url, avatar_url FROM bebanjoscope, bebanjoscope_users where bebanjoscope.user_id = bebanjoscope_users.cartodb_id order by creation_date desc")
          .done(function(data) {
            for(var i in data.rows){
                $('.slides').append([
                    '<section class="entry"  data-cartodb-id="', data.rows[i].cartodb_id,'" data-lat="',data.rows[i].lat,'" data-lng="',data.rows[i].lng,'">',
                        '<div class="content">',
                          '<div class="row">',
                            '<img src="',data.rows[i].url,'" class="entry-picture"/>',
                           '</div>',
                           '<div class="row-bottom">',
                             '<img src="', data.rows[i].avatar_url,'" class="entry-avatar" />',
                             '<h2 class="description"><span class="entry-time">2:30 a.m. 5/31</span>', data.rows[i].description,'</h2>',
                           '</div>',
                        '</div>',
                    '</section>'
                ].join(""));
            }
            // Have slides, can initialize Reveal
            bebanjoscope.initialize_reveal();
            // Move marker to the position of the current slide
            bebanjoscope.update_map();
          })
          .error(function(errors) {
            console.log("errors:" + errors);
          })
    },

    init: function() {
        // Create map and add one marker
        cartodb.createVis('map_canvas', 'https://maloshumos.cartodb.com/api/v2/viz/09443b82-5338-11e5-a69b-0e4fddd5de28/viz.json')
            .done(function(vis, layers) {
                bebanjoscope.map = vis.getNativeMap();
                // Add a lonely marker
                bebanjoscope.marker = L.marker([37.71859033, -3.69140625]).addTo(bebanjoscope.map);
                bebanjoscope.load_data();
            });
    }
}

bebanjoscope.init();
