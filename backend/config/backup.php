<?php

return [

    'backup' => [

        'name' => env('APP_NAME', 'laravel-backup'),

        'source' => [
            'files' => [
                'include' => [
                    base_path('storage/app/public'),
                    base_path('.env'),
                ],
                'exclude' => [
                    base_path('vendor'),
                    base_path('node_modules'),
                ],
                'follow_links' => false,
                'relative_path' => true,
            ],

            'databases' => [
                'mysql', // Change this to your actual database connection name
            ],
        ],

        'destination' => [
            'disks' => [
                's3', // Change this to your actual S3 disk configuration name
            ],
            'compression_method' => ZipArchive::CM_DEFAULT, // Use a default compression method
            'compression_level' => 6, // Set a medium compression level (1-9)
            'filename_prefix' => env('BACKUP_FILENAME_PREFIX', 'backup_'), // Ensure this key is included
        ],

        'password' => env('BACKUP_PASSWORD', ''), // Set to your desired password or leave empty if not needed
        'encryption' => ZipArchive::EM_AES_256, // Use AES-256 encryption (set to int)
        'tries' => 3, // Number of tries before failing
        'retry_delay' => 5, // Delay between retries in seconds
        'database_dump_filename_base' => env('DATABASE_DUMP_FILENAME_BASE', 'dump'), // Ensure this key is included
        'database_dump_file_extension' => 'sql', // Add this key if it's not already defined
        'database_dump_file_timestamp_format' => 'Y-m-d_H-i-s', // Add this key if it's not already defined
    ],

    'notifications' => [
        'notifications' => [
            \Spatie\Backup\Notifications\Notifications\BackupHasFailed::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\UnhealthyBackupWasFound::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\CleanupHasFailed::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\BackupWasSuccessful::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\HealthyBackupWasFound::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\CleanupWasSuccessful::class => ['mail'],
        ],
        'notifiable' => \Spatie\Backup\Notifications\Notifiable::class,
        'mail' => [
            'to' => 'your-email@example.com', // Change this to your email address
        ],
        'slack' => [
            'webhook_url' => env('SLACK_WEBHOOK_URL', ''),
            'channel' => env('SLACK_CHANNEL', null),
            'username' => 'Laravel Backup',
            'icon' => null,
        ],
        'discord' => [
            'webhook_url' => env('DISCORD_WEBHOOK_URL', ''),
            'username' => 'Laravel Backup',
            'avatar_url' => '',
            'embed_title' => '',
            'embed_description' => '',
            'embed_color' => '',
        ],
    ],

    'monitor_backups' => [
        [
            'name' => env('APP_NAME', 'laravel-backup'),
            'disks' => ['s3'], // Change this to your actual S3 disk configuration name
            'newest_backups_should_not_be_older_than_days' => 1,
            'storage_used_limit_in_megabytes' => 5000,
            'health_checks' => [
                \Spatie\Backup\Tasks\Monitor\HealthChecks\MaximumAgeInDays::class,
                \Spatie\Backup\Tasks\Monitor\HealthChecks\MaximumStorageInMegabytes::class,
            ],
        ],
    ],

    'cleanup' => [
        'strategy' => \Spatie\Backup\Tasks\Cleanup\Strategies\DefaultStrategy::class,

        'default_strategy' => [
            'keep_all_backups_for_days' => 7,
            'keep_daily_backups_for_days' => 16,
            'keep_weekly_backups_for_weeks' => 8,
            'keep_monthly_backups_for_months' => 4,
            'keep_yearly_backups_for_years' => 2,
            'delete_oldest_backups_when_using_more_megabytes_than' => 5000,
        ],

        'tries' => 3,
        'retry_delay' => 5,
    ],

];
