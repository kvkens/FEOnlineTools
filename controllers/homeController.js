/**
 * title : 海尔商城前端上线主程序控制器
 * author: Kvkens
 * update: 2016.04.25 21:00:00
 */

var request = require('superagent');
var crypto = require('crypto');
var sqlop = require("../schemas/sqlop");

exports.index = function(req,res,next){
	//console.log("当前用户："+req.session.realname+" IP="+req.ip);

	res.render("index",{"session":req.session});
	sqlop.addguestlog({
		"username" : req.session.User&&req.session.User.username,
		"type" : "index",
		"ip" : req.ip,
		"msg" : "首页有访问"
	});
}
exports.svn2line = function(req,res,next){
	var url = req.query.url,
	user = req.session.User;
	if(user){
		request.get("http://www.ehaieridc.net/cgi-bin/su.cgi?directory=" + url).timeout(8000).end(function(err,result){
			if(err){
				res.json({"text":"错误，服务器超时，请检查是否切换上线HOST或没有连接上线VPN！"});
				sqlop.addonlinelog({
					"username" : user.username,
					"type" : "跳板机推送",
					"path" : url,
					"msg" : "操作失败没有切换Hosts or VPN"
				});
			}else{
				res.json(result);
				sqlop.addonlinelog({
					"username" : user.username,
					"type" : "跳板机推送",
					"path" : url,
					"msg" : "上线操作成功"
				});
			}
		});
	}else{
		res.json({"text":"登录失效，请刷新页面重新登录！"});
	}
}
exports.cdncache = function(req,res,next){
	var fullurl = req.query.fullurl,
	user = req.session.User,
	username = "",
	password = "";
	password = md5(username + password + fullurl);
	if(user){
		request.get("http://ccm.chinanetcenter.com/ccm/servlet/contReceiver").timeout(8000).query({
			"username":username,
			"passwd": password,
			"url" : fullurl
		}).end(function(err,result){
			if(err){
				res.json({"result": {"text":"网络超时没有响应，请检查网络！"}});
				sqlop.addonlinelog({
					"username" : user.username,
					"type" : "CDN",
					"path" : fullurl,
					"msg" : "操作失败，网络超时没有响应！"
				});
			}else{
				res.json({result});
				sqlop.addonlinelog({
					"username" : user.username,
					"type" : "CDN",
					"path" : fullurl,
					"msg" : result.text
				});
			}
			
		});
	}else{
		res.json({"result": {"text":"登录失效，请刷新页面重新登录！"}});
	}
	
}
exports.login = function(req,res,next){
	sqlop.loginByNamePwd(req.body.users,function(result){
		if(result){
			req.session.User = result;
			res.redirect("/");
		}else{
			res.render("error",{"session":req.session,"error":"似乎登录的时候密码不对！>.<"});
		}
	});
}
exports.logout = function(req,res,next){
	delete req.session.User;
	res.redirect("/");
}

exports.register = function(req,res,next){
	res.render("register",{"session":req.session});
}
exports.registerDo = function(req,res,next){
	sqlop.registerByNamePwd(req.body.users,function(result){
		if(result){
			res.render("ok",{"session":req.session});
		}else{
			res.render("error",{"session":req.session,"error":"注册失败，貌似用户名重复了！>.<"});
		}
	});
}
exports.getfilename = function(req,res,next){
	var user = req.session.User,
	rows = req.query.rows,
	pages = req.query.pages;

	if(user){
		if(rows&&pages){
			sqlop.getFileByName(user.username,function(result){
				res.send(result);
			},pages,rows);
		}else{
			sqlop.getFileByName(user.username,function(result){
				res.send(result);
			});
		}
	}else{
		res.sendStatus(500);
	}
}
exports.addfilename = function(req,res,next){
	var obj = {};
	obj.username = (typeof req.session.User !== "undefined" ? req.session.User.username : null);
	obj.filename = req.body.inputFileName;
	obj.path = req.body.inputFileUrl;
	if(obj.username){
		sqlop.addFileByName(obj,function(result){
			res.json(result);
		});
	}else{
		res.sendStatus(500);
	}
}
exports.updatefilename = function(req,res,next){
	var obj = {};
	obj.username = (typeof req.session.User !== "undefined" ? req.session.User.username : null);
	obj.id = req.body.id;
	obj.filename = req.body.inputFileName;
	obj.path = req.body.inputFileUrl;
	if(obj.username){
		sqlop.updateFileByName(obj,function(result){
			res.json(result);
		});
	}else{
		res.sendStatus(500);
	}
}
exports.deletefilename = function(req,res,next){
	var obj = {};
	obj.username = (typeof req.session.User !== "undefined" ? req.session.User.username : null);
	obj.id = req.body.id;
	if(obj.username){
		sqlop.deleteFileByName(obj,function(result){
			res.json(result);
		});
	}else{
		res.sendStatus(500);
	}
}

exports.log = function(req,res,next){
	if(req.session.User){
		res.render("log",{"session":req.session});
	}else{
		res.redirect("/");
	}
}
exports.admin = function(req,res,next){
	if(req.session.User){
		if(req.session.User.username !== "admin"){
			res.redirect("/");
		}else{
			res.render("admin",{"session":req.session});
		}
	}else{
		res.redirect("/");
	}
}

exports.getlog = function(req,res,next){
	var user = req.session.User,
	rows = req.query.rows,
	pages = req.query.pages;
	if(user){
		if(rows&&pages){
			sqlop.getOnlineLog(user,function(result){
				res.send(result);
			},pages,rows);
		}else{
			sqlop.getOnlineLog(user,function(result){
				res.send(result);
			});
		}
	}else{
		res.sendStatus(500);
	}
}
exports.getadminid = function(req,res,next){
	var user = req.session.User,
	rows = req.query.rows,
	pages = req.query.pages;
	if(req.session.User){
		if(req.session.User.username !== "admin"){
			res.sendStatus(500);
		}else{
			if(rows&&pages){
				sqlop.getAdminID(function(result){
					res.send(result);
				},pages,rows);
			}else{
				sqlop.getAdminID(function(result){
					res.send(result);
				});
			}
		}
	}else{
		res.sendStatus(500);
	}
}


// exports.addlog = function(req,res,next){
// 	var log = {};
// 	log.username = (typeof req.session.User !== "undefined" ? req.session.User.username : null);
// 	log.type = req.body.type;
// 	log.filename = req.body.inputFileName;
// 	log.path = req.body.inputFileUrl;
// 	if(log.username){
// 		sqlop.addonlinelog(log,function(result){
// 			res.json(result);
// 		});
// 	}else{
// 		res.sendStatus(500);
// 	}
// }


function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
};