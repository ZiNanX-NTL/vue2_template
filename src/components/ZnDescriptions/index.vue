<template>
  <el-descriptions :column="column" :title="title">
    <template #title>
      <slot name="title" />
    </template>
    <template #extra>
      <slot name="extra" />
    </template>
    <template v-for="item in headerParams">
      <el-descriptions-item
        v-if="isShowItem(paramsSetting ? item[paramsSetting.prop] : item.prop)"
        :key="paramsSetting ? item[paramsSetting.prop] : item.prop"
        :label="paramsSetting ? item[paramsSetting.label] : item.label"
      >
        <!-- {{ descriptions[item.prop] }} -->
        <template #label>
          <slot name="label" />
        </template>
        <slot
          :name="paramsSetting ? item[paramsSetting.prop] : item.prop"
          :content="descriptions[paramsSetting ? item[paramsSetting.prop] : item.prop]"
        >
          {{ descriptions[paramsSetting ? item[paramsSetting.prop] : item.prop] }}
        </slot>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    column: {
      type: Number,
      default: 1
    },
    descriptions: {
      type: Object,
      default: () => {}
    },
    headerParams: {
      type: Array,
      default: () => []
    },
    paramsSetting: {
      type: Object,
      default: null
    },
    hiddenList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    isShowItem(prop) {
      return !this.hiddenList.includes(prop)
    }
  }
}
</script>

<style></style>
