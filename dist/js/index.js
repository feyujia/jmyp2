
alert(5+11);
//search
window.onload = function(){
				var acars = document.getElementById("car");
				var oDiv = document.getElementById("sub");

				acars.onmouseover = function(){
					oDiv.style.display = 'block';
				}
				acars.onmouseout = function(){
					oDiv.style.display= 'none';
				}
}

// 轮播
	$(function(){
				var aBtns = $("#play").find("ol").find("li");
				var oUl = $("#play").find("ul");
				var aLis = oUl.find("li");

				var iNow = 0; //设置，我当前点击的按钮的下标，当前应该显示图片的下标

				aBtns.click(function(){
					iNow = $(this).index();
					tab();
				})

				//切换图片
				function tab(){
					aBtns.attr("class", '').eq(iNow).attr("class", 'active');

					if(iNow == aBtns.size()){
						//iNow == 5 最后一张图片  让下标为0的按钮变成被选中
						aBtns.eq(0).attr("class", 'active');
					}

					oUl.stop().animate({
						top: -iNow * 150
					}, function(){
						if(iNow == aBtns.size()){
							oUl.css("top", 0);
							iNow = 0;
						}
					})
				}

				var timer = setInterval(function(){
					iNow++;
					document.title = iNow;
					tab();
				}, 2000);


				$("#play").mouseenter(function(){
					clearInterval(timer);
				})

				$("#play").mouseleave(function(){
					timer = setInterval(function(){
						iNow++;
						document.title = iNow;
						tab();
					}, 2000);
				})

				$("#play").hover(function(){
					clearInterval(timer);
				}, function(){
					timer = setInterval(function(){
						iNow++;
						document.title = iNow;
						tab();
					}, 2000);
				})
	})
