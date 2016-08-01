(function($){
	$.fn.mdater = function(config){
		var defaults = {
			maxDate : null,
			minDate : new Date(1970, 0, 1)
		};
		var option = $.extend(defaults, config);
//		window.console && console.log(this);
		var input = this;
		//通用函数
		var F = {
			//计算某年某月有多少天
			getDaysInMonth : function(year, month){
			    return new Date(year, month+1, 0).getDate();
			},
			//计算某月1号是星期几
			getWeekInMonth : function(year, month){
				return new Date(year, month, 1).getDay();
			},
			getMonth : function(m){
				return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
			},
			//计算年某月的最后一天日期
			getLastDayInMonth : function(year, month){
				return new Date(year, month, this.getDaysInMonth(year, month));
			}
		}

		//为$扩展一个方法，以配置的方式代理事件
		$.fn.delegates = function(configs) {//[function(){...},function(){...}]
		    el = $(this[0]);
		    for (var name in configs) {
		        var value = configs[name];
		        if (typeof value == 'function') {
		            var obj = {};
		            obj.tap = value;
		            value = obj; //vaule= {tap:function(){...}}
		        };
		        for (var type in value) {
		            el.delegate(name, type, value[type]);
		        }
		    }
		    return this;
		}

		var mdater = {
			value : {
				year : '',
				month : '',
				date : ''
			},
			lastCheckedDate : '',
			init : function(){
				this.initListeners();
			},
			renderHTML : function(){
				var $html = $('<div class="md_mask"></div><div class="md_panel"><div class="md_head"><div class="md_selectarea"><a class="md_prev change_year" href="javascript:void(0);"></a> <a class="md_headtext yeartag" href="javascript:void(0);"></a> <a class="md_next change_year" href="javascript:void(0);"></a></div><div class="md_selectarea"><a class="md_prev change_month" href="javascript:void(0);"></a> <a class="md_headtext monthtag" href="javascript:void(0);">月</a> <a class="md_next change_month" href="javascript:void(0);"></a></div></div><div class="md_body"><ul class="md_weekarea fn-clear"><li>周日</li><li>周一</li><li>周二</li><li>周三</li><li>周四</li><li>周五</li><li>周六</li></ul><ul class="md_datearea in fn-clear"></ul></div><div class="md_foot"><a href="javascript:void(0);" class="md_ok">确定</a> <a href="javascript:void(0);" class="md_cancel">取消</a></div></div>');
				if($('.md_mask').length==0){$(document.body).append($html);}
				return $html;
			},
			_showPanel : function(container){
				$("body").bind("touchmove", function(event) {
					event.preventDefault()
				}, false);
				this.refreshView();
				$('.md_panel, .md_mask').fadeIn();
			},
			_hidePanel : function(){
				$("body").unbind("touchmove");
				//$('.md_panel, .md_mask').removeClass('show');
				$('.md_panel, .md_mask').remove();
			},
			_changeMonth : function(add, checkDate){

				//先把已选择的日期保存下来
				this.saveCheckedDate();

				var monthTag = $('.md_selectarea').find('.monthtag'),
					num = ~~monthTag.data('month')+add;
				//月份变动发生了跨年
				if(num>11){
					num = 0;
					this.value.year++;
					$('.yeartag').text(this.value.year).data('year', this.value.year);
				}
				else if(num<0){
					num = 11;
					this.value.year--;
					$('.yeartag').text(this.value.year).data('year', this.value.year);
				}

				var nextMonth = F.getMonth(num)+'月';
				monthTag.text(nextMonth).data('month', num);
				this.value.month = num;
				if(checkDate){
					this.value.date = checkDate;
				}
				else{
					//如果有上次选择的数据，则进行赋值
					this.setCheckedDate();
				}
				this.updateDate(add);
			},
			_changeYear : function(add){
				//先把已选择的日期保存下来
				this.saveCheckedDate();

				var yearTag = $('.md_selectarea').find('.yeartag'),
					num = ~~yearTag.data('year')+add;
				yearTag.text(num+'年').data('year', num);
				this.value.year = num;

				this.setCheckedDate();

				this.updateDate(add);
			},
			//保存上一次选择的数据
			saveCheckedDate : function(){
				if(this.value.date){
					this.lastCheckedDate = {
						year : this.value.year,
						month : this.value.month,
						date : this.value.date
					}
				}
			},
			//将上一次保存的数据恢复到界面
			setCheckedDate : function(){
				if(this.lastCheckedDate && this.lastCheckedDate.year==this.value.year && this.lastCheckedDate.month==this.value.month){
					this.value.date = this.lastCheckedDate.date;
				}
				else{
					this.value.date = '';
				}
			},
			//根据日期得到渲染天数的显示的HTML字符串
			getDateStr : function(y, m, d){
				var dayStr = '';
				//计算1号是星期几，并补上上个月的末尾几天
				var week = F.getWeekInMonth(y, m);
				var lastMonthDays = F.getDaysInMonth(y, m-1);
				for(var j=week-1; j>=0; j--){
					dayStr += '<li class="prevdate" data-day="'+(lastMonthDays-j)+'">'+(lastMonthDays-j)+'</li>';
				}
				//再补上本月的所有天;
				var currentMonthDays = F.getDaysInMonth(y, m);
				//判断是否超出允许的日期范围
				var startDay = 1,
					endDay = currentMonthDays,
					thisDate = new Date(y, m, d),
					firstDate = new Date(y, m, 1);
					lastDate =  new Date(y, m, currentMonthDays),
					minDateDay = option.minDate.getDate();


				if(option.minDate>lastDate){
					startDay = currentMonthDays+1;
				}
				else if(option.minDate>=firstDate && option.minDate<=lastDate){
					startDay = minDateDay;
				}

				if(option.maxDate){
					var maxDateDay = option.maxDate.getDate();
					if(option.maxDate<firstDate){
						endDay = startDay-1;
					}
					else if(option.maxDate>=firstDate && option.maxDate<=lastDate){
						endDay = maxDateDay;
					}
				}


				//将日期按允许的范围分三段拼接
				for(var i=1; i<startDay; i++){
					dayStr += '<li class="disabled" data-day="'+i+'">'+i+'</li>';
				}
				for(var j=startDay; j<=endDay; j++){
					var current = '';
					date_type = 0;
					if(y==this.value.year && m==this.value.month && d==j){
						current = 'current';
					}
					/*--新修改(2016-5-26 18:01)  开始--*/
					for(var z=0; z<arr.length; z++){
						if(y==arr[z][0] && m==(arr[z][1]-1)){
							if(j==arr[z][2]){
								current = 'disabled';
							}
						}	
					}
					dayStr += '<li class="'+current+'" data-day="'+j+'">'+j+'</li>';
					/*--新修改(2016-5-26 18:01)  结束--*/
				}
				for(var k=endDay+1; k<=currentMonthDays; k++){
					dayStr += '<li class="disabled" data-day="'+k+'">'+k+'</li>';
				}

				//再补上下个月的开始几天
				var nextMonthStartWeek = (currentMonthDays + week) % 7;
				if(nextMonthStartWeek!==0){
					for(var i=1; i<=7-nextMonthStartWeek; i++){
						dayStr += '<li class="nextdate" data-day="'+i+'">'+i+'</li>';
					}
				}

				return dayStr;
			},
			updateDate : function(add){
				var dateArea = $('.md_datearea.in');
				if(add == 1){
					var c1 = 'out_left hide';
					var c2 = 'out_right hide';
				}
				else{
					var c1 = 'out_right hide';
					var c2 = 'out_left hide';
				}
				var newDateArea = $('<ul class="fn-clear md_datearea '+c2+'"></ul>');
				newDateArea.html(this.getDateStr(this.value.year, this.value.month, this.value.date));
				$('.md_body').append(newDateArea);
				
				
				setTimeout(function(){
					newDateArea.removeClass(c2).addClass('in');
					dateArea.removeClass('in').addClass(c1);
				}, 0);

			},
			//每次调出panel前，对界面进行重置
			refreshView : function(){
				var initVal = this.input.val(),
					date = null;
				if(initVal){
					var arr = initVal.split('-');
					date = new Date(arr[0], arr[1]-1 , arr[2]);
				}
				else{
					date = new Date();
				}
				var y = this.value.year = date.getFullYear(),
					m = this.value.month = date.getMonth(),
					d = this.value.date = date.getDate();
				$('.yeartag').text(y+'年').data('year', y);
				$('.monthtag').text(F.getMonth(m)+'月').data('month', m);
				var dayStr = this.getDateStr(y, m, d);
				$('.md_datearea').html(dayStr);
			},
			input : null,//暂存当前指向input
			initListeners : function(){
				var _this = this;
				input.on('tap', function(){
					_this.input = $(this);//暂存当前指向input
					
					/*--新修改(2016-5-26 18:01)  开始--*/
					if(_this.input.attr("data-mdtype")==2){
						arr = arr2;
					}else if(_this.input.attr("data-mdtype")==1){
						arr = arr1;
					}
					/*--新修改(2016-5-26 18:01)  结束--*/
					
					window.mdtype=$(this).data('mdtype')?$(this).data('mdtype'):0;
					if($('.md_mask').length){
						_this._hidePanel();
					}else{
						_this.renderHTML();
						var panel = $('.md_panel'),
						mask = $('.md_mask');
						_this.afterShowPanel(mask,panel);
						setTimeout(function () {
							_this._showPanel();
						}, 50);
					}
				});

			},
			afterShowPanel : function (mask,panel) {
				var _this = this;
				mask.on('tap', function(){
					_this._hidePanel();
				});
				panel.delegates({
					'.change_month' : function(){
						var add = $(this).hasClass('md_next') ? 1 : -1;
						_this._changeMonth(add);
					},
					'.change_year' : function(){
						var add = $(this).hasClass('md_next') ? 1 : -1;
						_this._changeYear(add);
					},
					'.out_left, .out_right' : {
						'webkitTransitionEnd' : function(){
							$(this).remove();
						}
					},
					'.md_datearea li' : function(){
						var $this = $(this);
						if($this.hasClass('disabled')){
							return;
						}
						_this.value.date = $this.data('day');
						//判断是否点击的是前一月或后一月的日期
						var add = 0;
//						if($this.hasClass('nextdate')){
//							add = 1;
//						}
//						else if($this.hasClass('prevdate')){
//							add = -1;
//						}
//
//						if(add !== 0){
//							_this._changeMonth(add, _this.value.date);
//						}
//						else{
//							$this.addClass('current').siblings('.current').removeClass('current');
//						}
						if(!$this.hasClass('nextdate') && !$this.hasClass('prevdate')){
							$this.addClass('current').siblings('.current').removeClass('current');
						}
					},
					'.md_ok' : function(){
						 
						var monthValue = ~~_this.value.month + 1;
						if(monthValue < 10){
							monthValue = '0' + monthValue;
						}
						var dateValue = _this.value.date;
						if(dateValue === ''){
							dateValue = _this.value.date = 1;
						}
						if(dateValue < 10){
							dateValue = '0' + dateValue;
						}
						window.mdDate=_this.value.year + '-' + monthValue + '-' + dateValue;
						//返回确定日期
						_this.input.text(_this.value.year + '-' + monthValue + '-' + dateValue);
						_this._hidePanel();
					},
					'.md_cancel' : function(){
						$("body").unbind("touchmove");
						_this._hidePanel();
					}
				});
			}
		}
		mdater.init();
	}
})(Zepto);