/* app.service('modalShowCheck',function(){
    var isIE7= {
        modalShown:false
            };
        return{
            switchModal:function(){
                console.log("switchModal clicked");
                isIE7.modalShown=!isIE7.modalShown; 
                },
            getStatus:function(){
                return isIE7;
            }
    };
}); */


app.directive('fileChange', ['$parse','$timeout','$q', function($parse,$timeout,$q) {

    return {
     /*  require: 'ngModel', */
      restrict: 'A',
	  /* templateUrl : "/api/filecontent/?url=modules/FileUpload/template/template.html", */
	  templateUrl : "template/template.html",
	  link: function ($scope, element, attrs) {
			$scope.init = function(){
				$scope.max = 100;
				$scope.filesList = [];
				$scope.elems = [];
				$scope.prev = [];
				$scope.attrib = [];
				$scope.progress =[];
				$scope.ajaxC = [];
				$scope.count = "";
				$scope.complete=[];
				$scope.selectedFiles = [];
				$scope.retry=[];
				$scope.abort=[];
				$scope.success=[];
				 $scope.totalLoaded =0;
					$scope.totalSize =0; 	
					$scope.partialLoaded = [];
					$scope.temp=0;
				$scope.progressAll =0;
				
			};	
			$scope.init();
		
		
			
			
			fileInput = element.children().find("input");
			filedragger = element.children().find("#file-dropper");
			//$scope.addEvents(fileDropper);
						
			fileInput.bind("change", function(e){ 
				 var formData = new FormData();
				 
				$scope.$apply(function () {
				$scope.processFile(e.target.files);
				
				/*  formData.append("fileToUpload", e.target.files[0]);
				 $scope.files.push( e.target.files[0]);
				 console.log($scope.files,"$scope.files",$scope.files.length);
				 sendFile(formData,$scope.files.length);
				 uploadFile(formData); */
				});
			});
			$scope.closeUploader = function(){
			var popupOverlay = document.getElementById("overlay-popup");
				var pupupContent = document.getElementById("FileUploadContent");
				
				popupOverlay.classList.remove("in");
				pupupContent.classList.remove("in");
			}	
			$scope.uploaderOpen = function(){
					$scope.init();
				var popupOverlay = document.getElementById("overlay-popup");
				var pupupContent = document.getElementById("FileUploadContent");
				
				popupOverlay.classList.add("in");
				pupupContent.classList.add("in");
			
			}
			$scope.progressHandler = function(event,data){
				if(event.lengthComputable){
					if(!$scope.$$phase) {


					
						$scope.$apply(function(){
							
							var fileListLength = data.id;
							
							$scope.elems[fileListLength] = {"label":"Uploaded" + event.loaded/1000 +" kb of " + event.total/1000 +"kb",
							"stat":Math.round((event.loaded / event.total) * 100)}
							
							if($scope.partialLoaded[data.id]){
								$scope.temp = $scope.partialLoaded[data.id];
							}
							$scope.partialLoaded[data.id]	= event.loaded;
							if($scope.totalLoaded){
								$scope.totalLoaded = $scope.totalLoaded - $scope.temp;
								$scope.temp = 0;
							}
							
							$scope.totalLoaded = $scope.totalLoaded + $scope.partialLoaded[data.id];
							
							$scope.progressAll = Math.round(($scope.totalLoaded / $scope.totalSize) * 100);	
								
							if(!$scope.prev[fileListLength]){
								$scope.attrib[fileListLength] = {
									prev:0,
									speed:0,
									remainingBytes:0
								} 
							}

							$scope.attrib[fileListLength].speed = event.loaded - $scope.attrib[fileListLength].prev	
							$scope.attrib[fileListLength].prev = event.loaded;	
							$scope.attrib[fileListLength].remainingBytes = event.total - event.loaded;
							$scope.attrib[fileListLength].timeRemaining = ($scope.attrib[fileListLength].remainingBytes / $scope.attrib[fileListLength].speed).toFixed(3);
						
						
						});
					}
				}else{
					
					console.log("error on uploading, uploading stopped");
				}
			};
			$scope.errorHandler = function(event,resp){
				
				console.log(resp,"Error");
				$scope.$apply(function(){
					$scope.serviceError(resp.id);
				});
			}
			$scope.completeHandler = function(event,resp){
				
				$scope.complete[resp.id] = true;
					if(!$scope.$$phase) {
						$scope.$apply(function(){
							$scope.abort[resp.id] = false;
							$scope.retry[resp.id] = false;
							$scope.success[resp.id] = true;
						})
					}
					
			}
			$scope.uploadFile = function(file){
					var fileObj = new Object();
					if("string" === (typeof $scope.count)){
						$scope.count = 0;
					}else{
						$scope.count++;
					}
					fileObj.id = $scope.count;
					fileObj.file = file
					
					
					//var options = $.extend({},this.options,fileObj);
					/* $scope.filesList.push($scope.count); */
					$scope.filesList[$scope.count]=file.name;
					$scope.selectedFiles[$scope.count]=file;
					var DataToSend = new FormData();
					DataToSend.append("fileToUpload", file);
					$scope.abort[$scope.count] = true;	
					$scope.ajaxC[$scope.count] = new XMLHttpRequest();
					
					/* ajax[$scope.count].upload.addEventListener("progress", this.progressHandler, false); */
					$scope.ajaxC[$scope.count].upload.addEventListener("progress",function(event){
						
						$scope.progressHandler(event,fileObj);
						
					}, false);
					$scope.ajaxC[$scope.count].addEventListener("error", function(event){
						$scope.errorHandler(event,fileObj);
					}, false);
					$scope.ajaxC[$scope.count].addEventListener("load",function(event){ 
						$scope.completeHandler(event,fileObj)
					 }, false);
					/* ajax.addEventListener("error", errorHandler, false);
					ajax.addEventListener("abort", abortHandler, false);  */
					/*   $scope.ajaxC[$scope.count].onreadystatechange=function()
					  {
						if($scope.ajaxC[$scope.count]){
							if (4 === $scope.ajaxC[$scope.count].readyState)
								{
									console.log($scope.ajaxC[$scope.count],"$scope.completed");
								}
						}
					  } */  
					
					console.log(file,"$scope.ajaxC[$scope.count]");
					$scope.totalSize= $scope.totalSize + file.size;
					//console.log($scope.formatSizeUnits($scope.totalSize),"size");
					var date = new Date();
					$scope.ajaxC[$scope.count].open("POST", $scope.PostUrl+"?t=" + date.getTime(),true);
					$scope.ajaxC[$scope.count].send(DataToSend);
					
					
			};
			
			$scope.formatSizeUnits = function(bytes){
					if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
					else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
					else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
					else if (bytes>1)           {bytes=bytes+' bytes';}
					else if (bytes==1)          {bytes=bytes+' byte';}
					else                        {bytes='0 byte';}
					return bytes;
			}
						
			$scope.processFile = function(file){
				
				
				for(var i=0;i<file.length;i++){
					// upload the file
					$scope.uploadFile(file[i]);
					
				}
				
			}
			$scope.addEvents = function(filedragger){
				var fileDropper = filedragger[0];
				fileDropper.addEventListener(
					'dragover',
					function(e) {
						e.dataTransfer.dropEffect = 'move';
						// allows us to drop
						if (e.preventDefault) {e.preventDefault();}
						this.classList.add('over');
						return false;
					},
					false
				);
				fileDropper.addEventListener(
					'dragenter',
					function(e) {
						this.classList.add('over');
						return false;
					},
					false
				);

				fileDropper.addEventListener(
					'dragleave',
					function(e) {
						this.classList.remove('over');
						return false;
					},
					false
				);
				fileDropper.addEventListener(
						'drop',
						function(e) {
							// Stops some browsers from redirecting.
							if (e.stopPropagation){ e.stopPropagation();}
							if (e.preventDefault) {e.preventDefault();}
							
								/* process the droped file. */ 
									$scope.processFile(e.dataTransfer.files);						
								//console.log(e.dataTransfer.files[0],"e.dataTransfer")
							

							return false;
						},
						false
				);
			}
			
			$scope.addEvents(filedragger);
			$scope.serviceError = function($index){
				if(!$scope.complete[$index]){
					$scope.ajaxC[$index].abort();
					$scope.retry[$index] = true;
					console.log($scope.ajaxC[$index],"index");
					$scope.progress[$index]='error-class';
					$scope.abort[$index] = false;
				}
				
			};
			$scope.abortAjax=function($index){
				if(!$scope.complete[$index]){
					$scope.ajaxC[$index].abort();
					$scope.retry[$index] = true;
					console.log($scope.ajaxC[$index],"index");
					$scope.progress[$index]='cancelled-class';
					$scope.abort[$index] = false;
				}
			};
			$scope.retryAjax=function($index){
				if(!$scope.complete[$index]){
					$scope.count = $index;
					if($scope.count>0){
						$scope.count = $scope.count - 1;
					}else{
						$scope.count = "";
					}
					
					$scope.progress[$index]='';
					$scope.retry[$index] = false;
					$scope.totalSize = $scope.totalSize - $scope.selectedFiles[$index].size;
					
					$scope.uploadFile($scope.selectedFiles[$index]);
				}
			}
			
		
		
      }
    };
  }]);

				
