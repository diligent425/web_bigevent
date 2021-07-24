$(function() {
    // 为密码框自定义校验规则
    var form = layui.form
    form.verify({
        //1.密码基本规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新密码和旧密码不能重复"
            }
        },
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return "确认密码和新密码输入不一致"
            }
        }
    })

    // 发起请求实现重置密码
    $("layui-form").on("submit", function(e) {
        e.preventDefault()
        $.ajax({
            methods: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("重置密码失败")
                }
                layui.layer.msg("重置密码成功");
                // 重置表单(先将获取表单，再通过[0]的形式将jquery元素转为dom对象，调用dom对象的reset()方法)
                $(".layui-form")[0].reset();
            }
        })
    })
})