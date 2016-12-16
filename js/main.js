/**
 * Created by Administrator on 2016/12/14.
 */
;(function (){
    'use strict';

    var $add_button = $ ('.add-task button'),
        $from_add_task = $ ('.add-task'),
        $delete_task,
        task_list={}
        ;

    init();



    $add_button.on('click',function(e){

        e.preventDefault();  //禁用默认行为

        var new_task={} ;  //写在函数外的话就会因为作用域问题报错，因为函数内会不停的修改一个对象，导致数据覆盖

        var $input = $from_add_task.find('input[name=content]');

        new_task.content = $input.val();
        //获取新task的值

        if(!new_task.content) return;
        //如果为空返回

         if(add_task(new_task)){

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


    function delete_task(index){

        if(index === undefined || !task_list[index]) return;  //如果没写或者写了没有，就返回

        delete task_list[index];

        refresh_task_list();

    }

    function refresh_task_list(){   //更新localstorge中的task_list 并刷新

        store.set('task_list',task_list);

        render_task_list();

    }

    function init(){

        task_list = store.get('task_list') || [];

        refresh_task_list();

    }

    function render_task_list(){

        var $task_list = $('.task-list');

        $task_list.html('');

        for(var i=0; i<task_list.length;i++){

            var $task = render_task_tpl(task_list[i],i);

            $task_list.append($task);

        }

       $delete_task = $ ('.action.delete');

        $delete_task.on('click',function(){   //事件绑定在此是因为render之后才能找到

            var $this = $(this);

            var $item = $this.parent().parent();

            var index = $item.data('index');

            var r = confirm('确定要删除吗？');

            if(!r) return;

            delete_task(index);

        });

    }

    function render_task_tpl(data,index){

        if(!data || !index ) return;

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