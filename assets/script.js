const localStorageKey = 'shortenedUrls';

    // get the existing urls from local storage
    const storedShortenedUrls = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // an array for the current shortened urls that will be shown in the shortened urls list
    const currentShortenedUrls = [];
    
    // function that saves shortenedUrls to local storage
    function saveToLocalStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(storedShortenedUrls));
    }

  // function to add a shortened URL to the array and update local storage
function addShortenedUrl(originalUrl, shortenedUrl, expirationTime) {
    const expirationTimestamp = Date.now() + expirationTime * 60 * 1000;
    const index = currentShortenedUrls.length;
    const newItem = {
        originalUrl: originalUrl,
        shortenedUrl: shortenedUrl,
        expirationTimestamp: expirationTimestamp
    };

    currentShortenedUrls.push(newItem);
    storedShortenedUrls.push(newItem);
    saveToLocalStorage();

    setTimeout(() => deleteUrl(index), expirationTime * 60 * 1000)

    displayShortenedUrls();
}


    // function to remove a shortened URL from the list
    function deleteUrl(index) {
      currentShortenedUrls.splice(index, 1);
      displayShortenedUrls();
    }

    // function to display the updated list of shortened URLs
    function displayShortenedUrls() {
      const shortenedUrlsList = document.getElementById('shortenedUrlsList');
      shortenedUrlsList.innerHTML = '';

      // loop through the array and display each shortened URL
      currentShortenedUrls.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('shortened-url-item');

        const expirationMinutes = Math.ceil((item.expirationTimestamp-Date.now())/(60*1000));
        
        listItem.innerHTML = `<a href="${item.originalUrl}" target="_blank">${item.shortenedUrl}</a>
          <img src="./assets/time.png" alt="Expiration Time" class="expiration-img" data-bs-toggle="modal" data-bs-target="#expirationModal-${index}">
            <img src="./assets/delete.png" alt="Delete" class="delete-btn" onclick="deleteUrl(${index})">
            <div class="modal fade" id="expirationModal-${index}" tabindex="-1" aria-labelledby="expirationModalLabel-${index}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="expirationModalLabel-${index}">Expiration Time</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="expirationTimeContent-${index}">
                            Expiration Time: <span id="expirationTimeSpan-${index}">${expirationMinutes} minute${expirationMinutes === 1 ? '' : 's'}</span>
                        </div>
                    </div>
                </div>
            </div>`;

        shortenedUrlsList.appendChild(listItem);
      });
    }

    //function to update the expiration time every minute
    function updateExpirationTime() {
      const now = Date.now();
      currentShortenedUrls.forEach((item, index) => {
          const expirationMinutes = Math.max(0, Math.ceil((item.expirationTimestamp - now) / (60 * 1000)));
          const expirationSpan = document.querySelector(`#expirationModal-${index} .modal-body`);
          if (expirationSpan) {
            expirationSpan.textContent = `Expiration Time: ${expirationMinutes} ${expirationMinutes === 1 ? 'minute' : 'minutes'}`;
          }
      });
  
      // Call the function every minute
      setTimeout(updateExpirationTime, 60 * 1000);
  }
  
  updateExpirationTime();
  
  // function that tells if the URL is valid (has '.com')
    function isValidUrl(url) {
      return url.includes('.com');
    }

    // the function that shortens the URL
    function shortenUrl() {
      const originalUrl = document.getElementById('originalUrl').value;
      const expirationDropdown=document.querySelector('select');
      let selectedExpiration=expirationDropdown.value;

      if (!isValidUrl(originalUrl)) {
        alert('Please enter a valid URL');
        return;
      }

      //set a default expiration time if the user doesn't select one
      if(selectedExpiration==='disabled'){
        selectedExpiration='60';
        expirationDropdown.value=selectedExpiration;
      }

      const randomString = Math.random().toString(36).substring(2, 6);
      const shortenedUrl = `https://shorturl.co/${randomString}`;

      let expirationTime = parseInt(selectedExpiration, 10);

      addShortenedUrl(originalUrl, shortenedUrl, expirationTime);

      displayShortenedUrls();

      // Clear the input when the URL is shortened and displayed
      document.getElementById('originalUrl').value = '';

      expirationDropdown.value = expirationDropdown.options[0].value;
    }

    displayShortenedUrls();