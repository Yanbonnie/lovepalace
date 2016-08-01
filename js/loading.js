(function(d) {
    var loading_dom = d.createElement("div");
    with (loading_dom) {
        addEventListener("touchstart", function(e) {
            e.preventDefault()
        }
        );
        addEventListener("touchmove", function(e) {
            e.preventDefault()
        }
        );
        addEventListener("touchend", function(e) {
            e.preventDefault()
        }
        )
    }
    loading_dom.className = "loading";
    loading_dom.innerHTML = '<div class="box-ct"><div class="box-bd"><div><div class="cm-loading-spinner"><span class="loading-top"></span><span class="loading-right"></span><span class="loading-bottom"></span><span class="loading-left"></span></div> <div class="msg">正在加载</div></div></div></div>';
    var first = d.body.firstChild;
    d.body.insertBefore(loading_dom, first);
    d.onreadystatechange = onComplete;
    function onComplete() {
        if (d.readyState == "complete" || d.readyState == "interactive") {
            setTimeout(function() {
                $(".loading").remove();
                $(".wrap").css("visibility", "visible");
              	
                //分屏加载图片
				Jacky.util.imgScrollRequest('.lazy img');
				$(window).scroll(function(){
					Jacky.util.imgScrollRequest('.lazy img');
				})
            }, 300);
        }
    }
}
)(document);

