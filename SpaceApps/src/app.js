
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
    var handle = $( "#custom-handle" );
    $( "#slider" ).slider({
    min: 2000,
    max: 2020,
    step: 5,
    change: function (event, ui) {
        console.log(ui.value);
        getJson(ui.value);
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
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var unemployment = d3.map();

    var path = d3.geoPath();

    var x = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([600, 860]);

    var color = d3.scaleThreshold()
        .domain(d3.range(2, 10))
        .range(d3.schemeGreens[9]);

    var g = svg.append("g")
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
        .tickFormat(function(x, i) { return i ? x : x + "%"; })
        .tickValues(color.domain()))
      .select(".domain")
        .remove();

    d3.queue()
        .defer(d3.json, "https://d3js.org/us-10m.v1.json")
        //.defer(d3.tsv, "unemployment.tsv", function(d) { unemployment.set(d.id, +d.rate); })
        .await(ready);
    
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
      getJson("2000");
      svg.append("g")
          .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("fill", function(d) { return color(d.rate = (unemployment.get(d.id) || 0) / 5000); })
          .attr("d", path)
        .append("title")
          .text(function(d) { return d.rate + "%"; });

      svg.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", path);
    }
