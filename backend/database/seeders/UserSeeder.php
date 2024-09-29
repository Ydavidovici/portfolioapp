<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Define the roles
        $roles = ['admin', 'developer', 'client'];

        // Ensure roles exist
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Create Admin Users
        User::factory()->count(2)->admin()->create()->each(function ($user) {
            $adminRole = Role::where('name', 'admin')->first();
            $user->roles()->attach($adminRole);
        });

        // Create Developer Users
        User::factory()->count(3)->developer()->create()->each(function ($user) {
            $developerRole = Role::where('name', 'developer')->first();
            $user->roles()->attach($developerRole);
        });

        // Create Client Users
        User::factory()->count(5)->client()->create()->each(function ($user) {
            $clientRole = Role::where('name', 'client')->first();
            $user->roles()->attach($clientRole);
        });

        // Optionally, create specific users with known credentials for testing
        /*
        $superAdmin = User::factory()->create([
            'username' => 'superadmin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('superpassword'),
            'api_token' => hash('sha256', 'superadmin_token'),
        ]);
        $superAdminRole = Role::where('name', 'admin')->first();
        $superAdmin->roles()->attach($superAdminRole);
        */
    }
}
