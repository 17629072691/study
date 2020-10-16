$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度必须在1-6个字符之间"
            }
        }
    })
    initUserinfo()
    //初始化用户信息
    function initUserinfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败")
                }
                console.log(res);
                //调用form.val快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    //重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        //重新获取数据初始化用户信息
        initUserinfo()
    })
    //监听表单的提交数据
    $('.layui-form').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //发起ajax数据请求
        $.ajax({
            method: 'post',
            url: '',
            //this指form本身
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                layer.msg('获取用户信息成功')
                //调用父页面的方法，重新渲染用户的头像和用户的信息
                //parent属性返回当前窗口的父窗口,iframe的对象是window
                window.parant.getUserinfo()
                // console.log(window.parent);
            }
        })
    })
})