var exit_code = new Vue({
  el: '#exitcode',
  data: {
    exitcodes: [],
  },
  mounted(){
    socket.on('table_process_exitcode', (data) => {
      this.exitcodes.unshift(data);
      if(this.exitcodes.length > 100) {
        this.exitcodes.pop();
      };
    });
  }
});

