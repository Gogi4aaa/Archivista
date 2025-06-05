const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

// Start the React development server
const reactProcess = spawn('npm', ['start'], {
  shell: true,
  env: {
    ...process.env,
    BROWSER: 'none'
  }
});

reactProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // When we see that the development server is ready, start Electron
  if (output.includes('Local:')) {
    console.log('Starting Electron...');
    const electronProcess = spawn(electron, ['.'], { 
      shell: true,
      env: process.env 
    });

    electronProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    electronProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
  }
});

reactProcess.stderr.on('data', (data) => {
  console.error(data.toString());
}); 