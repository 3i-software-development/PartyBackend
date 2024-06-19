App.toastrSuccess = function (msg) {
    toastr.clear();
    toastr['success'](msg);
};

App.toastrInfo = function (msg) {
    toastr.clear();
    toastr['info'](msg);
};

App.toastrWarning = function (msg) {
    toastr.clear();
    toastr['warning'](msg);
};

App.toastrError = function (msg) {
    toastr.clear();
    toastr['error'](msg);
    errorSound.play().catch(err => {
        console.error('Lỗi khi phát âm thanh:', err);
    });

};


$(document).ready(function () {
    if (toastr != undefined) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }
});

