<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]);
});

Route::get('/setup', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = Artisan::output();
        Artisan::call('db:seed', ['--force' => true]);
        $seedOutput = Artisan::output();
        return response()->json([
            'migrate' => $migrateOutput,
            'seed' => $seedOutput,
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
