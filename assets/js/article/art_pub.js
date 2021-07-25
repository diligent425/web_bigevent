$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate();

    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("加载文章分类失败")
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }


    // 以下三步：实现图片的基本剪裁
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 给按钮绑定点击事件，触发“选择文件”的隐藏域
    $("#btnChooseImg").on("click", function() {
        $("#coverFlie").click();
    })

    // 将用户选择的图片设置到图片剪裁区域
    // 1.为 coverFlie文件选择框 绑定 change事件
    $("#coverFlie").on("change", function(e) {
        var files = e.target.files; //获取到文件列表的数组
        //根据选择的文件，创建文件对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    var art_state = "已发布"
    $("#btnSave2").on("click", function() {
        art_state = "草稿"
    })



    // 1.监听表单的提交事件
    $("#form-pub").on("submit", function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0]) //2.基于form表单快速创建一个FormData对象
        fd.append("state", art_state) //3.将文章的发布状态追加进去

        // // v是我们输入表单中的值，k是FormData的参数名
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })

        // 4.将封面裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存到fd中，"cover_img"必须是接口文档中的参数名
                fd.append("cover_img", blob)

                // 5.封装一个Ajax的方法（发起Ajax数据请求）
                publishArticle(fd)
            })

    })


    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 向服务器提交的是 FormData 格式的数据，必须要加上以下两个配置项，否则会请求提交数据失败
            contentType: false,
            processData: false,
            success: function(res) {

                if (res.statues !== 0) {
                    return layer.msg("发布文章失败")
                }
                layer.msg("发布文章成功");
                // 发布文章成功，就跳转到文章列表页面(为什么跳转不了？？)
                location.href("/article/art_list.html")
            }
        })
    }
})