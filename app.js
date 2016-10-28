/**
 * title : 海尔商城前端上线主程序
 * author: Kvkens
 * update: 2016.04.25 15:45:00
 */

//Express
var express = require("express");//引用express
var app = express();//获取express的app对象
var session = require('express-session');
var path = require('path');//路径引用
var fs = require("fs");
var bodyParser = require('body-parser');
var webRouter = require("./webRouter");//路由引入

if (!fs.existsSync("databases")){  
    fs.mkdirSync("databases", function (err){
        if (err) {  
            console.log(err);  
            return;  
        }  
    });  
}

app.use(session({//session持久化配置
	secret: "kvkenssecret",
	key: "kvkenskey",
	cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//超时时间
	resave: false,
  	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
	extended : true
}));

app.use(express.static(path.join(__dirname, 'assets')));//assets文件夹作为前端静态资源目录

app.use("/",webRouter);//启用页面路由
//app.use(bodyParser.json());
//ejs配置
app.set('views', path.join(__dirname, 'views'));//设置模板目录
app.set('view engine', 'html');//设置ejs引擎
app.engine('html', require('ejs-mate'));//可以使用.html
app.locals._layoutFile = 'layout.html';//默认layout文件

app.listen(process.env.PORT || 18080,function(){
	console.log("ehaier go online tool is start! http://ip:18080");
});