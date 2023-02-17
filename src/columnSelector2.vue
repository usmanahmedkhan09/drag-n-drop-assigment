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
            <span class="subHeader">({{ hideColumnLength }})</span>
          </p>
          <p class="select-button" @click="selectAllHiddenColumns">
            {{ hideColumnsSelectAll ? "Deselect all" : "Select all" }}
          </p>
        </div>
        <div id="hide-columns" class="container">
          <div
            class="column"
            v-for="column in hideColumns"
            :key="column.key"
            :draggable="true"
            :data-key="column.key"
            :id="column.key"
            :class="'column-' + column.key"
            :data-order="column.order"
          >
            <div class="column__name">
              <!-- <svg-icon
                icon="icon-DragNDrop"
                width="12px"
                height="12px"
                role="presentation"
              /> -->
              <p>{{ column.label }}</p>
            </div>
            <span class="pointer" @click="hideColumn(column.key)">
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
            <span class="subHeader">({{ displayColumnLength }})</span>
          </p>
          <p class="select-button" @click="selectAllDisplayColumns">
            {{ displayColumnsSelected ? "Deselect all" : "Select all" }}
          </p>
        </div>
        <div id="display-columns" class="container">
          <div
            class="column"
            v-for="column in displayColumns"
            :key="column.key"
            :data-order="column.order"
            :draggable="true"
            :data-key="column.key"
            :id="column.key"
            :class="'column-' + column.key"
          >
            <div class="column__name">
              <!-- <svg-icon
                icon="icon-DragNDrop"
                width="12px"
                height="12px"
                role="presentation"
              /> -->
              <p>{{ column.label }}</p>
            </div>
            <span class="pointer" @click="hideColumn(column.key)">
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
    selectedColumns: {
      type: Array,
    },
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
      componentSelectedColumns: this.selectedColumns,
      displayColumnKeys: [],
      displayColumnsSelected: false,
      hideColumnsSelectAll: false,
      currentColumnLabel: "",
      displayColumnLength: 0,
      hideColumnLength: 0,
      intialEventsTimeout: null,
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
    displayColumns() {
      return this.defaultColumns
        .filter((column) => this.componentSelectedColumns.includes(column.key))
        .map((item, index) => ({
          ...item,
          order: index + 1,
        }));
    },
    hideColumns() {
      return this.defaultColumns
        .filter((column) => !this.componentSelectedColumns.includes(column.key))
        .map((item, index) => ({
          ...item,
          order: index + 1,
        }));
    },
  },
  methods: {
    handleChangeIcon(dragableElement) {
      const parentId = dragableElement.parentElement.id;
      const svgContainer = dragableElement.querySelector(".pointer");
      // const svgImg = svgContainer.querySelector("svg");
      // svgContainer.removeChild(svgImg);
      if (parentId === "display-columns") {
        svgContainer.innerHTML = this.hideIcon;
        svgContainer.setAttribute("href", "#icon-column-hide");
      }
      if (parentId === "hide-columns") {
        svgContainer.innerHTML = this.addIcon;
        svgContainer.setAttribute("href", "#icon-column-add");
      }
    },
    handleResetDOM() {
      const hideContainer = document.getElementById("hide-columns");
      const displayContainer = document.getElementById("display-columns");
      const columnList = document.querySelectorAll(
        `.${this.customClass} .column`
      );

      // classify each column to original states including the block it belong to
      // and sort them base on origin order in that block
      const hideColumns = (Array.from(columnList) || [])
        .filter(
          (col) => !this.selectedColumns.includes(parseInt(col.dataset.key))
        )
        .sort((a, b) => a.dataset.order - b.dataset.order);
      const displayColumns = (Array.from(columnList) || [])
        .filter((col) =>
          this.selectedColumns.includes(parseInt(col.dataset.key))
        )
        .sort((a, b) => a.dataset.order - b.dataset.order);

      // append back to original block
      displayColumns.forEach((col) => {
        displayContainer.appendChild(col);
        this.handleChangeIcon(col);
      });
      hideColumns.forEach((col) => {
        hideContainer.appendChild(col);
        this.handleChangeIcon(col);
      });

      // scroll each block to top
      hideContainer.scrollTop = 0;
      displayContainer.scrollTop = 0;
    },
    handleClose() {
      this.$emit("closeColumnSelector");
    },
    handleOpen() {
      this.intialEvents();
      this.componentSelectedColumns = this.selectedColumns;
    },
    change(event) {
      this.componentSelectedColumns = event;
    },
    submit() {
      const container2 = document.querySelector(
        `.${this.customClass} #display-columns`
      );
      this.displayColumnKeys = [
        ...container2.querySelectorAll(`.${this.customClass} .column`),
      ].map((column) => {
        return parseInt(column.dataset.key);
      });
      this.$emit("changeTableColumns", this.displayColumnKeys);
      this.handleClose();
    },
    resetToDefault() {
      // this.componentSelectedColumns = this.defaultColumnsKeys;
      // this.displayColumnLength = this.defaultColumnsKeys.length
      // this.hideColumnLength = 0
      this.componentSelectedColumns = this.selectedColumns;
      this.displayColumnLength = this.selectedColumns.length;
      this.hideColumnLength =
        this.defaultColumnsKeys.length - this.selectedColumns.length;
      this.hideColumnsSelectAll = false;
      this.displayColumnsSelected = false;

      this.handleResetDOM();
    },
    handleBackwardTab(e) {
      if (document.activeElement === this.firstFocusableEl) {
        e.preventDefault();
        this.lastFocusableEl.focus();
      }
    },
    handleForwardTab(e) {
      if (document.activeElement === this.lastFocusableEl) {
        e.preventDefault();
        this.firstFocusableEl.focus();
      }
    },
    handleKeyDown(e) {
      const KEY_TAB = 9;
      switch (e.keyCode) {
        case KEY_TAB:
          if (this.focusableEls.length === 1) {
            e.preventDefault();
            break;
          }
          if (e.shiftKey) {
            this.handleBackwardTab(e);
          } else {
            this.handleForwardTab(e);
          }
          break;
        default:
          break;
      }
    },
    intialEvents() {
      this.displayColumnLength = this.selectedColumns.length;
      this.hideColumnLength =
        this.defaultColumnsKeys.length - this.selectedColumns.length;
      this.componentSelectedColumns = this.selectedColumns;
      const draggables = document.querySelectorAll(
        `.${this.customClass} .column`
      );
      const containers = document.querySelectorAll(
        `.${this.customClass} .container`
      );

      draggables.forEach((dragable) => {
        dragable.addEventListener("dragstart", () => {
          dragable.classList.add("selected", "drag");
          if (this.displayColumnsSelected) {
            const temp = dragable.querySelector("p");
            this.currentColumnLabel = temp.innerText;
            // Add translation
            temp.innerText = `${this.currentColumnLabel} + ${
              this.displayColumnLength - 1
            } others`;
            const container = document.querySelector(
              `.${this.customClass} #display-columns`
            );
            const dragableElements = [
              ...container.querySelectorAll(
                `.${this.customClass} .column:not(.drag)`
              ),
            ];
            dragableElements.forEach(
              (element) => (element.style.display = "none")
            );
          }
          if (this.hideColumnsSelectAll) {
            const temp = dragable.querySelector("p");
            this.currentColumnLabel = temp.innerText;
            // Add translation
            temp.innerText = `${this.currentColumnLabel} + ${
              this.hideColumnLength - 1
            } others`;
            const container = document.querySelector(
              `.${this.customClass} #hide-columns`
            );
            const dragableElements = [
              ...container.querySelectorAll(
                `.${this.customClass} .column:not(.drag)`
              ),
            ];
            dragableElements.forEach(
              (element) => (element.style.display = "none")
            );
          }
        });

        dragable.addEventListener("dragend", () => {
          this.displayColumnLength = document.querySelectorAll(
            `.${this.customClass} #display-columns .column`
          ).length;
          this.hideColumnLength = document.querySelectorAll(
            `.${this.customClass} #hide-columns .column`
          ).length;
          // const svgIcon = dragable.querySelector('.pointer use');
          const svgIcon = dragable.querySelector(".pointer");
          if (dragable.parentElement.id == "hide-columns") {
            svgIcon.setAttribute("href", "#icon-column-add");
          } else {
            svgIcon.setAttribute("href", "#icon-column-hide");
          }
          if (this.displayColumnsSelected) {
            const temp = dragable.querySelector("p");
            temp.innerText = this.currentColumnLabel;
          }
          if (this.hideColumnsSelectAll) {
            const temp = dragable.querySelector("p");
            this.currentColumnLabel = temp.innerText;
          }
          if (this.displayColumnsSelected) {
            const temp = dragable.querySelector("p");
            this.currentColumnLabel = temp.innerText;
            // Add translation
            temp.innerText = `${this.currentColumnLabel} + ${
              this.displayColumnLength - 1
            } others`;
            const container = document.querySelector(
              `.${this.customClass} #display-columns`
            );
            const dragableElements = [
              ...container.querySelectorAll(
                `.${this.customClass} .column:not(.drag)`
              ),
            ];
            dragableElements.forEach(
              (element) => (element.style.display = "flex")
            );
          }
          if (this.hideColumnsSelectAll) {
            const temp = dragable.querySelector("p");
            this.currentColumnLabel = temp.innerText;
            // Add translation
            temp.innerText = `${this.currentColumnLabel} + ${
              this.hideColumnLength - 1
            } others`;
            const container = document.querySelector(
              `.${this.customClass} #hide-columns`
            );
            const dragableElements = [
              ...container.querySelectorAll(
                `.${this.customClass} .column:not(.drag)`
              ),
            ];
            dragableElements.forEach(
              (element) => (element.style.display = "flex")
            );
          }
          dragable.classList.remove("selected", "drag");

          // reset column to it's original label
          const originalColumn = (this.defaultColumns || []).find(
            (item) => item.key === parseInt(dragable.dataset.key)
          );
          const labelEl = dragable.querySelector("p");
          labelEl.innerText = originalColumn.label;

          // check icon add/hide
          this.handleChangeIcon(dragable);
        });
      });

      containers.forEach((container) => {
        container.addEventListener("dragover", (e) => {
          e.preventDefault();
          const afterElement = this.getDragAfterElement(container, e.clientY);
          let dragable = null;
          const dragables = document.querySelectorAll(
            `.${this.customClass} .selected.drag`
          );
          if (dragables.length == 1) {
            dragable = dragables[0];
          }
          console.log(dragables);
          if (afterElement != null || afterElement != undefined)
            container.appendChild(dragable);
          container.insertBefore(dragable, afterElement);
        });

        container.addEventListener(
          "dragover",
          () => {
            container.classList.add("dragging");
          },
          false
        );

        container.addEventListener(
          "dragleave",
          () => {
            container.classList.remove("dragging");
          },
          false
        );

        container.addEventListener(
          "drop",
          () => {
            container.classList.remove("dragging");
            if (this.displayColumnsSelected) {
              const container2 = document.querySelector(
                `.${this.customClass} #display-columns`
              );
              const selectedElement = document.querySelector(
                `.${this.customClass} .column.drag p`
              );
              selectedElement.innerText = this.currentColumnLabel;
              const dragableElements = [
                ...container2.querySelectorAll(
                  `.${this.customClass} .column:not(.drag)`
                ),
              ];
              dragableElements.forEach((element) => {
                container.appendChild(element);
                element.style.display = "flex";
                element.classList.remove("selected");
                // const svgIcon = element.querySelector('.pointer use');
                // const svgIcon = element.querySelector('.pointer');
                // if (element.parentElement.id == 'hide-columns')
                //   svgIcon.setAttribute('href', '#icon-column-add');
                // else svgIcon.setAttribute('href', '#icon-column-hide');
                this.handleChangeIcon(element);
              });
              this.displayColumnsSelected = false;
            }

            if (this.hideColumnsSelectAll) {
              const container2 = document.querySelector(
                `.${this.customClass} #hide-columns`
              );
              const selectedElement = document.querySelector(
                `.${this.customClass} .column.drag p`
              );
              selectedElement.innerText = this.currentColumnLabel;
              const dragableElements = [
                ...container2.querySelectorAll(
                  `.${this.customClass} .column:not(.drag)`
                ),
              ];
              dragableElements.forEach((element) => {
                container.appendChild(element);
                element.style.display = "flex";
                element.classList.remove("selected");
                // const svgIcon = element.querySelector('.pointer use');
                // const svgIcon = element.querySelector('.pointer');
                // if (element.parentElement.id == 'hide-columns')
                //   svgIcon.setAttribute('href', '#icon-column-add');
                // else svgIcon.setAttribute('href', '#icon-column-hide');
                this.handleChangeIcon(element);
              });
              this.hideColumnsSelectAll = false;
            }

            this.displayColumnLength = document.querySelectorAll(
              `.${this.customClass} #display-columns .column`
            ).length;
            this.hideColumnLength = document.querySelectorAll(
              `.${this.customClass} #hide-columns .column`
            ).length;
          },
          false
        );
      });
    },
    getDragAfterElement(container, y) {
      const dragableElements = [
        ...container.querySelectorAll(
          `.${this.customClass} .column:not(.selected.drag)`
        ),
      ];
      return dragableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    },
    selectAllDisplayColumns() {
      const container2 = document.querySelector(
        `.${this.customClass} #display-columns`
      );
      const columns = container2.querySelectorAll(
        `.${this.customClass} .column`
      );
      if (!this.displayColumnsSelected) {
        this.displayColumnsSelected = true;
        columns.forEach((column) => column.classList.add("selected"));
      } else {
        this.displayColumnsSelected = false;
        columns.forEach((column) => column.classList.remove("selected"));
      }
    },
    selectAllHiddenColumns() {
      const container2 = document.querySelector(
        `.${this.customClass} #hide-columns`
      );
      const columns = container2.querySelectorAll(
        `.${this.customClass} .column`
      );
      if (!this.hideColumnsSelectAll) {
        this.hideColumnsSelectAll = true;
        columns.forEach((column) => column.classList.add("selected"));
      } else {
        this.hideColumnsSelectAll = false;
        columns.forEach((column) => column.classList.remove("selected"));
      }
    },
    hideColumn(key) {
      const currentElement = document.querySelector(`.${this.customClass}`);
      const element = currentElement.querySelector(`.column-${key}`);
      if (element.parentElement.id == "display-columns") {
        const container = document.querySelector(
          `.${this.customClass} #hide-columns`
        );
        //const svgIcon = element.querySelector(".pointer use")
        const svgIcon = element.querySelector(".pointer");
        svgIcon.setAttribute("href", "#icon-column-add");
        const newElement = document.createElement("div");
        newElement.innerHTML = element.outerHTML;

        container.appendChild(element);
      } else {
        const container = document.querySelector(
          `.${this.customClass} #display-columns`
        );
        //const svgIcon = element.querySelector(".pointer use")
        const svgIcon = element.querySelector(".pointer");
        svgIcon.setAttribute("href", "#icon-column-hide");
        container.appendChild(element);
      }
      this.handleChangeIcon(element);
      this.displayColumnLength = document.querySelectorAll(
        `.${this.customClass} #display-columns .column`
      ).length;
      this.hideColumnLength = document.querySelectorAll(
        `.${this.customClass} #hide-columns .column`
      ).length;
    },
  },
};
</script>
