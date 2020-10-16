$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个查询的参数对象，将来请求数据的时候，需要将数据提交至服务器
    var q = {
        pagenum: 1, //页码数。默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', //文章的分类id
        state: '' //文章的状态
    }
    initTable()
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据分类失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    //为筛选按钮绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage的render方法渲染分页
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选中分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 5, 10],
            //分页发生切换的时候，触发
            jump: function (obj, first) {
                //把最新的页码值赋值到q中
                q.pagenum = obj.curr
                //把最新的条目数，赋值到q的pagesize中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表，并渲染数据
                if (first) return
                initTable()
            }
        })

    }
    //通过代理的方式为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length;
        //获取文章的id
        var id = $(this).attr('data-id')
        //询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    layer.close(index)
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上没有剩余的数据
                        //如果没有剩余数据就让页码值-1之后 在调用initTable函数
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
        })
    })
})