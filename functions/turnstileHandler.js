export default {
    async fetch(request, env) {
        return handleRequest(request, env);
    }
}

async function handleRequest(request, env) {
    if (request.method === 'POST') {
        return handlePost(request, env);
    }

    // For GET requests, return the HTML content with Turnstile
    const SITE_KEY = env.SITE_KEY; // Replace with your actual site key
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
            }
            .container {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-theme="light"></div>
        </div>
    </body>
    </html>
    `;

    return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html' },
    });
}

async function handlePost(request, env) {
    const body = await request.formData();
    const token = body.get('cf-turnstile-response');
    const ip = request.headers.get('CF-Connecting-IP');

    let formData = new FormData();
    formData.append('secret', env.SECRET_KEY); // Ensure SECRET_KEY is set in your environment variables
    formData.append('response', token);
    formData.append('remoteip', ip);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
        body: formData,
        method: 'POST',
    });

    const outcome = await result.json();

    if (!outcome.success) {
        return new Response('The provided Turnstile token was not valid!', { status: 401 });
    }

    // Successfully validated the Turnstile token, redirect to the index.html file
    return Response.redirect('/index.html', 302);
}
