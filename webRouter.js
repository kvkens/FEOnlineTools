/**
 * title : 海尔商城前端上线主程序路由机制
 * author: Kvkens
 * update: 2016.04.25 20:30:00
 */

var express = require("express");
var router = express.Router();

var home = require("./controllers/homeController");
var tool = require("./controllers/toolController");



//首页
router.get("/",home.index);
//日志
router.get("/Log",home.log);
//管理
router.get("/Admin",home.admin);
router.get("/api/getLog",home.getlog);
//SVN代码拉取线上
router.get("/api/svn2line",home.svn2line);
//刷新cdn
router.get("/api/cdncache",home.cdncache);
//login
router.post("/Login",home.login);
//注册页面
router.get("/Register",home.register);
//注册post
router.post("/Register",home.registerDo);
//登出
router.get("/Logout",home.logout);
//获取静态文件
router.get("/api/getFileName",home.getfilename);
//添加静态文件
router.post("/api/addFileName",home.addfilename);
//修改
router.post("/api/updateFileName",home.updatefilename);
//删除
router.post("/api/deleteFileName",home.deletefilename);
//获得所有账号
router.get("/api/getAdminID",home.getadminid);


//压缩测试
router.get("/static/compress",tool.index);
//404
router.all("*",function(req,res,next){
	res.send("别白费力气了！这一切都是徒劳啊亲~");
});
module.exports = router;