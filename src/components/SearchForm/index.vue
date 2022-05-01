/** * 搜索栏公共组件 */
<template>
  <div class="search-form-box" :class="inline ? 'inline' : 'no-inline'">
    <template v-if="inline">
      <el-form
        ref="formRef"
        :label-width="isAutoLabelWidth ? 'auto' : ''"
        :model="formData"
        :inline="inline"
      >
        <template v-for="(item, index) in formOptions">
          <el-form-item
            v-if="!item.isHidden"
            ref="formItem"
            :key="newKeys[index]"
            :prop="item.prop"
            :label="item.label ? item.label + '：' : ''"
            :rules="item.rules"
            :style="item.width ? `--width:${item.width}` : `--width:var(--${item.element}-width)`"
          >
            <formItem v-model="formData[item.prop]" :item-options="item" />
          </el-form-item>
        </template>

        <!-- 自定义插槽，可用于特殊表单块 -->
        <slot />
      </el-form>
    </template>
    <template v-else>
      <el-form ref="formRef" label-width="auto" :model="formData" :inline="inline">
        <el-row>
          <template v-for="(item, index) in formOptions">
            <el-col v-if="!item.isHidden" :key="newKeys[index]" :span="item.span" :xs="24">
              <el-form-item
                :prop="item.prop"
                :label="item.label ? item.label + '：' : ''"
                :rules="item.rules"
                :style="item.width && `--width:${item.width}`"
              >
                <formItem v-model="formData[item.prop]" :item-options="item" />
              </el-form-item>

              <!-- 自定义插槽，可用于特殊表单块 -->
              <slot />
            </el-col>
          </template>
        </el-row>
      </el-form>
    </template>

    <!-- 提交按钮 -->
    <div class="btn-box">
      <el-button
        v-if="btnItems.includes('search')"
        size="mini"
        type="primary"
        class="btn-search"
        @click="onSearch"
      >
        搜索
      </el-button>

      <el-button
        v-if="btnItems.includes('export')"
        size="mini"
        type="primary"
        class="btn-export"
        @click="onExport"
      >
        导出
      </el-button>

      <el-button
        v-if="btnItems.includes('reset')"
        size="mini"
        type="default"
        class="btn-reset"
        @click="onReset"
      >
        重置
      </el-button>

      <!-- 其他按钮 -->
      <slot name="button" />
    </div>
  </div>
</template>

<script>
import formItem from './formItem'
import tools from './util'

export default {
  name: 'SearchForm',
  components: { formItem },
  props: {
    /**
     * 表单配置
     * 示例：
     * [{
     *   label: '用户名', // label文字
     *   prop: 'username', // 字段名
     *   element: 'el-input', // 指定elementui组件
     *   initValue: '阿黄', // 字段初始值
     *   placeholder: '请输入用户名', // elementui组件属性
     *   rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组件属性
     *   events: { // elementui组件方法
     *     input (val) {
     *       console.log(val)
     *     },
     *     ...... // 可添加任意elementui组件支持的方法
     *   }
     *   ...... // 可添加任意elementui组件支持的属性
     * }]
     */
    value: {
      type: Object,
      required: true
    },
    formOptions: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    // 提交按钮项，多个用逗号分隔（search, export, reset）
    btnItems: {
      type: String,
      default() {
        return 'search'
      }
    },
    // 布局类型
    inline: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      formData: {},

      isAutoLabelWidth: false
    }
  },

  computed: {
    newKeys() {
      return this.formOptions.map(v => {
        return tools.createUniqueString()
      })
    }
  },

  watch: {
    formData: {
      handler(nv, ov) {
        this.$emit('input', nv)
      },
      deep: true
    }
    // value: {
    //   handler(nv, ov) {
    //     for (const key in ov) {
    //       this.formData[key] = ov[key]
    //     }
    //   },
    //   deep: true
    // }
  },

  created() {
    this.addInitValue()
  },

  mounted() {
    if (this.inline) {
      this.resizeHandler()
      window.addEventListener('resize', this.resizeHandler)
    }
  },
  beforeDestroy() {
    if (this.inline) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  },

  methods: {
    // 尺寸改变操作
    resizeHandler() {
      this.$nextTick(() => {
        const outWidth = this.$refs.formRef.$el.offsetWidth
        let innerWidth = 0
        this.$refs.formItem.forEach(item => {
          innerWidth += 10
          innerWidth += item.$el.offsetWidth
          // console.log(item.$el.offsetWidth)
        })
        // console.log(innerWidth)
        this.isAutoLabelWidth = outWidth < innerWidth
      })
    },
    // 校验
    onValidate(callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          console.log('提交成功')
          console.log(this.formData)
          callback()
        }
      })
    },
    // 搜索
    onSearch() {
      this.onValidate(() => {
        this.$emit('onSearch', this.formData)
      })
    },
    // 导出
    onExport() {
      this.onValidate(() => {
        this.$emit('onExport', this.formData)
      })
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    // 添加初始值
    addInitValue() {
      const obj = {}
      this.formOptions.forEach(v => {
        if (v.initValue !== undefined) {
          obj[v.prop] = v.initValue
        } else {
          obj[v.prop] = ''
        }
      })
      this.formData = obj
      // console.log('++++++++++++', this.formData)
    },
    // 重置noInline表单
    resetFields() {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form-box {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .btn-box {
    // padding-top: 5px;
    display: flex;

    button {
      height: 28px;
    }
  }
}
.no-inline {
  flex-direction: column;
  align-items: center;
}
</style>
<style lang="scss">
.search-form-box.inline {
  --el-input-width: 120px;
  --el-select-width: 120px;
  --el-cascader-width: 200px;

  .el-form {
    .el-form-item__label {
      padding-right: 0;
    }
    .el-form-item {
      margin-bottom: 0;

      &.is-error {
        margin-bottom: 22px;
      }
    }
    // el-input宽度
    .form-item {
      > .el-input:not(.el-date-editor) {
        width: var(--width);
      }
    }
    .el-select {
      width: var(--width);
    }
    .el-cascader {
      width: var(--width);
    }
  }
}
.search-form-box.no-inline {
  margin-bottom: unset !important;
  .el-form {
    width: 100%;
    .el-form-item__label {
      padding-right: 0;
    }
    .el-form-item {
      margin-bottom: 0;

      &.is-error {
        margin-bottom: 22px;
      }
    }
    // el-input宽度
    .form-item {
      > .el-input:not(.el-date-editor) {
        max-width: var(--width);
      }
      > .el-select {
        display: block !important;
        max-width: var(--width);
      }
      > .el-cascader {
        display: block !important;
        max-width: var(--width);
      }
    }
  }
}
</style>
