$(function () {
    // 定义模型类
    var Text = Backbone.Model.extend({
        content: ''
    });

    // 创建结合模型类
    var TextList = Backbone.Collection.extend({
        model: Text,
    });

    var Texts = new TextList({
        content: 'hello'
    });

    var AppView = Backbone.View.extend({
        el: $('body'),
        initialize: function () {
            $('#text-list').html(Texts.models[0].get('content'))
        }
    })

    var App = new AppView;
})