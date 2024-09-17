<?php

namespace Tests\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Board;

class SeedersTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_seeds_users()
    {
        $this->seed('UserSeeder');

        $userCount = User::count();
        $this->assertTrue($userCount > 0, 'No users were seeded');
    }

    #[Test]
    public function it_seeds_projects()
    {
        $this->seed('ProjectSeeder');

        $projectCount = Project::count();
        $this->assertTrue($projectCount > 0, 'No projects were seeded');
    }

    #[Test]
    public function it_seeds_boards()
    {
        $this->seed('BoardSeeder');

        $boardCount = Board::count();
        $this->assertTrue($boardCount > 0, 'No boards were seeded');
    }
}
