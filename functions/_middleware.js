export async function onRequestPost(context) {
    const { request, env } = context;
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
