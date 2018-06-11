const connectDB = require('../../foundation/connectDB');

const MysqlStatus_Schema = new connectDB.mongoose.Schema({
  Aborted_connects:         {type: String},
  Binlog_cache_disk_use:    {type: String},
  Bytes_received:           {type: String},
  Bytes_sent:               {type: String},
  Created_tmp_disk_tables:  {type: String},
  Created_tmp_files:        {type: String},
  Created_tmp_tables:       {type: String},
  Handler_delete:           {type: String},
  Handler_read_first:       {type: String},
  Handler_read_rnd:         {type: String},
  Handler_read_rnd_next:    {type: String},
  Handler_update:           {type: String},
  Handler_write:            {type: String},
  Key_read_requests:        {type: String},
  Key_reads:                {type: String},
  Max_used_connections:     {type: String},
  Open_files:               {type: String},
  Opened_table_definitions: {type: String},
  Opened_tables:            {type: String},
  Qcache_free_memory:       {type: String},
  Qcache_hits:              {type: String},
  Qcache_queries_in_cache:  {type: String},
  Questions:                {type: String},
  Select_full_join:         {type: String},
  Select_full_range_join:   {type: String},
  Select_range:             {type: String},
  Select_range_check:       {type: String},
  Select_scan:              {type: String},
  Slave_running:            {type: String},
  Slow_queries:             {type: String},
  Sort_merge_passes:        {type: String},
  Sort_scan:                {type: String},
  Table_locks_immediate:    {type: String},
  Table_locks_waited:       {type: String},
  Threads_connected:        {type: String},
  Threads_created:          {type: String},
  Threads_running:          {type: String},
  Uptime:                   {type: String},
  QPS:                      {type: String},
  created_at: {
    type: String,
    default: Date.now()
  },
  updated_at: {
    type: String,
    default: Date.now()
  },
});

const mysql_status = connectDB.mongoose.model('mysql_status',MysqlStatus_Schema);
module.exports = mysql_status;