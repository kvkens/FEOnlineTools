/**
*	首页
*/
var Page = {
	page : 1,
	rows : 5,
	id : 0,
	init : function(){
		var that = this;
		that.bindDropDownList();
		that.bindEvent();
	},
	bindEvent : function(){
		var that = this;
		$("#ddlFile").on("change",function(e){
			var url = $(this).val();
			if(url=="none"){
				$("#url,#fullurl").val("");
				return;
			}
			$("#url").val($("#url").val() + url+ "\n");
			$("#fullurl").val($("#fullurl").val() + "http://cdn09.ehaier.com/" + url + "\n");
		});
		$(".J_btnGoOnline").on("click",function(){
			$(".J_urlInfo").addClass("hidden");
			$(".J_urlInfoResult").removeClass("hidden").html("正在操作请等待结果……");

			if($("#url").val()==""){
				$(".J_urlInfo").html("预上线的静态文件相对路径不能为空哦！").removeClass("hidden");
				$(".J_urlInfoResult").addClass("hidden");
			}else{
				$(".J_urlInfo").addClass("hidden");
				$(".J_urlProcess").animate({
					"width":"100%"
				},3000);
				for (var i = 0; i < $("#url").val().trim().replace(/\n/g,"|").split("|").length; i++) {
					$.get("./api/svn2line",{ "url" : $("#url").val().trim().replace(/\n/g,"|").split("|")[i]},function(result){
						$(".J_urlInfoResult").html(result.text).removeClass("hidden");
						$(".J_urlProcess").css("width","0%");
					},"json");
				}
			}
		});
		$(".J_btnCache").on("click",function(){
			if($("#fullurl").val()==""){
				$(".J_fullurlInfo").html("刷新的CDN文件完整路径不能为空哦！").removeClass("hidden");
			}else{
				$(".J_fullurlInfo").addClass("hidden");
				$(".J_fullurlProcess").animate({
					"width":"100%"
				},3000);
				$.get("./api/cdncache",{ "fullurl" : $("#fullurl").val().trim().replace(/\n/g,";").split("|").join("") },function(result){
					$(".J_fullurlInfoResult").html(result.result.text).removeClass("hidden");
					$(".J_fullurlProcess").css("width","0%");
				},"json");
			}
		});
		// 配置事件操作
		$("#btnConfigSuccess").on("click",function(e){
			alert("开发中");
		});
		$("#btnAdd").on("click",function(e){
			var _that = this,
			$inputFileName = $("#inputFileName"),
			$inputFileUrl = $("#inputFileUrl"),
			$opform = $("#opform");

			if($inputFileName.val() == ""){
				$inputFileName.closest("div.form-group").addClass("has-error");
				return;
			}else{
				$inputFileName.closest("div.form-group").removeClass("has-error");
			}
			if($inputFileUrl.val() == ""){
				$inputFileUrl.closest("div.form-group").addClass("has-error");
				return;
			}else{
				$inputFileUrl.closest("div.form-group").removeClass("has-error");
			}

			var param = $opform.serialize();
			$.post("/api/addFileName",param,function(result){
				if(result){
					$opform[0].reset();
					that.bindDropDownList();
					that.bindGrid();
				}else{
					alert("错误");
				}
			},"json");
		});

		//update
		$("#btnUpdate").on("click",function(e){
			e.preventDefault();
			if(that.hasInputValue()){
				$.post("/api/updateFileName",that.getInputValue(),function(result){
					if(result){
						$("#opform")[0].reset();
						that.bindDropDownList();
						that.bindGrid();
					}
				},"json");
			}else{
				//alert("no");
			}

		});

		//delete
		$("#btnDelete").on("click",function(e){
			e.preventDefault();
			if(that.hasInputValue()){
				$.post("/api/deleteFileName",{"id":that.id},function(result){
					if(result){
						$("#opform")[0].reset();
						that.bindDropDownList();
						that.bindGrid();
					}
				},"json");
			}else{
				//alert("no");
			}

		});



		$('#myModal').on('shown.bs.modal', function(){
		  	that.bindGrid();
		});
		$('#myModal').on('hidden.bs.modal', function(){
		  	$("#opform")[0].reset();
		  	that.page = 1;
		});

		// 分页
		$("#btnUp,#btnDown").on("click",function(e){
			e.preventDefault();
			switch($(this).attr("id")){
				case "btnUp":
					--that.page;
					if(that.page<=1){
						that.page = 1;
					}
					break;
				case "btnDown":
					++that.page;
					break;
			}
			that.bindGrid(that.rows,that.page);
		});

		//绑定grid事件
		$("#tblGrid").on("click","tr",function(){
			that.loadInputValue($(this).data());
			that.id = $(this).data().id;
		});
	},
	loadInputValue : function(obj){
		var that = this;
		$("#inputFileName").val(obj.filename);
		$("#inputFileUrl").val(obj.path);

	},
	clearInputValue : function(){
		var that = this;
		$("#inputFileName").val("");
		$("#inputFileUrl").val("");

	},
	hasInputValue : function(){
		var result = false;
		if(($("#inputFileName").val()=="") || ($("#inputFileUrl").val()=="")){
			result = false;
		}else{
			result = true;
		}
		return result;
	},
	getInputValue : function(){
		var obj = {},
		that = this;
		obj["inputFileName"]=$("#inputFileName").val();
		obj["inputFileUrl"]=$("#inputFileUrl").val();
		obj["id"] = that.id;
		return obj;
	},
	bindGrid : function(rows,pages){
		var that = this,
		$grid = $("#tblGrid"),
		itemArr = [];
		var r = (typeof rows !== "undefined") ? rows : that.rows;
		var p = (typeof pages !== "undefined") ? pages  : that.page;
		if($grid.size()!==0){
			$.get("./api/getFileName",{ "rows" : r,"pages" : p },function(result){
				$grid.find("tr:not([role=title])").remove();
				result.forEach(function(obj){
					itemArr.push("<tr data-id="+obj.rowid+" data-filename="+obj.filename+" data-path="+obj.path+"><td>"+obj.filename+"</td><td>"+obj.path+"</td></tr>");
				});
				$grid.append(itemArr.join(""));
			},"json");
		}
	},
	bindDropDownList : function(){
		var that = this,
		$ddl = $("#ddlFile"),
		optionArr = [];
		$ddl.find("option").remove();
		optionArr.push("<option value=none >-=请选择静态文件=-</option>");
		if($ddl.size()!==0){
			$.get("./api/getFileName",function(result){
				result.forEach(function(obj){
					optionArr.push("<option value="+obj.path+" >"+obj.filename+"</option>");
				});
				$ddl.append(optionArr.join(""));
			},"json");
		}
		
	}
};

$(function(){
	Page.init();
});