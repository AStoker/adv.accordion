adv.accordion
=============

A knockout binding to transform a configured list into an advanced accordion with weighted tabs.


#Options:
####headerHeight: (string)  
A string which will define the height of the header. 


####toggleZone: (string|function)  
A string which is a selector to an element.  
A function which will return the element itself. If nothing is returned, toggle zone will be the entire header. ex: 
 
	function(tabElement){  
		var $clickableZone = $(tabElement).find(".clickable-zone");
		if($clickableZone.length() > 0) {
			return $clickableZone[0];
		}
	}
	

####afterResizeComplete: function(transitionEvent, transitionedElement)
A function which will execute after the resizing (including any transition) is finished. Variable transitionEvent is passed from CSS Transition Event.

####beforeResize: function(transitionedElement)
A function which will resize immediately before any transition takes into affect before a resize


#Known Bugs:
(10-23-2014): Due to percentages, occasionally there are gaps between panels generally 1px in height.
