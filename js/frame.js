/**
* 描述： 框架页js
* 作者： kujvpi - kujvpi@outlook.com - 2017-03-13
* 版本： 1.0.1
**/
//屏蔽键盘F5  
document.onkeydown=function(){  
   if(window.event.keyCode == 116)  
   {  
     window.event.keyCode=0;  
     event.cancelBubble=true;  
     return false;  
   }  
};

var outerVm;

// DOM加载后执行
$(function(){
	/**
	* 描	述： 创建VUE实例
	**/
	outerVm = new Vue({
		el: ".erp-outer",
		data: {
			// 用户信息
			loginInfo:{
				name: "用户名",
				job: "信息"
			},
			// 用户菜单
			menuNav: [],
			// 标签
			lables: [ {
				// 窗口ID
				id: "index",
				// 窗口名称
				name: "首页",
				// 链接地址
				url: "http://cn.bing.com/",
				// 是否可关闭
				colse: false,	
				// 是否当前
				now: true
			} ],
			// 填写模块控制按钮
			fillCtrl: {
				max: true,
				main: true,
				restore: false,
				close: true
			},
			// listFrame数组
			listFrameIdArr: ["index"],
			// list标签宽度(px)
			listLablesWidth: 100
		},
		methods: {
			/**
			* 描	述： 填写模块操作
			**/
			fillC: function(str){
				var width1 = $(".view").width();
				var width2 = width1 > 732 ? 732 : width1;
				// 更改操作显示参数
				switch (str) {
					case "max":
						this.fillCtrl.max = false;
						this.fillCtrl.restore = true;
						$(".fill-conter").animate({width: width1+"px"});
						break;
					case "restore":
						this.fillCtrl.max = true;
						this.fillCtrl.restore = false;
						$(".fill-conter").animate({width: width2 + "px"});
						break;
					case "main":
						this.fillCtrl.max = true;
						this.fillCtrl.restore = false;
						$(".fill-conter").animate({width:"0px"});
						break;
					case "close":
						this.fillCtrl.max = true;
						this.fillCtrl.restore = false;
						// 删除正在进行的窗口
						$(".fill-view iframe:visible").remove();
						$(".fill-conter").animate({width:"0px"});
						break;
				};
			},
			/**
			* 描	述： 菜单列表点击操作， 参数(id, 链接, 名称)
			**/
			nemuListC: function(navId, navHref, navName){
				// 隐藏所有list窗口
				$(".view-view iframe").hide();
				// 关闭填写模块
				this.fillCtrl.max = true;
				this.fillCtrl.restore = false;
				$(".fill-conter").animate({width:"0px"});
				// 此窗口未打开
				if($.inArray(navId, this.listFrameIdArr) < 0){
					var str = '<iframe src="'+navHref+'" data-id="'+navId+'" data-name="'+navName+'" frameborder="0" width="100%" height="100%"></iframe>';
					for(var key in this.lables){
						this.lables[key].now = false;
					}
					var lableObj = {
						// 窗口ID
						id: navId,
						name: navName,
						url: navHref,
						colse: true,	
						now: true
					}
					// 添加lable标签
					this.lables.push(lableObj);
					// 添加listframe
					this.listFrameIdArr.push(navId);
					// 添加窗口
					$(".view-view").append(str);
					// 更新绑定拖动
					setViewLableArrangeable();
				}
				// 此窗口已经打开
				else{
					// 显示对应窗口
					$('.view-view iframe[data-id="'+navId+'"]').show();
					// 显示对应标签
					for(var key =0; key< this.lables.length; key++){
						if(this.lables[key].id == navId){
							this.lables[key].now = true;
						}else{
							this.lables[key].now = false;
						}
					}
				}
			},
			/**
			* 描	述： 菜单标签点击操作， 参数(id)
			**/
			nemuListLableC: function(navId){
				// 隐藏所有list窗口
				$(".view-view iframe").hide();
				// 关闭填写模块
				this.fillCtrl.max = true;
				this.fillCtrl.restore = false;
				$(".fill-conter").animate({width:"0px"});
				// 显示对应窗口
				$('.view-view iframe[data-id="'+navId+'"]').show();
				// 显示对应标签
				for(var key =0; key< this.lables.length; key++){
					if(this.lables[key].id == navId){
						this.lables[key].now = true;
						console.log(this.lables[key].name);
					}else{
						this.lables[key].now = false;
					}
				}
			},
			/**
			* 描	述： 菜单标签关闭操作， 参数(id)
			**/
			nemuListLableRemoveC: function(navId){
				// 判断元素在数组中的位置
				function indexOf(arr, str){
				    if(arr && arr.indexOf){
				        return arr.indexOf(str);
				    }
				    var len = arr.length;
				    for(var i = 0; i < len; i++){
				        // 定位该元素位置
				        if(arr[i] == str){
				            return i;
				        }
				    }
				    // 数组中不存在该元素
				    return -1;
				}
				
				// 删除本标签和窗口，显示对应标签和窗口
				for(var i=0; i < this.lables.length; i++){
					if(this.lables[i].id == navId){
						// 如果是当前标签
						if(this.lables[i].now){
							if(this.lables[i+1]){
								this.lables[i+1].now = true;
								$('.view-view iframe[data-id="'+this.lables[i+1].id+'"]').show();
							}else{
								this.lables[i-1].now = true;
								$('.view-view iframe[data-id="'+this.lables[i-1].id+'"]').show();
							}
						}
						// 删除元素
						this.lables.splice(i,1);
						// 删除窗口
						$('.view-view iframe[data-id="'+navId+'"]').remove();
						// 删除listFrameIdArr
						this.listFrameIdArr.splice(indexOf(this.listFrameIdArr, navId), 1);
					}
				}
				setViewLableArrangeable();
			}
		},
		computed: {
			
		}
	});
	
	
	/**
	* 描	述： 设置，监听模块尺寸
	**/
	// 窗口的高度
	var domHeight; 
	// 窗口的宽度
	var domWidth; 
	
	// 外容器
	var outer = $(".erp-outer");
	// 快捷模块
//	var shortcut = $(".shortcut-in");
	// 视图模块
	var view = $(".view");
	// 视图模块视图
	var viewView = $(".view-view");
	// 菜单模块
	var menu = $(".menu");
	var menuIn = $(".menu-in")
	// 菜单模块容器
	var menuCont = $(".menu-cont");
	// 填写部分容器
	var fillCont = $(".fill-conter");
	// 填写部分视图
	var fillView = $(".fill-view");
	
	// 设置函数
	var setSize = function(){
		// 窗口的高度
		domHeight = $(window).height(); 
		// 窗口的宽度
		domWidth = $(window).width(); 
		
		// 设置高度
		outer.height(domHeight);
//		shortcut.height(domHeight);
		view.height(domHeight);
		viewView.height(domHeight-50);
		menu.height(domHeight);
		menuIn.height(domHeight);
		fillCont.height(domHeight);
		fillView.height(domHeight);
		menuCont.height(domHeight - 266);
		
		// 设置视图模块 = 窗口宽度-（快捷模块 + 菜单模块宽度）
		view.width(domWidth-(menu.width()));
		
		// lable宽度
		if((outerVm.lables.length +1) * outerVm.listLablesWidth > view.width() ){
			outerVm.listLablesWidth = parseInt( view.width() / (outerVm.lables.length +1) );
		}
		
		outer.height(domHeight);
	}
	// 执行一次
	setSize();
	// 监听窗口改变
	$(window).on("resize", function(){
		setSize();
		// 填写框打开状态
		if(fillCont.width() > 0){
			// 设置填写框宽
			if(outerVm.fillCtrl.restore){
				fillCont.width(view.width());
			}else{
				if(view.width() > 732){
					fillCont.width(732);
				}else{
					fillCont.width(view.width());
				}
			}
		}
	})
	
	
	/**
	* 描	述： 视图模块最大化
	**/
	$(".view-max").click(function(){
		$(".menu-cont").width(0);
		$(this).hide();
		$(".menu-cont, .menu-nav, .menu-personal").hide();
		$(".menu-max").show();
		menu.animate({width:"70px"});
		view.animate({width: domWidth-70 +"px"});
	});
	
	
	/**
	* 描	述： 菜单最大化
	**/
	$(".menu-max").click(function(){
		view.animate({width: domWidth-400 +"px"});
		menu.animate({width:"400px"});
		$(".view-max").show();
		$(".menu-cont, .menu-nav, .menu-personal").show();
		$(".menu-cont").width(400);
		$(this).hide();
	});
	
	
	/**
	* 描	述： 菜单容器绑定
	**/
	outerVm.menuNav = dataArr; 
	outerVm.$nextTick(function(){
		// 1级菜单开关
		$(".menu-list h1").on("click", function(){
			$(".menu-list-box2").slideUp();
			$(".menu-list-h1-right").removeClass("fa-angle-left").addClass("fa-angle-up");
			$(".menu-list-box1").removeClass("col3");
			if($(this).attr("data-open") == "1"){
				$(".menu-list h1").attr("data-open", "0");
			}else{
				$(".menu-list h1").attr("data-open", "0");
				$(this).nextAll(".menu-list-box2").slideDown();
				$(this).parents(".menu-list-box1").addClass("col3");
				$(this).find(".menu-list-h1-right").removeClass("fa-angle-up").addClass("fa-angle-left");;
				$(this).attr("data-open", "1");
			}
		});
		// 2级菜单开关
		$(".menu-list h2[data-open], .menu-list h3[data-open]").on("click", function(){
			var box = $(this).nextAll("div");
			if(box[0]){
				if($(this).attr("data-open") == "1"){
					box.slideUp();
					$(this).attr("data-open", "0");
				}else{
					box.slideDown();
					$(this).attr("data-open", "1");
				}
			}
		});
	});
	
	
	/**
	* 描	述： VM实例渲染后执行绑定拖拽, 更新参数
	**/
	var setViewLableArrangeable = function(){
		// 解除绑定
		$(".view-lable-cont li").unbind();
		// lable宽度
		if((outerVm.lables.length +1) * outerVm.listLablesWidth > view.width() ){
			outerVm.listLablesWidth = parseInt( view.width() / (outerVm.lables.length +1) );
		}
		// 更新绑定
		outerVm.$nextTick(function(){
			// 拖拽插件绑定
			$(".view-lable-cont li").arrangeable();
		});
	}
	
	
	/**
	* 描	述： 个人中心设置
	**/
	// 点击头像打开
	$(".menu-personal-img p").click(function(){
		$(".menu-personal-img-bomb").toggle();
	})
	// 点击内容关闭
	$(".menu-personal-img-nav li").click(function(){
		$(".menu-personal-img-bomb").hide();
	})
	
	
	
	
	
	
	
});
