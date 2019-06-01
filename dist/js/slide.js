define(["jquery"], function($){
	function banner(){
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

				/*$("#play").hover(function(){
					clearInterval(timer);
				}, function(){
					timer = setInterval(function(){
						iNow++;
						document.title = iNow;
						tab();
					}, 2000);
				})*/
			})
	}

	//实现选项卡菜单的
	function tab(){
		$.ajax({
			url: "../data/tab.json",
			success: function(arr){
				for(var i = 0; i < arr.length; i++){
					var node = $(`<button class = "${i == 0 ? 'active' : ''}">${arr[i].title}</button>`);
					node.appendTo($("#div1"));
				}
				for(var i = 0; i < arr.length; i++){
					var node2 = $(`<div style = "display: ${i == 0 ? 'block' : 'none'}">${arr[i].desc}</div>`);
					node2.appendTo($("#div1"));
				}
			},
			error: function(msg){
				alert("请求错误" + msg);
			}
		})

		//通过事件委托给按钮添加点击事件
		$("#div1").on("click", "button", function(){
			$(this).attr("class", "active").siblings("button").attr("class", '');
			$("#div1").find("div").css("display", 'none')
			.eq($(this).index()).css("display", "block");
		})
	}
	return {
		banner: banner,
		tab: tab
	}
})