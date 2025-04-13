$(document).ready(function() {
    // Set current year in footer
    $('#current-year').text(new Date().getFullYear());
    
    // Device detection variables
    let deviceOS = "";
    let deviceOSVersion = "";
    let isDeviceSupported = false;
    const requiredOSVersion = 5.0; // Set minimum required iOS version
    
    // Sample data - In production, this would come from your backend
    const appData = {
        iconUrl: "favour.jpg" // Updated to use local image
    };
    
    // Toast notification system
    const toastContainer = $('.toast-container');
    let toastCount = 0;
    let toastIdCounter = 0;
    const MAX_TOASTS = 3;
    
    // Function to show toast notification
    function showToast(message) {
        // Create a unique ID for this toast
        const toastId = `toast-${toastIdCounter++}`;
        
        // Create a clone of the toast template
        const toastTemplate = $('#notificationToast').clone();
        toastTemplate.attr('id', toastId);
        toastTemplate.find('.toast-body').text(message);
        
        // Add entrance animation class
        toastTemplate.addClass('toast-enter');
        
        // Prepend to put newest at the top
        toastContainer.prepend(toastTemplate);
        toastTemplate.show();
        
        // Increment toast count
        toastCount++;
        
        // If we have more than MAX_TOASTS, remove the oldest one
        if (toastCount > MAX_TOASTS) {
            const oldestToast = toastContainer.find('.toast').last();
            removeToast(oldestToast);
        }
        
        // Set timeout to auto-remove this toast after 5 seconds
        setTimeout(function() {
            removeToast(toastTemplate);
        }, 5000);
        
        // Add click handler for dismiss button
        toastTemplate.find('.btn-close').on('click', function() {
            removeToast(toastTemplate);
        });
    }
    
    // Function to remove a toast with animation
    function removeToast(toastElement) {
        // Add exit animation class
        toastElement.removeClass('toast-enter').addClass('toast-exit');
        
        // After animation completes, remove from DOM
        setTimeout(function() {
            toastElement.remove();
            toastCount--;
        }, 400); // Match the animation duration
    }
    
    // Function to check internet connection
    function isOnline() {
        return navigator.onLine;
    }
    
    // Function to disable/enable specific button
    function setButtonState($button, disabled) {
        if (disabled) {
            $button.attr('disabled', true).css('pointer-events', 'none');
        } else {
            $button.removeAttr('disabled').css('pointer-events', 'auto');
        }
    }
    
    // Populate app data
    function populateAppData(data) {
        $('#app-name').text(data.name);
        $('#bundle-id').text(data.bundleId);
        $('#app-version').text(data.version);
        $('#app-version-detail').text(data.version);
        $('#file-size').text(data.fileSize);
        $('#file-size-pill').text(data.fileSize);
        
        // Set app icon if available
        if (data.iconUrl) {
            $('#app-image').attr('src', data.iconUrl);
        }
    }
    
    // Initialize with sample data
    populateAppData(appData);
    
    // Add haptic feedback (vibration) if available
    function hapticFeedback(type = 'medium') {
        if (!navigator.vibrate) return;
        
        switch(type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(25);
                break;
            case 'heavy':
                navigator.vibrate([30, 50, 30]);
                break;
        }
    }
    
    // Device detection function
    function getDeviceInfo() {
        const platform = navigator.platform;
        const userAgent = navigator.userAgent;
        
        // Create OS info element if it doesn't exist
        if (!$('#osInfo').length) {
            $('<div id="osInfo" style="display:none;"></div>').appendTo('body');
        }
        
        // Detect OS and version
        if (/iP(hone|ad|od)/.test(platform) || /iP(hone|ad|od)/.test(userAgent)) {
            deviceOS = "iOS";
            const match = userAgent.match(/OS (\d+)_(\d+)/);
            if (match) {
                deviceOSVersion = parseFloat(match[1] + '.' + match[2]);
            }
            isDeviceSupported = true;
        } else if (/Mac/.test(platform)) {
            deviceOS = "macOS";
            const match = userAgent.match(/Mac OS X (\d+)[._](\d+)/);
            if (match) {
                deviceOSVersion = parseFloat(match[1] + '.' + match[2]);
            }
            isDeviceSupported = true;
        } else if (/Android/.test(userAgent)) {
            deviceOS = "Android";
            const match = userAgent.match(/Android (\d+)\.(\d+)/);
            if (match) {
                deviceOSVersion = parseFloat(match[1] + '.' + match[2]);
            }
        } else if (/Win/.test(platform)) {
            deviceOS = "Windows";
            const match = userAgent.match(/Windows NT (\d+)\.(\d+)/);
            if (match) {
                deviceOSVersion = parseFloat(match[1] + '.' + match[2]);
            }
        } else if (/Linux/.test(platform)) {
            deviceOS = "Linux";
        }
        
        // Update OS info display
        $('#osInfo').text("systeminfo_str: " + deviceOS + " " + deviceOSVersion);
        
        // Handle unsupported devices for install button
        const $installButton = $('#install-button');
        if (!isDeviceSupported) {
            $installButton.attr('disabled', true);
            $installButton.find('.btn-text').html('Desteklenmiyor');
        }
        
        // Add outdated OS warning if needed
        if (deviceOS === "iOS" && deviceOSVersion < requiredOSVersion) {
            if (!$('.os-warning').length) {
                const $osWarning = $('<div class="os-warning"><i class="fa-solid fa-triangle-exclamation"></i> <span><strong>requires_newer_OS</strong></span></div>');
                $osWarning.css({
                    'color': '#ff4500',
                    'margin-top': '8px',
                    'text-align': 'center',
                    'font-size': '14px'
                });
                $('.app-info-pills').after($osWarning);
            }
        }
    }
    
    // Call device detection on document ready
    getDeviceInfo();
    
    // Install button click handler
    $('#install-button').on('click', function() {
        const $button = $(this);
        const $btnText = $button.find('.btn-text');
        const originalText = $btnText.html();
        
        // Skip if device not supported
        if (!isDeviceSupported) {
            return;
        }
        
        // Haptic feedback
        hapticFeedback('medium');
        
        // Check internet connection
        if (!isOnline()) {
            showToast("İnternet bağlantınızı sağladığınızdan emin olun.");
            return;
        }
        
        // Disable only this button
        setButtonState($button, true);
        
        // Show loading state
        $button.addClass('loading');
        $btnText.html('Yükleniyor...');
        
        // Show toast notification
        showToast("Gelen pencereden Yükle butonuna dokunun. Dosya indilirken siteden ayrılabilirsiniz.");
        
        // Start installation process
        setTimeout(function() {
            window.location.href = 'itms-services://?action=download-manifest&url=https://urlbase/urlpath/randomchar/install.plist';
            
            // Reset button state after 4 seconds
            setTimeout(function() {
                $button.removeClass('loading');
                $btnText.html(originalText);
                setButtonState($button, false);
            }, 4000);
        }, 400);
    });
    
    // Download button click handler
    $('#download-button').on('click', function() {
        const $button = $(this);
        const $btnText = $button.find('.btn-text');
        const originalText = $btnText.html();
        
        // Haptic feedback
        hapticFeedback('medium');
        
        // Check internet connection
        if (!isOnline()) {
            showToast("İnternet bağlantınızı sağladığınızdan emin olun.");
            return;
        }
        
        // Disable only this button
        setButtonState($button, true);
        
        // Show loading state
        $button.addClass('loading');
        $btnText.html('İndiriliyor...');
        
        // Show toast notification
        showToast("Dosyanız iPA olarak indiriliyor. Lütfen bekleyiniz.");
        
        // Start download process
        setTimeout(function() {
            window.location.href = 'dlurl';
            
            // Reset button state after 4 seconds
            setTimeout(function() {
                $button.removeClass('loading');
                $btnText.html(originalText);
                setButtonState($button, false);
            }, 4000);
        }, 400);
    });
    
    // Listen for online/offline events
    window.addEventListener('online', function() {
        showToast("İnternet bağlantısı sağlandı.");
        console.log('Online status: connected');
    });
    
    window.addEventListener('offline', function() {
        showToast("İnternet bağlantınızı sağladığınızdan emin olun.");
        console.log('Online status: disconnected');
    });
    
    // Function to get URL parameters (for potential dynamic app loading)
    function getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
    // Check for app parameters in URL (for dynamic loading)
    const appParam = getParameterByName('app');
    if (appParam) {
        // In production, this would fetch app data from your backend
        console.log('Loading app data for: ' + appParam);
        
        // Example fetch request (not functional in this demo)
        /*
        fetch(`/api/apps/${appParam}`)
            .then(response => response.json())
            .then(data => {
                populateAppData(data);
                // Update device info after loading app data
                getDeviceInfo();
            })
            .catch(error => {
                console.error('Error loading app data:', error);
                showToast("Uygulama bilgileri yüklenirken hata oluştu.");
            });
        */
    }
});

document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });