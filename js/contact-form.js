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
    // The request always resolves with an opaque response, so we assume success.
    // This is a limitation of cross-origin Google Forms submissions.
    fetch('https://docs.google.com/forms/d/e/1FAIpQLSftQC3-QlgIvA3_dVFKJoeNN-k6B6CdDjzE6X74oGA-Uhg5Ww/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    }).then(function() {
        form.classList.add('hidden');
        document.getElementById('form-success').classList.remove('hidden');
        statusDiv.textContent = 'Message sent successfully!';
    });
});
