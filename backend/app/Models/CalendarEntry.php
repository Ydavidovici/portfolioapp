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
     * The attributes that should be hidden for arrays and JSON serialization.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
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
     * Get the user that owns the calendar entry.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessor to format the date attribute when retrieved.
     *
     * @param  string  $value
     * @return string
     */
    public function getDateAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d');
    }
}
