document.addEventListener('DOMContentLoaded', function() {

    var uberLinks = document.querySelectorAll('.uberTab');
    var cabifyLinks = document.querySelectorAll('.cabifyTab');
    var customAlert = document.createElement('div');
    var loadingGif = document.createElement('img');
    
    customAlert.id = 'custom-alert';
    customAlert.style.display = 'none';
    customAlert.style.fontFamily = 'system-ui';
    customAlert.style.position = 'fixed';
    customAlert.style.top = '20px';
    customAlert.style.left = '50%';
    customAlert.style.transform = 'translateX(-50%)';
    customAlert.style.backgroundColor = '#ffffff';
    customAlert.style.color = '#000000';
    customAlert.style.padding = '15px';
    customAlert.style.borderRadius = '2px';
    customAlert.style.zIndex = '1000';
    customAlert.style.width = '12rem';
    customAlert.textContent = 'Redirigiendo a la página...';

    loadingGif.src = '/images/loadingGif.gif';  // Asegúrate de que la ruta del GIF sea correcta
    loadingGif.style.display = 'flex';
    loadingGif.style.marginTop = '10px';
    loadingGif.style.width = '2rem';
    
    customAlert.textContent = 'Redirigiendo a la página...';
    customAlert.appendChild(loadingGif);
    
    document.body.appendChild(customAlert);
    
    function showAlert(url) {
        customAlert.style.display = 'block';
        setTimeout(function() {
            customAlert.style.display = 'none';
            window.location.href = url;
        }, 3000);
    }

    uberLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            showAlert(link.href);
        });
    });

    cabifyLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            showAlert(link.href);
        });
    });
});

