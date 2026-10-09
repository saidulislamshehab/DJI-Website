const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const jobs = [
  { name: 'E:\\Github Projects\\DJI-Drone-Website\\screenshots\\home_micmini_1440.png', w: 1440, h: 900 },
  { name: 'E:\\Github Projects\\DJI-Drone-Website\\screenshots\\home_micmini_1024.png', w: 1024, h: 768 },
  { name: 'E:\\Github Projects\\DJI-Drone-Website\\screenshots\\home_micmini_390.png', w: 390, h: 844 },
];
for (const j of jobs) {
  console.log('Capturing ' + j.name);
  execSync(`"${edgePath}" --headless --screenshot="${j.name}" --window-size=${j.w},${j.h} --disable-gpu "http://localhost:3000"`);
}
console.log('Done!');
