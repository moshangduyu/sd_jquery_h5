 var minehelpController = {
     initView: function () {
         var that = this;
         this.initEventView();
         this.initKefuView();
     },
     initEventView: function () {
         var that = this;
         //标题点击显示内容
         $("#list").on("click", "li", function () {
             $(this).parents(".mhm_ul").siblings('ul').find("span").removeClass("onshang");
             $(this).parents(".mhm_ul").siblings('ul').find("p").hide();
             $(this).find("span").toggleClass("onshang");
             $(this).next("p").slideToggle(300);
         })
         /*反馈跳转判断*/
         $.LogonStatusEvent($(".mine_main_btm_list"), function () {
             window.location.href = "/html/mine_yijian.html"
         }, function () {
             local.backHref = document.referrer;
         });
     },
     //内容显示
     doHelpListView: function (obj) {
         var _this = this;
         //分类名称
         var html = '';
         $.each(obj.lists, function (i, b) {
             if (i != 0) {
                 html += '<li id=' + b.type_id + ' data-name=' + b.type_name + '><img src=' + b.img_link + ' /></li>';
             }
         });
         $('#center_nav').html(html);
         $('.showTitle').html($('#center_nav>li').eq(0).data('name'));
         var typeId = $('#center_nav>li').eq(0).attr('id');
         _this.ajaxList(typeId);
         _this.changeList();
         //官方热线
         _this.callPhone(obj.official_hotline);
         //QQ
         $('#qqPage').attr('href', '//shang.qq.com/wpa/qunwpa?idkey=' + obj.official_qq_web_key);

     },
     //客服
     initKefuView: function () {
         $.LogonStatusEvent($(".call_phone"), function () {
             window.location.href = 'http://kefu.easemob.com/webim/im.html?tenantId=34128&to=kefuchannelimid_041115&appKey=1164170103115772%23kefuchannelapp34128&xmppServer=im-api.easemob.com&restServer=a1.easemob.com';
         }, function () {
             local.backHref = document.referrer;
         })
     },
     //免费热线
     callPhone: function (official_hotline) {
         var _this = this;
         var n = new Date();
         var nowTime = n.getHours() + ":" + n.getMinutes();
         $('.callBtn').on('click', function () {
             if (_this.chekcTime('09:30', '19:00', nowTime)) {
                 window.location.href = "tel:" + official_hotline;
             } else {
                 var content = "<h4 style='padding:0;font-size:.28rem;text-indent:0;text-align:center;'>客服休息中，请在工作时间拨打</h4><p style='text-indent:0;text-align:center;padding-top:.15rem'>工作日：09:30-19:00 <br> 周末节假日：休息中～</p>"
                 $.promptCover({
                     content: content
                 });
                 $('.sureBtn').click(function () {
                     window.location.href = "tel:" + official_hotline;
                 })
             }

         })
     },
     //时间判断
     chekcTime: function (beginTime, endTime, nowTime) {
         var strb = beginTime.split(":");
         if (strb.length != 2) {
             return false;
         }
         var stre = endTime.split(":");
         if (stre.length != 2) {
             return false;
         }

         var strn = nowTime.split(":");
         if (stre.length != 2) {
             return false;
         }
         var b = new Date();
         var e = new Date();
         var n = new Date();

         b.setHours(strb[0]);
         b.setMinutes(strb[1]);
         e.setHours(stre[0]);
         e.setMinutes(stre[1]);
         n.setHours(strn[0]);
         n.setMinutes(strn[1]);

         if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
             return true;
         } else {
             return false;
         }
     },
     //列表切换
     changeList: function () {
         var _this = this;
         $('#center_nav').on('click', 'li', function () {
             var typeId = $(this).attr('id');
             $('.showTitle').html($(this).data('name'));
             _this.ajaxList(typeId);
         })
     },
     ajaxList: function (typeId) {
         var _this = this;
         service.doAjaxRequest({
             url: '/v1/help/help',
             type: 'GET',
             data: {
                 typeId: typeId
             }
         }, function (obj) {
             var html = "";
             $.each(obj, function (i, b) {
                 html += "<ul class='mhm_ul'>" + " <li>" + b.title + "<span></span></li>" + "<p>" + b.content + "</p>" + "</ul>";
             });

             $("#list_btm").html(html);
         })
     }
 };
 $(function () {
     minehelpController.initView();
     /*ajax渲染*/
     service.doAjaxRequest({
         url: '/v1/help/types',
         type: 'GET'
     }, function (obj) {
         minehelpController.doHelpListView(obj);
     })
 })
