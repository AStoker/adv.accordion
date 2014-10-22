define(['jquery', 'knockout'], function($, ko) {

	var activeWeights = ko.observable(0),
		inactiveTabHeights = ko.observable(0),
		activeTabs = ko.observable(0),
		pfx = ["webkit", "moz", "MS", "o", ""];
		
	function PrefixedEvent(element, type, callback) {
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) {
				type = type.toLowerCase();
			}
			element.addEventListener(pfx[p]+type, callback, false);
		}
	}

	function calculateHeights(arrayOfSections, $selectedHeader) {
		if(!$selectedHeader){
			throw ("Multi-Accordion -> calculateHeights: No selected header defined");
		}
		
		var $selectedTab = $selectedHeader.parent(),
			$selectedTc = $selectedTab.children("[data-accordion='content']"),
			$selectedTh = $selectedTab.children("[data-accordion='header']"),
			selectedTcVisible = !($selectedTab.height() <= $selectedTh.height()),
			$t = null,
			$tc = null,
			$th = null,
			$tcVisible = null;

		console.log($selectedTab.height());
		console.log($selectedTh.height());
		console.log(!($selectedTab.height() <= $selectedTh.height()));
		console.log(selectedTcVisible);			

		//Reset variables
		activeTabs(0), 
		inactiveTabHeights(0), 
		activeWeights(0);
		
				//Sum active weights and inactive tab header height (taking into account selected tab which does not have values applied yet --this enables some smoother css transitions--)
		for (var i = 0; i < arrayOfSections.length; i++) {	
			$t = $(arrayOfSections[i]);
			$tc = $t.children("[data-accordion='content']");
			$th = $t.children("[data-accordion='header']");
			tcVisible = !($t.height() <= $th.height());	
			
			if (tcVisible && $selectedTab[0] !== $t[0]) { 
			
				activeWeights(activeWeights() + $t.data("weight")); //Add to sum of active weights
				activeTabs(activeTabs() + 1);
				
			} else if ($selectedTab[0] === $t[0]) { //Check to see if selected tab is going to be hidden or visible
			
				if(tcVisible){ //then will be inactive (
					inactiveTabHeights(inactiveTabHeights() + $th.height());
				} else { //it will become active
					activeWeights(activeWeights() + $t.data("weight")); //Add to sum of active weights
					activeTabs(activeTabs() + 1);
				}		
			} else { //The tab is hidden, so it is inactive			
				inactiveTabHeights(inactiveTabHeights() + $th.height());				
			}
		}
		
		
				
		//Set heights (will move to knockout binding to be dynamic) for ACTIVE tabs
		//If expanding tab, then set heights from top down (heights will be collapsing)
		//Else if collapsing tab, set heights from bottom top (heights will be increasing)
		if (selectedTcVisible){  //Content of tab is visible, thus it it will become invisible, and we are collapsing (bottom up)			
			for (var x = arrayOfSections.length-1; x >= 0; x--) {
				setHeight(arrayOfSections[x], $selectedTab);			
			}
		} else {//Content of tab is not visible, thus it will be visible, and we are expanding (top down)
			for (var p = 0; p < arrayOfSections.length; p++) {
				setHeight(arrayOfSections[p], $selectedTab);			
			}
		}
		
	}
	
	function setHeight(tab, $selectedTab){
		var $t = $(tab),
			$tc = $t.children("[data-accordion='content']"),
			$th = $t.children("[data-accordion='header']"),
			tcVisible = !($t.height() <= $th.height()),
			tabPercentage = 0,
			tabHeight = 0;				
		
		if (tcVisible && $selectedTab[0] !== $t[0]) { //Tab isn't selected tab and is visible, which means it just needs to be resized
			tabPercentage = (($t.data("weight") / activeWeights()) * 100).toFixed(1);
			
			if(activeTabs() === 0){//Can't divide by 0, set height to header height
				tabHeight = $th.height();
			} else {
				tabHeight = (inactiveTabHeights() / activeTabs());		
			}						
			
			animateHeight({ $tab: $t, 
							tabPercentage: tabPercentage, 
							tabHeight: tabHeight, 
							speed: 500});			
			//$t.css("height", "calc(" + tabPercentage + "% - " + tabHeight + "px)");
			
		} else if ($selectedTab[0] === $t[0]){// Tab is selected tab, thus needs to either hide, or show with appropriate size
			tabPercentage = (($t.data("weight") / activeWeights()) * 100).toFixed(1);
				
			if(activeTabs() === 0){//Can't divide by 0, set height to header height
				tabHeight = $th.height();
			} else {
				tabHeight = (inactiveTabHeights() / activeTabs());		
			}							
				
			if(tcVisible){ //If tab is visible, then we're toggling to hide, else toggling to show.
				animateHeight({ $tab: $t,
							speed: 500});	
				//$t.css("height", ""); //remove any specified height off tab (tab will be size of header)
				PrefixedEvent($t[0], "TransitionEnd", function(transitionEvent){
					//$tc.hide();
				})
				//$tc.hide();
			} else {
				animateHeight({ $tab: $t, 
							tabPercentage: tabPercentage, 
							tabHeight: tabHeight, 
							speed: 500});	
				//$t.css("height", "calc(" + tabPercentage + "% - " + tabHeight + "px)");
				PrefixedEvent($t[0], "TransitionEnd", function(transitionEvent){
					//$tc.show();
				})
				//$tc.show();
			}				
		
		} else if (!(tcVisible) && $selectedTab[0] !== $t[0]){ //The tab is hidden and not the selected tab, so it is inactive
			animateHeight({ $tab: $t,
							speed: 500});	
			//$t.css("height", "");//remove any specified height off tab (tab will be size of header)
		}
	}
	
	function animateHeight(options){
		var $tab = options.$tab || null,
			tabPercentage = options.tabPercentage || null,
			tabHeight = options.tabHeight || null, 
			speed = options.speed || null;
			
					
		var calcHeight = $tab.children("[data-accordion='header']").height();
		
		if (tabPercentage && tabHeight){
			calcHeight = "calc(" + tabPercentage + "% - " + tabHeight + "px)";
		} else if (tabPercentage && !tabHeight) {
			calcHeight = tabPercentage + "%";
		} else if (tabHeight && !tabHeight){
			calcHeight = tabHeight + "px";
		}
		
		if(!speed){
			speed = 500;
		}
		
		$tab.css("height", calcHeight);
/*
		$tab.animate({
			height: calcHeight
		}, {
			duration: speed,
			complete: function() {
				console.log("Finished animating " + $tab);
			}
		});
*/
	}
	
	ko.bindingHandlers.multiAccordion = {
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			// This will be called when the binding is first applied to an element
			// Set up any initial state, event handlers, etc. here
			
			
			//Hide all accordion content divs
			//$(element).find("[data-accordion='content']").hide();
			
			//Register click events on headers to reveal content 
			$(element).find("[data-accordion='header']").each(function(i, e) {
				$(e).on("click", function(ev) {					
					calculateHeights($(element).children(), $(e)); //recalculate the heights
				});
			});
			
			$(element).children().each(function(i, e){
				$(e).data("accordionID", i);
				$(e).height($(e).children("[data-accordion='header']").height());
			});
			
			//On initial load, resize heights with first one to be active
			calculateHeights($(element).children(), $(element).children().first().children("[data-accordion='header']").first()); //Passing all the accordion sections and the first accordion section
		},
		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			// This will be called once when the binding is first applied to an element,
			// and again whenever any observables/computeds that are accessed change
			// Update the DOM element based on the supplied values here.
			//console.log("bar");
		}
	};
});
