var Admin = {
	init : function(){
		var that = this;
		that.bindTabs();
	},
	bindTabs : function(){
		var that = this,
		$tab = $('a[data-toggle="tab"]'),
		$usertable = $("#tblAdminUserGrid");
		$usertable.find("tr:not([role=title])").on("click",function(e){
			// var tmp = $(this).find("td:eq(1)").text();
			// $(this).find("td:eq(1)").html("<input type='text' value='"+tmp+"' >").focus();
		});
		that.SysAdmin();
		$tab.on('show.bs.tab', function (e) {
		  switch($(this).text()){
		  	case "系统用户":
		  		that.SysAdmin();
		  	break;
		  }
		})
	},
	SysAdmin : function(){
		var that = this,
		itemArr = [],
		$grid = $("#tblAdminUserGrid");
		$grid.find("tr:not([role=title])").remove();
		$.get("/api/getAdminID",{},function(result){
			result.forEach(function(obj){
				itemArr.push("<tr><td>"+obj.username+"</td><td>"+obj.password+"</td><td>"+obj.realname+"</td><td>"+obj.regtime+"</td></tr>");
			});
			$grid.append(itemArr.join(""));
		},"json");
	}
};
$(function(){
	Admin.init();
});