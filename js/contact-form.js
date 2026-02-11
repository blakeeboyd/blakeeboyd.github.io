/**
 * Contact Form Handler
 * Submits form data to Google Forms backend
 */
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const formData = new FormData(form);
    const submitButton = form.querySelector('.form-submit');
    const statusDiv = document.getElementById('form-status');

    // Honeypot check - if filled, silently reject (likely a bot)
    const honeypot = document.getElementById('contact-website');
    if (honeypot && honeypot.value) {
        // Fake success for bots
        form.classList.add('hidden');
        document.getElementById('form-success').classList.remove('hidden');
        return;
    }

    // Remove honeypot from form data before sending
    formData.delete('website');

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    statusDiv.textContent = 'Sending your message...';

    // Note: With mode: 'no-cors', we cannot read the response or detect errors.
    // The request always resolves with an opaque response, so we assume success
    // after a reasonable timeout. Network failures will be caught by the catch handler.
    var timeoutId = setTimeout(function() {
        // If the request hasn't completed in 10 seconds, assume network issue
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        statusDiv.textContent = 'The request is taking longer than expected. Your message may still have been sent.';
    }, 10000);

    fetch('https://docs.google.com/forms/d/e/1FAIpQLSftQC3-QlgIvA3_dVFKJoeNN-k6B6CdDjzE6X74oGA-Uhg5Ww/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    }).then(function() {
        clearTimeout(timeoutId);
        form.reset();
        form.classList.add('hidden');
        document.getElementById('form-success').classList.remove('hidden');
        statusDiv.textContent = 'Message sent successfully!';
    }).catch(function() {
        clearTimeout(timeoutId);
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        statusDiv.textContent = 'Something went wrong. Please try again or email me directly.';
    });
});
