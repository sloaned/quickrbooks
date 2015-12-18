var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path')
require('../models/users');
var User = mongoose.model('User');
require('../models/projects');
var Project = mongoose.model('Project');
require('../models/reports');
var Report = mongoose.model('Report');

//router.use("/js")express.static(__dirname + "../p")
/* GET home page. */

function checkAuth(req,res,next){
  console.log(req.user)
   if(!req.user){
     if(req.xhr)res.send({message:"no can do!"})
     else res.redirect('/')
 }
 else next()
}
router.all('/*',checkAuth)

router.get('/',function(req,res,next){
   res.render('index');
})


/* Post a project to database*/
router.post('/projects', function(req, res, next) {
  var project = new Project(req.body);
  User.findOne({"name": req.user}, "_id", function(err, id) {
      project.approver = id;
      project.save(function(err, project){
        if(err){ return next(err); }

        res.json(project);
      });
  });

});

// Test routes to get data from db
router.get('/users',function(req, res, next) {
    User.find(function(err, users) {
        if (err) {
            return next(err);
        }
        res.json(users);
    });
});

router.get('/projects', checkAuth,function(req, res, next) {
    Project.find(function(err, projects) {
        if (err) {
            return next(err);
        }
        res.json(projects);
    });
});
/*
router.get('/expense-report', function(req, res, next) {
    Report.find(function(err, reports) {
        if (err) {
            return next(err);
        }
        res.json(reports);
    });
});*/

router.get('/expense-report/:id', function(req, res, next){
	var idString = req.params.id.toString();
	console.log("in route for /expense-report/:id");
	console.log(idString);
	var objId = mongoose.Types.ObjectId(idString);
	Report.findById(objId, function(err, report){
		if (err) {
            return next(err);
        }
        res.json(report);
	});
});

router.get('/expense-report', function(req, res, next){
	//var idString = req.params.id.toString();
	//var objId = mongoose.Types.ObjectId(idString);
	
	User.findOne({'name': req.user}, function(err, user){
		if(err){
			return next(err);
		}
		console.log("here's your user ID:");
		console.log(user._id);
		var usrId = user._id;
		Report.find({'user': usrId}, function(error, reports){
			if(error){
				return next(error);
			}
			res.json(reports);
		});
	});
		/*Project.findById(reports.project, function(err, project){
			reports.project = project;
		});*/    
});

router.post('/expense-report', function(req, res, next){
	var report = new Report(req.body);
	console.log("the new report:");
	console.log(req.body);
    report.save(function(err, report){
      if(err){ return next(err); }
      res.json(report);
    });
});

router.put('/expense-report', function(req, res, next){
	var rep = req.body;
	if(rep.hasOwnProperty('items')){
		for(var i = 0; i < rep.items.length; i++)
		{
			rep.items[i].value = rep.items[i].value * 100;
		}
	}
	Report.findById(rep._id, function(err, report){
		if(err){ return next(err);}
		for(var field in Report.schema.paths){
			if((field !== '_id') && (field !== '__v')){
				if(rep[field] !== undefined)
				{
					report[field] = rep[field];
				}
			}
		}
		report.save(function(error, report){
			if(error){ return next(error); }
			res.json(report);
		});
	});	
});


// Get all line item types
router.get('/line-item-types', function(req, res, next) {
    var lineItemTypes = [{name: 'Mileage'}, {name: 'Per Diem'}, {name: 'Lodging'}, {name: 'Travel'}, {name: 'Meals'}, {name: 'Entertainment'}, {name: 'Parking'}, {name: 'Other'}];
    res.json(lineItemTypes);
});


// //Test routes to get data from db
// router.get('/users', function(req, res, next) {
//    User.find(function(err, users) {
//        if (err) {
//            return next(err);
//        }
//        res.json(users);
//    });
// });
//


router.get('/project/:id', function(req, res, next){
	var idString = req.params.id.toString();
	console.log("in route for /project/:id");
	console.log(idString);
	var objId = mongoose.Types.ObjectId(idString);
	Project.findById(objId, function(err, project){
		if (err) {
            return next(err);
        }
        res.json(project);
	});
});



//router.get('/reports', function(req, res, next) {
// router.get('/projects', function(req, res, next) {
//    Project.find(function(err, projects) {
//        if (err) {
//            return next(err);
//        }
//        res.json(projects);
//    });
// });
//
// router.post('/reports', function(req, res, next) {
//     var aReport = new Report(req.body);
//     aReport.save(function(err, aReport) {
//        if (err) {
//            return next(err);
//        }
//        res.json(aReport);
//    });
//});
/*
router.get('/expense-report', function (req, res, next) {
    Report.find(function(err, reports) {
        if (err) {
            return next(err);
        }
        res.json(reports);
    });
});

router.post('/expense-report', function (req, res, next) {
    console.log("attempting to post");
    var expenseReport = new Report(req.body);

    expenseReport.save(function(err, post){
        if(err) { return next(err); }

        res.json(post);
    });
});*/

module.exports = router;
