//JackySlide
function JackySlide(container,options){var noop=function(){};var offloadFn=function(fn){setTimeout(fn||noop,0)};var browser={addEventListener:!!window.addEventListener,touch:("ontouchstart" in window)||window.DocumentTouch&&document instanceof DocumentTouch,transitions:(function(temp){var props=["transitionProperty","WebkitTransition","MozTransition","OTransition","msTransition"];for(var i in props){if(temp.style[props[i]]!==undefined){return true}}return false})(document.createElement("swipe"))};if(!container){return}var element=container.children[0];var slides,slidePos,width,length;options=options||{};var index=parseInt(options.startSlide,10)||0;var speed=options.speed||300;options.continuous=options.continuous!==undefined?options.continuous:true;function setup(){slides=element.children;length=slides.length;if(slides.length<2){options.continuous=false}if(browser.transitions&&options.continuous&&slides.length<3){element.appendChild(slides[0].cloneNode(true));element.appendChild(element.children[1].cloneNode(true));slides=element.children}slidePos=new Array(slides.length);width=container.getBoundingClientRect().width||container.offsetWidth;element.style.width=(slides.length*width)+"px";var pos=slides.length;while(pos--){var slide=slides[pos];slide.style.width=width+"px";$(container).find("img").css({width:width});slide.setAttribute("data-index",pos);if(browser.transitions){slide.style.left=(pos*-width)+"px";move(pos,index>pos?-width:(index<pos?width:0),0)}}if(options.continuous&&browser.transitions){move(circle(index-1),-width,0);move(circle(index+1),width,0)}if(!browser.transitions){element.style.left=(index*-width)+"px"}container.style.visibility="visible"}function prev(){if(options.continuous){slide(index-1)}else{if(index){slide(index-1)}}}function next(){if(options.continuous){slide(index+1)}else{if(index<slides.length-1){slide(index+1)}}}function circle(index){return(slides.length+(index%slides.length))%slides.length}function slide(to,slideSpeed){if(index==to){return}if(browser.transitions){var direction=Math.abs(index-to)/(index-to);if(options.continuous){var natural_direction=direction;direction=-slidePos[circle(to)]/width;if(direction!==natural_direction){to=-direction*slides.length+to}}var diff=Math.abs(index-to)-1;while(diff--){move(circle((to>index?to:index)-diff-1),width*direction,0)}to=circle(to);move(index,width*direction,slideSpeed||speed);move(to,0,slideSpeed||speed);if(options.continuous){move(circle(to-direction),-(width*direction),0)}}else{to=circle(to);animate(index*-width,to*-width,slideSpeed||speed)}index=to;offloadFn(options.callback&&options.callback(index,slides[index]))}function move(index,dist,speed){translate(index,dist,speed);slidePos[index]=dist}function translate(index,dist,speed){var slide=slides[index];var style=slide&&slide.style;if(!style){return}style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration=speed+"ms";style.webkitTransform="translate("+dist+"px,0)"+"translateZ(0)";style.msTransform=style.MozTransform=style.OTransform="translateX("+dist+"px)"}function animate(from,to,speed){if(!speed){element.style.left=to+"px";return}var start=+new Date;var timer=setInterval(function(){var timeElap=+new Date-start;if(timeElap>speed){element.style.left=to+"px";if(delay){begin()}options.transitionEnd&&options.transitionEnd.call(event,index,slides[index]);clearInterval(timer);return}element.style.left=(((to-from)*(Math.floor((timeElap/speed)*100)/100))+from)+"px"},4)}var delay=options.auto||0;var interval;function begin(){interval=setTimeout(next,delay)}function stop(){delay=0;clearTimeout(interval)}var start={};var delta={};var isScrolling;var events={handleEvent:function(event){switch(event.type){case"touchstart":this.start(event);break;case"touchmove":this.move(event);break;case"touchend":offloadFn(this.end(event));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":offloadFn(this.transitionEnd(event));break;case"resize":offloadFn(setup);break}if(options.stopPropagation){event.stopPropagation()}},start:function(event){var touches=event.touches[0];start={x:touches.pageX,y:touches.pageY,time:+new Date};isScrolling=undefined;delta={};element.addEventListener("touchmove",this,false);element.addEventListener("touchend",this,false)},move:function(event){if(event.touches.length>1||event.scale&&event.scale!==1){return}if(options.disableScroll){event.preventDefault()}var touches=event.touches[0];delta={x:touches.pageX-start.x,y:touches.pageY-start.y};if(typeof isScrolling=="undefined"){isScrolling=!!(isScrolling||Math.abs(delta.x)<Math.abs(delta.y))}if(!isScrolling){event.preventDefault();stop();if(options.continuous){translate(circle(index-1),delta.x+slidePos[circle(index-1)],0);translate(index,delta.x+slidePos[index],0);translate(circle(index+1),delta.x+slidePos[circle(index+1)],0)}else{delta.x=delta.x/((!index&&delta.x>0||index==slides.length-1&&delta.x<0)?(Math.abs(delta.x)/width+1):1);
translate(index-1,delta.x+slidePos[index-1],0);translate(index,delta.x+slidePos[index],0);translate(index+1,delta.x+slidePos[index+1],0)}}},end:function(event){var duration=+new Date-start.time;var isValidSlide=Number(duration)<250&&Math.abs(delta.x)>20||Math.abs(delta.x)>width/2;var isPastBounds=!index&&delta.x>0||index==slides.length-1&&delta.x<0;if(options.continuous){isPastBounds=false}var direction=delta.x<0;if(!isScrolling){if(isValidSlide&&!isPastBounds){if(direction){if(options.continuous){move(circle(index-1),-width,0);move(circle(index+2),width,0)}else{move(index-1,-width,0)}move(index,slidePos[index]-width,speed);move(circle(index+1),slidePos[circle(index+1)]-width,speed);index=circle(index+1)}else{if(options.continuous){move(circle(index+1),width,0);move(circle(index-2),-width,0)}else{move(index+1,width,0)}move(index,slidePos[index]+width,speed);move(circle(index-1),slidePos[circle(index-1)]+width,speed);index=circle(index-1)}options.callback&&options.callback(index,slides[index])}else{if(options.continuous){move(circle(index-1),-width,speed);move(index,0,speed);move(circle(index+1),width,speed)}else{move(index-1,-width,speed);move(index,0,speed);move(index+1,width,speed)}}}element.removeEventListener("touchmove",events,false);element.removeEventListener("touchend",events,false)},transitionEnd:function(event){if(parseInt(event.target.getAttribute("data-index"),10)==index){if(delay){begin()}options.transitionEnd&&options.transitionEnd.call(event,index,slides[index])}}};setup();if(delay){begin()}if(browser.addEventListener){if(browser.touch){element.addEventListener("touchstart",events,false)}if(browser.transitions){element.addEventListener("webkitTransitionEnd",events,false);element.addEventListener("msTransitionEnd",events,false);element.addEventListener("oTransitionEnd",events,false);element.addEventListener("otransitionend",events,false);element.addEventListener("transitionend",events,false)}window.addEventListener("resize",events,false)}else{window.onresize=function(){setup()}}return{setup:function(){setup()},slide:function(to,speed){stop();slide(to,speed)},prev:function(){stop();prev()},next:function(){stop();next()},stop:function(){stop()},getPos:function(){return index},getNumSlides:function(){return length},kill:function(){stop();element.style.width="";element.style.left="";var pos=slides.length;while(pos--){var slide=slides[pos];slide.style.width="";slide.style.left="";if(browser.transitions){translate(pos,0,0)}}if(browser.addEventListener){element.removeEventListener("touchstart",events,false);element.removeEventListener("webkitTransitionEnd",events,false);element.removeEventListener("msTransitionEnd",events,false);element.removeEventListener("oTransitionEnd",events,false);element.removeEventListener("otransitionend",events,false);element.removeEventListener("transitionend",events,false);window.removeEventListener("resize",events,false)}else{window.onresize=null}}}}if(window.jQuery||window.Zepto){(function($){$.fn.JackySlide=function(params){return this.each(function(){$(this).data("JackySlide",new JackySlide($(this)[0],params))})}})(window.jQuery||window.Zepto)};
//JackScroll
var jackyScroll=(function(){var _upSupportTouch=!((window.DocumentTouch&&document instanceof window.DocumentTouch)||"ontouchstart" in window)*1,_event={start:["touchstart","mousedown"][_upSupportTouch],move:["touchmove","mousemove"][_upSupportTouch],end:["touchend","mouseup"][_upSupportTouch]};var _scroller=function(container,direction,params){var key="top",Key="Top",size="height",Size="Height",pageKey="pageY";if(direction=="horizontal"){key="left";Key="Left";size="width";Size="Width";pageKey="pageX"}var scroller=null;if(params.hideScrollBar==false){scroller=document.createElement("div");scroller.className="scroller_"+direction;params.container.appendChild(scroller)}var sizeContainer=container["client"+Size],sizeContainerWithScroll=0;var fnPosScroll=function(){if(scroller==null){return}var sizeScroller=scroller.style[size].replace("px",""),keyScroller=container["scroll"+Key]/(sizeContainerWithScroll-sizeContainer)*(sizeContainer-sizeScroller);if(sizeContainer-sizeScroller-keyScroller<=0){keyScroller=sizeContainer-sizeScroller}scroller.style[key]=keyScroller+"px"};var pos={};container.addEventListener(_event.start,function(event){sizeContainerWithScroll=this["scroll"+Size];pos[pageKey]=event.touches?event.touches[0][pageKey]:event[pageKey];pos[key]=this["scroll"+Key];document.moveFollow=true;if(scroller&&sizeContainerWithScroll>sizeContainer){scroller.style.opacity=1;scroller.style[size]=(sizeContainer*sizeContainer/sizeContainerWithScroll)+"px";fnPosScroll()}});container.addEventListener(_event.move,function(event){if(_upSupportTouch==false||(document.moveFollow==true)){this["scroll"+Key]=pos[key]+(pos[pageKey]-(event.touches?event.touches[0][pageKey]:event[pageKey]));fnPosScroll();params.onScroll.call(this,event)}event.preventDefault()});container.addEventListener(_event.end,function(event){scroller&&(scroller.style.opacity=0)});if(_upSupportTouch==true){document.addEventListener("mouseup",function(){this.moveFollow=false})}};return function(container,options){options=options||{};var params=new Object({verticalScroll:true,horizontalScroll:false,hideScrollBar:false,onScroll:function(){}}),key;for(key in options){params[key]=options[key]}if(window.getComputedStyle(container).position=="static"){container.style.position="relative"}var childerns=container.childNodes,fragment=document.createDocumentFragment();[].slice.call(childerns).forEach(function(child){fragment.appendChild(child)});var wrap=document.createElement("div");wrap.style.height="100%";wrap.style.width="100%";wrap.style.overflow="hidden";container.appendChild(wrap);wrap.appendChild(fragment);params.container=container;if(params.verticalScroll==true){_scroller(wrap,"vertical",params)}if(params.horizontalScroll==true){_scroller(wrap,"horizontal",params)}}})();
//Jacky
var Jacky = (function(c) {
	c.util = {
		backTop:function(btnId){
			var btn = document.getElementById(btnId);
		    var d = document.documentElement;
		    var b = document.body;
		    window.onscroll = set;
		    btn.style.display = "none";
		    $(btn).on('tap',function(e){
		    	e.preventDefault();
		    	btn.style.display = "none";
		        window.onscroll = null;
		        this.timer = setInterval(function() {
		            d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
		            b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
		            if ((d.scrollTop + b.scrollTop) == 0) clearInterval(btn.timer, window.onscroll = set);
		        }, 10);
		    })
		    function set() {
		        btn.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block': "none"
		    }
		},
		tab: function(config) {
			var target = config.target,//目标选项卡片
				controller = config.controller,//触发器
				currentClass= config && config.currentClass ? config.currentClass : "cur";
		    target.each(function() {
		        $(this).children().eq(0).css('display','block');
		    });
		    controller.each(function() {
		        $(this).children().eq(0).addClass(currentClass);
		    });
		    controller.children().on('tap', function(e){
		    	e.preventDefault();
		        $(this).addClass(currentClass).siblings().removeClass(currentClass);
		        var index = controller.children().index(this);
		        target.children().eq(index).css('display','block').siblings().css('display','none');
		    });
		},
		imageSize:function(obj){
			var screenImage = $(obj),
		        theImage = new Image(),
		        imageWidth,
		        screenWidth=$(window).width();
			for(var i=0;i<screenImage.length;i++){
				theImage.src = screenImage.eq(i).attr("src");
		   		imageWidth =theImage.width;
		   		if(imageWidth<screenWidth){
		   			screenImage.eq(i).css({"width":imageWidth+'px'});
		   		}
			}
		},
		getArray:function(array){//数组去重
			var hash = {},
			    len = array.length,
			    result = [];
			
			for (var i = 0; i < len; i++){
			    if (!hash[array[i]]){
			        hash[array[i]] = true;
			        result.push(array[i]);
			    } 
			}
			 return result;
		},
		patternString:function (filterString,string){
		        var s,len,res,rule,str = string.toString(),filter = filterString.toString();
		        if(filterString instanceof Array && string instanceof Array){
		            try{
		                res = false;
		                len = filterString.length;
		                for(var i = 0;i<len;i++){
		                    rule = new RegExp(filterString[i]);
		                    s = rule.test(string[i]);
		                    res = (res || s);
		                }
		            }catch(e){
		                e.message();
		            }
		        }else{
		          	var r = new RegExp(filterString),
		            	rule = r.test(string),
		            	res = rule;
		        }
		        return res;
		},
		isScrolledBottom: function() {
			var scrollTop = 0,
				clientHeight = 0,
				scrollHeight = 0;
			if (document.documentElement && document.documentElement.scrollTop) {
				scrollTop = document.documentElement.scrollTop
			} else {
				if (document.body) {
					scrollTop = document.body.scrollTop
				}
			} if (document.body.clientHeight && document.documentElement.clientHeight) {
				clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
			} else {
				clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
			}
			scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
			if (scrollTop + clientHeight >= scrollHeight-40) {
				return true
			} else {
				return false
			}
		},
		visible: function(obj) {
			if ($(obj).offset().top < ($(window).height() + $("body").scrollTop()) && (($(window).height() + $("body").scrollTop()) - $(obj).offset().top) < $(window).height()) {
				return true
			} else {
				return false
			}
		},
		pageLoad:{//elem:选择器,txt:文本
			show:function(config){
				$("body").bind("touchmove tap", function(event) {
				   event.preventDefault()
				}, false); 
				var elem= (config && config.elem ? config.elem : $('body')),
					txt=(config && config.txt ? config.txt : '正在加载'),
					pageload=$('#pageload');
				if(pageload.length){
					pageload.remove();
				}
	            elem.append('<div id="pageload" class="fixed_full"><div class="box-ct"><div class="box-bd"><div><div class="cm-loading-spinner"><span class="loading-top"></span><span class="loading-right"></span><span class="loading-bottom"></span><span class="loading-left"></span></div> <div class="msg">'+txt+'</div></div></div></div></div>');
			},
			remove:function(){
				$("body").unbind("touchmove");
				$('#pageload').remove();
			}
        },  
		stopPropagation: function(e) {
			if (e && e.stopPropagation) {
				e.stopPropagation()
			} else {
				window.event.cancelBubble = true
			}
		},
		request: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return unescape(r[2])
			}
			return ""
		},
		goBack: function(href) {
			history.back()
		},
		alertBox: function(txt, callback, config) {
			var time = (config && config.time ? config.time : 2000);
			if ($("#_alert_bg").length) {
				$("#_alert_bg").show()
			} else {
				var _d = document;
				var _alert_bg = _d.createElement("div");
				_alert_bg.setAttribute("id", "_alert_bg");
				_d.body.appendChild(_alert_bg);
				var _alert_content = _d.createElement("div");
				_alert_content.setAttribute("id", "_alert_content");
				_alert_bg.appendChild(_alert_content)
			}
			var _this = $("#_alert_content");
			_this.html(txt).show();
			setTimeout(function() {
				$("#_alert_bg").hide();
				callback && callback()
			}, time)
		},
		popup:function(config){
			var elem=config.elem,
				move=(config && config.move ? config.move : false),
        	    state=elem.data('state');
        	if(state){
        		elem.css('display','block');
        		elem.data('state','false');
        		if(!move){
        			$("body").bind("touchmove", function(event) {
						event.preventDefault()
					}, false); 
        		}
        		
        	}else{
        		elem.css('display','none');
        		elem.data('state','true');
        		if(!move){
        			$("body").unbind("touchmove");
        		}
        	}
		},
		masking: function(json) {
			if ($("#maskContainer").length) {
				$("#maskBackground,#maskContainer").remove();
				return false
			}
			if (json) {
				json = json || {};
				json.isNeedMask = json.isNeedMask || true;
				json.opacity = json.opacity || 0.5;
				json.html = json.html || "";
				json.disappearTime = json.disappearTime || 0;
				json.isClickDisappear = json.isClickDisappear || true;
				var maskObj = null;
				if (json.isNeedMask) {
					var maxHeight = ($(window).height() > $(document).height() ? $(window).height() : $(document).height());
					maskObj = $('<div id="maskBackground" style="z-index:999;opacity:' + json.opacity + ";height:" + maxHeight + 'px;width:100%;top:0;left:0;position:fixed;background:#000;"></div>');
					$("body").append(maskObj);
				}
				var maskContent = $('<div id="maskContainer" style="position: fixed;z-index:99999;"></div>');
				maskContent.append(json.html);
				$("body").append(maskContent);
				json.top = (typeof json.top == "undefined" ? (($(window).height() - maskContent.height()) / 2) : json.top);
				json.left = (typeof json.left == "undefined" ? (($(window).width() - maskContent.width()) / 2) : json.left);
				maskContent.css({
					top: json.top,
					left: json.left
				});
				if (json.disappearTime) {
					setTimeout(function() {
						maskObj.remove();
						maskContent.remove()
					}, json.disappearTime)
				}
			}
			
		},
		scrollBottom: function() {
			var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
			if (($(document).height() - 80) <= totalheight) {
				return true
			}
		},
		imgScrollRequest: function(obj) {
			var flag = typeof(arguments[1]) != "undefined" ? arguments[1] : false;
			$(obj).each(function() {
				var $this = $(this);
				if ($this.attr("data-src")) {
					if (flag) {
						$this.attr("src", $this.attr("data-src")).removeAttr("data-src");
						return
					}
					if (Jacky.util.visible($this)) {
						$this.attr("src", $this.attr("data-src")).removeAttr("data-src")
					}
				}
			})
		},
		tipsImg:function(obj){
			$('body').append('<section class="tipsImg hide" data-state="true" onclick="Jacky.util.tipsImg(this)"><div id="banner" class="swipe"><ul class="swipe-wrap"></ul><ul id="indicator"></ul></div></section>');
			var tipsImg=$(".tipsImg");
	    	if(tipsImg.data('state')){
	    		var img=$(obj).parent().data('img'),
	    			idx=$(obj).index(),
	    			indicator='',
	    			list='';
				
	    		for (var i=0;i<img.length;i++){
	    			list +='<li class="box box-center"><img src="../images/common/default_small.jpg" data-src="'+img[i]+'"  alt="" /></li>';
	    			if(i==0){
	    				indicator +='<li class="active">1</li>';
	    			}else{
	    				indicator +='<li>1</li>';
	    			}
				}
	    		tipsImg.find('.swipe-wrap').html(list);
	    		tipsImg.find('#indicator').html(indicator);
	    		tipsImg.show();	
				$("body").bind("touchmove", function(event) {
					event.preventDefault()
				}, false);
				var banner = document.getElementById('banner'),
		    		fristimg=$('#banner li').eq(0).find('img');
				fristimg.attr('src',fristimg.attr('data-src'));
				window.slide=JackySlide(banner, {
					callback: function(index, element) {
						var currimg=$('#banner li').eq(index).find('img');
						currimg.attr('src',currimg.attr('data-src'));
						$('#indicator li').eq(index).addClass('active').siblings().removeClass('active');
					}
				});
				slide.slide(idx,1);
				tipsImg.data('state',false);
				
	    	}else{
	    		tipsImg.remove().hide().data('state',true);
	    		$("body").unbind("touchmove");
	    	}
		}
	};
	c.localData = {
		hname: location.hostname ? location.hostname : "localStatus",
		isLocalStorage: window.localStorage ? true : false,
		dataDom: null,
		initDom: function() {
			if (!this.dataDom) {
				try {
					this.dataDom = document.createElement("input");
					this.dataDom.type = "hidden";
					this.dataDom.style.display = "none";
					this.dataDom.addBehavior("#default#userData");
					document.body.appendChild(this.dataDom);
					var exDate = new Date();
					exDate = exDate.getDate() + 30;
					this.dataDom.expires = exDate.toUTCString()
				} catch (ex) {
					return false
				}
			}
			return true
		},
		set: function(key, value) {
			if (this.isLocalStorage) {
				window.localStorage.setItem(key, value)
			} else {
				if (this.initDom()) {
					this.dataDom.load(this.hname);
					this.dataDom.setAttribute(key, value);
					this.dataDom.save(this.hname)
				}
			}
		},
		get: function(key) {
			if (this.isLocalStorage) {
				return window.localStorage.getItem(key)
			} else {
				if (this.initDom()) {
					this.dataDom.load(this.hname);
					return this.dataDom.getAttribute(key)
				}
			}
		},
		remove: function(key) {
			if (this.isLocalStorage) {
				localStorage.removeItem(key)
			} else {
				if (this.initDom()) {
					this.dataDom.load(this.hname);
					this.dataDom.removeAttribute(key);
					this.dataDom.save(this.hname)
				}
			}
		}
		
	};
	c.cookie = {
		get: function(key) {
			try {
				var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
				if (arr != null) {
					return decodeURIComponent(arr[2])
				}
			} catch (e) {}
			return null
		},
		set: function(key, value, date, domain) {
			try {
				domain = domain ? (';domain=' + domain) : '';
				var Days = date ? date * 1000 : 60 * 1000;
				var exp = new Date();
				exp.setTime(exp.getTime() + Days);
				document.cookie = key + "=" + encodeURIComponent(value) + domain + ";expires=" + exp.toGMTString() + ";path=/"
			} catch (e) {}
		},
		remove: function(key, domain) {
			this.set(key, "", -24 * 60 * 60, domain)
		}
	};
	c.net = {
		loadScript: function(url, args, callback) {
			var params = "";
			args = args || {};
			args.randomtime = Math.random();
			if (args && (typeof args === "object")) {
				var paramArr = [];
				for (var i in args) {
					paramArr.push(i + "=" + args[i])
				}
				params = paramArr.join("&")
			}
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = url + (url.indexOf("?") === false ? "?" : "&") + params;
			script.onload = script.onreadystatechange = function() {
				if (!this.readyState || (this.readyState == "complete" || this.readyState == "loaded")) {
					callback && callback();
					script.onreadystatechange = script.onload = null;
					script = null;
//                  $("#_alert_bg").hide();//隐藏浮尘
				}
			};
			document.getElementsByTagName("head")[0].appendChild(script)
		}
	};
	c.device = {
		isAndriod: /android/i.test(window.navigator.userAgent),
		isIphone: /iphone/i.test(window.navigator.userAgent),
		isIpad: /ipad/i.test(window.navigator.userAgent),
		isPC:function(){//判断是否PC
			var userAgentInfo = navigator.userAgent; 
	        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
	        var flag = true; 
	        for (var v = 0; v < Agents.length; v++) { 
	            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; } 
	        } 
	        return flag;
		},
		isWechat:function(){
			var ua = navigator.userAgent.toLowerCase();
    		return /micromessenger/i.test(ua) || /windows phone/i.test(ua);
		}
	};
	c.validate = {
		isEmpty: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "") ? false : true
		},
		isEmail: function(str) {
			return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/i.test(str)
		},
		isPhone: function(str) {
			return /^0?1[3|4|5|8][0-9]\d{8}$/.test(str)
		},
		isID: function(str) {
			return /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(str)
		},
		betweenLength: function(str, min, max) {}
	};
	c.geo = {
		getLocation: function(callback) {//获取纬经度
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(
					function(p){
					    callback(p.coords.latitude, p.coords.longitude);
					    return 
					},
					function(e){
					    var msg = e.code + "\n" + e.message;
					    switch(e.code) {
							case e.PERMISSION_DENIED:
								Jacky.util.alertBox("定位失败,用户拒绝请求地理定位");
								break;
							case e.POSITION_UNAVAILABLE:
								Jacky.util.alertBox("定位失败,位置信息是不可用");
								break;
							case e.TIMEOUT:
								Jacky.util.alertBox("定位失败,请求获取用户位置超时");
								break;
							case e.UNKNOWN_ERROR:
								Jacky.util.alertBox("定位失败,定位系统失效");
								break;
						}
					}
				);
			}
			
		}
	};
	return c
})(window.Jacky || {});
