module.exports = {
  apps: [
    {
      name: 'todai',
      script: 'node dist/main',
      instances: 1,
      out_file: '/dev/null',
      error_file: '/dev/null',
      cron_restart: '0 3 * * *',
    },
  ],
};
