var app = new Vue({
  el: '#app',
  data: {
    processes: [],
  },
  mounted(){
    socket.on('table_process_info', (data) => {
      // Vue.set(this,'processes',data)
      this.processes = data;
      this.processes.sort((a, b) => {
        return b.detail.pcpu - a.detail.pcpu;
      });
    });
  }
});