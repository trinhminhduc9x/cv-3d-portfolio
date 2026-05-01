import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const PORT = 4174;
const BASE_URL = `http://127.0.0.1:${PORT}/cv-3d-portfolio/index.html`;
const ARTIFACT_DIR = path.join(ROOT, 'test-results/visual');
const BASELINE_DIR = path.join(__dirname, '__baselines__');
const LAYERS = ['Mechanical', 'Architecture', 'Software'];

let server;
let browser;
let serverOutput = '';

function waitForServer(url, timeoutMs = 30000) {
    const started = Date.now();

    const checkUrl = () => new Promise((resolve, reject) => {
        const request = http.get(url, (response) => {
            response.resume();
            resolve(response.statusCode >= 200 && response.statusCode < 500);
        });

        request.on('error', reject);
        request.setTimeout(2000, () => {
            request.destroy(new Error('Timed out waiting for HTTP response'));
        });
    });

    return new Promise((resolve, reject) => {
        const tick = async () => {
            try {
                if (await checkUrl()) {
                    resolve();
                    return;
                }
            } catch {
                // Vite is still starting.
            }

            if (Date.now() - started > timeoutMs) {
                reject(new Error(`Timed out waiting for ${url}`));
                return;
            }

            setTimeout(tick, 500);
        };

        tick();
    });
}

async function compareWithBaseline(name, screenshot) {
    await fs.mkdir(ARTIFACT_DIR, { recursive: true });
    await fs.mkdir(BASELINE_DIR, { recursive: true });

    const actualPath = path.join(ARTIFACT_DIR, `${name}.png`);
    const baselinePath = path.join(BASELINE_DIR, `${name}.png`);
    const diffPath = path.join(ARTIFACT_DIR, `${name}.diff.png`);

    await fs.writeFile(actualPath, screenshot);

    let baseline;

    try {
        baseline = await fs.readFile(baselinePath);
    } catch {
        if (process.env.UPDATE_VISUAL_BASELINES === '1') {
            await fs.writeFile(baselinePath, screenshot);
        }

        expect(screenshot.length).toBeGreaterThan(1000);
        return;
    }

    const baselinePng = PNG.sync.read(baseline);
    const actualPng = PNG.sync.read(screenshot);
    expect(actualPng.width).toBe(baselinePng.width);
    expect(actualPng.height).toBe(baselinePng.height);

    const width = baselinePng.width;
    const height = baselinePng.height;
    const diff = new PNG({ width, height });
    const mismatchedPixels = pixelmatch(
        baselinePng.data,
        actualPng.data,
        diff.data,
        width,
        height,
        { threshold: 0.18 },
    );

    await fs.writeFile(diffPath, PNG.sync.write(diff));

    const mismatchRatio = mismatchedPixels / (width * height);
    expect(mismatchRatio).toBeLessThanOrEqual(0.08);
}

beforeAll(async () => {
    server = spawn(
        process.execPath,
        [
            path.join(ROOT, 'node_modules/vite/bin/vite.js'),
            '--host',
            '127.0.0.1',
            '--port',
            String(PORT),
            '--strictPort',
        ],
        { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    server.stdout.on('data', (chunk) => {
        serverOutput += chunk.toString();
    });
    server.stderr.on('data', (chunk) => {
        serverOutput += chunk.toString();
    });

    try {
        await waitForServer(BASE_URL);
    } catch (error) {
        throw new Error(`${error.message}\n\nVite output:\n${serverOutput}`);
    }

    browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-gpu-blocklist',
            '--use-gl=swiftshader',
        ],
    });
});

afterAll(async () => {
    if (browser) {
        await browser.close();
    }

    if (server) {
        server.kill();
    }
});

describe('CV 3D layer visual regression', () => {
    test.each(LAYERS)('%s layer renders consistently', async (layer) => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        await page.waitForSelector(`[aria-label="Show ${layer} career layer"]`);
        await page.click(`[aria-label="Show ${layer} career layer"]`);
        await page.waitForTimeout(1200);

        const screenshot = await page.screenshot({ fullPage: false });
        await compareWithBaseline(layer.toLowerCase(), screenshot);
        await page.close();
    });
});
