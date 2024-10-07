<!DOCTYPE html>
<html>
<head>
    <title>New Message Notification</title>
</head>
<body>
<h1>New Message from {{ $sender }}</h1>
<p>{{ $content }}</p>

@if (!empty($file_name))
    <p>Attachment: {{ $file_name }}</p>
@else
    <p>No attachments.</p>
@endif

<p>Best regards,</p>
<p>Your App Team</p>
</body>
</html>
