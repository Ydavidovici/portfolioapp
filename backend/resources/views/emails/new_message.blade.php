<!DOCTYPE html>
<html>
<head>
    <title>New Message Received</title>
</head>
<body>
<h1>New Message from {{ $senderName }}</h1>
<p>{{ $messageContent }}</p>

@if($message->file_name)
    <p><strong>File Attachment:</strong> {{ $message->file_name }}</p>
    <p>Download the attachment from the web portal.</p>
@endif

<p>Log in to view and reply to the message.</p>
</body>
</html>
