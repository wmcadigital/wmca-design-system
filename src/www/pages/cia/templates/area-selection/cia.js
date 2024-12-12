const cia = () => {
  // Logic for redirecting users based on location
  // The user will be redirected to the area select page if it's their first time on the site
  // If a user has visited before and they try to go on the homepage, it will redirect them to the correct region
  // If a user goes on any other page then a banner will show up and say, you usually browse the site via x region, do you want to change?
  function localAreaSelect() {
    const pagePath = window.location.pathname; // Get the page's URL path
    const trimmedPathname = pagePath.replace(/\/$/, ''); // Remove the trailing slash from page's URL path
    const segments = trimmedPathname.split('/'); // Split the page's URL path
    const lastSegment = segments.pop(); // Gets the last part of the path
    const areaPages = ['coventry', 'dudley', 'sandwell', 'solihull', 'walsall', 'wolverhampton']; // Set area pages (where the area menu appears) '/' == Birmingham(default)
    const anyAreaPage = areaPages.includes(lastSegment); // Check areaPages to see if pagePath === any of them
    const splashUrl = '/cia/templates/area-selection'; // Splash URL,TODO: change this to umbraco URL
    const getSelectedArea = localStorage.getItem('selectedArea'); // Get selected area from localStorage

    // If localStorage doesn't contain a selected area and the page != splash page and the page IS an area home page
    if (getSelectedArea === null && pagePath !== splashUrl && anyAreaPage) {
      // window.location.replace(splashUrl); // Then redirect the user to splash page
      // Else if the pagePath is one of the area home pages && the pagePath != localStorage(stops loops)
    } else if (anyAreaPage && pagePath !== getSelectedArea) {
      window.location.href = getSelectedArea; // Then redirect user to the area they were last on
    }

    // If page is == to any area homepages or splashpage (only pages with area select menus)
    if (anyAreaPage || pagePath === splashUrl) {
      // const changeAreaNav = document.querySelectorAll('.area-select'); // Get all a tags in change area menu(s)
      localStorage.setItem('selectedArea', window.location.pathname);
      // On click
      // changeAreaNav.addEventListener('click', event => {
      //   console.log('yes');
      //   event.preventDefault(); // Prevent default click action
      //   const getHref = window.location.pathname; // ele.getAttribute('href'); // Get the href
      //   const getSessionUrl = sessionStorage.getItem('cachedUrl'); // Get the url from the previous page if the user has got to splash page via "update location button" in notification banner

      //   localStorage.setItem('selectedArea', getHref); // Set localstorage to href clicked (for future visits to the site we can re-direct to this page)
      //   // If the sessionURL is not null (user has come from previous page using "update location button")
      //   if (getSessionUrl != null) {
      //     sessionStorage.removeItem('cachedUrl'); // Remove the session storage
      //     window.location.href = getHref; // Redirect user back to the page from which they came
      //   } else {
      //     window.location.href = getHref; // The redirect user to the correct page
      //   }
      // });
    }
  }
  // Logic for the area dropdown in the footer
  function areaDropdownFooter() {
    const footerAreaSelect = document.querySelectorAll('footer .footer-dropdown > select');

    footerAreaSelect[0].addEventListener('change', () => {
      const selVal = footerAreaSelect[0].value;
      if (selVal === 'wolverhampton') {
        const modal = document.getElementById('wolvoModal');
        modal.style.display = 'block';
      } else {
        localStorage.setItem('selectedArea', footerAreaSelect[0].value); // Set localstorage to href clicked (for future visits to the site we can re-direct to this page)
        window.location.href = footerAreaSelect[0].value; // The redirect user to the correct page
      }
    });
  }
  // Only run function if areaDropdown is available
  if (document.querySelectorAll('footer .footer-dropdown > select').length) {
    window.addEventListener('load', areaDropdownFooter);
  }

  window.addEventListener('load', localAreaSelect); // Run localAreaSelect as soon as page loads

  // Function for defining video lightbox on pages
  function videoLightbox() {
    const videoLightboxEle = document.querySelectorAll('.lightBoxVideoLink'); // Define lightbox links on page

    // Foreach lightbox element
    videoLightboxEle.forEach(element => {
      const getHref = element.getAttribute('href'); // Get the href attr

      // The below if statements check all the posible ways a user can copy a youtube/youtu.be link and converts them into the correct format for the lightbox.
      // Otherwise there will be x-frame errors as youtube doesn't let you embed videos unless using the youtube.com/embed url

      // If the href contains the below string
      if (getHref.indexOf('youtube.com/watch') !== -1) {
        element.setAttribute('href', `${getHref.replace('watch?v=', 'embed/')}?autoplay=1`); // Then set the href to the correct format
        // Else if the href contains the below string
      } else if (getHref.indexOf('youtu.be') !== 1) {
        element.setAttribute(
          'href',
          `${getHref.replace('youtu.be/', 'youtube.com/embed/')}?autoplay=1` // Then set the href to correct format
        );
      }
    });

    const { SimpleLightbox } = window; // Define what SimpleLightbox is so we can use it

    // eslint-disable-next-line no-unused-vars
    const lightbox = new SimpleLightbox({
      elements: videoLightboxEle // Call lightbox with defaults for each video ele
    });
  }
  window.addEventListener('load', videoLightbox); // call video lightbox on page load

  //   const fetchJustGiving = () => {
  //     fetch('https://api.justgiving.com/v1/campaigns/changeintoaction/birmingham', {
  //       mode: 'cors',
  //       headers: {
  //         'x-api-key': '81970c9b',
  //         'Content-Type': 'application/json'
  //         // Accept: 'application/json'
  //       }
  //     })
  //       .then(response => response.json())
  //       .then(myJson => {
  //         console.log(myJson);

  //         const currencyFormat = new Intl.NumberFormat('en-GB', {
  //           style: 'currency',
  //           currency: 'GBP',
  //           minimumFractionDigits: 2
  //         });

  //         const totalAmount = currencyFormat.format(myJson.totalRaised);
  //         console.log(totalAmount);

  //         if (document.body.innerHTML.indexOf('$*totalraised') !== -1) {
  //           document.body.innerHTML = document.body.innerHTML.replace(
  //             /\$\*totalraised/gi,
  //             totalAmount
  //           );
  //         }
  //       });
  //   };

  const fetchJustGiving = () => {
    fetch('https://apis.networkwestmidlands.com/justgiving/api', {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data);

        const currencyFormat = new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
          minimumFractionDigits: 2
        });

        const totalAmount = currencyFormat.format(data.totalRaised);
        // console.log(totalAmount);

        const replaceClass = document.querySelectorAll('.total-raised');

        if (replaceClass) {
          replaceClass.forEach(element => {
            const e = element;
            e.textContent = totalAmount;
          });
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  window.addEventListener('load', fetchJustGiving);

  // Search document for all elements with the class 'shortanswer'
  // loop through the elements and assign a different class for odd and even elements
  document.body.querySelectorAll('.shortanswer').forEach((node, i) => {
    node.classList.add(i % 2 ? 'item-cost' : 'item-description');
  });

  function radioYesNo() {
    if (document.getElementById('4aaa3ba9-97a6-42c6-a56e-bd3ddfa62614_0').checked) {
      document.getElementsByName('submitbtn')[0].style.display = 'block';
    } else {
      document.getElementsByName('submitbtn')[0].style.display = 'none';
    }
  }

  if (document.querySelector('.umbraco-forms-form') != null) {
    // for funding application form, listen for when yes/no radio buttons to change
    // display and hide submit button depending on which is checked

    // window.addEventListener('click', function () {
    //   if (document.getElementById('4aaa3ba9-97a6-42c6-a56e-bd3ddfa62614_0').checked) {
    //     document.getElementsByName('submitbtn')[0].style.display = 'block';
    //   } else {
    //     document.getElementsByName('submitbtn')[0].style.display = 'none';
    //   }
    // });

    window.addEventListener('click', radioYesNo);

    const findTotal = () => {
      const arr = document.querySelectorAll('.item-cost div input');
      let total = 0;

      // loop through and add value in input to total
      for (let i = 0; i < arr.length; i += 1) {
        if (parseFloat(arr[i].value)) {
          total += parseFloat(arr[i].value);
        }
      }

      // get the input field to display total
      document.getElementById('e37c9663-f327-4930-8b0e-7ffec4802f15').value = total.toFixed(2);
    };

    // listen for any changes to the input fields
    window.addEventListener('keyup', findTotal);
  }

  //   // overlay - popup
  //   function modalOverlay() {
  //     // Get the modal
  //     const modal = document.getElementById('wolvoModal');

  //     // Get the button that opens the modal
  //     const btn = document.getElementById('modalWolvo');

  //     // Get the <span> element that closes the modal
  //     const span = document.getElementsByClassName('button-close')[0];

  //     // When the user clicks the button, open the modal
  //     btn.onclick = function () {
  //       modal.style.display = 'block';
  //     };

  //     // When the user clicks on <span> (x), close the modal
  //     span.onclick = function () {
  //       modal.style.display = 'none';
  //     };

  //     // When the user clicks anywhere outside of the modal, close it
  //     window.onclick = function (event) {
  //       if (event.target === modal) {
  //         modal.style.display = 'none';
  //       }
  //     };

  //     window.openModal = modal.open.bind(modal);
  //   }
  //   window.addEventListener('load', modalOverlay); // Run modalOverlay as soon as page loads
};

export default cia;
