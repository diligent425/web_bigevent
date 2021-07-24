$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $("#image");
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };
    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 2.实现选择文件的功能
    $("#btnChooseImage").on("click", function() {
        $("#file").click();
    })


    // 3.实现图片裁剪区域的替换功能
    $("#file").on("change", function(e) {
        // console.log(e);
        // console.log(e.target.files);
        var fileList = e.target.files
        if (fileList.length === 0) {
            return "请选择图片"
        }

        // 3.1 拿到用户选择的文件
        var file = e.target.files[0];
        // 3.2 将拿到的图片转为对应的URL地址
        var urlImage = URL.createObjectURL(file);
        // 3.3 重新初始化裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', urlImage) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    var layer = layui.layer
        // 4.将剪裁后的图像上传到服务器
    $("#btnUpload").on("click", function() {
        // 4.1 拿到用户裁剪后的图像(这段代码从corpper文档中复制过来即可)
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 4.2 调用接口，将图片上传到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("上传图像失败")
                }
                layer.msg("上传图像成功")
                window.parent.getUserInfo()
            }
        })

    })
})