//AMD规范
/*
	确定依赖的模块
	jquery jquery-cookie  抛物线
*/
define(["parabola", 'jquery', "jquery-cookie"], function(parabola, $){
	function index(){
		$(function(){

			sc_num();


			$.ajax({
				url: "../data/data.json",
				success: function(arr){
					//通过循环，将数据添加到我们的页面上
					for(var i = 0; i < arr.length; i++){
						$(`<li class = 'goods_item'>
								<div class = 'goods_pic'>
									<img src="${arr[i].img}" alt="">
								</div>
								<div class = 'goods_title'>
									<p>【京东超市】奥利奥软点小草莓</p>
								</div>
								<div class = 'sc'>
									<div id = '${arr[i].id}' class = 'sc_btn'>加入购物车</div>
								</div>
							</li>`).appendTo($(".goods_box ul"));

					}
					
				},
				error: function(msg){
					alert("请求错误：" + msg);
				}
			})

			//给购物车添加点击事件
			/*
				eval 将json格式的字符串转成数据结构
				【注】最外层是数组，里面对象

				每个域名下的cookie最多50条
				cookie最大 4kb
					只存储商品的id和数量
					[{id:id,num:1},{id:id,num:1}]
			*/
			$(".goods_box").on("click", ".sc_btn", function(){
				// alert(this.id);  拿到了当前点击加购物车按钮的商品的id
				var id = this.id;
				//1、判断是否是第一次添加商品
				var first = $.cookie("goods") == null ? true : false;

				if(first){
					//第一次
					$.cookie("goods", `[{id:${id},num:1}]`, {
						expires: 7
					});
				}else{
					//不是第一次

					//2、判断之前是否添加过该商品
					var cookieStr = $.cookie("goods");
					var cookieArr = eval(cookieStr);

					var isSame = false; //假设没添加过
					for(var i = 0; i < cookieArr.length; i++){
						if(cookieArr[i].id == id){
							isSame = true; //添加过
							cookieArr[i].num++;
						}
					}

					//3、如果之前没添加过
					if(!isSame){
						cookieArr.push({id: id, num: 1});
					}

					$.cookie("goods", JSON.stringify(cookieArr), {
						expires: 7
					});
				}
				sc_num();
				ballMove(this);
			})	
			
			/*
				给右侧购物车，添加移入移出
				mouseover mouseout
				mouseenter  mouseleave  JQ的官方函数
			*/
			$(".sc_right").mouseenter(function(){
				sc_msg();
				$(this).stop().animate({
					right: 0
				})
			})

			$(".sc_right").mouseleave(function(){
				$(this).stop().animate({
					right: -270
				})
			})


			/*
				抛物线运动
			*/
			function ballMove(oBtn){
				//1、先将小球显示出来，将小球的位置，挪动到按钮的位置
				$("#ball").css({
					display: "block",
					left: $(oBtn).offset().left,
					top: $(oBtn).offset().top
				});


				//运动小球，改成当前点击按钮所在的商品图片
				var str = $(oBtn).parent().prevAll(".goods_pic").find("img").attr('src');

				$("#ball").html($(`<img src = ${str}>`).css({
					width: 50,
					height: 50
				}));

			

				//计算要运动的偏移位置
				var X = $(".sc_right .sc_pic").offset().left - $("#ball").offset().left;
				var Y = $(".sc_right .sc_pic").offset().top - $("#ball").offset().top;


				//1、声明一个抛物线对象

				var bool = new Parabola({
					el: "#ball",
					targetEl: null,
					offset: [X, Y],
					duration: 500,
					curvature: 0.0005,
					callback: function(){
						$("#ball").hide();
					},
					autostart: true
				})
			}

			/*
				计算购物车中所有商品的数量
			*/
			function sc_num(){
				var cookieStr = $.cookie("goods");
				if(cookieStr){
					var cookieArr = eval(cookieStr);
					var sum = 0;
					for(var i = 0; i < cookieArr.length; i++){
						sum += cookieArr[i].num;
					}

					//修改页面上的数量
					$(".sc_right .sc_num").html(sum);
				}else{
					$(".sc_right .sc_num").html(0);
				}
			}

			/*
				加载购物车中的商品
			*/
			function sc_msg(){
				var cookieStr = $.cookie("goods");
				if(cookieStr){
					var cookieArr = eval(cookieStr);
					/*
						ajax再把数据下载下来，下来以后筛选中购物车中数据
					*/
					$.ajax({
						url: "../data/data.json",
						success: function(arr){
							var goodsArr = []; //放加入购物车的商品数据

							for(var i = 0; i < arr.length; i++){
								for(var j = 0; j < cookieArr.length; j++){
									if(arr[i].id == cookieArr[j].id){

										//添加商品数量进入
										arr[i].num = cookieArr[j].num;
										goodsArr.push(arr[i]);
									}
								}
							}

							//清空购物车中的数据
							$(".sc_right ul").html("");

							//再通过循环，将数据添加到购物车
							for(var i = 0; i < goodsArr.length; i++){
								$(`<li>
									<div class = 'sc_goodsPic'>
										<img src="${goodsArr[i].img}" alt="">
									</div>
									<div class = 'sc_goodsTitle'>
										<p>这是商品曲奇饼干</p>
									</div>
									<div class = 'sc_goodsBtn' id = '${goodsArr[i].id}'>购买</div>
									<div class = 'sc_goodsNum'>
										<span>商品数量：${goodsArr[i].num}</span>
										<button id = '${goodsArr[i].id}'>+</button>
										<button id = '${goodsArr[i].id}'>-</button>
									</div>
									<div class = 'sc_goodsBtn sc_goodsRemove' style = 'background-color: blue' id = '${goodsArr[i].id}'>删除</div>
								</li>`).appendTo(".sc_right ul");
							}

						},
						error: function(msg){
							alert("请求错误：" + msg);
						}
					})

				}else{
					$(".sc_right ul").html("");
				}
			}

			//清除购物车
			$("#clearBtn").click(function(){
				$.cookie("goods", null);
				sc_num();
			})

			//删除某一个商品

			$(".sc_right ul").on("click", ".sc_goodsRemove", function(){
				var id = this.id; //找到当前要删除的商品的id
				/*
					1、删除页面上的节点
					2、删除cookie中的数据
				*/
				$(this).closest("li").remove();

				var cookieStr = $.cookie("goods");
				var cookieArr = eval(cookieStr);
				for(var i = 0; i < cookieArr.length; i++){
					if(cookieArr[i].id == id){
						cookieArr.splice(i, 1);
						break;
					}
				}

				//判断是否是空数组
				if(!cookieArr.length){
					$.cookie("goods", null);
				}else{
					$.cookie("goods", JSON.stringify(cookieArr), {
						expires: 7
					})
				}

				//计算购物车商品数量
				sc_num();

			})

			/*
				给+号和-号按钮添加事件
			*/
			$(".sc_right ul").on("click", ".sc_goodsNum button", function(){
				var id = this.id;
				//找出要+和-的商品的id
				var cookieStr = $.cookie("goods");
				var cookieArr = eval(cookieStr);
				for(var i = 0; i < cookieArr.length; i++){
					if(id == cookieArr[i].id){
						//先去判断点击的+ 还是 -

						if(this.innerHTML == "+"){
							cookieArr[i].num++;

						}else{
							if(cookieArr[i].num == 1){
								alert("当前商品数量为1，不能再删除");
							}else{
								cookieArr[i].num--;
							}
						}

						$(this).prevAll("span").html("商品数量：" + cookieArr[i].num);

						break;
					}
				}

				$.cookie("goods", JSON.stringify(cookieArr), {
					expires: 7
				})

				sc_num();

				return false;
			})

		})
	}
	return {
		index: index
	}
})