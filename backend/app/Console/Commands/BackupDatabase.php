<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Backup the database';

    public function handle()
    {
        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');
        $port = config('database.connections.mysql.port', 3306);

        $date = date('Y-m-d_H-i-s');
        $fileName = "backup_{$database}_{$date}.sql";

        // Determine the backup directory based on the environment
        if (app()->environment('testing')) {
            $backupDir = storage_path('app/testing-backup');
        } else {
            $backupDir = storage_path('app/backup');
        }

        $storagePath = "{$backupDir}/{$fileName}";

        // Ensure the backup directory exists
        if (!file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        // Create a temporary credentials file
        $tempCnfPath = tempnam(sys_get_temp_dir(), 'mysqldump');
        $cnfContent = "[client]\nuser={$username}\npassword=\"{$password}\"\nhost={$host}\nport={$port}";
        file_put_contents($tempCnfPath, $cnfContent);

        // Build the mysqldump command using the credentials file and result-file option
        $mysqldumpPath = 'mysqldump'; // Provide full path if necessary
        $command = [
            $mysqldumpPath,
            "--defaults-extra-file={$tempCnfPath}",
            '--result-file=' . $storagePath,
            $database,
            '--routines',
            '--triggers',
            '--single-transaction',
            '--quick',
            '--lock-tables=false',
            '--set-gtid-purged=OFF',
        ];

        $process = new Process($command);
        $process->setTimeout(null); // Remove timeout limit

        // Run the process
        try {
            $process->run();

            // Delete the temporary credentials file
            unlink($tempCnfPath);

            if (!$process->isSuccessful()) {
                $errorOutput = $process->getErrorOutput();
                $this->error('Backup failed: ' . $errorOutput);

                // Delete the incomplete backup file if it exists
                if (file_exists($storagePath)) {
                    $this->error('Deleting incomplete backup file: ' . $storagePath);
                    unlink($storagePath);
                }

                if (app()->environment('testing')) {
                    throw new \Exception('Backup failed: ' . $errorOutput);
                }

                return 1; // Non-zero exit code indicates failure
            }

            $this->info("Backup was successful. File saved to: {$storagePath}");
            return 0; // Zero exit code indicates success

        } catch (\Exception $exception) {
            // Delete the temporary credentials file
            if (file_exists($tempCnfPath)) {
                unlink($tempCnfPath);
            }

            // Delete the incomplete backup file
            if (file_exists($storagePath)) {
                $this->error('Deleting incomplete backup file: ' . $storagePath);
                unlink($storagePath);
            }

            $this->error('Backup failed: ' . $exception->getMessage());

            if (app()->environment('testing')) {
                throw $exception;
            }

            return 1;
        }
    }
}
