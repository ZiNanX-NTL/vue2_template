<template>
  <div class="data-table">
    <div class="header" style="">
      <div>
        <slot name="title" />
      </div>
      <div>
        <slot name="header" />
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        class="scrollCss"
        :data="tableData"
        :height="'100%'"
        :highlight-current-row="selectedRow"
        row-key="id"
        lazy
        :load="load"
        style="width: 100%"
        :row-style="rowStyle"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="showSelectColumn" type="selection" width="60" align="center" />
        <el-table-column
          v-if="showIndexColumn"
          type="index"
          label="序号"
          align="center"
          width="80"
        />
        <el-table-column
          v-for="item in tableHead"
          :key="tableHeadSetting ? item[tableHeadSetting.prop] : item.prop"
          show-overflow-tooltip
          align="center"
          :fixed="item.fixed"
          :prop="tableHeadSetting ? item[tableHeadSetting.prop] : item.prop"
          :label="
            resultLabel({
              label: tableHeadSetting ? item[tableHeadSetting.label] : item.label,
              prefix: hasContent(item.prefix, prefix),
              unit: item.unit
            })
          "
          :width="item.width"
          :min-width="
            fixWidth(
              tableHeadSetting ? item[tableHeadSetting.label] : item.label,
              item.unit,
              item.prefix || prefix
            )
          "
        >
          <template slot-scope="scope">
            <!-- <span v-if="item.unit">{{ scope.row[item.prop] + ' ' + item.unit }}</span> -->
            <slot
              :name="tableHeadSetting ? item[tableHeadSetting.prop] : item.prop"
              :row="scope.row"
            >
              {{ scope.row[tableHeadSetting ? item[tableHeadSetting.prop] : item.prop] }}
            </slot>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="display: flex; justify-content: right">
      <slot name="footer">
        <el-pagination
          v-if="showPagination"
          :current-page="pageInfo.pageNum"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZnTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    childrenData: {
      type: Array,
      default: () => []
    },

    tableHead: {
      type: Array,
      default: () => []
    },
    prefix: {
      type: String,
      default: ''
    },
    pageInfo: {
      type: Object,
      default: () => ({})
    },
    showIndexColumn: {
      type: Boolean,
      default: false
    },
    showSelectColumn: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    tableHeadSetting: {
      type: Object || undefined || null,
      default: undefined
    }
  },
  data() {
    return {
      currentRowId: '',
      selectedRow: false
    }
  },
  watch: {
    // pageInfo: {
    //   deep: true,
    //   immediate: true,
    //   handler(v) {
    //     this.$emit('page-change', v)
    //   }
    // },
    'pageInfo.pageNum': {
      handler(v) {
        console.log('pageNum Change')
        this.$emit('page-change', v)
      }
    },
    'pageInfo.pageSize': {
      handler(v) {
        console.log('pageSize Change')
        this.$emit('page-change', v)
      }
    }
  },
  created() {},
  methods: {
    resultLabel(obj) {
      let resLabel = obj.label
      if (obj.prefix) resLabel = obj.prefix + resLabel
      if (obj.unit) resLabel = resLabel + ` (${obj.unit})`
      return resLabel
    },
    fixWidth(label, unit = '', prefix) {
      let length = 0
      const val = label + '' + unit
      if (unit) {
        length = val.length * 16 + 30
      } else {
        length = val.length * 20 + 30
      }
      if (prefix) length += prefix.length * 20
      if (length < 80) {
        length = 80
      }
      // console.log(length)
      return length
    },
    hasContent(content, defaultContent) {
      return content ?? defaultContent
    },

    rowStyle({ row, rowIndex }) {
      // console.log(row)
      const styleObj = {}
      if (!row.hasChildren) {
        styleObj.backgroundColor = '#e4ebe1'
        return styleObj
      } else {
        styleObj.cursor = 'pointer'
        return styleObj
      }
    },

    load(tree, treeNode, resolve) {
      // 传递数据和成功执行的回调 以实现异步加载,在父组件也需要设置是否有树表格的hasChildren属性
      // console.log('tree', tree)
      this.$emit('on-rowClick', tree, () => {
        resolve(this.childrenData)
      })
      // console.log('treeNode', treeNode)
      // console.log('resolve', resolve)
    },

    handleRowClick(row, column, event) {
      // console.log(row.id)
      const isSelectRow = this.setCurrentRow(row.id)
      if (typeof isSelectRow !== 'boolean') return
      if (isSelectRow) {
        this.$emit('on-rowClick', row)
      } else {
        this.$emit('on-cancel-SelectRow-init')
      }
    },

    setCurrentRow(currentRowId) {
      if (!currentRowId) return
      if (this.currentRowId !== currentRowId) {
        this.selectedRow = true
        this.currentRowId = currentRowId
      } else {
        this.selectedRow = !this.selectedRow
      }
      return this.selectedRow
    },

    // 选择表格选项发生改变
    handleSelectionChange(selection) {
      this.$emit('selectionChange', selection)
    },

    // 改变当前页
    handleCurrentChange(currentPage) {
      this.pageInfo.pageNum = currentPage
    },

    // 改变当前页面数据条数
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize
    }
  }
}
</script>

<style lang="scss" scoped>
.data-table {
  height: 100%;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.table-wrap {
  height: 0;
  flex: 1;
}
</style>
<style lang="scss">
.data-table {
  tr.current-row > td {
    background-color: #d5e6f9;
  }

  // 隐藏table表格小面的横条
  .el-table::before {
    background-color: transparent !important;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    background-color: transparent !important;
  }
}
</style>
