(function () {

    'use strict';

    /* Filters */
    com.programmar.core.filter('nl2br', function(){
        return function(text) {
            return text.replace(/\n/g, '<br>');
        };
    });

    com.programmar.core.filter('slice', function() {
        return function(arr, start, end) {
            return (arr || []).slice(start, end);
        };
    });

    com.programmar.core.filter('dateSuffix', function($filter) {
      var suffixes = ["th", "st", "nd", "rd"];
      return function(input) {
        var dtfilter = $filter('date')(input, ' MMM');
        var dtfilterDay = $filter('date')(input, 'dd');
        var day = parseInt(dtfilter.slice(-2));
        var relevantDigits = (day < 30) ? day % 20 : day % 30;
        var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
        return dtfilterDay + suffix + dtfilter;
      };
    });

})();
