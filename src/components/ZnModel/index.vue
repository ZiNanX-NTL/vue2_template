<template>
  <el-dialog
    id="model"
    title="新增用户"
    :visible.sync="dialogVisible"
    append-to-body
    :width="width"
    :top="top"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <search-form
      v-if="isShow"
      ref="formRef"
      v-model="formData"
      btn-items=""
      :form-options="formOptions"
      :inline="false"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SearchForm from '@/components/SearchForm/index.vue'
export default {
  components: {
    SearchForm
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '15vh'
    },
    formOptions: {
      type: Array,
      required: true
    },
    modelDefaultInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShow: true, // 解决label-width: auto报错问题
      dialogVisible: false,
      formData: {}
    }
  },
  computed: {
    minusWidth() {
      return 100 - parseFloat(this.width) + '%'
    },
    minusTop() {
      return this.top
    }
  },
  watch: {
    formData: {
      handler(nv, ov) {
        this.$emit('input', nv)
      },
      deep: true
    },
    modelDefaultInfo: {
      handler(nv, ov) {
        // console.log(nv, this.formOptions, this.formData)
        this.$nextTick(() => {
          for (const item of this.formOptions) {
            this.formData[item.prop] = nv[item.prop]
          }
        })
      },
      deep: true
    }
  },
  methods: {
    handleConfirm() {
      this.$refs.formRef.onValidate(() => {
        this.$emit('confirm')
      })
    },
    // 解决label-width: auto报错问题
    handleOpen() {
      this.isShow = true
    },
    handleClosed() {
      this.$refs.formRef.resetFields()
      this.isShow = false
    },

    // 对话框根据点击位置展示动画
    positioningAnimation(e) {
      this.$nextTick(() => {
        if (!document.querySelector('#model>.el-dialog')) return
        document.querySelector(
          '#model>.el-dialog'
        ).style.transformOrigin = `calc(${e.x}px - ${this.minusWidth}) calc(${e.y}px - ${this.minusTop})`
      })
    }
  }
}
</script>

<style></style>
