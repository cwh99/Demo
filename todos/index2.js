// require(["../backbone/jquery.js"],function () {
//     $('h1').html('dwde')
// })


require.config({
    baseUrl: "../backbone",
    paths: {
        // 加载符合AMD标准的模块文件
        // "jQuery" : "jquery",
        'jQuery' : 'jquery-3.2.1',
        "underscore" : "underscore",
        'backbone' : 'backbone',
        'bootstrap' : 'bootstrap',
        'bootbox' : 'bootbox',
        'backbone.localStorage' : 'backbone.localStorage'
    },
    // 加载非AMD标准的文件模块，通过options对象的shim属性来配置
    shim: {
        'underscore' : {
            exports: '_'
        },
        'backbone' : {
            deps: ['underscore' , 'jQuery'],
            // exports: 'Backbone'
        },
        'bootstrap' : {
            deps : ['jQuery']
        },
        'bootbox' : {
            deps : ['bootstrap']
        }
    }
});

require(['backbone','underscore','backbone.localStorage','bootbox','jQuery'],function (backbone) {
    $('header h1').html('A Simple Demo! - cwh');

    var Text = Backbone.Model.extend({

        defaults: function() {
            return {
                title: "empty...",
                order: Texts.nextOrder(),
                done: false
            };
        },

        toggle: function() {
            this.save({done: !this.get("done")});
        }

    });

    var TextList = Backbone.Collection.extend({

        model: Text,

        localStorage: new Backbone.LocalStorage("Texts-backbone"),

        done: function() {
            return this.where({done: true});
        },

        remaining: function() {
            return this.where({done: false});
        },

        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: 'order'

    });
    var Texts = new TextList;

    var TextView = Backbone.View.extend({

        tagName:  "li",

        template: _.template($('#item-template').html()),

        events: {
            "click .toggle"   : "toggleDone",
            "dblclick .view"  : "edit",
            "click a.destroy" : "clear",
            "keypress .edit"  : "updateOnEnter",
            "blur .edit"      : "close"
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        toggleDone: function() {
            this.model.toggle();
        },

        edit: function() {
            this.$el.addClass("editing");
            this.input.focus();
        },

        close: function() {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass("editing");
            }
        },

        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.close();
        },

        clear: function() {
            this.model.destroy();
        },


    });


    var AppView = Backbone.View.extend({

        el: $("body"),

        statsTemplate: _.template($('#stats-template').html()),

        events: {
            "keypress #new-text":  "createOnEnter",
            "click #clear-completed": "clearCompleted",
            // "click #toggle-all": "toggleAllComplete",
            'click #previewBtn' : 'preview',
            'click #imgBtn' : 'newimg',
            'click #clearBtn' : 'clearall'
        },

        initialize: function() {

            this.input = this.$("#new-text");
            this.allCheckbox = this.$("#toggle-all")[0];

            this.listenTo(Texts, 'add', this.addOne);
            this.listenTo(Texts, 'reset', this.addAll);
            this.listenTo(Texts, 'all', this.render);

            this.footer = this.$('footer');
            this.main = $('#main');

            Texts.fetch();
        },
        render: function() {
            //
            if (Texts.length) {
                this.main.show();
            } else {
                this.main.hide();
            }

        },

        addOne: function(text) {
            var view = new TextView({model: text});
            this.$("#text-list").append(view.render().el);
        },

        addAll: function() {
            Texts.each(this.addOne, this);
        },

        createOnEnter: function(e) {
            if (e.keyCode != 13) return;
            if (!this.input.val()) return;

            Texts.create({title: this.input.val()});
            this.input.val('');
            console.log(1)
        },

        clearCompleted: function() {
            _.invoke(Texts.done(), 'destroy');
            return false;
        },
        preview: function () {
            var yl = $('#main').find('div').each(function () {})
            var html = '';
            yl.each(function () {
                html += $(this).html() +'<br>'
            });
            bootbox.dialog({
                title:'预览作品',
                message: '<ul>' + html +'</ul>'
            })
        },
        newimg: function () {
            var objImg = {};

            $('#text-list').append('<div class="divItem"><img class="items" ' +
                'style="margin:10px 0 0 180px;width: 100px;height: 150px" ' +
                'src="../img/test1.jpg"/></div>');

        },
        clearall: function () {
            $('#main').empty();
        }

    });

    var aImg=["../img/test1.jpg","../img/test2.gif","../img/test3.jpg","../img/test4.jpg"];
    var num=0;
    $("#text-list").on('click','.items',function () {
        $(".items").addClass("checked");
    });

    $("#text-list").on('mouseout','.items',function () {
        $(".items").removeClass("checked");
    });

    $("#text-list").on('click','.checked',function(){
        num=num+1; //每次加一
        if(num>aImg.length-1){

            num=0;
        }
        $('.checked').attr('src',aImg[num]);
    });


    var App = new AppView;

})