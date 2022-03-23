let editorExtensionId = "fbbjhoaakfhbggkegckmjafkffaofnkd";

(function(angular, $) {

    "use strict";

    angular.module("FileManagerApp").controller("FileManagerCtrl", [
        "$scope", "$rootScope", "$q", "$window", "$translate", "fileManagerConfig", "item", "fileNavigator", "apiMiddleware", "$timeout","$compile",
        function($scope, $rootScope, $q, $window, $translate, fileManagerConfig, Item, FileNavigator, ApiMiddleware, $timeout, $compile) {

        var $storage = $window.localStorage;
        $scope.config = fileManagerConfig;
        $scope.reverse = false;
        $scope.predicate = ["model.type", "model.name"];
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate[1] === predicate) ? !$scope.reverse : false;
            $scope.predicate[1] = predicate;
        };
        $scope.query = "";
        $scope.fileNavigator = new FileNavigator("FileManagerCtrl");
        $scope.apiMiddleware = new ApiMiddleware();
        $scope.uploadFileList = [];
        $scope.viewTemplate = $storage.getItem("viewTemplate") || "main_table_html"; // "main_icons_html";
        $scope.fileList = [];
        $scope.temps = [];

        $scope.notMatComune = true;
        $rootScope.menuFileManagerCtrl = true;
        $rootScope.menuFileManagerComuneCtrl = false;
        $rootScope.menuFileManagerComuneMezzaCtrl = false;
        $scope.$watch("temps", function() {
            if ($scope.singleSelection()) {
                $scope.temp = $scope.singleSelection();
            } else {
                $scope.temp = new Item({rights: 644});
                $scope.temp.multiple = true;
            }
        });

        $scope.fileNavigator.onRefresh = function() {
            $scope.temps = [];
            $scope.query = "";
            $rootScope.selectedModalPath = $scope.fileNavigator.currentPath;

            $scope.apiMiddleware.getTotal($scope.config.rootCode).then(function(data) {
                function parseMySQLDate(mysqlDate) {
                    var d = (mysqlDate || "").toString().split(/[- :]/);
                    return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
                }
                $scope.totalIncSize = data.result.size;
                $scope.totalIncFiles = data.result.files;
                $scope.incLastUpload = parseMySQLDate(data.result && data.result.lastUpload);
                $scope.dateNow = new Date();
            });
        };

        $scope.setTemplate = function(name) {
            $storage.setItem("viewTemplate", name);
            $scope.viewTemplate = name;
        };

        $scope.changeLanguage = function (locale) {
            if (locale) {
                $storage.setItem("language", locale);
                return $translate.use(locale);
            }
            $translate.use($storage.getItem("language") || fileManagerConfig.defaultLang);
        };

        $scope.isSelected = function(item) {
            return $scope.temps.indexOf(item) !== -1;
        };

        $scope.singleClickStud = function(item, $event) {
           $scope.selectOrUnselect(item, $event);
        };

        $scope.selectOrUnselect = function(item, $event) {
            console.log(item);
            $rootScope.menuFileManagerCtrl = true;
            $rootScope.menuFileManagerComuneCtrl = false;

            var indexInTemp = $scope.temps.indexOf(item);
            var isRightClick = $event && $event.which === 3;
            if ($event && $event.target.hasAttribute("prevent")) {
                $scope.temps = [];
                return;
            }
            if (!item || (isRightClick && $scope.isSelected(item))) {
                if($scope.totalSelecteds() > 1)
                {
					return;
                }
            }
            if ($event && $event.shiftKey && !isRightClick) {
                var list = $scope.fileList;
                var indexInList = list.indexOf(item);
                var lastSelected = $scope.temps[0];
                var i = list.indexOf(lastSelected);
                var current = undefined;
                if (lastSelected && list.indexOf(lastSelected) < indexInList) {
                    $scope.temps = [];
                    while (i <= indexInList) {
                        current = list[i];
                        !$scope.isSelected(current) && $scope.temps.push(current);

                        i++;
                    }
                    return;
                }
                if (lastSelected && list.indexOf(lastSelected) > indexInList) {
                    $scope.temps = [];
                    while (i >= indexInList) {
                        current = list[i];
                        !$scope.isSelected(current) && $scope.temps.push(current);
                        i--;
                    }
                    return;
                }
            }
            if ($event && $event.ctrlKey && !isRightClick) {
                $scope.isSelected(item) ? $scope.temps.splice(indexInTemp, 1) : $scope.temps.push(item);

                return;
            }
            $scope.temps = [item];
        };

        $scope.singleSelection = function() {
            return $scope.temps.length === 1 && $scope.temps[0];
        };

        $scope.totalSelecteds = function() {
            return $scope.temps.length;
        };

        $scope.selectionHas = function(type) {
            return $scope.temps.find(function(item) {
                return item && item.model.type === type;
            });
        };

        $scope.prepareNewFolder = function() {
            var item = new Item(null, $scope.fileNavigator.currentPath, $scope.fileNavigator.currentCode);
            $scope.temps = [item];
            return item;
        };

        $scope.smartClick = function(item) {
            var pick = $scope.config.allowedActions.pickFiles;
            if (item.isFolder()) {
                return $scope.fileNavigator.folderClick(item);
            }

            if (typeof $scope.config.pickCallback === "function") {
                var callbackSuccess = $scope.config.pickCallback(item.model);
                if (callbackSuccess === true) {
                    return;
                }
            }

            if (item.isImage()) {
                if ($scope.config.previewImagesInModal) {
                    return $scope.openImagePreview(item);
                }
                return $scope.apiMiddleware.download(item, true);
            }
			else{
				return $scope.apiMiddleware.download(item, false);
			}

            if (item.isEditable()) {
                return $scope.openEditItem(item);
            }
        };

        $scope.modal = function(id, hide, returnElement) {
            if (id === "compress") {
              $scope.apiMiddleware.processAmount($scope.temps).then(function(data) {
                  $scope.totalSize = data.result.size;
                  $scope.nFiles = data.result.files;
                  $scope.lastUpload = data.result.lastUpload;
              });
            }

            var element = $("#" + id);
            element.modal(hide ? "hide" : "show");
            $scope.apiMiddleware.apiHandler.error = "";
            $scope.apiMiddleware.apiHandler.asyncSuccess = false;

            return returnElement ? element : true;
        };

        $scope.modalWithPathSelector = function(id) {
            $rootScope.selectedModalPath = $scope.fileNavigator.currentPath;
            return $scope.modal(id);
        };

        $scope.isInThisPath = function(path) {
            var currentPath = $scope.fileNavigator.currentPath.join("/");
            return currentPath.indexOf(path) !== -1;
        };

        $scope.edit = function() {
            $scope.apiMiddleware.edit($scope.singleSelection()).then(function() {
                $scope.modal("edit", true);
            });
        };

        $scope.changePermissions = function() {
            $scope.apiMiddleware.changePermissions($scope.temps, $scope.temp).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal("changepermissions", true);
            });
        };

        $scope.download = function() {
            var item = $scope.singleSelection();
            if ($scope.selectionHas("dir")) {
                return;
            }
            if (item) {
                return $scope.apiMiddleware.download(item);
            }
            return $scope.apiMiddleware.downloadMultiple($scope.temps);
        };

        $scope.copy = function() {
            var item = $scope.singleSelection();
            if (item) {
                var name = item.tempModel.name.trim();
                var nameExists = $scope.fileNavigator.fileNameExists(name);
                if (nameExists && validateSamePath(item)) {
                    $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
                    return false;
                }
                if (!name) {
                    $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
                    return false;
                }
            }
            $scope.apiMiddleware.copy($scope.temps, $rootScope.selectedModalPath).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal("copy", true);
            });
        };

        $scope.compress = function() {
            var name = $scope.temp.tempModel.name.trim();
            var nameExists = $scope.fileNavigator.fileNameExists(name);

            if (nameExists && validateSamePath($scope.temp)) {
                $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
                return false;
            }
            if (!name) {
                $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
                return false;
            }
            $scope.apiMiddleware.compress($scope.temps, name, $scope.fileNavigator.currentCode).then(function() {
                $scope.fileNavigator.refresh();
                if (! $scope.config.compressAsync) {
                    return $scope.modal("compress", true);
                }
                $scope.apiMiddleware.apiHandler.asyncSuccess = true;
            }, function() {
                $scope.apiMiddleware.apiHandler.asyncSuccess = false;
            });
        };

        $scope.extract = function() {
            var item = $scope.temp;
            var name = $scope.temp.tempModel.name.trim();
            var nameExists = $scope.fileNavigator.fileNameExists(name);

            if (nameExists && validateSamePath($scope.temp)) {
                $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
                return false;
            }
            if (!name) {
                $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
                return false;
            }

            $scope.apiMiddleware.extract(item, name, $rootScope.selectedModalPath).then(function() {
                $scope.fileNavigator.refresh();
                if (! $scope.config.extractAsync) {
                    return $scope.modal("extract", true);
                }
                $scope.apiMiddleware.apiHandler.asyncSuccess = true;
            }, function() {
                $scope.apiMiddleware.apiHandler.asyncSuccess = false;
            });
        };

        $scope.remove = function() {
            $scope.apiMiddleware.remove($scope.temps).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal("remove", true);
            });
        };

        $scope.move = function() {
            var anyItem = $scope.singleSelection() || $scope.temps[0];
            if (anyItem && validateSamePath(anyItem)) {
                $scope.apiMiddleware.apiHandler.error = $translate.instant("error_cannot_move_same_path");
                return false;
            }
            $scope.apiMiddleware.move($scope.temps, $rootScope.selectedModalPath).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal("move", true);
            });
        };

        $scope.rename = function() {
            var item = $scope.singleSelection();
            var name = item.tempModel.name;
            var samePath = item.tempModel.path.join("") === item.model.path.join("");
            if (!name || (samePath && $scope.fileNavigator.fileNameExists(name))) {
                $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
                return false;
            }
            $scope.apiMiddleware.rename(item).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal("rename", true);
            });
        };

        $scope.createFolder = function() {
            var item = $scope.singleSelection();
            var name = item.tempModel.name;
            if (!name || $scope.fileNavigator.fileNameExists(name)) {
                return $scope.apiMiddleware.apiHandler.error = $translate.instant("error_invalid_filename");
            }
            $scope.apiMiddleware.createFolder(item).then(function() {
                $scope.fileNavigator.refresh();
                $scope.modal("newfolder", true);
            });
        };

        $scope.addForUpload = function($files) {
            $scope.uploadFileList = $scope.uploadFileList.concat($files);
            $scope.modal("uploadfile");
        };

        $scope.removeFromUpload = function(index) {
            $scope.uploadFileList.splice(index, 1);
        };

        $scope.uploadFiles = function() {
          var promise;
          var files = $scope.uploadFileList;
          if (files && files.length) {
            var promiseList=[];
            for (var i = 0; i < files.length; i++) {
              promise = $scope.apiMiddleware.upload(files[i], $scope.fileNavigator.currentCode);
              promiseList.push(promise);
            }
          }
          $q.all(promiseList).then(function(){
            //This is run after all of your HTTP requests are done
            $scope.fileNavigator.refresh();
            $scope.uploadFileList = [];
            $scope.modal("uploadfile", true);
          });
        };

        var validateSamePath = function(item) {
            var selectedPath = $rootScope.selectedModalPath.join("");
            var selectedItemsPath = item && item.model.path.join("");
            return selectedItemsPath === selectedPath;
        };

        var getQueryParam = function(param) {
            var found = $window.location.search.substr(1).split("&").filter(function(item) {
                return param ===  item.split("=")[0];
            });
            return found[0] && found[0].split("=")[1] || undefined;
        };

        $scope.changeLanguage(getQueryParam("lang"));
        $scope.isWindows = getQueryParam("server") === "Windows";
        $scope.fileNavigator.refresh();

        $scope.caricaNuovoVideo = function(inc) {
            location.assign("https://didattica.polito.it/portal/pls/portal/sviluppo.materiale.videoupload?inc=" + inc);
        };

		function bytesToSize(bytes) {
		   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		   if (bytes == 0) return '0 Byte';
		   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		};

		$scope.download_status = 0; //0=Default, 1=Generating files list, 2=Downloading, 3=Zipping, 4=Done

		$scope.onDownloadSelectedButtonClicked = function ()
		{
			var tree = [];

			$scope.download_status = 1;

			updateProgressBar(0,"Starting",1);

			$scope.temps.forEach(function(el){
				if(el.model.code !== "")
					tree.push(el.model);
			});

			initializated = 0;
			usedir = 0;

			addListInDir(tree,true, function(){

				$scope.download_status = 2;
				var co = countFileList(tree);
				var mb = bytesToSize(co.size);
				if(confirm("Stai provando a scaricare "+co.count+" file ("+mb+").\nVuoi procedere?"))
				{
					zipAndDownloadAll(tree);

				}
				else{
					$scope.download_status = 0;
				}
			});

		}

		if(typeof chrome != "undefined") {
            var port = chrome.runtime.connect(editorExtensionId,{ name:"lalaland" });

            port.onMessage.addListener(function(msg)
            {
                if(msg.type === "downloadstatus")
                {
                    $scope.download_status = msg.val;
                }
                else if(msg.type === "updateProgressBar")
                {
                    updateProgressBar(msg.cs,msg.string,msg.tt);
                }
            });
        }


		function updateProgressBar(current_progress, string, type = 0)
		{
			var dynamic = $("#dynamic");

		    dynamic.css("width", current_progress + "%")
			.attr("aria-valuenow", current_progress)
			.text(string);

			switch(type) {
                case 0:
                    dynamic.removeClass("progress-bar-danger")
                        .removeClass("progress-bar-info")
                        .removeClass("progress-bar-warning")
                        .addClass("progress-bar-success");
                    break;
                case 1:
                    dynamic.removeClass("progress-bar-danger")
                        .removeClass("progress-bar-success")
                        .removeClass("progress-bar-warning")
                        .addClass("progress-bar-info");
                    break;
                case 2:
                    dynamic.removeClass("progress-bar-success")
                        .removeClass("progress-bar-info")
                        .removeClass("progress-bar-warning")
                        .addClass("progress-bar-danger");
                    break;
                case 3:
                    dynamic.removeClass("progress-bar-success")
                        .removeClass("progress-bar-info")
                        .removeClass("progress-bar-danger")
                        .addClass("progress-bar-warning");
                    break;
            }
		}


		function loadjsfile(filename){
			var fileref = document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", filename);
			if (typeof fileref!="undefined")
				document.getElementsByTagName("head")[0].appendChild(fileref);
		}

	function zipAndDownloadAll(tree)
	{
        if(typeof chrome != "undefined") {
            chrome.runtime.sendMessage(
                editorExtensionId, {
                    msg: "zipAndDownloadAll",
                    tree: tree
                }
            );
        } else {
            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", "https://didattica.polito.it/zip.html", true);
            xhttp.send(JSON.stringify(tree))
        }
	}

	function countFileList(list)
	{

		var count = 0;
		var size = 0;
		list.forEach(function(el){
			if(el.type !== "dir")
			{
				count++;
				size += el.size;
			}
			else
			{
				var re = countFileList(el.list);
				count += re.count;
				size += re.size;
			}
		});

		return {"count": count,"size": size};
	}


		var initializated = 0;
		var usedir = 0;

		function addListInDir(list, recursive, callback, depth = 0)
		{
			list.forEach(function(el)
			{
				console.log(el);
				if(el.type !== "dir")
				{

				}
				else {
					var code = el.code;

					usedir = 1;
					initializated++;
					var ret ;
					if ($scope.fileNavigator.callerCtrl === "FileManagerCtrl") {
						ret = $scope.fileNavigator.apiMiddleware.list($scope.fileNavigator.currentPath, $scope.fileNavigator.deferredHandler.bind($scope.fileNavigator), code);
					} else if ($scope.fileNavigator.callerCtrl === "FileManagerComuneMezzaCtrl") {
						ret = $scope.fileNavigator.apiMiddleware.listComuneMezza($scope.fileNavigator.currentPath, $scope.fileNavigator.deferredHandler.bind($scope.fileNavigator), code);
					} else if ($scope.fileNavigator.callerCtrl === "FileManagerComuneCtrl") {
						ret = $scope.fileNavigator.apiMiddleware.listComune($scope.fileNavigator.currentPath, $scope.fileNavigator.deferredHandler.bind($scope.fileNavigator), code);
					}


					var mmh = ret.then(function(data)
					{$scope
						console.log(data.result);
						el.list = data.result;

						if(recursive)
						{
							addListInDir(el.list, true, callback, depth+1);

							/*data.result.forEach(function(el)
							{
								if(el.type == "dir"){
									addListInDir(el, true, callback, depth+1);
								}
							});*/
						}

						initializated--;

						if(initializated === 0)
						{
							callback();
						}

					});
				}

			});

			if(usedir === 0)
			{
				callback();
			}


			return;
		}

		$scope.downloadStatus = function(){
			return $scope.download_status;
		};

		$scope.$watch('$viewContentLoaded',
			function() {
				$timeout(function() {
					console.log = function() {};

					// loadjsfile(extensionBase+"lib/FileSaver.min.js");
                    // loadjsfile(extensionBase+"lib/jszip.min.js");
                    // loadjsfile(extensionBase+"lib/jszip-utils.min.js");
                    var a = document.querySelector("#materialiPanel #navbarFm");

                    if(typeof chrome != "undefined") {
                        var code = `
					    <button id="button_download_selected" class="btn btn-primary" style="margin-left: 20px"
					    ng-disabled="totalSelecteds() == 0"
					    ng-click="onDownloadSelectedButtonClicked()"
					    ng-show="downloadStatus() == 0 || downloadStatus() == 4">
					    <i class="glyphicon glyphicon-th-large"></i> Download Selected
					    </button>

					    <div class="progress" style="margin-bottom: 0" ng-show="downloadStatus() != 0 && downloadStatus() != 4">
					        <div id="dynamic" class="progress-bar progress-bar-success active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
						        <span id="current-progress"></span>
					        </div>
					    </div>
					`;
                    } else {
                        var code = `
					    <button id="button_download_selected" class="btn btn-primary" style="margin-left: 20px; display: block"
					    ng-disabled="totalSelecteds() == 0"
					    ng-click="onDownloadSelectedButtonClicked()"
					    <i class="glyphicon glyphicon-th-large"></i> Download Selected
					    </button>

					    <div id="dynamic-container" class="progress" style="margin-bottom: 0; display: none">
					        <div id="dynamic" class="progress-bar progress-bar-success active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
						        <span id="current-progress"></span>
					        </div>
					    </div>
					`;
                    }

					var newelem = angular.element(code);
					newelem.insertBefore(a.firstChild);

					$compile(newelem)($scope);

					var menu = `
					<ul class="dropdown-menu dropdown-right-click" role="menu" aria-labelledby="dropdownMenu">
						<li ng-show="singleSelection() && singleSelection().isFolder()">
							<a href="" tabindex="-1" ng-click="smartClick(singleSelection())" class="ng-binding">
								<i class="glyphicon glyphicon-folder-open"></i> Apri
							</a>
						</li>
						<li ng-show="config.allowedActions.download && !selectionHas('dir') && singleSelection()" class="ng-hide">
							<a href="" tabindex="-1" ng-click="download()" class="ng-binding">
								<i class="glyphicon glyphicon-cloud-download"></i> Download
							</a>
						</li>
						<li class="" ng-show="downloadStatus() == 0 || downloadStatus() == 4">
							<a href="" tabindex="-1" ng-click="onDownloadSelectedButtonClicked()" class="ng-binding">
								<i class="glyphicon glyphicon-cloud-download"></i> Download as Zip
							</a>
						</li>
					</ul>
					`

					var cmenu = document.querySelector("#materialiPanel #context-menu");

					while (cmenu.firstChild) {
						cmenu.removeChild(cmenu.firstChild);
					}

					var newmenu = angular.element(menu);

					newmenu.appendTo(cmenu);

					$compile(cmenu)($scope);

					//a.insertAdjacentHTML('afterbegin',code);

					//button_download_selected =  document.getElementById("button_download_selected");
					//a.appendChild(butt_download_selected);


					//butt_download_selected.outerHTML = ;

					//console.log(angular);
				},1000);
		});


    }]);

})(angular, jQuery);

