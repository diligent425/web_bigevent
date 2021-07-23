$(function() {
    getUserInfo(); // 调用getUserInfo函数获取用户基本信息
})


// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers请求头配置对象已经在baseAPI.js中统一封装了，所以词出不需要再写 
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                // 获取用户名失败
                return layui.layer.msg(res.message);
            }
            // 获取用户成功，渲染用户图像和欢迎词
            renderAvatar(res.data);
        },
        // 无论请求成功与否，都会调用 complete函数。封装在baseAPI.js中
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空本地缓存的token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到login.html页面
        //         location.href = '/login.html'
        //     }
        // }
    })
};


// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username;
    // 2.设置“欢迎”的文本
    $(".welcome").html("欢迎&nbsp;" + name);
    // 3.按需渲染用户图象
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase()
        $(".text-avatar").html(first).show();
    }
};


var layer = layui.layer;
// 点击“退出”按钮，实现退出功能
$("#btnLogout").on("click", function() {
    // 弹出确认框
    layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function(index) {
        localStorage.removeItem("token"); //清空本地存储的token
        location.href = "/login.html"; //跳转到登录页面
        layer.close(index); //关闭此confirm询问框
    });
})