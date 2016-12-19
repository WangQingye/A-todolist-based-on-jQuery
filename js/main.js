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
        task_list={},
        $task_item,
        $update_form,
        $checkbox_complete
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


    //增加一条新事件
    function add_task(new_task){
        /*将新Task推入task_list*/
        task_list.push(new_task);
        /*更新localstorage*/
        refresh_task_list();
        return true;

    }

    //监听点击删除事件
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

    //删除事件
    function delete_task(index){   /*删除task*/

        if(index === undefined || !task_list[index]) return;  //如果没写或者写了没有，就返回

        delete task_list[index];

        refresh_task_list();

    }

    //监听点击查看详情事件
    function listen_watch_detail(){    //事件嵌套是因为render之后才能找到删除键

        $watch_detail.on('click',function(){

            var $this = $(this);

            var $item = $this.parent().parent();

            var index = $item.data('index');

            /*console.log(index);*/

            show_task_detail(index);

        });

        //双击事件查看
        $task_item.on('dblclick',function(){

            show_task_detail($(this).data('index'));

        });
    }

    //监听事件完成状态
    function listen_checkbox_complete(){

        $checkbox_complete.on('click',function(){


            var $this = $(this);

          /*  var is_complete = $this.is(':checked');*/

            var index = $this.parent().parent().data('index');

            var item = store.get('task_list')[index];

            if (item.complete){

                update_task(index,{complete:false})

            }else{

                update_task(index,{complete:true})

            }
            console.log(item);
        })

    }

    //监听事件提醒时间：
    function task_remind_check(){

        var current_timestamp;

        var itl = setInterval(function(){
            for(var i= 0; i<task_list.length;i++){

                var item = store.get('task_list')[i],
                    task_reminddate;
                if(!item || !item.remind_date || item.informed) continue;

                current_timestamp = (new Date()).getTime();

                task_reminddate = (new Date(item.remind_date)).getTime();

                if (current_timestamp - task_reminddate >= 1) {  //现在的时间大于了设置的时间

                    update_task(i,{informed:true});
                    notice(item.content);

                }

            }
        },1000);



    }

    function notice(content){

        console.log(1);

    }

    //查看task详情：
    function show_task_detail(index){

        render_task_detail(index);

        $task_detail.show();
        $task_detail_mask.show();

        $task_detail_mask.on('click',function(){

            $task_detail.fadeOut();
            $task_detail_mask.fadeOut();

        })

    }

    //更新任务详情:
    function update_task( index, data ){

        if(index === undefined || !task_list[index]) return;

        task_list[index] = $.extend({},task_list[index], data);

        refresh_task_list();


    }

    //渲染特定的任务详情:
    function render_task_detail(index){

        if(index === undefined || !task_list[index]) return;

        var item = task_list[index];

       /* console.log(item);*/

        var task_detail_tpl ='<form>'+
            '<div class="content">'+item.content+'</div>'+
            '<div><input  style="display:none" type="text" name="content" value="'+item.content+'"></div>'+
            '<div>'+
            '<div class="desc">'+
            '<textarea name="desc">'+(item.desc||'')+'</textarea>'+
            '</div>'+
            '</div>'+
            '<div class="remind">'+
            '<laber>提醒时间:</laber>'+
            '<input class="datetimepicker" name="remind" type="text" value="'+(item.remind_date||'')+'">'+
            '<button type="submit">更新</button>'+
            '</div>'+
            '</form>';

        $task_detail.html(null);
        $task_detail.html(task_detail_tpl);
        $('.datetimepicker').datetimepicker();
        $.datetimepicker.setLocale('ch');
        $update_form = $task_detail.find('button');
        var $detail_form = $task_detail.find('form');
        var $update_form_content = $task_detail.find('.content');
        var $update_form_content_input = $task_detail.find('[name=content]');

        $update_form_content.on('dblclick',function(){
            $update_form_content_input.show();
            $update_form_content.hide();
        });


        $update_form.on('click',function(e){

            e.preventDefault();

            var data = {};

            data.content = $detail_form.find('[name=content]').val();

            data.desc = $detail_form.find('[name=desc]').val();

            data.remind_date = $detail_form.find('[name=remind]').val();

            /*console.log(data);*/
            update_task(index,data);

            $task_detail.hide();
            $task_detail_mask.hide();
        })

    }

    //更新localstorge中的task_list 并刷新:
    function refresh_task_list(){

        store.set('task_list',task_list);

        render_task_list();

    }

    /*初始化加载*/
    function init(){

        task_list = store.get('task_list') || [];

        refresh_task_list();

        task_remind_check();

    }

    /*渲染全部模板*/
    function render_task_list(){

        var $task_list = $('.task-list');

        $task_list.html('');

        var complete_items = [];

        for(var i=0; i<task_list.length;i++){

            var item = task_list[i];

            if(item && item.complete) {

                complete_items[i]=item;

            } else {
                var $task = render_task_tpl(item,i);

                $task_list.prepend($task);
            }
        }

        for(var j=0; j<complete_items.length;j++){


            $task = render_task_tpl(complete_items[j],j);

            if(!$task) continue;

            $task.addClass('completed');

            $task_list.append($task);

        }

       $delete_task = $ ('.action.delete');
       $watch_detail = $('.action.detail');
       $task_item = $('.task-item');
       $checkbox_complete = $('.task-item .complete');
       listen_delete_task();   //在此调用事件添加，才能成功添加
       listen_watch_detail();
       listen_checkbox_complete();

    }

    //生成一条任务
    function render_task_tpl(data,index){

        if(!data || !index ) return;  /*如果没有数据，就不添加*/

        var list_item_tpl =
            '<form class="task-item" data-index='+index+'>'+
            '<span><input type="checkbox" class="complete" ' + (data.complete ? 'checked' : '' ) + '></span>'+
            '<span class="task-content">'+data.content+'</span>'+
            '<span class="fr">'+
                '<span class="action detail">详细</span>'+
                '<span class="action delete">删除</span>'+
            '</span>'+
            '</form>';

        return $(list_item_tpl);
    }

})();