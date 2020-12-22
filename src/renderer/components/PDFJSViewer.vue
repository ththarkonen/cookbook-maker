<template>
<div>
  <iframe height="100%" width=100% :src="`${source}`" frameBorder="0" ></iframe>
</div>
</template>

<script>
export default {
  name: 'PDFJSViewer',
  props: {
    fileName: String,
    path:String
  },

  data: function() {
    return {
        source: this.showFile(this.path, this.filename),
    }
  },

  methods: {
    showFile( path, file ){
      if(this.fileName!==''){
          return this.path +'?file=' + this.fileName
      }
    },

    updateFile(file){
      this.source = this.path +'?file=' + file;
    },
  },
}
</script>
<style scoped>
div {
  width: 100%;
  height: 100%;
  padding: 0px;
}
</style>
