/**
 * title : 海尔商城前端上线主程序数据库
 * author: Kvkens
 * update: 2016年05月09日 09:57:22
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('databases/database.sqlite3');
db.run("CREATE TABLE IF NOT EXISTS account (username TEXT,password TEXT,realname TEXT,regtime TIMESTAMP default (datetime('now', 'localtime')) )");
db.run("CREATE TABLE IF NOT EXISTS filelist (filename TEXT,path TEXT,username TEXT,filetime TIMESTAMP default (datetime('now', 'localtime')))");
db.run("CREATE TABLE IF NOT EXISTS logs (username TEXT,type TEXT,path TEXT,msg TEXT,logtime TIMESTAMP default (datetime('now', 'localtime')))");
db.run("CREATE TABLE IF NOT EXISTS logguest (username TEXT,type TEXT,ip TEXT,msg TEXT,guesttime TIMESTAMP default (datetime('now', 'localtime')))");



exports.addonlinelog = function(Log){
	db.serialize(function(){
		db.all("insert into logs (username,type,path,msg) values($username,$type,$path,$msg)",{
			$username : Log.username,
			$type : Log.type,
			$path : Log.path,
			$msg : Log.msg
		},function(err,row){
			
		});
	});
}
exports.addguestlog = function(Log){
	db.serialize(function(){
		db.all("insert into logguest (username,type,ip,msg) values($username,$type,$ip,$msg)",{
			$username : Log.username,
			$type : Log.type,
			$ip : Log.ip,
			$msg : Log.msg
		},function(err,row){
			
		});
	});
}

exports.getOnlineLog = function(User,cb,a,b){
	var condition = "";
	if(b&&a){
		condition = "limit " + (a - 1) * b + "," + b
	}
	db.serialize(function(){
		db.all("select username,type,path,msg,logtime from logs where username=$username order by logtime desc " + condition,{//where username=$username
			$username : User.username
		},function(err,row){
			cb(row);
		});
	});
}


//登录用户
exports.loginByNamePwd = function(User,cb){
	var username = User.username,
	password = User.password;
	db.serialize(function() {
	  db.get("SELECT username,password,realname FROM account where username=$username and password=$password",{
	  		$username : username,
	  		$password : password
	  }, function(err, row) {
	      if(row){
	      	cb(row);
	      }else{
	      	cb(false);
	      }
	  });
	});
}

//注册用户
exports.registerByNamePwd = function(User,cb){
	var username = User.username,
	password = User.password,
	realname = User.realname;
	db.serialize(function() {
	  db.all("SELECT username,password,realname FROM account where username=$username",{
	  		$username : username
	  }, function(err, row) {
	      if(row.length != 0){
	      	cb(false);
	      }else{
	      	db.all("insert into account (username,password,realname) values($username,$password,$realname)",{
	      		$username : username,
	      		$password : password,
	      		$realname : realname
	      	},function(a){
	      		if(!a){
	      			cb(true);
	      		}
	      	});
	      }
	  });
	});
}
//获得文件
exports.getFileByName = function(name,cb,a,b){
	var condition = "";
	if(b&&a){
		condition = "limit " + (a - 1) * b + "," + b
	}
	db.serialize(function(){
		db.all("select rowid,filename,path from filelist where username=$username order by filetime desc " + condition,{
			$username : name
		},function(err,row){
			cb(row);
		});
	});
}
//添加文件
exports.addFileByName = function(obj,cb){
	db.serialize(function(){
		db.all("insert into filelist (filename,path,username) values($filename,$path,$username)",{
			$filename : obj.filename,
			$path : obj.path,
			$username : obj.username
		},function(err,row){
			if(err){
				cb(false);
			}else{
				cb(true);
			}
			
		});
	});
}
//更新文件
exports.updateFileByName = function(obj,cb){
	db.serialize(function(){
		db.all("update filelist set filename = $filename,path = $path where rowid=$id",{
			$filename : obj.filename,
			$path : obj.path,
			$id : obj.id
		},function(err,row){
			if(err){
				cb(false);
			}else{
				cb(true);
			}
			
		});
	});
}
//删除文件
exports.deleteFileByName = function(obj,cb){
	db.serialize(function(){
		db.all("delete from filelist where rowid=$id",{
			$id : obj.id
		},function(err,row){
			if(err){
				cb(false);
			}else{
				cb(true);
			}
			
		});
	});
}
//获得文件
exports.getAdminID = function(cb,a,b){
	var condition = "";
	if(b&&a){
		condition = "limit " + (a - 1) * b + "," + b
	}
	db.serialize(function(){
		db.all("select rowid,username,password,realname,regtime from account order by regtime desc " + condition,{
			
		},function(err,row){
			cb(row);
		});
	});
}