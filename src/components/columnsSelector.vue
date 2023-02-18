<template>
  <el-dialog
    title="EditColumns"
    :before-close="handleClose"
    :visible.sync="showColumnSelector"
    :append-to-body="true"
    class="columnSelector"
    :width="'585px'"
    @opened="handleOpen"
    :destroy-on-close="true"
  >
    <div class="column-selector" :class="customClass ? customClass : ''">
      <div>
        <div class="section-header">
          <p class="heading">
            Hidden Columns
            <span class="subHeader">({{ hideColumns }})</span>
          </p>
          <p class="select-button" @click="selectAllHiddenColumns">
            {{
              hideColumnsSelectAll && items.length != 0
                ? "Deselect all"
                : "Select all"
            }}
          </p>
        </div>
        <div
          id="hide-columns"
          class="container"
          @dragover.prevent
          @dragenter.prevent
          @drop="ondropitem($event, 'first')"
        >
          <div
            class="column"
            v-for="(item, index) in items"
            :key="index"
            :class="{ selected: isSelected(item.id) }"
            :draggable="true"
            @dragstart="onDragStart(item, index, $event, 'items')"
            @drop.stop="dropOnChild(item, index, $event)"
            @click="onItemClick(item.id)"
          >
            <div class="column__name">
              <!-- <svg-icon
                icon="icon-DragNDrop"
                width="12px"
                height="12px"
                role="presentation"
              /> -->
              <font-awesome-icon icon="fa-solid fa-grip" />
              <p>{{ item.label }}</p>
            </div>
            <span class="pointer">
              <font-awesome-icon icon="fa-solid fa-xmark" />
              <!-- <svg-icon
                icon="icon-column-add"
                width="14px"
                height="14px"
                role="img"
              /> -->
            </span>
          </div>
        </div>
      </div>
      <div>
        <div class="section-header">
          <p class="heading">
            Display Columns
            <span class="subHeader">({{ displayColumns }})</span>
          </p>
          <p class="select-button" @click="selectAllDisplayColumns">
            {{
              displayColumnsSelected && data.length != 0
                ? "Deselect all"
                : "Select all"
            }}
          </p>
        </div>
        <div
          id="display-columns"
          class="container"
          @dragenter.prevent
          @dragover.prevent
          @drop="ondropitem($event, 'second')"
        >
          <!-- :class="{ selected: isSelected(column.label) }"
            v-for="column in displayColumns"
            :key="column.key"
            :data-order="column.order"
            @dragstart="dragStart($event, column)"
            @click="onItemClick(column)"
            :draggable="true" -->
          <div
            class="column"
            v-for="(item, index) in data"
            :key="index"
            :class="{ selected: isSelected(item.id) }"
            :draggable="true"
            @dragstart="onDragStart(item, index, $event, 'data')"
            @drop.stop="handleDrop(item, index, $event)"
            @click="onItemClick(item.id)"
          >
            <div class="column__name">
              <font-awesome-icon icon="fa-solid fa-grip" />
              <!-- <svg-icon
                icon="icon-DragNDrop"
                width="12px"
                height="12px"
                role="presentation"
              /> -->
              <p>{{ item.label }}</p>
            </div>
            <span class="pointer">
              <font-awesome-icon icon="fa-solid fa-check" />
              <!-- <svg-icon
                icon="icon-column-hide"
                width="14px"
                height="14px"
                role="img"
              /> -->
            </span>
          </div>
        </div>
        <p class="select-button reset-button" @click="resetToDefault">Reset</p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">Apply</el-button>
      <el-button type="text" @click="handleClose">Cancel </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "columnSelector",
  props: {
    defaultColumns: {
      type: Array,
      required: true,
    },
    // selectedColumns: {
    //   type: Array,
    // },
    showColumnSelector: {
      type: Boolean,
    },
    defaultColumnsKeys: {
      type: Array,
    },
    customClass: {
      type: String,
    },
  },
  data() {
    return {
      items: [],
      selectedItems: [],
      data: this.defaultColumns,
      // displaycoulumns: [],
      // selected: [],
      // incomingColumns: [...this.defaultColumns],
      // displayColumnKeys: [],
      displayColumnsSelected: false,
      hideColumnsSelectAll: false,
      // currentColumnLabel: "",
      // displayColumnLength: 0,
      // hideColumnLength: 0,
      // intialEventsTimeout: null,
      addIcon: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.88672 0.960938C7.30093 0.960938 7.63672 1.29672 7.63672 1.71094V6.96094L12.8867 6.96094C13.3009 6.96094 13.6367 7.29672 13.6367 7.71094C13.6367 8.12515 13.3009 8.46094 12.8867 8.46094L7.63672 8.46094V13.7109C7.63672 14.1252 7.30093 14.4609 6.88672 14.4609C6.4725 14.4609 6.13672 14.1252 6.13672 13.7109V8.46094L0.886719 8.46094C0.472505 8.46094 0.136719 8.12515 0.136719 7.71094C0.136719 7.29672 0.472505 6.96094 0.886719 6.96094L6.13672 6.96094V1.71094C6.13672 1.29672 6.47251 0.960938 6.88672 0.960938Z" fill="#003778"/>
</svg>`,
      hideIcon: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.886719 1.71094L10.8867 11.7109" stroke="#003778" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.886719 11.7109L10.8867 1.71094" stroke="#003778" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    };
  },
  watch: {},
  computed: {
    // componentSelectedColumns() {
    //   return this.selectedColumns;
    // },
    // showHiddenSelect() {
    //   if (this.items.length > 0) {
    //     return false;
    //   }
    //   return true;
    // },
    displayColumns() {
      return this.data.length;
    },
    hideColumns() {
      return this.items.length;
    },
  },
  methods: {
    isSelected(id) {
      return this.selectedItems.includes(id);
    },
    onDragStart(item, index, evt, arrayName) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";

      this.hideColumnsSelectAll = false;
      this.displayColumnsSelected = false;
      this.selectedColumns = [];

      if (arrayName == "items") {
        if (this.selectedItems.length > 0) {
          this.items.forEach((x) => {
            if (this.selectedItems.includes(x.id)) {
              evt.dataTransfer.setData(
                x.label,
                JSON.stringify({ id: x.id, index: index })
              );
            }
          });
        } else {
          evt.dataTransfer.setData(
            item.label,
            JSON.stringify({ id: item.id, index: index })
          );
        }
      } else {
        if (this.selectedItems.length > 0) {
          this.data.forEach((x) => {
            if (this.selectedItems.includes(x.id)) {
              evt.dataTransfer.setData(
                x.label,
                JSON.stringify({ id: x.id, index: index })
              );
            }
          });
        } else {
          evt.dataTransfer.setData(
            item.label,
            JSON.stringify({ id: item.id, index: index })
          );
        }
      }

      this.selectedItems = [];
    },
    onDragEnd(index, event) {
      const draggedIndex = JSON.parse(event.dataTransfer.getData("text"));
      const draggedItem = { ...this.items[draggedIndex.index] };
      const items = [...this.items];
      items.splice(draggedIndex.index, 1);
      items.splice(index, 0, { ...draggedItem });
      this.items = items.map((item, index) => ({ ...item, id: index }));
    },

    ondropitem(event, payload) {
      let IdContainer = new Set();

      if (payload == "second") {
        this.items.forEach((x) => {
          let data = event.dataTransfer.getData(x.label);
          if (data && JSON.parse(data).id == x.id) {
            IdContainer.add(x.id);
          }
        });
        this.items = this.items
          .map((x) => {
            if (IdContainer.has(x.id)) {
              this.data.push({ ...x });
            } else {
              return x;
            }
          })
          .filter(Boolean);
        this.selected = [];
      } else {
        this.data.forEach((x) => {
          let data = event.dataTransfer.getData(x.label);
          if (data && JSON.parse(data).id == x.id) {
            IdContainer.add(x.id);
          }
        });
        this.data = this.data
          .map((x) => {
            if (IdContainer.has(x.id)) {
              this.items.push({ ...x });
            } else {
              return x;
            }
          })
          .filter(Boolean);
      }
    },

    handleDrop(item, index, evt) {
      let IdContainer = [];
      this.data.forEach((x) => {
        let data = evt.dataTransfer.getData(x.label);
        if (data && JSON.parse(data).id == x.id) {
          IdContainer.push(JSON.parse(data).id);
        }
      });
      let itemIndex = this.data.findIndex((x) => x.id == IdContainer[0]);
      if (itemIndex != -1) {
        const draggedItem = this.data[itemIndex];
        let items = this.data;
        items.splice(itemIndex, 1, item);
        items.splice(index, 1, { ...draggedItem });
        this.data = items;
      } else {
        let ab = this.items.findIndex((x) => x.id == IdContainer[0]);
        if (ab != -1) {
          let item = { ...this.items[ab] };
          this.items.splice(ab, 1);
          this.data.push({ ...item });
        }
      }
    },

    dropOnChild(item, index, evt) {
      let IdContainer = [];
      this.items.forEach((x) => {
        let data = evt.dataTransfer.getData(x.label);
        if (data && JSON.parse(data).id == x.id) {
          IdContainer.push(JSON.parse(data).id);
        }
      });

      let itemIndex = this.items.findIndex((x) => x.id == IdContainer[0]);
      if (itemIndex != -1) {
        const draggedItem = this.items[itemIndex];
        let items = this.items;
        items.splice(itemIndex, 1, item);
        items.splice(index, 1, { ...draggedItem });
        this.items = [...items];
      } else {
        let ab = this.data.findIndex((x) => x.id == IdContainer[0]);
        if (ab != -1) {
          let item = { ...this.data[ab] };
          this.data.splice(ab, 1);
          this.items.push({ ...item });
        }
      }
    },

    onItemClick(id) {
      if (this.selectedItems.includes(id)) {
        // deselect item
        this.selectedItems = this.selectedItems.filter((i) => i !== id);
      } else {
        // select item
        this.selectedItems.push(id);
      }
    },

    submit() {
      this.$emit(
        "changeTableColumns",
        this.data.map((x) => x.id)
      );
      this.handleClose();
    },
    // dragStart(evt, item) {
    //   evt.dataTransfer.dropEffect = "move";
    //   evt.dataTransfer.effectAllowed = "move";
    //   if (this.selected.length > 0) {
    //     this.incomingColumns.forEach((x) => {
    //       if (this.selected.includes(x.label)) {
    //         evt.dataTransfer.setData(x.label, x.label);
    //       }
    //     });
    //   } else {
    //     evt.dataTransfer.setData(item.label, item.label);
    //   }
    //   this.selected = [];
    // },
    // onDrop(evt, list) {
    //   this.incomingColumns.filter((x) => {
    //     if (x.label == evt.dataTransfer.getData(x.label)) {
    //       x.list = list;
    //     }
    //     return x;
    //   });
    // },
    // onItemClick(item) {
    //   if (this.selected.includes(item.label)) {
    //     // deselect item
    //     this.selected = this.selected.filter((i) => i !== item.label);
    //   } else {
    //     // select item
    //     this.selected.push(item.label);
    //   }
    // },
    // isSelected(label) {
    //   return this.selectedItems.includes(label);
    // },
    handleClose() {
      this.$emit("closeColumnSelector");
    },
    handleOpen() {
      this.componentSelectedColumns = this.selectedColumns;
    },
    selectAllHiddenColumns() {
      if (!this.hideColumnsSelectAll) {
        this.selectedItems = this.items.map((x) => x.id);
        this.hideColumnsSelectAll = true;
      } else {
        this.hideColumnsSelectAll = false;
        this.selectedItems = [];
      }
    },
    selectAllDisplayColumns() {
      if (!this.displayColumnsSelected) {
        this.selectedItems = this.data.map((x) => x.id);
        this.displayColumnsSelected = true;
      } else {
        this.displayColumnsSelected = false;
        this.selectedItems = [];
      }
    },
    resetToDefault() {
      // this.componentSelectedColumns = this.selectedColumns;
      // this.displayColumnLength = this.selectedColumns.length;
      // this.hideColumnLength =
      //   this.defaultColumnsKeys.length - this.selectedColumns.length;
      this.hideColumnsSelectAll = false;
      this.displayColumnsSelected = false;
      // this.incomingColumns.filter((item) => (item.list = 1));
      this.selectedItems = [];
      this.items = [];
      this.data = this.defaultColumns;
    },
    // submit() {
    //   this.displayColumnKeys = [];
    //   this.displayColumns.forEach((item) => {
    //     this.displayColumnKeys.push(item.key);
    //   });
    //   this.$emit("changeTableColumns", this.displayColumnKeys);
    //   this.handleClose();
    // },
    // reorderColumns() {
    //   console.log("herererrerer");
    // },
  },
};
</script>
<style>
.selected {
  border-color: #0074d9;
}
</style>
