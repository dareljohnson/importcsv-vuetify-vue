<template>
  <v-container>
      <v-layout row wrap class="mb-2">
          <v-flex xs12 sm6 class="text-xs-center text-sm-right">
              
          </v-flex>
      </v-layout>
      <v-layout v-if="loading">
          <v-flex xs12 class="text-xs-center">
              <v-progress-circular 
                    indeterminate 
                    class="primary--text" 
                    :width="7" 
                    :size="70" 
                    ></v-progress-circular>
          </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-2" v-else>
          <v-flex xs12 sm6 offset-sm3>
             <v-card>
                <v-card-title>
                    <div>
                        <h4>CSV file to import</h4>
                    </div>
                </v-card-title>
                <v-card-actions>
                    <div class="form-group">
                        <div class="col-sm-9">
                            <v-btn raised class="primary" @click="onPickFile">Upload CSV</v-btn>
                            <input 
                                type="file" 
                                style="display:none" 
                                ref="fileInput" 
                                class="form-control" 
                                accept="csvFile/*"
                                @change="loadCSV">
                        </div>
                    </div>
                </v-card-actions>
             </v-card>
          </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-2">
          <v-flex xs12>
              <v-data-table
                :headers="headers"
                :pagination.sync="pagination"
                :items="contacts"
                hide-actions
                class="elevation-1"
                :loading="loading"
                >
                    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                    <template slot="items" slot-scope="props">
                        <!-- <td class="text-xs-middle">{{ props.item.ID }}</td> -->
                        <td class="text-xs-middle">{{ props.item.First_Name }}</td>
                        <td class="text-xs-middle">{{ props.item.Last_Name }}</td>
                        <!-- <td class="text-xs-middle">{{ props.item.Email }}</td> -->
                    </template>
                    <template slot="no-data">
                        <v-alert :value="true" color="error" icon="warning">
                            Sorry, nothing to display here :(
                        </v-alert>
                    </template>
              </v-data-table>
              <div class="text-xs-center pt-2">
                 <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
              </div>
          </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
            
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
      data () {
          return {
              contacts:[],
              headers: [
                  /* {
                  text: 'Id',
                  align: 'left',
                  sortable: false,
                  value: 'name'
                  }, */
                  {
                  text: 'First Name',
                  align: 'left',
                  sortable: false,
                  value: 'name'
                  },
                  {
                  text: 'Last Name',
                  align: 'left',
                  sortable: false,
                  value: 'name'
                  }/* ,
                  {
                  text: 'Email',
                  align: 'left',
                  sortable: false,
                  value: 'name'
                  } */
              ],
              pagination: {}
          }
      },
      filters:{
          capitalize (str) {
              return str.charAt(0).toUpperCase() + str.slice(1)
          }
      },
      computed:{
          /* contacts (){
            return this.loadCSV.toList()
        }, */
        pages () {
            if (this.pagination.rowsPerPage == null ||
            this.pagination.totalItems == null
            ) return 0
            return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
        },
        loading (){
            return this.$store.getters.loading
        } 
      },
      methods: {
        onCreateContact (){
             
        },
        sortBy (key){
            const vm = this
            vm.sortKey = key
            vm.sortOrders[key] = vm.sortOrders[key] * -1
        },
        csvJSON (csv){
            var vm = this
            var lines = csv.split("\n")
            var result = []
            var headers = lines[0].split(",")
            vm.parse_header = lines[0].split(",") 
                        
            lines.map(function(line, indexLine){
                if (indexLine < 1) return // Jump header line
                
                var obj = {}
                var currentline = line.split(",")
                
                headers.map(function(header, indexHeader){
                   obj[header] = currentline[indexHeader]
                })
                
                result.push(obj)
            })
            
            result.pop() // remove the last item because undefined values
            //console.log(result)
            return result // JavaScript object
        },
        onPickFile (){
            this.$refs.fileInput.click()
        },
        loadCSV (e) {
            var vm = this
            let files = e.target.files;
            let file = files[0];
            let name = files[0].name;
            //console.log(name);
            const dataset = []

            if (window.FileReader) {
                let reader = new FileReader();
                // when the file is read it triggers the onload event above.
                reader.readAsText(file, 'UTF-8');
                // Handle errors load
                reader.onload = function(event) {
                    let csv = reader.result;
                    vm.contacts = vm.csvJSON(csv)
                    //console.log(vm.contacts)
                };
                
                reader.onerror = function(evt) {
                    if(evt.target.error.name == "NotReadableError") {
                        alert("Canno't read file !");
                    }
                };
            } else {
                alert('FileReader are not supported in this browser.');
            }
        }
    }
}
</script>

<style scoped>
.title {
    position: absolute;
    bottom: 50px;
    background-color:rgb(0,0,0, 0.5);
    color:white;
    font-size: 2em;
    padding: 20px;
}
[v-cloak] { 
  display: none; 
}
</style>