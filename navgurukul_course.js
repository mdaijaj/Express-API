const file=require("fs");
const express=require("express");
const app=express();
app.use(express.json())

//get all data using get method
app.get("/course_list" ,function(req,res) {
	var data =file.readFileSync("course.json");
	let jsonfile=JSON.parse(data)

	console.log(jsonfile)
	return res.send(jsonfile)
});

//add the data using post method
app.post("/course_list/create" ,function(req,res){
	var read=file.readFileSync("course.json");
	let jsondata=JSON.parse(read);
	var dic={
	"id":jsondata.length+1,
	"name":req.body.name,
	"description":req.body.description,
	"course":req.body.course
	}
	jsondata.push(dic)
	file.writeFileSync("course.json" ,JSON.stringify(jsondata,null,2));
	console.log(jsondata)
	return (res.send(dic));
});

//get all data by id call using get method
app.get("/course_list/:id" ,function(req,res){
	var read_data=file.readFileSync("course.json")
	let jsondata=JSON.parse(read_data);
	for (var item of jsondata){
		if (item.id==req.params.id){
			console.log(item)
			return(res.send(item))
		}
		else{
			return(res.send({'data':"There is invalid data please input valid id............."}));
		}
	}
});

//edit any data using put method
app.put("/course_list/create/:id", function(req,res){
	var dic={
	"name":req.body.name,
	"description":req.body.description,
	"course":req.body.course
}
	var read_data=file.readFileSync("course.json");
	let jsondata=JSON.parse(read_data);
	for (var j of jsondata){
		if (j.id==req.params.id){
			var index=jsondata.indexOf(j);
			jsondata[index].name=dic.name;
			jsondata[index].description=dic.description;
			file.writeFileSync("course.json",JSON.stringify(jsondata,null,2))
			console.log(jsondata)
			return (res.send(dic));
		}
	}

});

//delete any data by id call using delete method
app.delete("/course_list/delete/:id", function(req,res){
	var read_data=file.readFileSync("course.json");
	let real_data=JSON.parse(read_data);
	for(var k of real_data){
		if(k.id==req.params.id){
			real_data.splice(k.id-1, 1);
			file.writeFileSync('course.json', JSON.stringify(real_data, null, 2));
			return res.json(real_data);
		}
	}
	return res.json({'data': 'there is no data present'});
});

//get all data exercise using get method
app.get("/course_list/create/:id/exercise", function(req,res){     //start from here
	var read_data=file.readFileSync("exercise.json");
	var jsondata=JSON.parse(read_data);

	var all_data=jsondata[req.params.id-1]["exercise"];
	console.log(all_data);
	return res.send(all_data);	
});

//add any data exercise using post method
app.post("/course_list/create/:id/exercise/add_exercise", function(req,res){
	var read_data=file.readFileSync("exercise.json");
	let jsondata=JSON.parse(read_data);

	var mydic={
		'course_id':req.params.id,
		'id': jsondata[req.params.id-1]['exercise'].length +1,
		'name':req.body.name,
		'content':req.body.content,
		'hint':req.body.hint
	}

	jsondata[req.params.id-1]['exercise'].push(mydic);
	console.log('done');

	file.writeFileSync('exercise.json', JSON.stringify(jsondata, null, 2));
	res.json(mydic);
	console.log('done');
});

//get all data exercise by id calling using get method
app.get("/course_list/create/:course_id/exercise/:id", function(req,res){
	var read_data=file.readFileSync("exercise.json");
	let jsondata=JSON.parse(read_data);

	for (var element of jsondata){
		var exercise=element["exercise"];
		for (var k of exercise){
			if (k["course_id"] == req.params.course_id && k["id"] == req.params.id){
				console.log(k)
				return (res.send(k));
			}
		}
	}
			return(res.send({'data':"There is invalid data please input valid id............."}));
	});

//edit any data exercise by id calling using put method
app.put("/course_list/create/:course_id/exercise/add_exercise/:id", function(req,res){
	var dict={
		"name":req.body.name,
        "content": req.body.content,
        "hint": req.body.hint
	}
	var read_data=file.readFileSync("exercise.json");
	let jsondata=JSON.parse(read_data);

	for(var dt of jsondata){
		var exercise=dt["exercise"];
		for (var data of exercise){
			if (data["id"]==req.params.id && (data["course_id"]) == req.params.course_id){
				exercise[req.params.id-1].name = dict.name;
				exercise[req.params.id-1].content = dict.content;
				exercise[req.params.id-1].hint = dict.hint;

				file.writeFileSync("exercise.json",JSON.stringify(jsondata, null,2));
				console.log(exercise);
				return res.json(dict);
			}
		}
	}	
});

//delete data using id and use data method
app.delete("/course_list/create/:course_id/exercise/delete/:exercise_id", function(req,res){
	var read_data=file.readFileSync("exercise.json");
	var real_data=JSON.parse(read_data);

	for (var k of real_data){
		var exercise=k["exercise"];
		for (var data of exercise){
			if (data.course_id==req.params.course_id && data.exercise_id==req.params.id){
				exercise.splice(data.id-1,1);
				file.writeFileSync("exercise.json", JSON.stringify(real_data, null,2));
				res.send(exercise);
			}
			return (res.send("There is no element by your input data"));
		}
	}
	
});

//comment all username by calling userid using get method
app.get("/course_list/create/:course_id/exercise/:exercise_id/all_comment", function(req,res){
	var read_data=file.readFileSync("comment.json");
	var jsondata=JSON.parse(read_data);

	for (var j of jsondata){
		if (req.params.course_id==j["id"]){
			for (var k of j["exercise"]){
				if (req.params.exercise_id ==k['exercise_id']){
					console.log(k['submission'])
					res.json(k['submission'])
				}
			}
		}
	}
});

//add comment of new username by userid using post method
app.post("/course_list/create/:course_id/exercise/:exercise_id/all_comment/add_comment", function(req,res){
	var read_data=file.readFileSync("comment.json");
	var jsondata=JSON.parse(read_data);
	
	var mydic={
		'user_id': jsondata[req.params.course_id-1]["exercise"][req.params.exercise_id-1]["submission"].length+1,
		'username':req.body.username,
		'content':req.body.content
	}
	for (var i of jsondata){
		if (req.params.course_id==i["id"]){
			for (var k of i["exercise"]){
				if(k["exercise_id"] == req.params.exercise_id){
					var all_data=k["submission"];
					all_data.push(mydic);
					file.writeFileSync("comment.json", JSON.stringify(jsondata, null,2));
					console.log(mydic);
					return(res.send(mydic))
				}
			}
		}
	}
})	
app.listen(port=8081,function(){
	console.log("server is running");
});