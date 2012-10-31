//*////////////////////////////////////////////////////////////////////////////////////////////*//
//   AUTHOR: BEN FREESE             ///////////////////////////////////////////////////////////
//   DATE: OCTOBER 17, 2012       ///////////////////////////////////////////////////////////
//*////////////////////////////////////////////////////////////////////////////////////////////*//

////////////////////////////////////////////////////////////////////////////////////////////////////
//   LOADING   //////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
pageFurniture();

$().ready(
	function(){
		//$(".content").show(); //this only works with display:none;
		
		setTimeout(loaded, 250); //slight delay for loading graphic
		
		function loaded(){			
			setup();
		}
	}
);

////////////////////////////////////////////////////////////////////////////////////////////////////
//   VARIABLES   ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//   VARS: DON'T TOUCH   /////////////////////////////////////////////////////////////////////
var browser = $.browser;
var requiredArray = [];
var supports_SVG = false;
var supports_Canvas = false;
var supports_CSS3 = false;
var dataSet;
var preventContentSelection = true;
var transitionCount = 0;

//   VARS: LISTS   //////////////////////////////////////////////////////////////////////////////
var dynamicPageFurniture = false;
var required_SVG = true;
var required_Canvas = false;
var required_CSS3 = false;
var required_Passed = false;
var isDown = false;
var mouseY;
var spreadsheet = "";
var listOfCountries = ["Afghanistan", "Algeria", "Angola", "Albania", "Argentina", "Armenia", "Antarctica", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bangladesh", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Congo, Democratic Republic of the", "Congo, Republic of the ", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Cyprus, Northern", "Czech Republic", "Denmark", "Djibouti", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "Falkland Islands", "French Southern and Antarctic Lands", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Guatemala", "Guinea", "Guinea Bissau", "Guyane", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, South", "Korea, North", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Mali", "Mauritania", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestinian territories", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "Somaliland", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"]
var listOfTopics = ["Population", "GDP", "Government", "Temperature"];
var activeTopic = "Population";

//   VARS: GLOBE   /////////////////////////////////////////////////////////////////////////////
var defaultsize = 300;
var size = defaultsize;
var transitionSize = defaultsize;
var sizeminmax = [100, 2000];
var zoomScale = 2.5;
var feature;
var ds = "data/dataset.json";
var projection = d3.geo.azimuthal().scale(size).origin([-71.03,42.37]).mode("orthographic").translate([size, size]);
var circle = d3.geo.greatCircle().origin(projection.origin());
var tst = [];
var m0;
var o0;
var lc;
var clrs = ["c36256", "eda45e", "94826b", "eed485", "a6a471", "819e9a", "75a5c2", "736e7e", "936971", "c1b8b4"];
var first = [], last = [], moved = false;
var zoomed = false;
var globeTransitioning = false;
var rotateInterval;
var elapsedDragTime = 0;

var scale = {
       orthographic: size,
       stereographic: size,
       gnomonic: size,
       equidistant: size / Math.PI * 2,
       equalarea: size / Math.SQRT2,
       zoom: size * zoomScale
};

var path = d3.geo.path()
       .projection(projection);

var svg = d3.select(".gl").append("svg:svg")
       .attr("width", size)
       .attr("height", size)
       .on("mousedown", mousedown);

////////////////////////////////////////////////////////////////////////////////////////////////////
//   INIT   ////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function setup(){
       if(preventContentSelection){document.onselectstart = function(){return false;};}
	if(required_SVG){checkSVG();}if(required_Canvas){checkCanvas();}if(required_CSS3){checkCSS3();}processRequired(requiredArray);if(required_Passed == true){loadData();}
}

function loadData(){
	if(spreadsheet.length > 0){
		Tabletop.init({
			key: spreadsheet, callback: processData, simpleSheet: true
		})
	}else{
		init();
	}
	
	function processData(ds){
		dataSet = ds;
		init();
	}
}

function init(){
       $('.content').append(list("Show countries by", listOfTopics, 125, 160, listTopicHandler, true));
       $('.content').append("<br />");
       $('.content').append(list("Countries", listOfCountries, 290, 160, listItemHandler, false));
       initGlobe();
       $(".content").css("visibility", "visible");
	$(".loader").remove();
	//console.log("build successful");
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//   FUNCTIONS   ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
function pageFurniture(){
       if(!dynamicPageFurniture){
              if($('#source').width() + $('#credits').width() > 725 || $('#credits').width() > 450){
                     var dir = "down";
                     var isMoving = false;
                     
                     $('.footer').click(
                            function(){
                                   if(!isMoving){
                                          $('.content').unbind('click');
                                          $('#sourcesCredits').slideToggle('fast', function(){
                                                 if(dir == "down"){
                                                        dir = "up";
                                                        $('#source').html('<div id="sourceLink">&#x25BC; Sources and credits</div>');
                                                        isMoving = false;
                                                        $('.content').click(
                                                               function(){
                                                                      $('.content').unbind('click');
                                                                      $('#sourcesCredits').slideToggle('fast', function(){
                                                                             dir = "down";
                                                                             $('#source').html('<div id="sourceLink">&#x25B2; Sources and credits</div>');
                                                                             isMoving = false;
                                                                      });
                                                               }
                                                        );
                                                 }else{
                                                        dir = "down";
                                                        $('#source').html('<div id="sourceLink">&#x25B2; Sources and credits</div>');
                                                        isMoving = false;
                                                 }
                                          })
                                   }
                                   isMoving = true;
                            }
                     );
                     
                     $('#sourcesCredits').html('<div style="font-weight:bold; line-height:125%;">Sources: ' + '<span style="font-weight:normal;">' + $('#source').html() + '</span></div><div style="height:5px; width:5px;"></div><div style="font-weight:bold;">By: ' + '<span style="font-weight:normal;">' + extractCreditNames('#credits') + '</span></div>');
                     $('#credits').empty();
                     $('#source').html('<div id="sourceLink">&#x25B2; Sources and credits</div>');
                     $("#sourcesCredits").css("width", $('div').first().width() - 19); //19 is padding - 1
                     //$("#sourcesCredits").css("bottom", $(document).height() - $('#source').position().top); <!-- this needs work     
              }
              $("#footerContents").css("visibility", "visible");
       }
}

function extractCreditNames(crd){
       var whoHTML = "";
       var arry = [];
       var start = 0, end = 0;
       var htmlTxt = $(crd).html();
              htmlTxt = htmlTxt.replace(" &amp;", "&nbsp; by");
  
       for(var i = 0; i < htmlTxt.length; i++){              
              if((htmlTxt.charAt(i) == ";" && htmlTxt.charAt(i - 3) == "b" && htmlTxt.charAt(i - 2) == "s" && htmlTxt.charAt(i - 1) == "p") || i + 1 == htmlTxt.length){
                     end = i + 1;

                     if(start < end){
                            var sl = htmlTxt.slice(start, end);
                            if(sl.indexOf("by") >= 0){
                                   sl = sl.slice(2, sl.length);
                                   
                                   if(sl.indexOf("by") >= 0){
                                          sl = sl.replace("&nbsp;", "").replace("by ", "");
                                          arry.push([sl.slice(0, sl.indexOf(" ")), sl.slice(sl.indexOf(" "), sl.length)]);
                                   }else{
                                          sl = sl.slice(2, sl.length).replace("&nbsp;", "");
                                          arry.push(["&", sl]);
                                   }
                            }
                            
                            start = end;
                     }
              }
       }
       
       for(var i = 0; i < arry.length; i++){
              if(i < arry.length - 2){
                     whoHTML += '<a href="http://search.ft.com/search?queryText=%22' + arry[i][1].slice(1, arry[i][1].length).replace(" ","%20") + '%22" target="_blank">' + arry[i][1] + '</a>' + ',';
              }else if(i < arry.length - 1){                     
                     whoHTML += '<a href="http://search.ft.com/search?queryText=%22' + arry[i][1].slice(1, arry[i][1].length).replace(" ","%20") + '%22" target="_blank">' + arry[i][1] + '</a>';
              }else{
                     if(arry[i][0] == "&"){
                            whoHTML += ' and ' + '<a href="http://search.ft.com/search?queryText=%22' + arry[i][1].slice(0, sl.indexOf(" ")) + '%20' + arry[i][1].slice(sl.indexOf(" ") + 1, sl.length) + '%22" target="_blank">' + arry[i][1] + '</a>';
                     }else{
                            whoHTML += ' and ' + '<a href="http://search.ft.com/search?queryText=%22' + arry[i][1].slice(1, arry[i][1].length).replace(" ","%20") + '%22" target="_blank">' + arry[i][1] + '</a>';
                     }
              }
       }
       
       return whoHTML;
}

function checkSVG(){
	try{
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		//supportsSVG = typeof svg.createSVGPoint == 'function';
		supports_SVG = true;
	}catch(e){
	}
	
	requiredArray.push(["SVG", supports_SVG]);
}

function checkCanvas(){
	if(!!(document.createElement('canvas').getContext && document.createElement('canvas').getContext('2d')) == true){
		supports_Canvas = true;
	}
	
	requiredArray.push(["Canvas", supports_Canvas]);
}

function checkCSS3(){
	var prevColor = $('body').css("color");
	
	try{
		$('body').css("color", "rgba(1,5,13,0.44)");
	}catch(e){
	}
	
	supports_CSS3 = $('body').css("color") != prevColor;
	$('body').css("color", prevColor);
		
	requiredArray.push(["CSS3", supports_CSS3]);
}

function processRequired(reqs){
	var fails = 0;
	
	for(var i = 0; i < reqs.length; i++){
		if(reqs[i][1] == false){
			fails++;
		}
	}
	
	if(fails != 0){
		if(fails > 1){
			$.get('http://interactive.ftdata.co.uk/admin/ifIE_Multiple.html', function(data){$('.errorMessage').html(data);});
		}else{	
			$.get('http://interactive.ftdata.co.uk/admin/ifIE_' + reqs[0][0] + '.html', function(data){$('.errorMessage').html(data);});
		}
		
		$('.errorMessageHolder').css("visibility", "visible");
		$('.errorImage').css("visibility", "visible");
		$('.errorMessage').css("visibility", "visible");
		$('.errorBground').css({"visibility": "visible"});
		$('.errorBground').height($('body').height());
		$('.errorBground').width($('.content').parent().width() + 2);
		
		//$('.errorImage').html('<img src="_media/errorMsg.jpg"/>')
		//$(".errorMessageHolder").bind("click", function() {$('.errorMessageHolder').remove();}); //Don't want error popup to close when you click it
		
		if($('.wideWidth').length > 0){
			$('.errorMessage').css("left", "142px");
			$('.errorMessage').width($('.content').parent().width() + 2 - 37 - 284); //37 is padding from the errorMessage <p>
		}else{
			$('.errorMessage').css("left", "50px");
			$('.errorMessage').width($('.content').parent().width() + 2 - 37 - 100); //37 is padding from the errorMessage <p>
		}
	}else{
		$('.errorMessageHolder').remove();
		required_Passed = true;
	}
}

//   FUNCTIONS: LIST   /////////////////////////////////////////////////////////////////////////
function list(t, c, h, w, f, a){ //title, content, height, width, function, top item is active
       var lst = document.createElement("div");
       var itms = document.createElement("div");
       var titl = document.createElement("div");
       var arwup = document.createElement("div");
       var arwdw = document.createElement("div");
       
       if(itms.addEventListener){ //bind doesn't work properly with mousewheels, won't give direction/value
              itms.addEventListener("mousewheel", mouseWheelHandler, false);
              itms.addEventListener('DOMMouseScroll', mouseWheelHandler, false);
       }else{
              itms.attachEvent("onmousewheel", mouseWheelHandler);
       }
       
       $(arwup).addClass("arrowInactive").css("position","relative").css("float","right").html("&#9650;").attr("direction","up");
       $(arwdw).addClass("arrow").css("position","relative").css("float","right").html("&nbsp;&nbsp;&#9660;").attr("direction","down");
       $(titl).addClass("title").html(t).append(arwup).append(arwdw);
       $(itms).addClass("items").css("position","relative").bind('mousemove', listGrab);
       //$(lst).addClass("list").html("<div class='title'>" + t + $(arwup) + "</div>").append(itms).css("width",w);
       $(lst).addClass("list").append(titl).append(itms).css("width",w);
       
       for(var i = 0; i < c.length; i++){
              var itm = document.createElement("div");
              if(i == 0 && a != false){
                     $(itm).addClass("itemOn").html(c[i]).bind("mouseover", f).bind("mouseout", f).bind("click", f).bind("mousedown", f).bind("mouseup", f);
              }else{
                     $(itm).addClass("item").html(c[i]).bind("mouseover", f).bind("mouseout", f).bind("click", f).bind("mousedown", f).bind("mouseup", f);
              }
              $(itms).append(itm);
       }
       
       //console.log($('item').height());
       
       //console.log(c.length * 25 + "  " + h);
       
       if(c.length * 25 < h){ //need to figure out how to get 24 or 25 as height from inside here
              $(arwup).hide();
              $(arwdw).hide();
       }else{
              $(arwup).bind("click", arrowsHandler).attr("scr","no");
              $(arwdw).bind("click", arrowsHandler).attr("scr","no");
       }
       
       $(lst).css("height", h).css("overflow", "hidden");
       
       //var lstHolder = document.createElement("div");
       //$(lstHolder).append(lst).css("height", h).css("overflow", "hidden").css("width", w - 17);
       
       return lst;
}

function listItemHandler(e){
       e.preventDefault();

       if(e.type == "mouseover"){
              //console.log("over");
              //highliteCountry($(this).text());
              //highliteCountry($(this).text());
       }else if(e.type == "mouseout"){
              //console.log("out");
              //resetCountries();
       }else if(e.type == "click"){       
              if($(this).hasClass("itemOn")){
                     $(this).parent().children().removeClass().addClass("item");
                     resetCountries();
              }else{
                     $(this).parent().children().removeClass().addClass("item");
                     $(this).removeClass().addClass("itemOn");
                     highliteCountry($(this).text());
                     gotoCountry($(this).text(), true);
              }
       }else{ // broke this part up for ease on the eyes
              if(e.type == "mousedown"){
                     isDown = true;
                     $('body').bind("mouseup", releasedOutside).bind("mouseleave", releasedOutside);
              }else{
                     isDown = false;
              }
       }
}

function listTopicHandler(e){
       e.preventDefault();
       
       var allowToggleOff = false;

       if(e.type == "mouseover"){

       }else if(e.type == "mouseout"){

       }else if(e.type == "click"){       
              if($(this).hasClass("itemOn")){
                     if(allowToggleOff){
                            $(this).parent().children().removeClass().addClass("item");
                     }
              }else{
                     $(this).parent().children().removeClass().addClass("item");
                     $(this).removeClass().addClass("itemOn");            
                     activeTopic = $(this).text();
                     mapFilter(activeTopic);
              }
       }else{ // broke this part up for ease on the eyes
              if(e.type == "mousedown"){
                     isDown = true;
                     $('body').bind("mouseup", releasedOutside).bind("mouseleave", releasedOutside);
              }else{
                     isDown = false;
              }
       }
}

function releasedOutside(e){
       $('body').unbind("mouseup", releasedOutside);
       isDown = false;
}

function listGrab(e){
       var arrows = [$($(this).siblings()).children()[0], $($(this).siblings()).children()[1]];

       if(isDown){
              var relPos = $(this).offset().top + e.pageY - mouseY;
              var top = parseFloat($(this).parent().offset().top + $($(this).parent().children()[0]).outerHeight() + 1);//1 pixel spacing
              var btm = parseFloat(($(this).height() * -1) + $(this).parent().height() + $(this).parent().offset().top - 1);//1 pixel spacing
              
              if(relPos < top && relPos > btm){
                     $(this).offset({top: $(this).offset().top + e.pageY - mouseY});
                     $(arrows[0]).removeClass().addClass("arrow");
                     $(arrows[1]).removeClass().addClass("arrow");
              }else{
                     if(relPos >= top){
                            $(this).offset({top: top});
                            $(arrows[0]).removeClass().addClass("arrowInactive");
                            $(arrows[1]).removeClass().addClass("arrow");
                     }else{
                            $(this).offset({top: btm});
                            $(arrows[0]).removeClass().addClass("arrow");
                            $(arrows[1]).removeClass().addClass("arrowInactive");
                     }
              }
       }
       
       mouseY = e.pageY;
}

function mouseWheelHandler(e){
       var delta = 0;
       var thiss = this; //IE8 cannot get $(this) DOM data from the wheel handler working with jQuery functions
       var arrows = "";
       
       if(e.preventDefault){
              e.preventDefault();
       }else{
              e.returnValue = false; //ie
              thiss = $(e.srcElement).parent();
              if(thiss.attr('class') == "list"){
                     thiss = $($(e.srcElement).parent().children()[1]);
              }
              arrows = [$($(thiss).siblings()).children()[0], $($(thiss).siblings()).children()[1]];
       }
       
       //once again, need this for IE, can't define the var arrows at the top without throwing an error
       if(arrows.length == 0){ //basically, if not IE
              arrows = [$($(this).siblings()).children()[0], $($(this).siblings()).children()[1]];
       }
       
       if(e.wheelDelta){
              delta = e.wheelDelta;
       }else if(e.detail){
              delta = -e.detail;
       }
       
       if(delta > 0){
              delta = 1;
       }else if(delta < 0){
              delta = -1;
       }
       
       var relPos = $(thiss).offset().top;
       var top = parseFloat($(thiss).parent().offset().top + $($(thiss).parent().children()[0]).outerHeight() + 1);//1 pixel spacing
       var btm = parseFloat(($(thiss).height() * -1) + $(thiss).parent().height() + $(thiss).parent().offset().top - 1);//1 pixel spacing
       var iH = $($(thiss).children()[0]).outerHeight() + 1;
       
       if(relPos + (delta * iH) <= top && relPos >= btm - (delta * iH)){
              $(thiss).offset({top: $(thiss).offset().top + (delta * iH)});
              $(arrows[0]).removeClass().addClass("arrow");
              $(arrows[1]).removeClass().addClass("arrow");
              
              if(relPos + (delta * iH) == top){
                     $(arrows[0]).removeClass().addClass("arrowInactive");
              }else if(relPos == btm - (delta * iH)){
                     $(arrows[1]).removeClass().addClass("arrowInactive");
              }
       }else{       
              if(iH + top > btm){
                     if(relPos + (delta * iH) >= top){
                            $(thiss).offset({top: top});
                            $(arrows[0]).removeClass().addClass("arrowInactive");
                            $(arrows[1]).removeClass().addClass("arrow");
                     }else{
                            $(thiss).offset({top: btm});
                            $(arrows[0]).removeClass().addClass("arrow");
                            $(arrows[1]).removeClass().addClass("arrowInactive");
                     }
              }
       }
}

function arrowsHandler(e){
       if($(this).hasClass("arrow") && $(this).attr("scr") == "no"){
              var lstloc = $($($(this).parent()).parent()).children()[1];
              var dist = 12;
              var relPos = $(lstloc).offset().top;
              var top = parseFloat($(lstloc).parent().offset().top + $($(lstloc).parent().children()[0]).outerHeight() + 1);//1 pixel spacing
              var btm = parseFloat(($(lstloc).height() * -1) + $(lstloc).parent().height() + $(lstloc).parent().offset().top - 1);//1 pixel spacing
              var iH = $($(lstloc).children()[0]).outerHeight() + 1;
              var ar = $(this);
              
              if($(this).attr("direction") == "down"){
                     dist *= -1;
              }
              
              if(relPos + (dist * iH) <= top && relPos >= btm - (dist * iH)){
                     //$(lstloc).offset({top: $(lstloc).offset().top + (dist * iH)});
                     $(this).attr("scr","yes");
                     $(this).siblings().removeClass().addClass("arrow");
                     $(lstloc).animate({
                            top: "+=" + (dist * iH)
                            }, 250, function(){
                            $(ar).attr("scr","no");
                     });

                     if(relPos + (dist * iH) == top || relPos == btm - (dist * iH)){
                            $(this).removeClass().addClass("arrowInactive");
                     }
              }else{
                     if(relPos + (dist * iH) >= top){
                            //$(lstloc).offset({top: top});
                            $(this).attr("scr","yes");
                            $(this).removeClass().addClass("arrowInactive");
                            $(this).siblings().removeClass().addClass("arrow");
                            $(lstloc).animate({
                                   top: 0
                                   }, 250, function(){
                                   $(ar).attr("scr","no");
                            });       
                     }else{
                            //$(lstloc).offset({top: btm});
                            $(this).attr("scr","yes");
                            $(this).removeClass().addClass("arrowInactive");
                            $(this).siblings().removeClass().addClass("arrow");
                            $(lstloc).animate({
                                   top: (($(lstloc).height() + 1) * -1) + ($($(lstloc).parent()).outerHeight() - ($($($($(this).parent()).parent()).children()[0]).outerHeight() + 1))
                                   }, 250, function(){
                                   //complete
                                   $(ar).attr("scr","no");
                            });
                     }
              }
       }else{
              //console.log("not active");
       }       
}

//   FUNCTIONS: GLOBE   //////////////////////////////////////////////////////////////////////
function initGlobe(){
       d3.json(ds, function(collection){
              feature = svg.selectAll("path")
                     .data(collection.features)
                     .enter().append("svg:path")
                     .attr("d", clip)

              feature.append("svg:country").text(function(d){return d.properties.name;});
              feature.append("svg:latitude").text(function(d){return d.position.latitude;});
              feature.append("svg:longitude").text(function(d){return d.position.longitude;});
              //feature.append("svg:population").text(function(d){return d.properties.population;});
              //feature.append("svg:GDP").text(function(d){return d.properties.population;});
              //feature.append("svg:population").text(function(d){return Math.floor(Math.random() * 1000000000);}); //temporary, until you enter all the json data
              
              for(var i = 0; i < listOfTopics.length; i++){
                     feature.append("svg:" + listOfTopics[i]).text(function(d){return d.properties.population;}); 
              }
              
              $('path').bind("mouseover", d3Handler).bind("mouseout", d3Handler).bind("click", d3Handler); //in script.js
              mapFilter(activeTopic);
       });

       d3.select(window).on("mousemove", mousemove).on("mouseup", mouseup);

       d3.select("select").on("change", function() {
              projection.mode(this.value).scale(scale[this.value]);
              refresh(750);
       });

       mouseEventSetup();
       zoomSetup();
}

function mapFilter(t){
      for(var i = 0; i < $(feature)[0].length; i++){
              $(feature[0][i]).css("fill", "#" + colorfy($(feature[0][i]).children(activeTopic).text()));
              
              if(parseFloat($(feature[0][i]).children("longitude").text()) > 280 || parseFloat($(feature[0][i]).children("longitude").text()) < -200){
                     console.log($(feature[0][i]).children("country").text());
              }
       } 
}

function mousedown(){
       if(!globeTransitioning){
              m0 = [d3.event.pageX, d3.event.pageY];
              o0 = projection.origin();
              d3.event.preventDefault();
              first = m0;
              
              accelTime();
       }else{
              m0 = null;
       }
}

function accelTime(){
       rotateInterval = setInterval(function(){count()},10);//acceleration interval
       
       function count(){
              elapsedDragTime++;
       }
}

function mousemove(){
       if(m0 && !globeTransitioning){
              var rotationalRate = size / 50;
              var m1 = [d3.event.pageX, d3.event.pageY];
              var o1 = [o0[0] + (m0[0] - m1[0]) / rotationalRate, o0[1] + (m1[1] - m0[1]) / rotationalRate];
              
              if(o1[0] > 150){
                     o1[0] -= 360;
              }else if(o1[0] < -150){
                     o1[0] += 360;
              }
              
              if(o1[1] > 150){
                     o1[1] -= 360;
              }else if(o1[1] < -150){
                     o1[1] += 360;
              }
              
              projection.origin(o1);
              circle.origin(o1);
              refresh();
              last = m1;
              tst = [o1];
              
              //console.log("position: " + o1);
              
              //console.log("start position: " + m0);
       }
}

function mouseup(){
       if(m0){
              mousemove();
              
              var direction = "east";
              
              if(m0 < last){
                     direction = "west";
              }
              
              gotoCoords(o0, projection.origin(), elapsedDragTime, direction, false);
              m0 = null;
              //fling globe
              //console.log("end position: " + last);
       }
       
       if(first[0] == last[0] && first[1] == last[1]){
              moved = false;
       }else{
              moved = true;
       }
}

function mouseEventSetup(){
       $("body").mousemove(function(e){
              var toolTipWidth =  $(".toolTip").width();
              var toolTipHeight =  $(".toolTip").height();

              $(".toolTip").css({
                     top: (e.pageY + 20) + "px",
                     left: (e.pageX - Math.floor(toolTipWidth / 2)) + "px"
              });
       });
       
       var svgE = document.getElementsByTagName("svg")[0];

       if(svgE.addEventListener){ //bind doesn't work properly with mousewheels, won't give direction/value
              svgE.addEventListener("mousewheel", zoomWheelHandler, false);
              svgE.addEventListener('DOMMouseScroll', zoomWheelHandler, false);
       }else{
              svgE.attachEvent("onmousewheel", zoomWheelHandler);
       }
}

function d3Handler(e){
       if(e.type == "mouseover"){
              lc = $(this).css("fill");
              $(".toolTip").html("<div class='stateName'><b>" + $(this).children("country").text() + "</b>" + "<div style='position:relative; margin-top:2px; width:100%; background:" + lc + "'><div style='text-align:center; font-size:32px; font-weight:bold; color:#fff1e0; padding-left:4px; padding-right:4px; text-shadow: -1px 1px 0px #333, 1px -1px 0px #333, 1px 1px 0px #333, -1px -1px 0px #333;'>" + commafy($(this).children("population").text().replace("undefined","no data")) + "<div style='font-size:12px; line-height:125%; position:relative; top:-2px;'>Residents</div></div>" + "</div>");
              $(".toolTip").css("display", "block");
              var dColor = $.xcolor.opacity(lc, '000000', 0.25);
              $(this).css("fill",dColor.getHex());  
       }else if(e.type == "mouseout"){
              $(this).css('stroke-width', '');
              $(this).css("fill",lc);
              $(".toolTip").css("display", "none");
       }else{
              if(!moved){
                     if(!zoomed){
                            gotoCountry($(this).children("country").text(), false);
                     }else{
                            projection.mode("orthographic").scale(defaultsize);
                            refresh(750);
                            zoomed = false;
                     }
              }
       }
}

function commafy(num){
       var txt = "";
       var j = 0;
       
       if(parseFloat(num)){
              for(var i = num.length % 3 || 3; i < num.length; i += 3){
                     txt += num.substring(j, i) + ",";
                     j = i;
              }
              
              txt += num.substring(j, i);
       }else{
              txt = num;
       }

       return txt;
}

function colorfy(v){
       var clr;
       
       switch(activeTopic){
              case "Population": 
                     if(parseFloat(v) > 500000000){
                            clr=clrs[0];
                     }else if(parseFloat(v) > 250000000){
                            clr=clrs[1];
                     }else if(parseFloat(v) > 100000000){
                            clr=clrs[2];
                     }else if(parseFloat(v) > 50000000){
                            clr=clrs[3];
                     }else if(parseFloat(v) > 25000000){
                            clr=clrs[4];
                     }else if(parseFloat(v) > 10000000){
                            clr=clrs[5];
                     }else if(parseFloat(v) > 5000000){
                            clr=clrs[6];
                     }else if(parseFloat(v) > 2500000){
                            clr=clrs[7];
                     }else if(parseFloat(v) > 1000000){
                            clr=clrs[8];
                     }else{
                            clr=clrs[9];
                     }
                     break;
              case "GDP": 
                     if(parseFloat(v) > 500000000){
                            clr=clrs[5];
                     }else if(parseFloat(v) > 250000000){
                            clr=clrs[3];
                     }else if(parseFloat(v) > 100000000){
                            clr=clrs[1];
                     }else if(parseFloat(v) > 50000000){
                            clr=clrs[7];
                     }else if(parseFloat(v) > 25000000){
                            clr=clrs[2];
                     }else if(parseFloat(v) > 10000000){
                            clr=clrs[4];
                     }else if(parseFloat(v) > 5000000){
                            clr=clrs[8];
                     }else if(parseFloat(v) > 2500000){
                            clr=clrs[0];
                     }else if(parseFloat(v) > 1000000){
                            clr=clrs[6];
                     }else{
                            clr=clrs[9];
                     }
                     break;
              case "Government": 
                     if(parseFloat(v) > 500000000){
                            clr=clrs[1];
                     }else if(parseFloat(v) > 250000000){
                            clr=clrs[8];
                     }else if(parseFloat(v) > 100000000){
                            clr=clrs[6];
                     }else if(parseFloat(v) > 50000000){
                            clr=clrs[3];
                     }else if(parseFloat(v) > 25000000){
                            clr=clrs[0];
                     }else if(parseFloat(v) > 10000000){
                            clr=clrs[2];
                     }else if(parseFloat(v) > 5000000){
                            clr=clrs[7];
                     }else if(parseFloat(v) > 2500000){
                            clr=clrs[4];
                     }else if(parseFloat(v) > 1000000){
                            clr=clrs[5];
                     }else{
                            clr=clrs[9];
                     }
                     break;
              case "Temperature": 
                     if(parseFloat(v) > 500000000){
                            clr=clrs[2];
                     }else if(parseFloat(v) > 250000000){
                            clr=clrs[7];
                     }else if(parseFloat(v) > 100000000){
                            clr=clrs[3];
                     }else if(parseFloat(v) > 50000000){
                            clr=clrs[4];
                     }else if(parseFloat(v) > 25000000){
                            clr=clrs[1];
                     }else if(parseFloat(v) > 10000000){
                            clr=clrs[0];
                     }else if(parseFloat(v) > 5000000){
                            clr=clrs[8];
                     }else if(parseFloat(v) > 2500000){
                            clr=clrs[6];
                     }else if(parseFloat(v) > 1000000){
                            clr=clrs[5];
                     }else{
                            clr=clrs[9];
                     }
                     break;
       };

       return clr;
}

function highliteCountry(c){
       for(var i = 0; i < $(feature)[0].length; i++){
              if($(feature[0][i]).children("country").text() == c){
                     $(feature[0][i]).css("fill", "#333333");
              }else{
                     $(feature[0][i]).css("fill", "#" + colorfy($(feature[0][i]).children(activeTopic).text()));
              }
       }
}

function resetCountries(){
       for(var i = 0; i < $(feature)[0].length; i++){
              $(feature[0][i]).css("fill", "#" + colorfy($(feature[0][i]).children(activeTopic).text()));
       }
}

function refresh(duration) {
       (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
}

function clip(d){
       return path(circle.clip(d));
       
}

function getCountryCoords(c){
       var coords = [];

       for(var i = 0; i < $(feature)[0].length; i++){
              if($(feature[0][i]).children("country").text() == c){
                     coords.push($(feature[0][i]).children("longitude").text(), $(feature[0][i]).children("latitude").text());
              }
       }
       
       return coords;
}

function gotoCoords(s, e, t, d, z){
       elapsedDragTime = 0;
       size = transitionSize;
       updateZoomTools(size);
       clearInterval(rotateInterval);
       globeTransitioning = false;
       
       if(t > 0){
              //console.log("begin: " + s + " end " + e); //where it began before you dragged, where it ended up.
       }
       
       var count = 0;
       var steps = 30;
       var horizontalD = (s[0] - e[0]);
       var verticalD = (s[1] - e[1]);

       if(d == "west"){
              if(horizontalD < 0){
                     horizontalD += 360;
              }else if(horizontalD > 360){
                     horizontalD -= 360;
              }
       }else if(d == "east"){
              if(horizontalD > 0){
                     horizontalD -= 360;
              }else if(horizontalD < -360){
                     horizontalD += 360;
              }
       }
       
       //need to do the same for north / south
              
       //horizontalD *= (steps / t);
       //verticalD *= (steps / t);
       
       steps = steps / (t / 10);
       
       if(horizontalD != 0 && verticalD != 0){
              //console.log("transitioning");
       
              rotateInterval = setInterval(function(){rotate()},10);
              globeTransitioning = true;
       }
       
       var adjusted = [0,0];
       
       function rotate(){
              if(count < steps){
                     count++
                     
                     var section0 = horizontalD / ((count + 1) * steps);
                     var section1 = verticalD / ((count + 1) * steps);
                     
                     section0 = section0 * horizontalD;

                     //console.log(adjusted[0]);
                     
                     
                     
                     console.log(e[0] - section0 + adjusted[0]);
                     
                     var d1 = [e[0] - section0 + adjusted[0], e[1] - section1];
                     projection.origin(d1);
                     circle.origin(d1);
                     refresh();
                     
                     adjusted = [section0, section1];
              }else{
                     clearInterval(rotateInterval);
                     globeTransitioning = false;
              }
       }
}

function gotoCountry(c, z){
       size = transitionSize;
       updateZoomTools(size);
       clearInterval(rotateInterval);
       globeTransitioning = false;
       
       var dOrigin = projection.origin();
       var dDestination = getCountryCoords(c);
       var count = 0;
       var steps = 35;
       
       var horizontalD = dOrigin[0] - dDestination[0];
       var verticalD = dOrigin[1] - dDestination[1];
       var longerD;
       var zoomedFarOut = false;
       
       if(horizontalD < 0){
              horizontalD *= -1;
       }
       
       if(verticalD < 0){
              verticalD *= -1;
       }
       
       if(horizontalD > verticalD){
              longerD = horizontalD;
       }else{
              longerD = verticalD;
       }
       
       steps = Math.ceil((longerD / 80) * steps); //trying to find that perfect "tween to two countries" speed
       
       if(steps > 35 || z == true){
              steps = 35; //For Russia or when zoom is enabled
       }else if(steps < 5){
              steps = 5;
       }
          
       if(dOrigin[0] != dDestination[0] && dOrigin[1] != dDestination[1]){
              rotateInterval = setInterval(function(){rotate()},10);
              globeTransitioning = true;
       }
       
       if(size <= defaultsize){
              zoomedFarOut = true;
       }
       
       function rotate(){
              if(count < steps){
                     count++
                     
                     if(!zoomedFarOut){
                            if(z){
                                   if(Math.floor(count * 2) > steps){
                                          transitionSize = defaultsize + ((defaultsize * zoomScale) - defaultsize) * ((count - Math.floor(steps / 2)) / Math.floor(steps / 2)); //doing this creates the pause. to remove the pause, don't set the size = to this. Instead, just feed this value directly into the scale() on the line below
                                          projection.mode("orthographic").scale(defaultsize + ((defaultsize * zoomScale) - defaultsize) * ((count - Math.floor(steps / 2)) / Math.floor(steps / 2)));
                                   }else{
                                          transitionSize = size + ((defaultsize - size) * (((count *2) - 1) / steps));
                                          projection.mode("orthographic").scale(size + ((defaultsize - size) * (((count *2) - 1) / steps)));
                                   }
                            }
                     }else{
                            if(z){
                                   transitionSize = size + ((defaultsize * zoomScale) - size) * (count / steps);
                                   projection.mode("orthographic").scale(size + ((defaultsize * zoomScale) - size) * (count / steps));
                            }
                     }
                     
                     var section0 = (dOrigin[0] - dDestination[0]) * (count / steps);
                     var section1 = (dOrigin[1] - dDestination[1]) * (count / steps);                            
                     var d1 = [dOrigin[0] - section0, dOrigin[1] - section1];
                     projection.origin(d1);
                     circle.origin(d1);
                     refresh();
                     updateZoomTools(transitionSize);
              }else{
                     updateZoomTools(transitionSize);
                     clearInterval(rotateInterval);
                     globeTransitioning = false;
                     
                     if(z){
                            size = defaultsize * zoomScale;
                     }else{
                            size = transitionSize;
                     }
              }
       }
}

function zoomWheelHandler(e){
       var delta = 0;
       var thiss = this; //IE8 cannot get $(this) DOM data from the wheel handler working with jQuery functions
       
       if(e.preventDefault){
              e.preventDefault();
       }else{
              e.returnValue = false; //ie
              thiss = $(e.srcElement).parent();
       }
              
       if(e.wheelDelta){
              delta = e.wheelDelta;
       }else if(e.detail){
              delta = -e.detail;
       }
       
       if(delta > 0){
              delta = 1;
       }else if(delta < 0){
              delta = -1;
       }

       zoomGlobe(delta);
}

function zoomGlobe(d){
       if(!globeTransitioning){ //no mouse wheel action while globe is rotating
              var zf = 4; //fraction of globe to zoom by       
              size += (d * (size / zf));
              
              if(size > sizeminmax[1]){
                     size = sizeminmax[1];
              }else if(size < sizeminmax[0]){
                     size = sizeminmax[0];
              }
              
              projection.mode("orthographic").scale(size);
              refresh();
              updateZoomTools(size);
              transitionSize = size;
       }
}

function zoomSetup(){
       var tools = document.createElement("div");
       var bar = document.createElement("div");
       var plusMinus = document.createElement("div");
       var plus = document.createElement("div");
              plus.id="tPlus";
       var minus = document.createElement("div");
              minus.id="tMinus";
       var scrubber = document.createElement("div");
              scrubber.id="tScrub";
       
       $(tools).css("position","absolute").css("width","36px").css("padding-bottom","4px").css("background","#fff1e0").css("top",$('.list').offset().top);
       $(bar).css("position","relative").css("float","left").css("width",4).css("height",52).css("margin-left","4px").css("background","#333333");
       $(plusMinus).css("position","relative").css("float","right").css("width",24);
       $(plus).css("position","relative").css("float","right").css("width",24).css("height",24).css("background","url(img/mPlus.gif)").css("cursor","pointer").bind('click', zoomToolsHandler);
       $(minus).css("position","relative").css("float","right").css("width",24).css("height",24).css("background","url(img/mMinus.gif)").css("cursor","pointer").bind('click', zoomToolsHandler);
       $(scrubber).css("position","relative").css("width",4).css("height",4).css("border","1px solid #333333").css("background","#fff1e0").css("z-index","2").css("top",29).css("left",3);
       
       $(plusMinus).append(plus).append("<div style='width:4px; height:4px; clear:both;'></div>").append(minus);
       $(tools).append(scrubber).append(bar).append(plusMinus);
       $('.content').append(tools);
       $(tools).css("left",$('.content').outerWidth() - (parseInt($('.content').css("padding-left")) - 1 + $(tools).width())); //must use padding-DIRECTION even if your css only uses 'padding:0px', otherwise it breaks in FF
       
       updateZoomTools(defaultsize);
       
       function zoomToolsHandler(e){
              if($(this).attr("id") == "tPlus"){
                     zoomGlobe(1);
              }else{
                     zoomGlobe(-1);
              }
       }
}

function updateZoomTools(s){
       if(sizeminmax[0] < sizeminmax[1]){
              if(s >= sizeminmax[1]){
                     $("#tPlus").css("opacity",0.15);
                     $("#tMinus").css("opacity",1);
                     $("#tScrub").css("top",7);
              }else if(s <= sizeminmax[0]){
                     $("#tPlus").css("opacity",1);
                     $("#tMinus").css("opacity",0.15);
                     $("#tScrub").css("top",51);
              }else{
                     $("#tPlus").css("opacity",1);
                     $("#tMinus").css("opacity",1);
                     
                     $("#tScrub").css("top",7 + ((sizeminmax[0] / s) * 44));
              }
       }
}

//$('.content').append("<div id='absoluteCenter' style='position:absolute; z-index:9999; left:479px; top:333px; color:#ffffff; pointer-events:none;'>+</div>"); //for debugging - map is slightly off-center, so the crosshairs need to be as well











