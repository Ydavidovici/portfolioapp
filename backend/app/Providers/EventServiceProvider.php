<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\MessageSent;
use App\Listeners\LogMessageSent;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Registering the LogMessageSent listener for the MessageSent event
        MessageSent::class => [
            LogMessageSent::class,
        ],

        // Add other event listeners here
        // For example:
        // Verified::class => [
        //     SomeListener::class,
        // ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }
}
