<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <template v-if="pageLayout === 'layout1'">
      <div :class="{ 'fixed-header1': true }">
        <navbar />
      </div>
    </template>
    <template v-if="pageLayout === 'horizontalLayout'">
      <div :class="{ 'fixed-header1': fixedHeader }">
        <navbar>
          <sidebar class="h-sidebar-container" />
        </navbar>
      </div>
    </template>
    <sidebar v-if="pageLayout !== 'horizontalLayout'" class="sidebar-container" />
    <div :class="mainContainerLayout">
      <div v-if="pageLayout === 'defaultLayout'" :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    pageLayout() {
      return this.$store.state.settings.pageLayout
    },
    classObj() {
      return {
        hideSidebar: !(this.pageLayout === 'horizontalLayout' ? true : this.sidebar.opened),
        openSidebar: this.pageLayout === 'horizontalLayout' ? true : this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    mainContainerLayout() {
      return {
        'main-container': true,
        layout1: this.pageLayout === 'layout1',
        horizontalLayout: this.pageLayout === 'horizontalLayout'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.fixed-header1 {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1009;
  // width: calc(100% - #{$sideBarWidth});
  width: 100%;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
