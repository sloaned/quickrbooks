/**
 * Created by ddelaney on 12/3/2015.
 */
'use strict';

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('viewReports', {
            url: '/',
            templateUrl: '../templates/viewReports.tpl.html',
            controller: 'viewReportsCtrl',
            resolve: {
                ExpenseReports: function(userFactory, expenseReportFactory) {
					//return expenseReportFactory.getAllExpenseReports("56707a9e2c29fc36bf61955f");
                    return userFactory.getCurrentUser().then(
                        function(success) {
							console.log("here's your name");
							console.log(success.data.name);
                            return expenseReportFactory.getAllExpenseReports(success.data.name);
                        },
                        function(error) {
                            return "Not working";
                        }
                    );
                }/*,
				SetExpenseReport: function(report, expenseReportCtrl) {
					expenseReportCtrl.setExpenseReport(report);
				}*/
            }
        }).state('viewReport', {
            url: '/report',
            templateUrl: '../templates/viewReport.tpl.html',
            controller: 'viewReportCtrl',
            resolve: {
                ExpenseReport: function(viewReportFactory) {
                    //stuff
                }
            }
        }).state('project', {
            url:'/projects',
            templateUrl: '../templates/project.tpl.html',
            controller: 'projectCtrl'
        }).state('expenseReport', {
            url: '/expense-report',
            views:{
                '':{templateUrl: '../templates/expense_report.tpl.html',
                    controller: 'expenseReportCtrl'},
                'projectSelect@expenseReport':{templateUrl: '../templates/projectSelect.tpl.html',
                                                controller: 'projectSelectCtrl'}},
            resolve: {
                LineItemTypes: function(expenseReportFactory) {
                    return expenseReportFactory.getAllListItems();
                },
                getAllProjects: function(projectFactory) {
                    return projectFactory.getAll();
                }
            }
        }).state('createProject', {
              url: '/createProject',
              templateUrl: '../templates/project.tpl.html',
              controller: 'projectCreateCtrl'
        }).state('hayes', {
            url:'/hayes',
            templateUrl: '../templates/theme.tpl.html'
        });

}]);
