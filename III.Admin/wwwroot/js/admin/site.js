/*=========================================================================================
  File Name: site.js
  Description: config message,scroll top
  initialization and manipulations
  ----------------------------------------------------------------------------------------
==========================================================================================*/

var config = {
    init: function () {
        config.loadMessage();
        config.scrollToTop();
        config.clickScrollToTop();
        config.removeZerofirst();
    },
    loadMessage: function () {
        App.inputFile = function () {
            $(".input-file").before(
                function () {
                    if (!$(this).prev().hasClass('input-ghost')) {
                        var element = $("<input type='file' id='File' class='input-ghost' style='display: none'>");
                        element.attr("name", $(this).attr("name"));
                        element.change(function () {
                            element.next(element).find('.inputFile').val((element.val().split('\\').pop()));
                        });
                        $(this).find("button.btn-choose").click(function () {
                            element.click();
                        });
                        $(this).find('input').css("cursor", "pointer");
                        $(this).find('input').mousedown(function () {
                            $(this).parents('.input-file').prev().click();
                            return false;
                        });
                        return element;
                    }
                }
            );
        }

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
    },
    clickScrollToTop: function () {
        $(".go2top").click(function (o) {
            o.preventDefault(),
                $("html, body").animate({
                    scrollTop: 0
                }, 600)
        })
    },
    scrollToTop: function () {
        var o = $(window).scrollTop();
        o > 100 ? $(".go2top").show() : $(".go2top").hide()
    },
    removeZerofirst: function () {
        $(document).on('input', '.remove-zero', function () {
            if (/^0/.test(this.value)) {
                this.value = this.value.replace(/^0/, "")
            }
            if (/^-/.test(this.value)) {
                this.value = this.value.replace(/^-/, "")
            }
        });
    },
}

var common = {
    ShowPopupModal: function (popupSrc, animateEffect, isModal) {
        animateEffect = animateEffect || 'mfp-slideDown';
        isModal = isModal || false;
        $.magnificPopup.open({
            removalDelay: 500,
            items: {
                src: popupSrc
            },
            // overflowY: 'hidden', // 
            callbacks: {
                beforeOpen: function (e) {
                    this.st.mainClass = animateEffect;
                }
            },
            midClick: false,
            showCloseBtn: true,
            modal: isModal,
        });
    },
    SearchPageAll: function () {
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });
        $.post('/Admin/Search/Index', function (response, status, xhr) {
            $('#modal-panel-lg').html(response);
            common.ShowPopupModal('#modal-panel-lg');
            App.unblockUI("#contentMain");
        });
    },
    CreateMeeting: function () {
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });

        $.post('/Admin/Meeting/CheckPermissonCreateMeeting', function (response, status, xhr) {
            if (response) {
                $.post('/Admin/Meeting/AddMeeting', function (response, status, xhr) {
                    $('#modal-panel-lg').html(response);
                    common.ShowPopupModal('#modal-panel-lg');
                    App.unblockUI("#contentMain");
                });
            } else {
                App.toastrError("Tài khoản không được phép tạo meeting");
                App.unblockUI("#contentMain");
            }
        });
    },
    EditMeeting: function (meetingID) {
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });

        meetingID = meetingID + '';

        $.post('/Admin/Meeting/CheckPermissonCreateMeeting', function (response, status, xhr) {
            if (response) {
                $.get('/Admin/Meeting/EditMeeting?meetingID=' + meetingID, function (response, status, xhr) {
                    $('#modal-panel-lg').html(response);
                    common.ShowPopupModal('#modal-panel-lg');
                    App.unblockUI("#contentMain");
                });
            } else {
                App.toastrError("Tài khoản không được phép sửa meeting");
                App.unblockUI("#contentMain");
            }
        });
    },
    InviteMeeting: function (meetingID) {
        $(".mfp-wrap").removeClass('hidden');
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });

        meetingID = meetingID + '';
        $.get('/Admin/Meeting/InviteMeeting?meetingID=' + meetingID, function (response, status, xhr) {
            $('#modal-panel-lg').html(response);
            common.ShowPopupModal('#modal-panel-lg');
            App.unblockUI("#contentMain");
        });
    },
    CreateGroup: function () {
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });

        $.post('/Admin/Chat/AddGroup', function (response, status, xhr) {
            $('#modal-panel-lg').html(response);
            common.ShowPopupModal('#modal-panel-lg');
            App.unblockUI("#contentMain");
        });
    },
    EditGroup: function (meetingID) {
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });

        meetingID = meetingID + '';

        $.post('/Admin/Chat/CheckPermissonCreateMeeting', function (response, status, xhr) {
            if (response) {
                $.get('/Admin/Meeting/EditMeeting?meetingID=' + meetingID, function (response, status, xhr) {
                    $('#modal-panel-lg').html(response);
                    common.ShowPopupModal('#modal-panel-lg');
                    App.unblockUI("#contentMain");
                });
            } else {
                App.toastrError("Tài khoản không được phép sửa meeting");
                App.unblockUI("#contentMain");
            }
        });
    },
    LogChangeExcel: function (fileCode, data) {
        var obj = {
            FileCode: fileCode,
            Data: data
        };
        jQuery.ajax({
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: "POST",
            url: "/Admin/Excel/LogChangeExcel",
            contentType: "application/json",
            dataType: "JSON",
            data: JSON.stringify(obj),
            success: function (rs) {
                App.unblockUI("#contentMain");
                App.toastrSuccess(rs.Title);
                getLastShift();
            },
            failure: function (errMsg) {
                App.toastrSuccess(errMsg);
            }
        });
    },
    ShowSearch: function () {
        if ($(".chat-call").hasClass('hidden')) {
            $(".chat-call").removeClass('hidden');
            $("#btnChat").addClass('hidden')
        } else {
            $(".chat-call").addClass('hidden');
            $("#btnChat").removeClass('hidden')
        }
    }
};

jQuery(document).ready(function () {
    config.init();
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

$(window).scroll(function () {
    config.scrollToTop();
    if ($('.modal.in').length != 0) {
        setModalDraggable('.modal-dialog');
    }
});

$(window).resize(function () {
    if ($('.modal.in').length != 0) {
        setModalMaxHeight($('.modal.in'));
    }
});

function addDay(dt, n) {
    return new Date(dt.setDate(dt.getDate() + n));
}
function addMonths(dt, n) {
    return new Date(dt.setMonth(dt.getMonth() + n));
}
function addYear(dt, n) {
    return new Date(dt.setYear(dt.getFullYear() + n));
}
function setStartDate(element, maxDate) {
    if (maxDate != '' && maxDate != null) {
        $(element).datepicker('setStartDate', toDate(maxDate));
    }
}
function setEndDate(element, minDate) {
    if (minDate != '' && minDate != null) {
        $(element).datepicker('setEndDate', toDate(minDate));
    }
}
function toDate(dateStr) {
    var parts = dateStr.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0])
}

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function setModalDraggable(element) {
    var topPos = window.scrollY - 30;
    $(element).draggable({
        handle: ".modal-header",
        containment: [-1000, topPos, 1000, 1000]
    });
    $(".modal-dialog").css({
        'cursor': 'pointer'
    });
}

function setModalMaxHeight(element) {
    this.$element = $(element);
    //$(element).children(".modal-dialog").draggable();
    this.$content = this.$element.find('.modal-content');
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find('.modal-header').outerHeight() || 0;
    var footerHeight = this.$element.find('.modal-footer').outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.$content.css({
        'overflow': 'hidden'
    });
    this.$element
        .find('.modal-body').css({
            'max-height': maxHeight,
            'overflow-y': 'auto'
        });
    this.$element
        .find('.modal-body').addClass("scrollbar-lg");
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function makeCode(length) {
    var result = '';
    //var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function convertDatetime(date) {
    var result = '';
    if (date != null && date != '') {
        var array = date.split('/');
        result = array[1] + '/' + array[0] + '/' + array[2];
    }
    return result;
}

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

function unlocFile() {
    $.post('/Admin/Docman/UnlockFile', function (response, status, xhr) {
        if (response.Status) {
            console.log(response.Message);
        } else {
            console.log('');
        }
    });
}

function heightTableAuto() {
    var heightTable = $(".table").height();

    var rowCount = $('.table tr').length;

    if (rowCount <= 11 || heightTable <= 400) {
        $('.dataTables_info').parent().removeClass('table-custom');
        $('.dataTables_info').parent().addClass('table-custom');
        $('.table-scrollable').css('min-height', 570);
    } else {
        $('.dataTables_info').parent().removeClass('table-custom');
    }
}

function heightTableManual(height, idTable) {
    var heightTable = $(idTable).height();
    var rowCount = $(idTable + ' tr').length;

    if (rowCount <= 7 || heightTable <= 400) {
        $(idTable + '_wrapper > table-scrollable > .dataTables_info').parent().removeClass('table-custom');
        $(idTable + '_wrapper > table-scrollable > .dataTables_info').parent().addClass('table-custom');
        $(idTable + '_wrapper .table-custom').css('min-height', height);
        $(idTable + '_wrapper .table-scrollable').css('min-height', height - 2);
    } else {
        $(idTable + '_wrapper > table-scrollable > .dataTables_info').parent().removeClass('table-custom');
    }
}

function heightTableViewportManual(padding, idTable) {
    $(idTable + '_wrapper .table-scrollable').css('height', 'calc(100vh - ' + padding + 'px)');
    $(idTable + '_wrapper .table-scrollable').addClass('table-y-scrollable');
}

function heightTableAutoCustom() {
    $('.dataTables_info').parent().removeClass('table-custom');
    $('.dataTables_info').parent().addClass('table-custom');
    $('.table-scrollable').css('min-height', 570);
}

$(document).ready(function () {
    $('ul.page-sidebar-menu>li').hover(function () {
        if ($(this).find('ul.sub-menu').length > 0) {
            var totalSubMenu = $(this).find('ul.sub-menu > li.nav-item').length;
            var subLevel2 = $(this).find('ul.sub-menu > li.nav-item').children().find('li.nav-item').length;
            var subLevel1 = totalSubMenu - subLevel2;

            if (subLevel1 >= 6 && subLevel1 < 15) {
                $(this).children('ul.sub-menu').addClass('menu-auto');
            } else if (subLevel1 >= 15) {
                $(this).children('ul.sub-menu').addClass('menu-max-auto');
            }
        }
    });

    //(function (open) {
    //    XMLHttpRequest.prototype.open = function (m, u, a, us, p) {
    //        this.addEventListener('readystatechange', function () {
    //            if (this.status === 401) {
    //                location.href = "/Admin/Account/Login";
    //            }
    //        }, false);

    //        open.call(this, m, u, a, us, p);
    //    };
    //})(XMLHttpRequest.prototype.open);
});
