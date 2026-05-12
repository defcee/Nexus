module.exports = {
  apps: [
    {
      name: 'nexus-parcel',
      script: './dist/server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: false,
      max_memory_restart: '500M',
      node_args: '--max-old-space-size=512',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 5000,
    },
  ],
};
