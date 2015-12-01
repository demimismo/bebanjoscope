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
            viewDistance: 1
        });
        Reveal.addEventListener('slidechanged', function(event) {
            var cartodb_id = $('section.present').data('cartodb-id');
            var sql = new cartodb.SQL({ user: 'maloshumos' });
            bebanjoscope.cartodb_layer.setSQL('SELECT * FROM bebanjoscope WHERE cartodb_id='+cartodb_id);
            sql.getBounds('SELECT * FROM bebanjoscope WHERE cartodb_id='+cartodb_id).done(function(bounds) {
              bebanjoscope.map.setMaxBounds(bounds);
            });
        });

    },

    load_data: function() {
        var sql = new cartodb.SQL({ user: 'maloshumos' });
        sql.execute("SELECT * FROM bebanjoscope")
          .done(function(data) {
            for(var i in data.rows){
                var nextSlide = parseInt(i)+1;
                $('.slides').append([
                    '<section class="entry"  data-cartodb-id="', data.rows[i].cartodb_id,'">',
                        '<div class="content">',
                            '<h2 class="description">', data.rows[i].description,'</h2>',
                            '<h3 class="date">2:30 a.m. 5/31</h3>',
                            '<img src="',data.rows[i].url,'"/>',
                        '</div>',
                    '</section>'
                ].join(""));
                bebanjoscope.initialize_reveal();
            }
          })
          .error(function(errors) {
            console.log("errors:" + errors);
          })        
    },

    init: function() {
        cartodb.createVis('map_canvas', 'https://maloshumos.cartodb.com/api/v2/viz/09443b82-5338-11e5-a69b-0e4fddd5de28/viz.json')
            .done(function(vis, layers) {
                bebanjoscope.cartodb_layer = layers[1].getSubLayer(0);
                bebanjoscope.map = vis.getNativeMap();
            });
        bebanjoscope.load_data();
    }
}

bebanjoscope.init();
