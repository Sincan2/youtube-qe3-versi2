import fs from 'fs';
import { spawn } from 'child_process';

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const proxies = fs.readFileSync('testedProxies.txt', 'utf-8').split('\n').filter(Boolean);
const usedProxies = fs.existsSync('usedProxies.txt') ? fs.readFileSync('usedProxies.txt', 'utf-8').split('\n') : [];
const availableProxies = proxies.filter(p => !usedProxies.includes(p));

const log = (msg) => {
  const logPath = `logs/viewer-log-${new Date().toISOString().split('T')[0]}.json`;
  fs.appendFileSync(logPath, JSON.stringify({ time: new Date().toISOString(), msg }) + '\n');
};

const runViewer = (proxy) => {
  const proc = spawn('node', ['viewerInstance.mjs', proxy, config.videoUrl], { stdio: 'inherit' });
  fs.appendFileSync('usedProxies.txt', proxy + '\n');
};

const run = () => {
  let running = 0;
  const queue = [...availableProxies];

  const spawnNext = () => {
    if (running >= config.maxViewers || queue.length === 0) return;

    const proxy = queue.shift();
    log(`🎬 Spawning viewer for ${proxy}`);
    runViewer(proxy);
    running++;

    setTimeout(() => {
      running--;
      spawnNext();
    }, 65000); // spawn new every ~65s
  };

  for (let i = 0; i < config.maxViewers; i++) {
    spawnNext();
  }
};

run();
