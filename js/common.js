$(function(){
	FastClick.attach(document.body);
	
	//手机捕捉触摸事件
	document.addEventListener("touchstart", function(){}, true);
	$("header .back").on("tap click", function(e) {
        e.preventDefault();
        Jacky.util.goBack();
    });
	
    //返回顶部
    $('.wrap').append('<div id="gotop"></div>');
	Jacky.util.backTop('gotop');
   
})
//popup
function popup(config){
	var elem=config.elem,//目标层
		coverMove=(config && config.coverMove ? config.coverMove : false);//默认遮罩层不可移动
	Jacky.util.popup({elem:$(elem),move:coverMove});//popup
}

//发送验证码
function validate(obj){
	var wait=60;
	document.getElementById("validate").disabled = false; 
	time(obj);
	function time(obj) {
		if (wait == 0) {
			obj.removeAttribute("disabled");           
			obj.value="获取验证码";
			wait = 60;
			obj.style.backgroundColor="#fff";
		} else {
			obj.setAttribute("disabled", true);
			obj.value="重新发送(" + wait + ")";
			obj.style.backgroundColor="#fff";
			wait--;
			setTimeout(function() {
				time(obj)
			},
			1000)
		}
	}
}

//时间选择点击确定调用函数
function valueResult(obj){
	var value1 = $(obj).siblings('p').eq(0).find('input').val(),
		value1=value1?value1:$(obj).siblings('p').eq(0).find('span').text();
		value2 = $(obj).siblings('p').eq(1).find('span').text(),
		indexNum = $('.selectArea').data('num'),
		attrState = $('.selectArea').attr('data-service');
	popup({elem:'.selectArea'});
	
	if(attrState == "time"){
		var timeData = value1+"-"+value2;
		$('.cleanning').find('li').eq(indexNum).find('.timeData').html(timeData);
	}if(attrState == "area"){
		var timeData = value1+" "+value2;
		$('.upgrade').find('li').eq(indexNum).find('.timeData').html(timeData);
	}
}
//时间或者地点调用函数
function timeSelect(obj){
	var indexNum = $(obj).index();
	var attrState = $(obj).attr('data-attr');
	$('.selectArea').data('num',indexNum);
	$('.selectArea').data('service',attrState);		
	if(attrState == "time"){
		var firstTxt = $(obj).find('.timeData').text().split("-");
		$('.selectTime p').eq(0).find('span').text(firstTxt[0].replace(/^\s+|\s+$/g,""));//开始
		$('.selectTime p').eq(1).find('span').text(firstTxt[1].replace(/^\s+|\s+$/g,""));//结束
		popup({elem:'.selectArea'});
		$('.selectTime').show();
		$('.selectAddress').hide();
	}if(attrState == "area"){
		var secondTxt = $(obj).find('.timeData').text().split(" ");
		$('.selectAddress p').eq(0).find('input').val(secondTxt[0].replace(/^\s+|\s+$/g,""));//开始
		$('.selectAddress p').eq(1).find('span').text(secondTxt[1].replace(/^\s+|\s+$/g,""));//结束
		popup({elem:'.selectArea'});
		$('.selectTime').hide();
		$('.selectAddress').show();
	}
}
