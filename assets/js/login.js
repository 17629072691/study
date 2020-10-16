$(function () {
    //点击“去注册账号的链接”
    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击“去登录”链接
    $('#link-login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            //通过形参拿到的是确认密码框的内容
            //还需要拿到密码框中的内容
            //进行判断，如果失败，则返回一个错误的提示信息
            var pwd = $('.reg-box [name=password]').val()
            // console.log(value, pwd);
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })
    //监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        //1.阻止默认的表单提交行为
        e.preventDefault()
        //2.发起ajax请求
        var data = {
            username: $('#form-reg [name = username]').val(),
            password: $('#form-reg [name = password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
                //    return console.log('注册失败');
            }
            layer.msg('注册成功，请登录！')
            // console.log('注册成功');
            //模拟人的点击行为
            $('#link-login').click()
        })
    })
    //监听登录表单的提交事件
    $('#form-login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功！')
                //将登陆成功得到的token字符串，保存到localstorage中
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = './index.html'
            }
        })
    })
})