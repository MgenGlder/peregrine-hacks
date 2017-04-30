var svg,
    path,
    x,
    color,
    g,
    currentYear = "2000";
   
    var getJson = function(year) {
      $.ajax({
        'async': false,
        'global': false,
        'url': "./population_data.json",
        'dataType': "json",
        'success': function (data) {
          data = data.zone_human_population;
          data.forEach(function(d) {
            unemployment.set(d.incits_id, +d.population_by_year[year]);
          });
        }
      });
    };
    function ready(error, us) {
        console.log("in here");
      if (error) throw error;
      getJson(currentYear);
      svg.append("g")
          .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("fill", function(d) { return getColor(d.rate = (unemployment.get(d.id) || 0) / 55015); })
          .attr("d", path)
        .append("title")
          .text(function(d) { return d.rate; });

      svg.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", path);
    }
    var renderMap = function () { 
        svg = d3.select("svg"),
                width = +svg.attr("width"),
                height = +svg.attr("height");

            unemployment = d3.map();

            path = d3.geoPath();

            x = d3.scaleLinear()
                .domain([1, 10])
                .rangeRound([54755, 55015]);

            var length = 10;
            var color = d3.scaleThreshold()
               .domain([2, length])
              .range([d3.rgb("#0000FF"), d3.rgb('#FF0000')]);


            g = svg.append("g")
                .attr("class", "key")
                .attr("transform", "translate(0,40)");

            g.selectAll("rect")
            .data(color.range().map(function(d) {
                d = color.invertExtent(d);
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
                }))
            .enter().append("rect")
                .attr("height", 8)
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", function(d) { return x(d[1]) - x(d[0]); })
                .attr("fill", function(d) { return color(d[0]); });

            g.append("text")
                .attr("class", "caption")
                .attr("x", x.range()[0])
                .attr("y", -6)
                .attr("fill", "#000")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Population Density");

            g.call(d3.axisBottom(x)
                .tickSize(13)
                .tickFormat(function(x, i) { return i ? x : x; })
                .tickValues(color.domain()))
            .select(".domain")
                .remove();

            d3.queue()
                .defer(d3.json, "https://d3js.org/us-10m.v1.json")
                //.defer(d3.tsv, "unemployment.tsv", function(d) { unemployment.set(d.id, +d.rate); })
                .await(ready);
        }
    renderMap();
    var handle = $( "#custom-handle" );
    $( "#slider" ).slider({
    min: 2000,
    max: 2020,
    step: 5,
    change: function (event, ui) {
        console.log(ui.value);
        //getJson(ui.value);
        //$('svg').empty(); //if we want it to look like it's refreshing.
        currentYear = ui.value;
        renderMap();
    },
    create: function() {
        handle.text( $( this ).slider( "value" ) );
    },
    slide: function( event, ui ) {
        handle.text( ui.value );
    }
    });
    $( "input" ).checkboxradio();
    $( "fieldset" ).controlgroup();
   //Basically a jquery like selector, grabs svg element on page
  

    function getColorFromPop(pop, max){
		return getColor(pop/max);
	}

	function getColor(xPercent) {
		var rgb;
		
		r = parseInt(255 * (xPercent));
		g = 0;
		b = parseInt(255 - (255 * (xPercent)));

		rgb = "rgb("+r+","+g+","+b+")";
		
		return rgb;
	}

