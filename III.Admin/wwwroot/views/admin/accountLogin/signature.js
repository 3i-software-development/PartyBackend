
app.controller(
    "signature",
    function (
        $scope,
        $rootScope,
        $compile,
        $uibModal,
        $uibModalInstance,
        dataservice,
        $filter
    ) {
        $scope.cancel = function () {
            //$uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
        };
        var signature;
        var toolbarObj;
        var saveBtn;

        let items = [
            {
                text: "Png",
            },
            {
                text: "Jpeg",
            },
            {
                text: "Svg",
            },
        ];

        $scope.init = function () {
            saveBtn = document.getElementById("save");
            saveBtn.disabled = true;
            signature = new ej.inputs.Signature(
                {
                    maxStrokeWidth: 2,
                    change: function () {
                        updateSaveBtn();
                    },
                },
                "#signature"
            );
        };

        function updateSaveBtn() {
            if (!signature.isEmpty()) {
                saveBtn.disabled = false;
            }
        }

        $scope.Save = function () {
            // L?y th? canvas t? Syncfusion EJ2
            var canvas = signature.element;
            // L?y d? li?u hình ?nh t? canvas d??i d?ng base64
            var imageData = canvas.toDataURL();
            // ?óng modal
            $uibModalInstance.close(imageData);
        };

        setTimeout(function () {
            $scope.init();
        }, 3000); // Ch? 3 giây (1000 milliseconds)
    }
);
