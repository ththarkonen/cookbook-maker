<template>
  <div class="modal fade" :id="`${id}`" tabindex="-1" role="dialog" aria-labelledby="addTopicModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="form-group less-margin-bottom">
            <h3 class="card-header text-center font-weight-bold text-uppercase py-4">Alaotsikko</h3>
            <div class="form-group row no-margin-bot">
              <label for="topicName" class="col-sm-3 col-form-label text-center">Nimi</label>
              <div class="col-sm-9">
                <input type="name" class="form-control"  v-on:keyup.enter="addTopic" id="topicName" ref="topicName" placeholder="Nimi">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-cancel" data-dismiss="modal">Peruuta</button>
          <button type="button" class="btn btn-primary btn-recipe" v-on:click="addTopic">Lisää</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

      props: {
        id: String
      },

      methods: {

        addTopic(){

          var topicName = this.$refs.topicName.value;
          var topicObj = { text: topicName, class: "topic", indent: false, image: 'glyphicon glyphicon-list'};

          this.$emit("topicAdded", topicObj);
          $('#addTopicModal').modal('hide')
        },

      }
  }
</script>
