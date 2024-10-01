<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarEntry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'date',
        'start_time',
        'end_time',
        'user_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'date',
        'start_time' => 'string',
        'end_time' => 'string',
    ];

    /**
     * Customize the serialization of date fields.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d');
    }

    /**
     * Get the user that owns the calendar entry.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
