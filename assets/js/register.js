var Page = {
	init : function(){
		var that = this;
		that.bindEvent();
	},
	bindEvent : function(){
		var $account = $("#inputAccount"),
		$password = $("#inputPassword"),
		$inputRealName = $("#inputRealName"),
		$btnReg = $("#btnReg"),
		$form = $("#frmReg"),
		that = this;

		$btnReg.on("click",function(e){
			e.preventDefault();
			if($account.val()==""){
				$account.closest("div.form-group").addClass("has-error");
				return;
			}else{
				$account.closest("div.form-group").removeClass("has-error");
			}
			if($password.val()==""){
				$password.closest("div.form-group").addClass("has-error");
				return;
			}else{
				$password.closest("div.form-group").removeClass("has-error");
			}
			if($inputRealName.val()==""){
				$inputRealName.closest("div.form-group").addClass("has-error");
				return;
			}else{
				$inputRealName.closest("div.form-group").removeClass("has-error");
			}

			$form.submit();

		});
	}
}
$(function(){
	Page.init();
});