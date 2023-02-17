<template>
  <div>
    <div class="container">
      <div
        class="items-container"
        ref="itemsContainer"
        @dragover.prevent
        @dragenter.prevent
        @drop="ondropitem($event, 'first')"
      >
        <div
          class="item"
          v-for="(item, index) in filterItems"
          :key="index"
          :class="{ selected: isSelected(item.id) }"
          :draggable="true"
          @dragstart="onDragStart(item, index, $event, 'items')"
          @drop.stop="dropOnChild(item, index, $event)"
          @click="onItemClick(item.id)"
        >
          {{ item.label }}
        </div>
      </div>
      <div
        class="items-container"
        ref="itemsContainer"
        @dragenter.prevent
        @dragover.prevent
        @drop="ondropitem($event, 'second')"
      >
        <div
          class="item"
          v-for="(item, index) in data"
          :key="index"
          :class="{ selected: isSelected(item.id) }"
          :draggable="true"
          @dragstart="onDragStart(item, index, $event, 'data')"
          @drop.stop="handleDrop(item, index, $event)"
          @click="onItemClick(item.id)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <div>
      <button @click="submit()">apply</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultColumns: {
      type: Array,
    },
  },
  data() {
    return {
      items: this.defaultColumns,
      // items: [
      //   { id: 1, name: "label", selected: false },
      //   { id: 2, name: "System", selected: false },
      //   { id: 3, name: "BillName", selected: false },
      //   { id: 4, name: "BillAddress", selected: false },
      //   { id: 5, name: "Cycle", selected: false },
      //   { id: 6, name: "Status", selected: false },
      // ],
      // items: [
      //   { id: 1, label: "Type", prop: "type", width: "110px", list: 1 },
      //   {
      //     id: 2,
      //     label: "System",
      //     prop: "billSystem",
      //     width: "125px",
      //     list: 1,
      //   },
      //   { id: 3, label: "Cycle", prop: "billCycle", width: "100px", list: 1 },
      //   {
      //     id: 4,
      //     label: "BillName",
      //     prop: "billingName",
      //     width: "145px",
      //     list: 1,
      //   },
      //   {
      //     id: 5,
      //     label: "BillAddress",
      //     prop: "billingAddress",
      //     width: "260px",
      //     list: 1,
      //   },
      //   { id: 6, label: "Status", prop: "status", width: "180px", list: 1 },
      // ],
      selectedItems: [],
      data: [],
    };
  },
  computed: {
    filterItems() {
      return this.items;
    },
  },
  methods: {
    isSelected(id) {
      return this.selectedItems.includes(id);
    },
    onDragStart(item, index, evt, arrayName) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";

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
    },
  },
};
</script>

<style lang="scss">
.columnSelector {
  .el-dialog__title {
    font-family: sans-serif;
    font-weight: 700;
  }

  .column-selector {
    display: flex;
    justify-content: space-between;
    gap: 30px;

    .section-header {
      display: flex;
      justify-content: space-between;
      .heading {
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
        margin-bottom: 5px;

        .subHeader {
          font-size: 12px;
          font-weight: 400;
        }
      }
    }

    .select-button {
      text-decoration: underline;
      color: blue;
      cursor: pointer;

      &.reset-button {
        margin-top: 10px;
        text-align: right;
      }
    }

    #hide-columns,
    #display-columns {
      height: 363px;
      width: 250px;
      border: 1px solid #d4d4d4;
      border-radius: 5px;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        display: none;
      }

      -ms-overflow-style: none;
      scrollbar-width: none;

      &.dragging {
        background-color: #f4f4f4;
      }
    }

    .column {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      padding-right: 22px;
      background-color: #fff;
      border-bottom: 1px solid #ffffff;

      &__name {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      &:hover {
        background-color: #f4f4f4;
        cursor: grab;
      }

      &.selected {
        background-color: #e4f0f9;
      }

      &.drag {
        border: 1px solid #999999;
        cursor: grabbing !important;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        .hide {
          display: flex !important;
        }
      }
    }
    .hide {
      display: none;
    }
  }

  .el-dialog__footer .dialog-footer {
    justify-content: flex-start;
  }

  .dragging {
    cursor: grabbing !important;
  }
}

// .container {
//   display: flex;
//   width: 100%;
//   gap: 16px;
// }

// .items-container {
//   height: 400px;
//   border: 1px solid red;
//   position: relative;
//   margin-bottom: 16px;
//   flex: 50%;
// }

// .item {
//   background: #fff;
//   border: 1px solid red;
//   padding: 10px;
//   /* position: absolute; */
//   cursor: move;
//   margin: 16px;
//   flex: 50%;
// }

// .selected {
//   border-color: blue;
// }
</style>
