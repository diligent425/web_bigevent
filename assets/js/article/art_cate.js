$(function() {

    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    // 1.获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // 使用模板引擎渲染表格数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }


    var indexAdd = null;
    // 2.为右侧“添加类别”按钮绑定点击事件
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })


    // 3.发起请求(使用了事件委托)，实现添加文章功能
    // 因为from表单是我们动态添加上去的，在点击“立即添加”按钮时，表单中是没有内容的，所以需要将submit提交事件绑定在父元素上
    $("body").on("submit", "#addForm", function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                // console.log("ok");
                if (res.status !== 0) {
                    return layer.msg("添加分类失败")
                }
                initArtCateList();
                layer.msg("添加分类成功");
                layer.close(indexAdd); // 根据索引，关闭弹出层
            }
        })
    })


    var indexEdit = null;
    // 4.通过代理的方式，为btn-edit按钮绑定点击事件
    $("tbody").on("click", "#btnEdit", function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });

        var id = $(this).attr("data-id");
        console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                // 通过form.val()快速获取表单区域所有值
                form.val("editForm-filter", res.data)
            }
        })
    })


    // 5.通过代理的方式，为修改分类的表单绑定submit事件(这里不知道为什么一直更新失败？)
    $("body").on("submit", "#editForm", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类失败")
                }
                layer.msg("更新分类成功");
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })


    // 6.通过代理的方式，为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function() {
        var id = $(this).attr("data-id");
        // 提示用户是否要删除
        layer.confirm('是否确认要删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除分类失败")
                    }
                    layer.msg("删除分类成功")
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})