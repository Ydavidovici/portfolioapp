<?php

namespace Tests\Database;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class BackupTest extends TestCase
{
    protected $backupDirectory;

    protected function setUp(): void
    {
        parent::setUp();
        $this->backupDirectory = storage_path('app/testing-backup');
        if (File::exists($this->backupDirectory)) {
            File::deleteDirectory($this->backupDirectory);
        }
    }

    protected function tearDown(): void
    {
        if (File::exists($this->backupDirectory)) {
            File::deleteDirectory($this->backupDirectory);
        }
        parent::tearDown();
    }

    #[Test]
    public function backup_creates_backup_file()
    {
        // Run the backup command
        $exitCode = Artisan::call('db:backup');

        // Assert that the command exited successfully
        $this->assertEquals(0, $exitCode, 'Backup command did not exit successfully.');

        // Check if the backup directory exists
        $this->assertDirectoryExists($this->backupDirectory, 'Backup directory does not exist.');

        // Get the list of backup files
        $backupFiles = File::files($this->backupDirectory);

        // Assert that a backup file was created
        $this->assertNotEmpty($backupFiles, 'No backup file was created.');

        // Get the path of the backup file
        $backupFilePath = $backupFiles[0]->getPathname();

        // Assert that the backup file exists
        $this->assertFileExists($backupFilePath, 'Backup file does not exist.');

        // Optionally, check the contents of the backup file
        $backupContents = File::get($backupFilePath);
        $this->assertStringContainsString('CREATE TABLE', $backupContents, 'Backup file does not contain expected content.');
    }

    #[Test]
    public function backup_fails_with_invalid_credentials()
    {
        // Backup original credentials
        $originalUsername = config('database.connections.mysql.username');
        $originalPassword = config('database.connections.mysql.password');

        // Set invalid credentials
        config(['database.connections.mysql.username' => 'invalid_user']);
        config(['database.connections.mysql.password' => 'invalid_password']);

        // Run the backup command
        try {
            Artisan::call('db:backup');

            $this->fail('Backup command should have failed with invalid credentials.');
        } catch (\Exception $e) {
            // Expected exception due to invalid credentials
            $this->assertStringContainsString('Access denied', $e->getMessage(), 'Exception message does not contain expected content.');
        } finally {
            // Restore original credentials
            config(['database.connections.mysql.username' => $originalUsername]);
            config(['database.connections.mysql.password' => $originalPassword]);
        }

        // Ensure no backup file was created
        if (File::exists($this->backupDirectory)) {
            $backupFiles = File::files($this->backupDirectory);
            $this->assertEmpty($backupFiles, 'Backup file should not have been created with invalid credentials.');
        } else {
            $this->assertFalse(File::exists($this->backupDirectory), 'Backup directory should not exist with invalid credentials.');
        }
    }
}
