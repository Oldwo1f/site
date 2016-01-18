$(document).ready(function() {
	console.log('CALENDAR');
    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
        header: {
		    left:   'prev',
		    center: 'title',
		    right:  'next'
		},
		firstDay: 1,
		contentHeight:'auto',
		// height:'150px',
		aspectRatio:'1.5',
		buttonIcons:{
		    prev: 'left-double-arrow',
		    next: 'right-double-arrow',
		},
		lang: 'fr',
		dayNamesShort : ['D', 'L', 'M', 'M', 'J', 'J', 'V'],
		events: {
	        url: '/calendar',
	        type: 'POST',
	        data: {
	            custom_param1: 'something',
	            custom_param2: 'somethingelse'
	        },
	        error: function() {
	            alert('there was an error while fetching events!');
	        },
	        success: function(res) {
	            console.log(res);
	        },
	        color: 'yellow',   // a non-ajax option
	        textColor: 'black' // a non-ajax option
	    },
		 // events: [
	  //       {
	  //           title  : 'Forum Handicap Emploi',
	  //           start  : '2016-01-01',
	  //           color: '#b81e57',
	  //           customfield: 'salaries',
	  //           // rendering: 'background',
	  //           allDay : true
	  //       },
	  //       {
	  //           title  : 'Portes ouvertes - Mission locale meaux',
	  //           color: '#482b63',
	  //           customfield: 'chercheurs',
	  //           // rendering: 'background',
	  //           start  : '2016-01-05',
	  //           end    : '2016-01-08',
	  //           allDay : true
	  //       },
	  //       {
	  //           title  : 'Autre Evenement',
	  //           color: '#b81e57',
	  //           customfield: 'entreprises',
	  //           // rendering: 'background',
	  //           start  : '2016-01-17',
	  //           // end    : '2016-01-08',
	  //           allDay : true
	  //       },
	  //       {
	  //           title  : 'event3',
	  //           color: '#c79b35',
	  //           customfield: 'partenaires',
	  //           // rendering: 'background',
	  //           start  : '2016-01-25T12:30:00',
	  //           allDay : true 
	  //       }
   //  	],
	    eventRender: function (event, element, view) { 
	        if(event.end){
	        	var i = moment(event.end).diff( moment(event.start),'days')
	        	for(j = i; i>0 ; i--){
	        		var dateString = moment(event.start).add(i-1,'days').format('YYYY-MM-DD');
	       			$('#calendar').find('.fc-day-number[data-date="' + dateString + '"]').addClass('calendar'+event.category).attr('title',event.title);
	        	}	
	        }else{
	        	var dateString = moment(event.start).format('YYYY-MM-DD');
	       		$('#calendar').find('.fc-day-number[data-date="' + dateString + '"]').addClass('calendar'+event.category).attr('title',event.title);
	        }
	     }
    })

});