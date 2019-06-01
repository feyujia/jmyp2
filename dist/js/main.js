console.log("加载成功");

//引入的所有模块
require.config({
	paths: {
		"jquery": "jquery-1.11.3",
		"jquery-cookie": "jquery.cookie",
		"parabola": "parabola",
		"gw": "index",
		"slide": "slide"
	},
	shim: {
		"jquery-cookie": ["jquery"],
		"parabola": {
			exports: "_"
		}
	}
})

//调用函数
require(["gw", "slide"], function(index, slide){
	gw.index();
	slide.banner();
	slide.tab();
})