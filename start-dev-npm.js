#!/usr/bin/env node
/**
 * Cinema E-Booking System - Development Startup Script
 * This Node.js script starts both Django backend and Next.js frontend concurrently
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('🎬 Starting Cinema E-Booking System Development Environment...');
console.log('='.repeat(60));

const isWindows = os.platform() === 'win32';
const projectRoot = __dirname;
const backendPath = path.join(projectRoot, 'Backend');
const frontendPath = path.join(projectRoot, 'Frontend');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

// Start Django backend
function startBackend() {
    log('🐍 Starting Django Backend...', 'blue');
    
    const backendCmd = isWindows ? 'python' : 'python3';
    const backend = spawn(backendCmd, ['manage.py', 'runserver'], {
        cwd: backendPath,
        stdio: 'pipe',
        shell: true
    });

    backend.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
            log(`🐍 ${output}`, 'blue');
        }
    });

    backend.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output && !output.includes('System check identified no issues')) {
            log(`🐍 ${output}`, 'red');
        }
    });

    backend.on('close', (code) => {
        if (code !== 0) {
            log(`🐍 Backend process exited with code ${code}`, 'red');
        }
    });

    return backend;
}

// Start Next.js frontend
function startFrontend() {
    log('⚛️ Starting Next.js Frontend...', 'green');
    
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    const frontend = spawn(npmCmd, ['run', 'dev'], {
        cwd: frontendPath,
        stdio: 'pipe',
        shell: true
    });

    frontend.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
            log(`⚛️ ${output}`, 'green');
        }
    });

    frontend.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
            log(`⚛️ ${output}`, 'yellow');
        }
    });

    frontend.on('close', (code) => {
        if (code !== 0) {
            log(`⚛️ Frontend process exited with code ${code}`, 'red');
        }
    });

    return frontend;
}

// Main execution
async function startDevelopment() {
    console.log('');
    log('🌐 Your applications will be available at:', 'cyan');
    log('   Frontend: http://localhost:3000', 'cyan');
    log('   Backend:  http://127.0.0.1:8000', 'cyan');
    log('   Admin:    http://127.0.0.1:8000/admin', 'cyan');
    console.log('');
    
    // Start both servers
    const backend = startBackend();
    
    // Wait a moment before starting frontend
    setTimeout(() => {
        const frontend = startFrontend();
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            log('🛑 Shutting down development servers...', 'yellow');
            backend.kill();
            frontend.kill();
            process.exit(0);
        });
        
        process.on('SIGTERM', () => {
            backend.kill();
            frontend.kill();
            process.exit(0);
        });
        
    }, 2000);
    
    log('💡 Press Ctrl+C to stop both servers', 'yellow');
}

// Start the development environment
startDevelopment().catch(error => {
    console.error('❌ Failed to start development environment:', error);
    process.exit(1);
});