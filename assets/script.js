const localStorageKey = 'shortenedUrls';

    // get the existing urls from local storage
    const storedShortenedUrls = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // an array for the current shortened urls
    const currentShortenedUrls = [];

    // function that saves shortenedUrls to local storage
    function saveToLocalStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(storedShortenedUrls));
    }

    // function to add a shortened URL to the array and update local storage
    function addShortenedUrl(originalUrl, shortenedUrl, expirationTime) {
        const expirationTimestamp=Date.now() + expirationTime * 60 * 1000;
        currentShortenedUrls.push({
        originalUrl: originalUrl,
        shortenedUrl: shortenedUrl,
        expirationTimestamp:expirationTimestamp
      });
      storedShortenedUrls.push({
        originalUrl: originalUrl,
        shortenedUrl: shortenedUrl,
        expirationTimestamp:expirationTimestamp
      });
      saveToLocalStorage();

      setTimeout(()=>{
        deleteUrl(currentShortenedUrls.length - 1);},
        expirationTime*60*1000);
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
        <span class="expiration">*Expires in ${expirationMinutes}${expirationMinutes <= 1?'m':'m'}*</span>
        <button class="btn btn-sm" onclick="deleteUrl(${index})"><img src="./assets/delete.png" alt="Delete"</button>`;
        shortenedUrlsList.appendChild(listItem);
      });
    }

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