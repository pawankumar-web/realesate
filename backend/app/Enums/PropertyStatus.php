<?php

namespace App\Enums;

enum PropertyStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case SOLD = 'sold';
    case RENTED = 'rented';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending Approval',
            self::APPROVED => 'Approved',
            self::REJECTED => 'Rejected',
            self::SOLD => 'Sold',
            self::RENTED => 'Rented',
        };
    }
}
