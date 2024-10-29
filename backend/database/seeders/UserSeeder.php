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

        // Create one Admin with a known token
        User::factory()->admin()->withRawToken('admin-valid-token')->create()->each(function ($user) {
            $adminRole = Role::where('name', 'admin')->first();
            $user->roles()->attach($adminRole);
        });

        // Create additional Admins with unique random tokens
        User::factory()->count(1)->admin()->create()->each(function ($user) {
            $adminRole = Role::where('name', 'admin')->first();
            $user->roles()->attach($adminRole);
        });

        // Create one Developer with a known token
        User::factory()->developer()->withRawToken('dev-valid-token')->create()->each(function ($user) {
            $developerRole = Role::where('name', 'developer')->first();
            $user->roles()->attach($developerRole);
        });

        // Create additional Developers with unique random tokens
        User::factory()->count(2)->developer()->create()->each(function ($user) {
            $developerRole = Role::where('name', 'developer')->first();
            $user->roles()->attach($developerRole);
        });

        // Create one Client with a known token
        User::factory()->client()->withRawToken('client-valid-token')->create()->each(function ($user) {
            $clientRole = Role::where('name', 'client')->first();
            $user->roles()->attach($clientRole);
        });

        // Create additional Clients with unique random tokens
        User::factory()->count(4)->client()->create()->each(function ($user) {
            $clientRole = Role::where('name', 'client')->first();
            $user->roles()->attach($clientRole);
        });
    }
}
