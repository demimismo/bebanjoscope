bebanjoscope = {
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
        var lat = $('section.present').data('lat');
        var lng = $('section.present').data('lng');
        // Reposition the map
        bebanjoscope.map.setView([lat, lng], 7);
        // Move marker
        bebanjoscope.marker.setLatLng(new L.LatLng(lat, lng));
    },

    load_data: function() {
        var sql = new cartodb.SQL({ user: 'maloshumos' });
        // Get slide data from CartoDB and generate slides
        sql.execute("SELECT cartodb_id, ST_X(the_geom) as lng, ST_Y(the_geom) as lat, description, url FROM bebanjoscope order by cartodb_id desc")
          .done(function(data) {
            for(var i in data.rows){
                $('.slides').append([
                    '<section class="entry"  data-cartodb-id="', data.rows[i].cartodb_id,'" data-lat="',data.rows[i].lat,'" data-lng="',data.rows[i].lng,'">',
                        '<div class="content">',
                            '<h2 class="description">', data.rows[i].description,'</h2>',
                            '<h3 class="date">2:30 a.m. 5/31</h3>',
                            '<img src="',data.rows[i].url,'"/>',
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

    hola: function() {
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

bebanjoscope.hola();
