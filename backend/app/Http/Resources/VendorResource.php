<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'company_name' => $this->company_name,
            'gst_no' => $this->gst_no,
            'pan_no' => $this->pan_no,
            'business_address' => $this->business_address,
            'kyc_status' => $this->kyc_status,
            'is_verified' => $this->is_verified,
            'commission_rate' => $this->commission_rate,
        ];
    }
}
