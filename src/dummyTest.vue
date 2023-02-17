<template>
  <div>
    <div
      role="button"
      tabindex="0"
      class="table-title__customize"
      @click="showSelector"
    >
      <!-- <svg-icon
        icon="icon-columns"
        width="18px"
        height="18px"
        role="presentation"
      /> -->
      <span>Open Dialog</span>
    </div>

    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="column in columns"
          :key="column.id"
          :label="column.label"
          :prop="column.prop"
        >
          <template #default="{ row }">
            <template>
              {{ row[column.prop] }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ColumnSelector
      :showColumnSelector="showColumnSelector"
      :defaultColumns="defaultColumns"
      :selectedColumns="selectedColumns"
      :defaultColumnsKeys="defaultColumnsKeys"
      @changeTableColumns="changeTableColumns"
      @closeColumnSelector="closeColumnSelector"
      customClass="accessSearch"
    />
    <!-- <HelloWorld
      :defaultColumns="defaultColumns"
      @changeTableColumns="changeTableColumns"
    /> -->
    <!-- <keep-alive>
      <column-selector-2
        :showColumnSelector="showColumnSelector"
        :defaultColumns="defaultColumns"
        :selectedColumns="selectedColumns"
        :defaultColumnsKeys="defaultColumnsKeys"
        @changeTableColumns="changeTableColumns"
        @closeColumnSelector="closeColumnSelector"
        customClass="accessSearch"
      />
    </keep-alive> -->
  </div>
</template>

<script lang="js">
// import ColumnSelector2 from "@/columnSelector2";
import ColumnSelector from "./components/columnsSelector.vue";
// import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "dummyTest",
  components: {
    // ColumnSelector2,
    ColumnSelector,
    // HelloWorld,
  },
  data() {
    return {
      selectedColumns: [1, 2, 3, 4, 5, 6],
      defaultColumnsKeys: [1, 2, 3, 4, 5, 6],
      showColumnSelector: false,
    };
  },
  methods: {
    showSelector() {
      this.showColumnSelector = true;
    },
    closeColumnSelector() {
      this.showColumnSelector = false;
    },
    changeTableColumns(updatedColumns) {
      this.selectedColumns = [];
      // console.log(updatedColumns);
      this.selectedColumns = updatedColumns;
    },
  },
  computed: {
    tableData() {
      let apidata = [
        {
          type: "red",
          billCycle: "25",
          billSystem: "Code Red",
          billingName: "NN",
          billingAddress: "Test 1",
          status: false,
        },
        {
          type: "blue",
          billCycle: "25",
          billSystem: "Code Blue",
          billingName: "ZZ",
          billingAddress: "Test 2",
          status: false,
        },
        {
          type: "Green",
          billCycle: "25",
          billSystem: "Code Green",
          billingName: "Y",
          billingAddress: "Test 3",
          status: false,
        },
        {
          type: "Yellow",
          billCycle: "25",
          billSystem: "Code Yellow",
          billingName: "X",
          billingAddress: "Test 4",
          status: false,
        },
      ];
      return JSON.parse(JSON.stringify(apidata));
    },
    defaultColumns() {
      return [
        { id: 1, label: "Type", prop: "type", width: "110px", list: 1 },
        {
          id: 2,
          label: "System",
          prop: "billSystem",
          width: "125px",
          list: 1,
        },
        { id: 3, label: "Cycle", prop: "billCycle", width: "100px", list: 1 },
        {
          id: 4,
          label: "BillName",
          prop: "billingName",
          width: "145px",
          list: 1,
        },
        {
          id: 5,
          label: "BillAddress",
          prop: "billingAddress",
          width: "260px",
          list: 1,
        },
        { id: 6, label: "Status", prop: "status", width: "180px", list: 1 },
      ];
    },
    columns() {
      let columns = [];
      this.selectedColumns?.forEach((column) => {
        columns.push(this.defaultColumns.filter((col) => col.id == column)[0]);
      });
      return columns;
    },
  },
};
</script>
