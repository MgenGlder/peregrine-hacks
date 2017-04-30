$.ajax({
        'async': false,
        'global': false,
        'url': "./SpaceApps/src/population_data.json",
        'dataType': "json",
        'success': function (data) {
          counties = data.zone_human_population;
          var largestPop2015 = 0;
          var largestPop2010 = 0;
          var largestPop2005 = 0;
          var largestPop2000 = 0;
          for (var county of counties) {
              console.log('running county');
            if (county.population_by_year['2000'] > largestPop2000) {
                largestPop2000 = +county.incits_id;
            }
            else if (county.population_by_year['2005'] > largestPop2005) {
                largestPop2005 = +county.incits_id;
            }
            else if (county.population_by_year['2010'] > largestPop2010) {
                largestPop2010 = +county.incits_id;
            }
            else if (county.population_by_year['2015'] > largestPop2015) {
                largestPop2015 = +county.incits_id;
            }
          }
          console.log(`Largest 2015 pop was ${largestPop2015}\nLargest 2010 pop was ${largestPop2010}\nLargest 2005 pop was ${largestPop2005}\nLargest 2000 pop was ${largestPop2000}`)
        }
      });