export async function onRequestGet(context) {
    const SITE_KEY = context.env.SITE_KEY; // Replace with your actual site key
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Turnstile Demo</title>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
            }
            .container {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <form action="/" method="POST">
                <div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-theme="light"></div>
            </form>
        </div>
    </body>
    </html>
    `;

    return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html' },
    });
}
