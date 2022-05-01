export default [
  {
    label: '用户名啊啊啊啊啊啊啊啊', // label文字
    span: 12,
    prop: 'username', // 字段名
    element: 'el-input', // 指定elementui组件
    initValue: '阿黄', // 字段初始值
    clearable: true,
    placeholder: '请输入用户名', // elementui组件属性
    rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组
    events: {
      // elementui组件方法
      input(val) {
        console.log(val)
      }
    }
  },
  {
    label: '密码', // label文字
    span: 12,
    width: '100%',
    prop: 'password', // 字段名
    element: 'el-select', // 指定elementui组件
    initValue: '啥', // 字段初始值
    placeholder: '请输入用户名', // elementui组件属性
    // rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组
    options: [
      {
        value: '选项1',
        label: '黄金糕'
      },
      {
        value: '选项2',
        label: '双皮奶'
      },
      {
        value: '选项3',
        label: '蚵仔煎'
      }
    ],
    events: {
      // elementui组件方法
      change(val) {
        console.log(val)
      }
    }
  },
  {
    label: '密码', // label文字
    prop: 'password', // 字段名
    width: '80px',
    element: 'el-select', // 指定elementui组件
    // initValue: 'hhhh', // 字段初始值
    placeholder: '请输入用户名', // elementui组件属性
    // rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组
    options: [
      {
        value: '选项1',
        label: '黄金糕'
      },
      {
        value: '选项2',
        label: '双皮奶'
      },
      {
        value: '选项3',
        label: '蚵仔煎'
      }
    ],
    events: {
      // elementui组件方法
      change(val) {
        console.log(val)
      }
    }
  },
  {
    label: '密码', // label文字
    prop: 'date', // 字段名
    element: 'el-date-picker', // 指定elementui组件
    initValue: ['2021-11-01 00:00:00', '2021-11-12 23:59:59'], // 字段初始值
    placeholder: '请选择日期', // elementui组件属性
    // rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组
    events: {
      // elementui组件方法
      change(val) {
        console.log(val)
      }
    }
  }
]
