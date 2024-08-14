<?php

return [

    'backup' => [

        /*
         * The name of this application. You can use this name to easily
         * distinguish backups from different applications.
         */
        'name' => env('APP_NAME', 'laravel-backup'),

        'source' => [

            'files' => [

                /*
                 * The list of directories and files that will be included in the backup.
                 * Directories can be specified by their path relative to the root of the
                 * application, or as an absolute path.
                 */
                'include' => [
                    base_path('storage/app/public'),
                    base_path('.env'),
                ],

                /*
                 * The list of directories and files that will be excluded from the backup.
                 * By default, the vendor and node_modules directories are excluded.
                 */
                'exclude' => [
                    base_path('vendor'),
                    base_path('node_modules'),
                ],

                /*
                 * Determines if symlinks should be followed.
                 */
                'follow_links' => false,
            ],

            /*
             * The names of the connections to the databases that should be backed up.
             * MySQL, PostgreSQL, SQLite, and Mongo databases are supported.
             */
            'databases' => [
                'mysql', // Change this to your actual database connection name
            ],
        ],

        'destination' => [

            /*
             * The disk names on which the backups will be stored.
             * You can use any number of disks configured in your filesystems.php file.
             */
            'disks' => [
                's3', // Change this to your actual S3 disk configuration name
            ],
        ],
    ],

    /*
     * You can get notified when specific events occur. Out of the box you can use 'mail' and 'slack'.
     * To use Slack notifications, you must also install the guzzlehttp/guzzle package.
     *
     * You can also implement your own notification classes by extending Spatie\Backup\Notifications\BaseNotification.
     */
    'notifications' => [

        'notifications' => [
            \Spatie\Backup\Notifications\Notifications\BackupHasFailed::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\UnhealthyBackupWasFound::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\CleanupHasFailed::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\BackupWasSuccessful::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\HealthyBackupWasFound::class => ['mail'],
            \Spatie\Backup\Notifications\Notifications\CleanupWasSuccessful::class => ['mail'],
        ],

        /*
         * Here you can specify which services should be used to notify you when certain
         * events take place. The same notification can be sent to multiple services.
         */
        'notifiable' => \Spatie\Backup\Notifications\Notifiable::class,

        'mail' => [
            'to' => 'your-email@example.com', // Change this to your email address
        ],

        'slack' => [
            'webhook_url' => env('SLACK_WEBHOOK_URL', ''),

            // If this is set to null the default channel of the webhook will be used.
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

    /*
     * Here you can specify which monitor should be used to monitor the backups.
     * A monitor will periodically check if the backups are still healthy.
     */
    'monitor_backups' => [
        [
            'name' => env('APP_NAME', 'laravel-backup'),
            'disks' => ['s3'], // Change this to your actual S3 disk configuration name
            'newest_backups_should_not_be_older_than_days' => 1,
            'storage_used_limit_in_megabytes' => 5000,
        ],
    ],

    /*
     * Here you can specify if the backups should be pruned.
     * By default, backups older than 365 days will be removed.
     */
    'cleanup' => [
        /*
         * The strategy that will be used to cleanup old backups.
         * By default, all backups older than 365 days will be removed.
         */
        'strategy' => \Spatie\Backup\Tasks\Cleanup\Strategies\DefaultStrategy::class,

        'default_strategy' => [

            /*
             * The number of days for which old backups must be kept.
             * The default is 365 days.
             */
            'keep_all_backups_for_days' => 7,

            /*
             * The number of days for which backups will be kept in this frequency.
             */
            'keep_daily_backups_for_days' => 16,
            'keep_weekly_backups_for_weeks' => 8,
            'keep_monthly_backups_for_months' => 4,
            'keep_yearly_backups_for_years' => 2,

            /*
             * After cleanup, the backups that remain will occupy this amount of space in megabytes.
             */
            'delete_oldest_backups_when_using_more_megabytes_than' => 5000,
        ],
    ],

];
