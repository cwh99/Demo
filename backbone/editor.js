$(function () {
    // 定义模型类
     var Text = Backbone.Model.extend({
        content: ''
    });

    // 创建结合模型类
    var TextList = Backbone.Collection.extend({
        model: Text,
    });

    var Texts = new TextList();

    // 创建view对象
    var TextView = Backbone.View.extend({
        tagName:'li',
        className: 'li_c',
        template: _.template($('#item-template').html()),
        events: {
            "dblclick span": "editing",
            "blur input,select": "blur",
            "click span a": "dele"
        },
        editing: function (e) {
            $(e.currentTarget).removeClass("show1").addClass("editing").find('input,select').focus();
        },
        blur: function (e) {
            var $curele = $(e.currentTarget);
            var objData = {};
            objData[$curele.attr('name')] = $curele.val();
            this.model.set(objData);
            $(e.currentTarget).parent().parent().removeClass("editing").addClass("show1");
        },
        dele: function () {
            this.model.destroy();
        },
        initialize: function () {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },
        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            this.model.on('destroy', this.remove, this);
            return this;
        },
        remove: function () {
            $(this.el).remove();
        },


    });

    var txtAppView = Backbone.View.extend({
        el: $("body"),
        events: {
            "click #txtBtn": "newtxt",
            'click #imgBtn' : 'newimg',
            'click #previewBtn' : 'preview',
            'click #saveBtn' : 'saveAll',
            'click #clearBtn' : 'clearall',
            // 'onclick #imgchBtn' : 'picChange'
        },
        // 绑定collection的相关事件
        initialize: function () {
            Texts.bind('add', this.addData, this);
            // this.listenTo(Texts,'add',this.addData);
            // this.listenTo(Texts, 'reset', this.addAll);
            // this.listenTo(Texts,'all',this.render);

        },
        newtxt: function () {
            var txt = new Text();
            var objData = {};
            $('#Name').each(function () {
                objData[$(this).attr('name')] = $(this).val();
            });
            if (txt.set(objData)) {
                Texts.add(txt);
            }

        },
        // render: function () {
        //     alert(1)
        // },
        newimg: function () {
            var objImg = {};

            $('#text-list').append('<div class="divItem"><img class="items" style="width: 150px;height: 100px" src="../img/test1.jpg"/></div>');

        },

        addData: function (txt) {
            var txtView = new TextView({ model: txt });
            $("#text-list").append(txtView.render().el);
            $('#Name').each(function () {
                $(this).val("");
            });
        },
        addAll: function() {
            Texts.each(this.addOne, this);
        },
        preview: function () {
            var yl = $('#middleSection').find('div').each(function () {

            });
            var html = '';
            yl.each(function () {
                html += $(this).html()
            });
            bootbox.dialog({
                title:'预览作品',
                message: '<ul>' + html +'</ul>'
            })
        },
        saveAll: function () {
            var arr = [];
            for(var i=0; i < Texts.models.length; i++){
                arr.push(Texts.models[i].toJSON()['Name']);
            }
            console.log(arr);
            for(var i=0; i<arr.length; i++){
                var s = window.localStorage.setItem(i,arr[i]);
            }
            bootbox.alert('保存成功！');
        },
        // picChange: function(){


        // },
        clearall: function () {
            $('#middleSection').empty();
        }
    })

    var app = new txtAppView;

    var oNext=document.getElementById("next");
    var oImg=document.getElementById("img");
//    var oDiv = document.getElementsByClassName('divItem')
    var aImg=["../img/test1.jpg","../img/test2.gif","../img/test3.jpg","../img/test4.jpg"];
    var num=0;
    oNext.onclick = function(){
        num=num+1; //每次加一
        if(num>aImg.length-1){

            num=0;
        }
        oImg.src=aImg[num];
    }

});