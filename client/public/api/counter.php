<?php
/**
 * 🕉️ DEEPATHOON SACRED COUNTER & MULTI-USER REAL-TIME API
 * 
 * Provides atomic, synchronized counter persistence and bot defense directly
 * on cPanel / Apache / LiteSpeed hosting without external cloud dependencies.
 */

// 1. Strict Headers & CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2. Constants & Data Paths
$BASELINE_COUNT  = 192798;        // Hard reset baseline requested by user
$MAX_VALID_COUNT = 50000000;      // 5 crore sanity ceiling
$RATE_LIMIT_SEC  = 2.5;           // Min seconds between increments per IP
$ACTIVE_WINDOW   = 180;           // 3 minutes window for active visitor tracking

$dataDir = __DIR__;
$dataFile        = $dataDir . '/counter_data.json';
$rateLimitFile   = $dataDir . '/rate_limits.json';
$activeFile      = $dataDir . '/active_visitors.json';

// Helper: Get real client IP (behind Cloudflare/Reverse Proxies if present)
function getClientIP() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        return $_SERVER['HTTP_X_REAL_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($parts[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

$clientIP = getClientIP();
$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');

// 3. SECURITY: Block Automated Scrapers & Malicious Bot User-Agents
$badBots = [
    'curl/', 'python-requests', 'go-http', 'wget/', 'scrapy', 'httrack',
    'masscan', 'zgrab', 'headlesschrome', 'phantomjs', 'puppeteer',
    'selenium', 'playwright', 'postman', 'insomnia', 'aiohttp', 'httpx'
];

foreach ($badBots as $bot) {
    if (strpos($ua, $bot) !== false) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden - Automated scrapers not permitted']);
        exit;
    }
}

// 4. ACTIVE VISITORS TRACKING (Realistic, bot-clean concurrent count)
$activeCount = 1;
try {
    $now = time();
    $activeData = [];
    if (file_exists($activeFile)) {
        $rawActive = @file_get_contents($activeFile);
        if ($rawActive) {
            $activeData = json_decode($rawActive, true) ?: [];
        }
    }
    
    // Register / update current visitor
    $activeData[$clientIP] = $now;

    // Prune stale visitors (> 180s)
    foreach ($activeData as $ip => $ts) {
        if ($now - $ts > $ACTIVE_WINDOW) {
            unset($activeData[$ip]);
        }
    }

    // Save active list with brief non-blocking write
    @file_put_contents($activeFile, json_encode($activeData), LOCK_EX);
    $activeCount = max(1, count($activeData));
} catch (Exception $e) {
    $activeCount = 1;
}

// 5. ATOMIC COUNTER READ / WRITE (With Exclusive File Locking)
$fp = @fopen($dataFile, 'c+');
if (!$fp) {
    // If file open fails, output baseline
    echo json_encode([
        'success' => true,
        'count'   => $BASELINE_COUNT,
        'active'  => $activeCount
    ]);
    exit;
}

// Acquire exclusive flock
flock($fp, LOCK_EX);

$rawContent = stream_get_contents($fp);
$data = json_decode($rawContent, true);

if (!is_array($data) || !isset($data['count']) || !is_numeric($data['count'])) {
    $data = ['count' => $BASELINE_COUNT];
}

// Ensure count never dips below user-specified baseline
if ($data['count'] < $BASELINE_COUNT || $data['count'] > $MAX_VALID_COUNT) {
    $data['count'] = $BASELINE_COUNT;
}

$isPost = ($_SERVER['REQUEST_METHOD'] === 'POST');

if ($isPost) {
    // Read POST body if JSON
    $body = json_decode(file_get_contents('php://input'), true);
    $action = $body['action'] ?? ($_POST['action'] ?? 'increment');

    if ($action === 'increment') {
        // Rate limit check per IP
        $nowFloat = microtime(true);
        $rateLimits = [];
        if (file_exists($rateLimitFile)) {
            $rawLimits = @file_get_contents($rateLimitFile);
            if ($rawLimits) {
                $rateLimits = json_decode($rawLimits, true) ?: [];
            }
        }

        $lastTime = $rateLimits[$clientIP] ?? 0;
        if (($nowFloat - $lastTime) >= $RATE_LIMIT_SEC) {
            // Legitimate increment: Strictly +1, never trust client-supplied counts
            $data['count']++;
            $rateLimits[$clientIP] = $nowFloat;

            // Prune old rate limit entries (> 120s)
            foreach ($rateLimits as $ip => $t) {
                if ($nowFloat - $t > 120) {
                    unset($rateLimits[$ip]);
                }
            }
            @file_put_contents($rateLimitFile, json_encode($rateLimits), LOCK_EX);

            // Persist updated count atomically
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
            fflush($fp);
        }
    }
}

$finalCount = (int)$data['count'];

// Release lock and close
flock($fp, LOCK_UN);
fclose($fp);

// 6. Return synchronized JSON response
echo json_encode([
    'success' => true,
    'count'   => $finalCount,
    'active'  => $activeCount
]);
