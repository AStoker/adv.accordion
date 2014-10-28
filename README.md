adv.accordion
=============

A knockout binding to transform a configured list into an advanced accordion with weighted tabs.


#Javascript Options:
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
	
####allowCloseAll: boolean (default: true)
A boolean which if true prohibits all the tabs from closing (if default tab is defined, then default tab will be the tab which is displayed if all tabs are attempting to close).

####afterResizeComplete: function(transitionEvent, transitionedElement)
A function which will execute after the resizing (including any transition) is finished. Variable transitionEvent is passed from CSS Transition Event.

####beforeResize: function(transitionedElement)
A function which will resize immediately before any transition takes into affect before a resize


#Known Bugs:
(10-23-2014): Due to percentages, occasionally there are gaps between panels generally 1px in height.  
(10-27-2014): Listening to CSS Transition property to prohibit certain effects from happening in incorrect order. However, not listening to individual css styles like transition-duration.  


#Future Improvements:
1. When collapsing all panels (when default-tab is selected to be opened on collapse all), make the closing transition happen the same time the opening transition is happening for the default tab.  
2. Better managing of state of tabs (Provide functions to toggle tabs for javascript use instead of relying on user click events)

#Untested Features:
1. Dynamically adding panels.  
2. Multiple panels on a page.  
