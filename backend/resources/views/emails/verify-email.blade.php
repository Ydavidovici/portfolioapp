@component('mail::message')
    # Hello {{ $username }},

    Thank you for registering at our application. Please click the button below to verify your email address.

    @component('mail::button', ['url' => $verificationUrl])
        Verify Email
    @endcomponent

    If you did not create an account, no further action is required.

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent
