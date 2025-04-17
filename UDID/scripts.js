$(document).ready(function() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const deviceInfo = urlParams.get('device_info');
    
    // If device info is available in URL parameters, populate the form
    if (deviceInfo) {
        try {
            const parsedInfo = JSON.parse(decodeURIComponent(deviceInfo));
            
            // Enable form fields
            $('#udid, #imei, #version, #model, #serial').prop('disabled', false);
            
            // Fill the form with device info
            if (parsedInfo.udid) $('#udid').val(parsedInfo.udid);
            if (parsedInfo.imei) $('#imei').val(parsedInfo.imei);
            if (parsedInfo.version) $('#version').val(parsedInfo.version);
            if (parsedInfo.model) $('#model').val(parsedInfo.model);
            if (parsedInfo.serial) $('#serial').val(parsedInfo.serial);
            
            // Hide the profile notice as profile is already installed
            $('.profile-notice').fadeOut();
            
            // Change download button to show success
            $('#getUdidBtn').html('<i class="fas fa-check-circle me-2"></i>Profil Yüklendi')
                .removeClass('primary')
                .addClass('secondary')
                .prop('disabled', true);
                
            // Highlight UDID field with animation
            $('#udid').parent().addClass('highlight-udid');
            
            // Smooth scroll to device info section
            $('html, body').animate({
                scrollTop: $('.device-info-section').offset().top - 20
            }, 800);
        } catch (e) {
            console.error('Error parsing device info:', e);
        }
    }
    
    // Download button click handler
    $('#getUdidBtn').click(function() {
        $(this).html('<i class="fas fa-spinner fa-spin me-2"></i>Yükleniyor...');
        setTimeout(function() {
            window.location.href = 'udid.mobileconfig';
        }, 600);
    });
    
    // Copy button click handlers
    $('.btn-copy').click(function() {
        const fieldId = $(this).data('field');
        const fieldValue = $('#' + fieldId).val();
        
        if (fieldValue) {
            // Create a temporary textarea element to copy from
            const textarea = document.createElement('textarea');
            textarea.value = fieldValue;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Show toast notification
            const toast = new bootstrap.Toast(document.getElementById('copyToast'));
            toast.show();
            
            // Animate the copy button
            $(this).addClass('copied');
            setTimeout(() => {
                $(this).removeClass('copied');
            }, 1000);
        }
    });
    
    // Add custom styles for highlighting UDID and copy button animation
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .highlight-udid .input-group {
                box-shadow: 0 0 0 3px rgba(224, 225, 221, 0.3);
                border-radius: 8px;
            }
            .highlight-udid .form-control {
                font-weight: bold;
                color: var(--platinum);
                background-color: rgba(65, 90, 119, 0.5);
            }
            .btn-copy.copied {
                background-color: #2ecc71;
                transform: scale(1.1);
            }
        `)
        .appendTo('head');
});
