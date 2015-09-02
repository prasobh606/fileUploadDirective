app.controller('UploadController',['$scope', function ($scope) {
$scope.fileAtr="prasobh"
$scope.fileNameChanged = function(element) {
	console.log(element.files[0]);
   alert("select file");
}

}]);
