<?php

namespace App\Models;

use App\Models\Project;
use App\Models\CalendarEntry;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'api_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'api_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Define the relationship with Role.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Define the relationship with Project.
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * Define the relationship with CalendarEntry.
     */
    public function calendarEntries()
    {
        return $this->hasMany(CalendarEntry::class);
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->whereRaw('LOWER(name) = ?', [strtolower($role)])->exists();
    }

    public function hasAnyRole(array $roles): bool
    {
        $lowerRoles = array_map('strtolower', $roles);
        return $this->roles()->whereIn(\DB::raw('LOWER(name)'), $lowerRoles)->exists();
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
