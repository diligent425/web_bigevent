$(function() {
    $('.reg').on('click', function() {
        $('.login-box').hide();
        $('.register-box').show();
    });
    $('.login').on('click', function() {
        $('.login-box').show();
        $('.register-box').hide();
    });


    // 从layui中获取form对象
    var form = layui.form
        // 从layui中获取layer对象
    var layer = layui.layer
        // 通过form.verify()自定义校验规则
    form.verify({
        //自定义一个叫pwd的校验规则。[正则匹配, 匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 校验注册框中的两次密码是否一致
        repwd: function(value) {
            // 通过形参value拿到的是确认密码框中的内容
            // 获取到输入密码框中的内容pwd
            // 判断两个密码框中输入的内容是否一致，不一致则return提示消息
            var pwd = $(".register-box [name=password]").val();
            if (pwd !== value) {
                return "两次输入的密码不一致"
            }
        }
    });


    // 监听“注册”表单的提交事件，点击“注册”，发起post请求
    $("#form_reg").on("submit", function(e) {
        // 阻止默认提交形为
        e.preventDefault();
        // 我们自己封装了 baseAPI.js，将根路径做了统一拼接，方便url管理
        $.post("/api/reguser", { username: $(".register-box [name=username]").val(), password: $(".register-box [name=password]").val() }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功！");
            // 模拟人点击“去登陆”形为，实现提交注册后，自动跳转到登录框
            $(".login").click();
        })
    });

    // 监听“登录”表单的提交事件
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("登录成功");
                // 将登陆成功的token字符串，保存到localStorage中
                localStorage.setItem("token", res.token);
                // 跳转到后台主页面
                location.href = "index.html";
            }
        })
    });

})