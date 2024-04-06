/*=========================================================================================
  File Name: custom-menu.js
  Description: avtive menu,expand,collapse menu
  initialization and manipulations
  ----------------------------------------------------------------------------------------
  Item Name: Robust - Responsive Admin Theme
  Version: 1.2
  Author: GeeksLabs
  Author URL: http://www.themeforest.net/user/geekslabs
==========================================================================================*/
var configMenu = {
    init: function () {
        configMenu.activeNav();
        //configMenu.expand();
        configMenu.navClick();
        configMenu.tabMenu();
        configMenu.fitContent();
        //configMenu.reponsitive();
        //configMenu.collapse();
    },
    //expand: function () {
    //    $('.main-menu-content').find('.navigation-header').addClass('open');
    //},
    //collapse: function () {
    //    var listMenu = $('.main-menu-content').find('.navigation-header');
    //    for (var i = 0; i < listMenu.length; i++) {
    //        if ($(listMenu[i]).nextUntil('.navigation-header').hasClass("active") == false && $(listMenu[i]).hasClass("navigation-header-no-expand") == false) {
    //            $(listMenu[i]).removeClass("open");
    //            $(listMenu[i]).nextUntil('.navigation-header').hide();
    //        }
    //    }
    //},
    activeNav: function () {
        if (document.location.pathname === '/Admin/CardJob') {
            $('#btnOpenTrello').removeAttr('href');
            $('#btnOpenTrelloMobile').removeAttr('href');
            //$('#navbar-menu').addClass('inOutCardPadding');
            $('#tab-module-header').addClass('menu-header-left');
        } else if ($('#educationMenu').size() > 0) {
            console.log('education');
            var hash = document.location.hash.split('/')[1].length > 0 ? '#' + document.location.hash.split('/')[1] : '';
            $("#educationMenu .Group a[href='" + document.location.pathname + hash + "']").addClass('activeEdu');
        }
        else {
            $("ul.navigation-main li a[href='" + document.location.pathname + "']").parents('li').addClass('active').addClass('hover').addClass('open');
            var tabActiveMain = $(".tab-content .tab-pane ul li a[href='" + document.location.pathname + "']").parent().parent().parent().prop('id');
            var tabActiveSub = $(".tab-content .tab-pane ul li a[href='" + document.location.pathname + "']").parent().parent().parent().parent().parent().prop('id');
            var tabActive = '';
            if (tabActiveMain !== '' && tabActiveMain !== undefined)
                tabActive = tabActiveMain;
            if (tabActiveSub !== '' && tabActiveSub !== undefined)
                tabActive = tabActiveSub;
            if (tabActive !== '') {
                $('ul.nav-tabs li').removeClass('active');
                //$('ul.sideways li').removeClass('tab-menu-li-no-active');
                //$('ul.sideways li').addClass('tab-menu-li-no-active');
                //$('ul.nav-tabs li a[href="#' + tabActive + '"]').parent().addClass('active');
                if (tabActive === 'store') {
                    $('#menu-store').addClass('active');
                }
                else if (tabActive === 'assetOperate') {
                    $('#menu-asset-operation').addClass('active');
                }
                else if (tabActive === 'finance') {
                    $('#menu-finace').addClass('active');
                }
                else if (tabActive === 'system') {
                    $('#menu-system-operation').addClass('active');
                }
                else if (tabActive === 'wfSystem') {
                    $('#menu-system-wf').addClass('active');
                }
                else if (tabActive === 'education') {
                    $('#menu-education').addClass('active');
                }
                else if (tabActive === 'crawler') {
                    $('#menu-crawler').addClass('active');
                }
                else if (tabActive === 'logistic') {
                    $('#menu-logistic').addClass('active');
                }
                else {
                    $('#menu-home').addClass('active');
                }

                $('.tab-content .tab-pane').removeClass('active');
                $('.tab-content #' + tabActive).addClass('active');
            }

            $('#tab-module-header').removeClass('menu-header-left');
        }
    },
    navClick: function () {
        $("ul.page-sidebar-menu li a[href='" + document.location.pathname + "']").parents('li').addClass('active').addClass('open');
    },
    tabMenu: function () {
        if (document.location.pathname !== '/Admin/CardJob') {
            $.app.menu.expanded = false;
            $.app.menu.collapsed = true;
            $.app.menu.toggle();
        }
    },
    fitContent: function () {
        $(".content-wrapper").addClass("padding-right-80");
    }
}
function directPage(idTab) {
    if (idTab === "menu-home") {
        //location.replace("/Admin/MenuCenter");
        location.replace("/Admin/CardWorkHome");
    }
    if (idTab === "menu-store") {
        //location.replace("/Admin/MenuStore");
        location.replace("/Admin/MenuStore");
    }
    if (idTab === "menu-asset-operation") {
        //location.replace("/Admin/MenuAssetOperation");
        location.replace("/Admin/MenuAssetOperation");
    }
    if (idTab === "menu-finace") {
        //location.replace("/Admin/MenuFinance");
        location.replace("/Admin/MenuFinance");
    }
    if (idTab === "menu-system-wf") {
        //location.replace("/Admin/MenuWfSystem");
        location.replace("/Admin/MenuWfSystem");
    }
    if (idTab === "menu-system-operation") {
        location.replace("/Admin/MenuSystemSetting");
        //location.replace("/Admin/UserManageHome");
    }
    if (idTab === "menu-education") {
        //location.replace("/Admin/MenuSystemSetting");
        location.replace("/Admin/LmsDashBoard");
    }
    if (idTab === "menu-crawler") {
        //location.replace("/Admin/MenuSystemSetting");
        location.replace("/Admin/CrawlerMenu");
    }
    if (idTab === "menu-system-mail") {
        //location.replace("/Admin/MenuSystemSetting");
        location.replace("/Admin/MailBox");
    }
    if (idTab === "menu-system-key") {
        //location.replace("/Admin/MenuSystemSetting");
        location.replace("/Admin/IwindoorKeygenManagement");
    }
    if (idTab === "menu-logistic") {
        //location.replace("/Admin/MenuSystemSetting");
        location.replace("/Admin/MenuLogistic");
    }
}

function stateMenu(id) {
    directPage(id);
}

function hideMenu() {
    if (document.location.pathname == '/Admin/WorkflowActivity') {
        $('#menu-web').addClass('hidden');
        $('#menu-mobile').addClass('hidden');
        $('#tab-module-header').addClass('ml210');
    }
}

var count = 1;
function setBackgroundDashboard() {
    $('.content-wrapper').toggleClass('demoscreen');
    $('.app-content').toggleClass('demoscreen');
    $('.border-box-dashboard').toggleClass('demobox');
    $('.boxdeu').toggleClass('demobox');
    $('.text-content-box-act-emp').toggleClass('text-content-box-act-emp-demo');
    $('.text-header-box-act-employee').toggleClass('text-header-box-act-employee-demo');
    $('.text-header-box').toggleClass('text-header-box-demo');
    $('.color-text-cms').toggleClass('color-text-cms-demo');
    $('.txtAction').toggleClass('txtAction-demo');
    $('.txtName').toggleClass('txtName-demo');
    $('h4').toggleClass('h42');
    if (count == 1) {
        $('rect.Object_Label').css('fill', '#fff');
        $('text.draw2d_shape_basic_Label.txt1').css('fill', '#000');
        $('text.draw2d_shape_basic_Label.txt2').css('fill', '#000');
        $('text.draw2d_shape_basic_Label.txt3').css('fill', '#000');
        $('text.draw2d_shape_basic_Label.txt5').css('fill', '#000');
        $('text.draw2d_shape_basic_Label.txt6').css('fill', '#000');

        count = 2;
    }
    else {
        $('rect.Object_Label').css('fill', '#000');
        $('text.draw2d_shape_basic_Label.txt1').css('fill', '#fff');
        $('text.draw2d_shape_basic_Label.txt2').css('fill', 'lime');
        $('text.draw2d_shape_basic_Label.txt3').css('fill', 'red');
        $('text.draw2d_shape_basic_Label.txt5').css('fill', 'grey');
        $('text.draw2d_shape_basic_Label.txt6').css('fill', '#00adef');
        count = 1;
    }
}

$(document).ready(function () {
    configMenu.init();
    hideMenu();
});




