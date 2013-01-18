(function (jQuery) {

var daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var shortMonthsInYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var longMonthsInYear = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
var shortMonthsToNumber = [];
shortMonthsToNumber["Jan"] = "01";
shortMonthsToNumber["Feb"] = "02";
shortMonthsToNumber["Mar"] = "03";
shortMonthsToNumber["Apr"] = "04";
shortMonthsToNumber["May"] = "05";
shortMonthsToNumber["Jun"] = "06";
shortMonthsToNumber["Jul"] = "07";
shortMonthsToNumber["Aug"] = "08";
shortMonthsToNumber["Sep"] = "09";
shortMonthsToNumber["Oct"] = "10";
shortMonthsToNumber["Nov"] = "11";
shortMonthsToNumber["Dec"] = "12";

    jQuery.format = (function () {
        function strDay(value) {
  return daysInWeek[parseInt(value, 10)] || value;
        }

        function strMonth(value) {
var monthArrayIndex = parseInt(value, 10) - 1;
  return shortMonthsInYear[monthArrayIndex] || value;
        }

        function strLongMonth(value) {
var monthArrayIndex = parseInt(value, 10) - 1;
return longMonthsInYear[monthArrayIndex] || value;
        }

        var parseMonth = function (value) {
return shortMonthsToNumber[value] || value;
        };

        var parseTime = function (value) {
                var retValue = value;
                var millis = "";
                if (retValue.indexOf(".") !== -1) {
                    var delimited = retValue.split('.');
                    retValue = delimited[0];
                    millis = delimited[1];
                }

                var values3 = retValue.split(":");

                if (values3.length === 3) {
                    hour = values3[0];
                    minute = values3[1];
                    second = values3[2];

                    return {
                        time: retValue,
                        hour: hour,
                        minute: minute,
                        second: second,
                        millis: millis
                    };
                } else {
                    return {
                        time: "",
                        hour: "",
                        minute: "",
                        second: "",
                        millis: ""
                    };
                }
            };

        return {
            date: function (value, format) {
                /*
value = new java.util.Date()
2009-12-18 10:54:50.546
*/
                try {
                    var date = null;
                    var year = null;
                    var month = null;
                    var dayOfMonth = null;
                    var dayOfWeek = null;
                    var time = null;
if (typeof value == "number"){
return this.date(new Date(value), format);
} else if (typeof value.getFullYear == "function") {
                        year = value.getFullYear();
                        month = value.getMonth() + 1;
                        dayOfMonth = value.getDate();
                        dayOfWeek = value.getDay();
                        time = parseTime(value.toTimeString());
                    } else if (value.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/) != -1) {
                        /* 2009-04-19T16:11:05+02:00 || 2009-04-19T16:11:05Z */
                        var values = value.split(/[T\+-]/);
                        year = values[0];
                        month = values[1];
                        dayOfMonth = values[2];
                        time = parseTime(values[3].split(".")[0]);
                        date = new Date(year, month - 1, dayOfMonth);
                        dayOfWeek = date.getDay();
                    } else {
                        var values = value.split(" ");
                        switch (values.length) {
                        case 6:
                            /* Wed Jan 13 10:43:41 CET 2010 */
                            year = values[5];
                            month = parseMonth(values[1]);
                            dayOfMonth = values[2];
                            time = parseTime(values[3]);
                            date = new Date(year, month - 1, dayOfMonth);
                            dayOfWeek = date.getDay();
                            break;
                        case 2:
                            /* 2009-12-18 10:54:50.546 */
                            var values2 = values[0].split("-");
                            year = values2[0];
                            month = values2[1];
                            dayOfMonth = values2[2];
                            time = parseTime(values[1]);
                            date = new Date(year, month - 1, dayOfMonth);
                            dayOfWeek = date.getDay();
                            break;
                        case 7:
                            /* Tue Mar 01 2011 12:01:42 GMT-0800 (PST) */
                        case 9:
                            /*added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0800 (China Standard Time) */
                        case 10:
                            /* added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0200 (W. Europe Daylight Time) */
                            year = values[3];
                            month = parseMonth(values[1]);
                            dayOfMonth = values[2];
                            time = parseTime(values[4]);
                            date = new Date(year, month - 1, dayOfMonth);
                            dayOfWeek = date.getDay();
                            break;
                        case 1:
                            /* added by Jonny, for 2012-02-07CET00:00:00 (Doctrine Entity -> Json Serializer) */
                            var values2 = values[0].split("");
                            year=values2[0]+values2[1]+values2[2]+values2[3];
                            month= values2[5]+values2[6];
                            dayOfMonth = values2[8]+values2[9];
                            time = parseTime(values2[13]+values2[14]+values2[15]+values2[16]+values2[17]+values2[18]+values2[19]+values2[20])
                            date = new Date(year, month - 1, dayOfMonth);
                            dayOfWeek = date.getDay();
                            break;
                        default:
                            return value;
                        }
                    }

                    var pattern = "";
                    var retValue = "";
                    var unparsedRest = "";
                    /*
Issue 1 - variable scope issue in format.date
Thanks jakemonO
*/
                    for (var i = 0; i < format.length; i++) {
                        var currentPattern = format.charAt(i);
                        pattern += currentPattern;
                        unparsedRest = "";
                        switch (pattern) {
                        case "ddd":
                            retValue += strDay(dayOfWeek);
                            pattern = "";
                            break;
                        case "dd":
                            if (format.charAt(i + 1) == "d") {
                                break;
                            }
                            if (String(dayOfMonth).length === 1) {
                                dayOfMonth = '0' + dayOfMonth;
                            }
                            retValue += dayOfMonth;
                            pattern = "";
                            break;
                        case "d":
                            if (format.charAt(i + 1) == "d") {
                                break;
                            }
                            retValue += parseInt(dayOfMonth, 10);
                            pattern = "";
                            break;
                        case "MMMM":
                            retValue += strLongMonth(month);
                            pattern = "";
                            break;
                        case "MMM":
                            if (format.charAt(i + 1) === "M") {
                                break;
                            }
                            retValue += strMonth(month);
                            pattern = "";
                            break;
                        case "MM":
                            if (format.charAt(i + 1) == "M") {
                                break;
                            }
                            if (String(month).length === 1) {
                                month = '0' + month;
                            }
                            retValue += month;
                            pattern = "";
                            break;
                        case "M":
                            if (format.charAt(i + 1) == "M") {
                                break;
                            }
                            retValue += parseInt(month, 10);
                            pattern = "";
                            break;
                        case "yyyy":
                            retValue += year;
                            pattern = "";
                            break;
                        case "yy":
                            if (format.charAt(i + 1) == "y" &&
                            format.charAt(i + 2) == "y") {
                             break;
                       }
                            retValue += String(year).slice(-2);
                            pattern = "";
                            break;
                        case "HH":
                            retValue += time.hour;
                            pattern = "";
                            break;
                        case "hh":
                            /* time.hour is "00" as string == is used instead of === */
                            var hour = (time.hour == 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
                            hour = String(hour).length == 1 ? '0' + hour : hour;
                            retValue += hour;
                            pattern = "";
                            break;
case "h":
if (format.charAt(i + 1) == "h") {
break;
}
var hour = (time.hour == 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
retValue += parseInt(hour, 10);
// Fixing issue https://github.com/phstc/jquery-dateFormat/issues/21
// retValue = parseInt(retValue, 10);
pattern = "";
break;
                        case "mm":
                            retValue += time.minute;
                            pattern = "";
                            break;
                        case "ss":
                            /* ensure only seconds are added to the return string */
                            retValue += time.second.substring(0, 2);
                            pattern = "";
                            break;
                        case "SSS":
                            retValue += time.millis.substring(0, 3);
                            pattern = "";
                            break;
                        case "a":
                            retValue += time.hour >= 12 ? "PM" : "AM";
                            pattern = "";
                            break;
                        case " ":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        case "/":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        case ":":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        default:
                            if (pattern.length === 2 && pattern.indexOf("y") !== 0 && pattern != "SS") {
                                retValue += pattern.substring(0, 1);
                                pattern = pattern.substring(1, 2);
                            } else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) {
                                pattern = "";
                            } else {
                             unparsedRest = pattern;
                            }
                        }
                    }
                    retValue += unparsedRest;
                    return retValue;
                } catch (e) {
                    console.log(e);
                    return value;
                }
            }
        };
    }());
}(jQuery));

jQuery.format.date.defaultShortDateFormat = "dd/MM/yyyy";
jQuery.format.date.defaultLongDateFormat = "dd/MM/yyyy hh:mm:ss";

jQuery(document).ready(function () {
    jQuery(".shortDateFormat").each(function (idx, elem) {
        if (jQuery(elem).is(":input")) {
            jQuery(elem).val(jQuery.format.date(jQuery(elem).val(), jQuery.format.date.defaultShortDateFormat));
        } else {
            jQuery(elem).text(jQuery.format.date(jQuery(elem).text(), jQuery.format.date.defaultShortDateFormat));
        }
    });
    jQuery(".longDateFormat").each(function (idx, elem) {
        if (jQuery(elem).is(":input")) {
            jQuery(elem).val(jQuery.format.date(jQuery(elem).val(), jQuery.format.date.defaultLongDateFormat));
        } else {
            jQuery(elem).text(jQuery.format.date(jQuery(elem).text(), jQuery.format.date.defaultLongDateFormat));
        }
    });
});


var video_audio = function(){
	var cache = {}, that, jqversion;
	var VIDEO = "video", AUDIO = "audio", VIDEOFILTERID = "va_video", AUDIOFILTERID = "va_audio", ALLFILTERID = "va_all";
	var lastdate = "", resultHTML = "", field, fieldname, container, initialised = false, el = {}, filter = ALLFILTERID, requesting = false;
	return {
		initialised : false,
		init : function(){
			that = this;
			if (initialised){
				return;
			}
			container = $("#holder").delegate(".media", "click", function(e) {
				e.preventDefault();
				field = $(e.currentTarget);
				fieldname = field.find('input[type="hidden"]').attr("name");
				if ($(e.target).hasClass("reload")){
					$(e.target).html("Reloading...");
					that.reload($(this));
					return;
				}else if ($(e.target).hasClass("cleardata")){
					that.clearField($(this).closest(".media"));
					return;
				}else if ($(e.target).hasClass("autoplay")){
					that.switchAutoplay($(this));
					return;
				}else if(field.hasClass("placeholder")){
					that.toggle();
					field.addClass("populating");
					that.getRecentlyAdded();
				}	
			});
			jqversion = $().jquery;
			$.ajaxSetup({cache:true}); //disable underscore timestamp in request
			cache.show = false;
			cache.reload = {};
			cache.mediatype = true;
			cache.baseurl = "https://feed.theplatform.com/f/h9dtGB/c6DHQoxs77tr";
			cache.baseurl += "?form=cjson&sort=added|desc&byApproved=true&fields=added,content,keywords,defaultThumbnailUrl,description,pubDate,title,availableDate,:show,:audioVideo&releaseFields=id,approved,:yospaceID&range=1-20";
			that.getShowList();
			initialised = true;
		},
		create : function(){
			
			cache.show_msg = 'Type in a show name if applicable';
			cache.keyword_msg = 'Type some keywords or the item ID #';
			cache.modal_show_html = '<div class="va_input_wrap"><select id="va_show">'+cache.shows+'</select></div>';
			cache.modal_kw_html = '<div class="va_input_wrap"><input id="va_keyword" type="text" value="'+cache.keyword_msg+'"/><span id="va_search_it" class="submit">Go</span><img id="va_fetching" src="http://www.cbc.ca/i/o/globalnav/v10/gfx/tabloading.gif" alt=""/></div>';
			cache.filter_html = '<div id="va_filters"><span class="va_filter" id="'+ALLFILTERID+'">All</span><span class="va_filter" id="'+VIDEOFILTERID+'">Video</span><span class="va_filter" id="'+AUDIOFILTERID+'">Audio</span><span class="message"></span></div>';
			cache.modal_html = '<div id="va_modal">'+cache.modal_show_html+cache.modal_kw_html+cache.filter_html+'<div id="va_results"></div></div>';
			
			if (!cache.fog){
				cache.fog = $('body').append('<div id="va_fog"></div>');
			}
			if (!cache.modal){
				cache.modal = $('body').append(cache.modal_html);
			}
			that.listen();
		},
		getRecentlyAdded : function(){
			if (cache.default_show){
				el.show.val(cache.default_show);
			}
			if (el.results.html() == ""){
				that.makeRequest();
			}
		},
		getDefaultShow : function(){
			return cache.default_show;
		},
		setDefaultShow : function(show){
			cache.default_show = show;
		},
		toggle : function(){
			el.modal.toggleClass('show');
			el.fog.toggleClass('show').css({ height: $('body').outerHeight() });
		},
		listen : function(){
			el.results = $('#va_results');
			el.filters = $('#va_filters');
			el.show = $('#va_show');
			el.keywords = $('#va_keyword');
			el.fog = $('#va_fog');
			el.search = $('#va_search_it');
			el.modal = $('#va_modal');
			el.results.delegate('.media','click', that.handleSelect);
			el.filters.delegate('.va_filter','click', that.handleFilterEvent);
			el.keywords.focus(function(){
				if (el.keywords.val() == cache.keyword_msg){
					el.keywords.val('');
				}
			});
			el.keywords.keyup(function(e){
			  if (e.which == 13) {
			    that.makeRequest();
			  }
			});
			el.keywords.blur(function(){
				if ($.trim(el.keywords.val()) == ''){
					el.keywords.val(cache.keyword_msg);
				}
			});
			el.fog.click(function(){
				that.toggle();
			});
			el.search.click(function(){
				that.makeRequest();
				return false;
			});
		},
		getShowList : function(){
			$.ajax({
			   type: 'GET',
			    url: "/expressionengine/themes/third_party/video_audio/scripts/shows.json",
			    async: true,
			    contentType: "application/json",
				success: that.handleShowList,
			    error: that.handleError
			});
		},
		handleShowList : function(data){
			that.debug(data);
			var shows = eval('(' + data + ')');
			var av = shows.entries[0].plfield$allowedValues;
			cache.shows = "<option value=''>All Shows</option>";
			for (var i=0; i<av.length; i++){
				cache.shows += '<option value="'+av[i]+'">'+av[i]+'</option>';
			}
			that.create();
		},
		makeRequest : function(){
			if (requesting){
				that.debug("A request to thePlatform is already in progress. Please wait until the first request is complete.");
				return;
			}
			var url = cache.baseurl;
			url += that.getCustom();
			url += that.getAvailableDate();
			url += that.getQuery();
			
			$.ajax({
			   type: 'GET',
			    url: url,
			    async: false,
			    jsonpCallback: 'video_audio.handleResponse',
			    contentType: "application/json",
			    dataType: 'jsonp',
			    success: that.handleResponse,
			    error: that.handleError
			});
			el.modal.addClass("loading");
			requesting = true;
		},
		getFormattedDate : function(epoch){
			var pubdate = new Date(epoch);
			//var strftime = "%B %e, %Y";
			//return Y.DataType.Date.format(pubdate, {format:strftime});
			return $.format.date(pubdate, "MMMM dd, yyyy");
		},
		getId : function (str){
			return str.match(/([0-9]{8,})$/)[0];
		},
		handleResponse : function (data){
			that.debug(data);
			var items = data.entries, html = "", itemcount = items.length; 
			for (var i=0; i<itemcount; i++){
				var item = items[i],
					c = item.content[0],
					r = c.releases[0],
					duration = that.secToHMS(c.duration),
					pubdate = that.getFormattedDate(item.pubDate),
					mediatype = item.pl1$audioVideo.toLowerCase(),
					summary = item.description;
				//var addeddate = getFormattedDate(item.added)
					id = that.getId(r.id),
					yospaceid = r.pl1$yospaceID;
				if (pubdate != lastdate){
					lastdate = pubdate;
					if (resultHTML != ""){
						resultHTML += "</div>";
					}
					resultHTML += '<div class="va_date"><h2>'+pubdate+'</h2>';
				}
				resultHTML += that.getMediaHTML({cid:id,yid:yospaceid, mediatype:mediatype, thumbnail:item.defaultThumbnailUrl, cliptitle:item.title, clipsummary:summary, pubdate:pubdate, epochpubdate:item.pubDate, duration:duration, truncatesummary:true, autoplay:false });
			}
			el.results.html(resultHTML);
			resultHTML = "";
			
			el.results.find(".va_date").each(function(){
				if ($(this).find(".audio:first").length == 0){
					$(this).addClass("va_video_only");
				}else if($(this).find(".video:first").length == 0){
					$(this).addClass("va_audio_only");
				}
			});
			that.handleFilter(filter);
			el.modal.addClass("results").removeClass("loading");
			requesting = false;
		},
		getMediaHTML : function(d){
			var fieldHTML = "", val = "";
			if (d.cliptitle) { val+= d.cliptitle; val+= "|"; }
			else{ that.debug("Cannot populate the video audio field due to missing title."); return "";}
			if (d.clipsummary) { val+= d.clipsummary; val+= "|"; }
			else{ that.debug("Cannot populate the video audio field due to missing description."); return "";}
			if (d.duration) { val+= d.duration; val+= "|"; }
			else{ that.debug("Cannot populate the video audio field due to missing duration."); return "";}
			if (d.epochpubdate) {  val+= d.epochpubdate; val+= "|"; }
			else{ that.debug("Cannot populate the video audio field due to missing pubdate (epoch)."); return "";}
			if (d.thumbnail) { val+= d.thumbnail; val+= "|"; }
			else{ that.debug("Cannot populate the video audio field due to missing thumbnail."); return "";}
			if (d.mediatype) {  val+= d.mediatype; val+= "|"; }
			else{ that.debug("Cannot populate the video audio field due to missing mediatype."); return "";}
			if (d.cid) { val+= d.cid; val+= "|"; }
			else{ that.debug("Cannot populate the video audio field due to missing clip id."); return "";}
			if (d.yid) { val+= d.yid; val+= "|"; }
			
			if (d.autoplay){
				fieldHTML+='<span class="autoplay">'+d.autoplay+'</span>';
				val+= d.autoplay; val+= "|";
			}else if(!d.autoplay){
			}else{
				fieldHTML+='<span class="autoplay">off</span>';
				val+= "off"; val+= "|";
			}
			val = val.replace(/\|$/, "");
			val = val.replace(/'/g, "&apos;");
			val = val.replace(/"/g, "&quot;");
			if (d.withfielddata && !d.fieldname){
				that.debug("Cannot populate the video audio field due to missing field name."); return "";
			}
			if (d.withfielddata){
				fieldHTML += "<input type='hidden' name='"+d.fieldname+"' value='"+val+"' />";
			}else if(d.withemptyfield){
				fieldHTML += "<input type='hidden' name='"+d.fieldname+"' value='' />";
			}
			
			if (d.clearbutton){
				fieldHTML+='<span class="cleardata submit">Clear</span>';
			}
			return '<a href="#'+d.cid+'&'+d.yid+'" class="media '+d.mediatype+' clearfix"><img src="'+d.thumbnail+'" alt="'+d.cliptitle+'"/><span class="cliptitle">'+d.cliptitle+'</span><span class="pubdate">'+d.pubdate+'</span><span class="epochpubdate">'+d.epochpubdate+'</span><span class="duration">'+d.duration+'</span><span class="summary">'+d.clipsummary+'</span><span class="selectclip submit">Select</span>'+fieldHTML+'</a>';
		},
		truncate : function(str){
			var max = 100;
			if (str.length > max)
				return str.substring(0, max) + "...";
			else
				return str;
		},
		clearField : function(field){
			var fname = field.find("input").attr("name");
			field.addClass("placeholder").html("<p><span>+</span>Select Clip</p><input type='hidden' name='"+fname+"' value='false'/>");
		},
		handleFailure : function(){
			that.debug("unable to contact media server");
		},
		switchAutoplay : function(el){
			var button = el.find(".autoplay");
			var html = button.html().toLowerCase();
			var hiddeninput = el.find("input");
			//that.debug(hiddeninput.attr("value"));
			if (html == "off"){
				button.html("on");
				var newautoplay = hiddeninput.attr("value").replace(/\|off$/g, "|on");
				that.debug(newautoplay);
				hiddeninput.attr("value", newautoplay);
			}else{
				button.html("off");
				var newautoplay = hiddeninput.attr("value").replace(/\|on$/g, "|off");
				that.debug(newautoplay);
				hiddeninput.attr("value", newautoplay);
			}
		},
		reload : function(jqel){
			if (requesting){
				that.debug("A request to thePlatform is already in progress. Please wait until the first request is complete.");
				return;
			}
			el.reload = jqel.closest(".media"); //ancestor
			cache.reload.autoplay = el.reload.find(".autoplay").text().toLowerCase();
			cache.reload.fieldname = el.reload.find("input").attr("name");
			cache.reload.cid = el.reload.attr("href").split("#")[1].split("&")[0];
			if (!cache.reload.cid || !cache.reload.cid.match(/^[0-9]+$/g)){
				that.debug("Unable to determine which clip to fetch metadata for.");
				return;
			}
			var url = cache.baseurl + "&byContent=byReleases%3DbyId%253D"+ cache.reload.cid;
			
			$.ajax({
			   type: 'GET',
			    url: url,
			    async: false,
			    jsonpCallback: 'video_audio.handleReload',
			    contentType: "application/json",
			    dataType: 'jsonp',
			    success: that.handleReload,
			    error: that.handleError
			});
			requesting = true;
		},
		handleReload : function (data){
			var items = data.entries; 
			var item = items[0],
				c = item.content[0],
				r = c.releases[0],
				duration = that.secToHMS(c.duration),
				pubdate = that.getFormattedDate(item.pubDate),
				mediatype = item.pl1$audioVideo.toLowerCase(),
				summary = item.description;
				id = that.getId(r.id),
				yospaceid = r.pl1$yospaceID;
			el.reload.replaceWith(that.getMediaHTML({cid:id,yid:yospaceid, mediatype:mediatype, thumbnail:item.defaultThumbnailUrl, cliptitle:item.title, clipsummary:summary, pubdate:pubdate, epochpubdate:item.pubDate, duration:duration, withfielddata:true, clearbutton:true, fieldname:cache.reload.fieldname, autoplay:cache.reload.autoplay }));
			requesting = false;
		},
		handleSelect : function(e){
			e.preventDefault();
			that.debug(e);
			var d = {};
			var anchor = $(e.target).closest("a");
			var mediatype = (anchor.hasClass(VIDEO))?VIDEO:AUDIO;
			var href = anchor.attr("href");
			var hash = href.split("#")[1];
			var ids = hash.split("&");
			var id = ids[0];
			d.cid = id;
			if (ids.length > 1){
				d.yid = ids[1];
			}
			d.html = anchor.html();
			d.cliptitle = anchor.find("span.cliptitle").text();
			d.clipsummary = anchor.find("span.summary").text();
			d.duration = anchor.find("span.duration").text();
			d.pubdate = anchor.find("span.pubdate").text();
			d.epochpubdate = anchor.find("span.epochpubdate").text();
			d.thumbnail = anchor.find("img").attr("src");
			d.mediatype = mediatype;
			d.withfielddata = true;
			d.clearbutton = true;
			d.fieldname = fieldname;
			d.autoplay = "off";
			that.debug(d);
			
			if ($(e.target).hasClass("selectclip")){
				field.replaceWith(that.getMediaHTML(d));
				that.toggle();
		},
		handleFilterEvent : function(e){
			e.preventDefault();
			var fid = $(this).attr("id");
			that.handleFilter(fid);
		},
		handleFilter : function(fid){
			filter = fid;
			var mtype = fid.replace("va_","");
			var mclass = (mtype == "all")?"":"."+mtype;
			el.modal.removeClass(AUDIOFILTERID).removeClass(VIDEOFILTERID).removeClass(ALLFILTERID).addClass(fid);
			var count = el.results.find(".media"+mclass).length;
			el.filters.find(".message:first").html('Showing '+count+' results');
		},
		getAvailableDate : function(){
			//2 weeks ahead of today
			var today = new Date();
			var availableDate = that.shiftDate(today, 14);
			var strftime = "~%F"; //~2012-11-23
			//var datestr = Y.DataType.Date.format(availableDate, {format:strftime});
			var datestr = $.format.date(availableDate, "~yyyy-MM-dd");
			datestr += "T00:00:00Z";
			return "&byAvailableDate="+datestr;
		},
		getCustom : function(){
			var custom = 0;
			var list = "";
			if (el.show.val() != ""){
				custom++;
				list = that.addToList(list, "{show}{"+el.show.val().replace(/\s/g, "%20")+"}", custom);
			}
			//if (cache.mediatype){
			//	custom++;
			//	list = that.addToList(list, "{audioVideo}{Audio}", custom);
			//}
			if (custom){
				return "&byCustomValue="+list;
			}
			return "";
		},
		validQuery : function(){
			var val = $.trim(el.keywords.val());
			if (val == cache.keyword_msg || val.length == 0 || !val.match(/^[0-9A-Za-z ]+$/)){
				return false;
			}
			return val;
		},
		getQuery : function(){
			var val = that.validQuery();
			if (!val)
				return '';
			if (that.isDigits(val)){
				return "&byContent=byReleases%3DbyId%253D"+val;
			}else{
				return "&q="+val.replace(" ", "%20");
			}
		},
		isDigits : function(str){
			if (str.match(/[0-9]{8,}/)){
				return true;
			}else{
				return false;
			}
		},
		addToList : function(list, item, count){
			if (count > 1){
				list +=",";
			}
			list += item;
			return list;
		},
		shiftDate : function(date, days) {
            var epoch = date.getTime() + (days * 24 * 60 * 60 * 1000);
            return (new Date(epoch));
        },
		secToHMS : function(s){
			return that.msToHMS(s * 1000);
		},
		msToHMS : function(ms){
			if (!ms) return "";
			var h = Math.floor(ms/3600000);ms=ms%3600000;
			var m = Math.floor(ms/60000);ms=ms%60000;
			var s = ('0'+Math.floor(ms/1000));
			s = s.substr(s.length-2,s.length);
			return h>0 ? h+':'+('0'+m).substr(-2)+':'+s : m+':'+s;	
		},
		debug : function(str){
			if (typeof console != 'undefined') console.log(str);
		}
	};
}();
jQuery(document).ready(function(){ video_audio.init(); });