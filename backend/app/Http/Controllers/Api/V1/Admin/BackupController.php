<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

class BackupController extends Controller
{
    use ApiResponse;

    public function create(): JsonResponse
    {
        try {
            Artisan::call('backup:run');

            return $this->success([
                'message' => 'Backup completed successfully',
                'output' => Artisan::output(),
            ]);
        } catch (\Exception $e) {
            return $this->error('Backup failed: '.$e->getMessage(), 500);
        }
    }
}
