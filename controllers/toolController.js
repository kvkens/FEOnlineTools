var fs = require("fs");
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var CleanCSS = require('clean-css');


exports.index = function(req,res){
	var path = req.query.path,
	type = req.query.type,
	min = req.query.min,
	final_code = [];
	for(var i = 0;i < path.split(";").length;i++){
		final_code.push(fs.readFileSync(path.split(";")[i],"utf-8"));
	}
	switch(type){
		case "js":
			res.set('Content-Type', 'text/javascript');
			if(min=="true"){
				var ast = jsp.parse(final_code.join(";"));
				ast = pro.ast_mangle(ast);
				ast = pro.ast_squeeze(ast);
				res.send(pro.gen_code(ast));
			}else{
				res.send(final_code.join(";"));
			}
		break;
		case "css":
			res.set('Content-Type', 'text/css');
			if(min=="true"){
				res.send(new CleanCSS().minify(final_code.join(";")).styles);
			}else{
				res.send(final_code.join(";"));
			}
		break;
	}
}