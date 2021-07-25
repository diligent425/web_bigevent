$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
        // 这里一定要注意：Date不能写成了Data（因为这个错误，耽误了一天时间）
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n < 10 ? "0" + n : n
    }

    var q = {
        pagenum: 1, // 页码值，默认第一页
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }


    initTabel();
    initCate();
    // 获取文章列表的方法（页面中显示获取列表数据成功，但是表格没有渲染出来）
    function initTabel() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表数据失败")
                }
                layer.msg("获取文章列表数据成功")
                console.log(res);
                // 使用模板引擎渲染表格数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr); //将结构填充到tbody中
                form.render() //通知layui重新渲染表单的页面结构
                renderPage(res.total); //调用渲染分页的函数
            }
        })
    }


    // 获取“所有分类”的下拉菜单中的可选项
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败")
                }
                var htmlStr = template("tpl-cate", res)
                    // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr)
                form.render() //通知layui重新渲染表单的页面结构
            }
        })
    }

    // 为“筛选”按钮绑定submit事件
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        // 获取下拉菜单中 选中的值
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val();
        // 为查询参数对象q中的属性赋值
        q.cate_id = cate_id
        q.state = state
        initTabel() //根据最新的筛选条件，重新渲染表格
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 发生页面切换时，触发jump回调函数
            // 触发jump回调，有两种方式：
            // 1.点击页码，就会触发
            // 2.只要调用了laypage.render()方法，就会触发
            jump: function(obj, first) {
                // 可以通过first的值，来判断是哪种方法触发jump
                // 如果first值为true，证明是方法2触发的
                console.log(first);
                console.log(obj.curr);
                // 把最新的页码值和每页条目熟，赋值到q的参数对象中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                // 根据最新的q，获取对应的数据列表，并渲染表格
                // 由于是第二种方式触发的jump，则不能直接调用initTabel()，否则会发生死循环，因此在调用initTabel()之前要先进行if判断
                // initTabel()
                if (!first) {
                    initTabel()
                }
            }
        })
    }


    // 通过代理，为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function() {
        // 获取删除按钮的个数
        var len = $(".btn-delete").length;
        console.log(len);
        // 通过自定义属性值，获取到当前删除按钮的自定义id
        var id = $(this).attr("data-id");

        layer.confirm('是否确认要删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败")
                    }
                    layer.msg("删除文章成功");

                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余数据，如果没有剩余数据，让页码值-1，在重新调用initTabel()方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTabel();
                }
            })
            layer.close(index)
        })
    })
})