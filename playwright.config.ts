import { defineConfig } from '@playwright/test'

const testUrl = 'http://127.0.0.1:4174'

export default defineConfig({
  testDir: 'tests/e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: testUrl },
  webServer: { command: 'npx --no-install serve out --listen tcp://127.0.0.1:4174', url: testUrl },
})
