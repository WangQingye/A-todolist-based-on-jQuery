/**
 * Created by Administrator on 2016/12/14.
 */
;(function (){
    'use strict';

    var $add_button = $ ('.add-task button'),
        $from_add_task = $ ('.add-task'),
        $delete_task,
        $watch_detail,
        $task_detail = $('.task-detail'),
        $task_detail_mask = $('.task-detail-mask'),
        task_list={}
        ;

    init();



    $add_button.on('click',function(e){    /*确认添加*/

        e.preventDefault();  //禁用默认行为

        var new_task={} ;  //写在函数外的话就会因为作用域问题报错，因为函数内会不停的修改一个对象，导致数据覆盖

        var $input = $from_add_task.find('input[name=content]');

        new_task.content = $input.val();
        //获取新task的值

        if(!new_task.content) return;
        //如果为空返回

        if(add_task(new_task)){   /*执行了add_task 如果确定成功添加了，就返回true，然后渲染*/

             refresh_task_list();

             $input.val(null);

        }
       /*  console.log(new_task);*/
    });



    function add_task(new_task){
        /*将新Task推入task_list*/
        task_list.push(new_task);
        /*更新localstorage*/
        refresh_task_list();
        return true;

    }

    function listen_delete_task(){

        $delete_task.on('click',function(){   //事件嵌套是因为render之后才能找到删除键

            var $this = $(this);

            var $item = $this.parent().parent();

            var index = $item.data('index');

            var r = confirm('确定要删除吗？');

            if(!r) return;

            delete_task(index);

        });
    }

    function delete_task(index){   /*删除task*/

        if(index === undefined || !task_list[index]) return;  //如果没写或者写了没有，就返回

        delete task_list[index];

        refresh_task_list();

    }

    function listen_watch_detail(){

        $watch_detail.on('click',function(){

            var $this = $(this);

            var $item = $this.parent().parent();

            var index = $item.data('index');

            console.log(index);

            show_task_detail(index);

        })
    }

    function show_task_detail(index){

        $task_detail.show();
        $task_detail_mask.show();

    }

    function refresh_task_list(){   //更新localstorge中的task_list 并刷新

        store.set('task_list',task_list);

        render_task_list();

    }

    function init(){    /*初始化加载*/

        task_list = store.get('task_list') || [];

        refresh_task_list();

    }

    function render_task_list(){    /*渲染全部模板*/

        var $task_list = $('.task-list');

        $task_list.html('');

        for(var i=0; i<task_list.length;i++){

            var $task = render_task_tpl(task_list[i],i);

            $task_list.append($task);

        }

       $delete_task = $ ('.action.delete');
       $watch_detail = $('.action.detail');
       listen_delete_task();   //在此调用事件添加，才能成功添加
       listen_watch_detail();

    }

    function render_task_tpl(data,index){

        if(!data || !index ) return;  /*如果没有数据，就不添加*/

        var list_item_tpl = '<form class="task-item" data-index='+index+'>'+
            '<span><input type="checkbox"></span>'+
            '<span class="task-content">'+data.content+'</span>'+
            '<span class="fr">'+
                '<span class="action detail">详细</span>'+
                '<span class="action delete">删除</span>'+
            '</span>'+
            '</form>';

        return $(list_item_tpl);
    }

})();