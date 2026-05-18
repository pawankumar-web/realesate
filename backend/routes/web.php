<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]);
});

Route::get('/setup', function () {
    try {
        $info = [
            'db_connection' => env('DB_CONNECTION'),
            'db_host' => env('DB_HOST'),
            'db_port' => env('DB_PORT'),
            'db_database' => env('DB_DATABASE'),
            'db_username' => env('DB_USERNAME'),
            'app_key' => env('APP_KEY') ? 'set' : 'missing',
            'app_env' => env('APP_ENV'),
            'app_debug' => env('APP_DEBUG'),
        ];

        try {
            DB::connection()->getPdo();
            $info['db_connected'] = true;
        } catch (\Throwable $e) {
            $info['db_connected'] = false;
            $info['db_error'] = $e->getMessage();
        }

        if ($info['db_connected'] && request()->query('run') === 'true') {
            try {
                Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
                $info['output'] = Artisan::output();
            } catch (\Throwable $e) {
                $info['error'] = $e->getMessage();
            }
        }

        return response()->json($info);
    } catch (\Throwable $e) {
        return response()->json(['error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()], 500);
    }
});
