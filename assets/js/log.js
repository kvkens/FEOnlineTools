var Log = {
	rows : 20,
	page : 1,
	init : function(){
		
		this.bindLogGrid();
		this.bindButton();
	},
	bindButton : function(){
		var that = this;
		$("#btnLogUp,#btnLogDown").on("click",function(e){
			e.preventDefault();
			switch($(this).attr("id")){
				case "btnLogUp":
					--that.page;
					if(that.page<=1){
						that.page = 1;
					}
					break;
				case "btnLogDown":
					++that.page;
					break;
			}
			that.bindLogGrid(that.rows,that.page);
		});
	},
	bindLogGrid : function(rows,pages){
		var $grid = $("#tblLogGrid"),
		that = this,
		itemArr = [];
		var r = (typeof rows !== "undefined") ? rows : that.rows;
		var p = (typeof pages !== "undefined") ? pages  : that.page;
		if($grid.size()!==0){
			$.get("./api/getLog",{ "rows" : r,"pages" : p },function(result){
				$grid.find("tr:not([role=title])").remove();
				result.forEach(function(obj){
					itemArr.push("<tr><td>"+obj.logtime+"</td><td>"+obj.type+"</td><td>"+obj.path+"</td><td>"+obj.msg+"</td><td>"+obj.username+"</td></tr>");
				});
				$grid.append(itemArr.join(""));
			},"json");
		}
	}
};
$(function(){
	Log.init();
});