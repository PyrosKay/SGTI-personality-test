module.exports = {
  apps: [{
    name: 'sgti-quiz',
    script: './dist-server/prod-server.js',
    interpreter: 'node',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/app/work/logs/bypass/pm2-error.log',
    out_file: '/app/work/logs/bypass/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
