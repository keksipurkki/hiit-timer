<?php

  $hash = hash_file('md5', $argv[1]);

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, maximum-scale=1, initial-scale=1" name="viewport">
  <meta content="yes" name="apple-mobile-web-app-capable">
  <meta content="no-cache" http-equiv="cache-control">
  <meta content="0" http-equiv="expires">
  <link href="/manifest.json" rel="manifest">
  <link href="icons/icon-192x192.png" rel="apple-touch-icon" sizes="192x192">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/tachyons/4.11.1/tachyons.min.css" rel="stylesheet">
  <link href="app.css" rel="stylesheet"><!-- Apple quirks -->
  <!-- iPhone 8, 7, 6s, 6 (750px x 1334px) -->
  <link href="icons/apple-launch-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel=
  "apple-touch-startup-image">
  <title>HIIT Timer</title>
</head>
<body>
  <div id="app">
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/nosleep/0.6.0/NoSleep.min.js"></script>
  <script crossorigin="" src="https://unpkg.com/react@16.9.0/umd/react.production.min.js"></script>
  <script crossorigin="" src="https://unpkg.com/react-dom@16.9.0/umd/react-dom.production.min.js"></script>
  <script src="/app.js?hash=<?= $hash ?>"></script>
</body>
</html>
