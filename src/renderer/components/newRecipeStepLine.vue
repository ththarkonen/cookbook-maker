<template>
    <tr ref="row">
      <td class="pt-3-half" contenteditable="true">{{step}}</td>
      <td class="pt-3-half">
        <span class="table-up"><a href="#!" class="indigo-text"><i class="glyphicon glyphicon-arrow-up"
              aria-hidden="true" v-on:click="moveUp"></i></a></span>
        <span class="table-down"><a href="#!" class="indigo-text"><i class="glyphicon glyphicon-arrow-down"
              aria-hidden="true" v-on:click="moveDown"></i></a></span>
      </td>
      <td>
        <span class="table-remove"><button type="button" v-on:click="deleteRow"
            class="btn btn-danger btn-rounded btn-sm my-0">Poista</button></span>
      </td>
    </tr>
</template>

<script>

  export default {

    props: {
      step: String,
    },

    mounted: function() {

    },

    methods: {

      deleteRow(e) {

        var trTemp = e.path[3];
        trTemp.remove();
      },

      moveUp(e) {
        const row = $(this.$refs.row);
        row.insertBefore(row.prev());
      },

      moveDown(e) {
        const row = $(this.$refs.row);
        row.insertAfter(row.next());
      },

    },

  }
</script>

<style>
  tr {
    height: 10px;
  }

  .pt-3-half {
    padding: 8px!important;
  }

  .btn-danger {
    border-radius: 0px!important;
    padding: 0px!important;
    padding-left: 5px!important;
    padding-right: 5px!important;
  }

</style>
