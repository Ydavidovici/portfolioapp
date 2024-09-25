<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Since you're using token-based authentication, you can leave this empty
    | or remove it.
    |
    */

    'stateful' => [],

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | Sanctum will use the 'api' guard by default.
    |
    */

    'guard' => ['api'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | Tokens do not expire by default. You can set this value to enable
    | token expiration.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix tokens to add an additional layer of security.
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | For token-based authentication, you do not need to include
    | 'EnsureFrontendRequestsAreStateful' or other session-related middleware.
    |
    */

    'middleware' => [
        // 'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        // 'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        // 'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,

        'api' => [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ],

];
