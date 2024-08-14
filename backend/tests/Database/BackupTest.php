<?php

namespace Tests\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Console\Scheduling\Schedule;
use Tests\TestCase;

class BackupTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_backup()
    {
        // Make sure the test uses the S3 disk.
        Storage::fake('s3');

        // Run the backup process.
        Artisan::call('backup:run');

        // Assert that the backup was created on the 's3' disk.
        Storage::disk('s3')->assertExists('your-backup-directory/'); // Replace with your actual backup directory name.
    }

    /** @test */
    public function it_handles_backup_failures_gracefully()
    {
        // Simulate a failure scenario.
        Storage::shouldReceive('disk')
            ->once()
            ->andThrow(new \Exception('Simulated failure'));

        $this->artisan('backup:run')
            ->assertExitCode(1); // Expect failure with exit code 1
    }

    /** @test */
    public function it_has_a_backup_scheduled()
    {
        $schedule = $this->app->make(Schedule::class);

        $backupEventFound = false;

        // Check the schedule for the backup:run command
        foreach ($schedule->events() as $event) {
            if (strpos($event->command, 'backup:run') !== false) {
                $backupEventFound = true;
                break;
            }
        }

        // Assert that the backup:run command is indeed scheduled
        $this->assertTrue($backupEventFound, 'The backup:run command is not scheduled.');
    }
}
