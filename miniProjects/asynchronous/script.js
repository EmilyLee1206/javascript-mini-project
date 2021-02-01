'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `    
  <article class="country ${className}">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
 </article>
 `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

///////////////////////////////////////

const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
  request.send();
  console.log(request.responseText);

  // We are waiting for data as soon as the data arrives
  request.addEventListener('load', function () {
    // console.log(this.responseText);
    //   const [data] = JSON.parse(request.responseText)[0];
    const [data] = JSON.parse(request.responseText);
    // console.log(data);

    // Render Country 1
    renderCountry(data);

    // Get neighbor country (2)
    const [neighbour] = data.borders;

    // 이웃국가가 없으면..
    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    request2.send();

    // nested callback
    request2.addEventListener('load', function () {
      // country code is unique so it doesn't need to do destructing
      const data2 = JSON.parse(this.responseText);
      // console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};

// data arrives at a slightly different time, so 순서가 달라질 수 있음.
// non-blocking behavior
// getCountryData('korea');
// getCountryData('usa');
// getCountryData('france');
// getCountryData('germany');
// getCountryData('uk');

// getCountryAndNeighbour('usa');

// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
// request.send();
// console.log(request.responseText);

/////////////////////////////////////////////////////////////////////////////

// const request = fetch(`https://restcountries.eu/rest/v2/name/portugal`);
// console.log(request); // Promise {<pending>}

// const getCountryData = function (country) {
//   // calling the fetch func will return a promise as soon as we start request
//   fetch(`https://restcountries.eu/rest/v2/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       // json method is available on all the response objects that is coming from the fetch func
//       return response.json();
//       // itself will return a promise
//     })
//     .then(function (data) {
//       // data = resolved data
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

/////////////////////////////////////////////////////////////////////////////

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
    return response.json();
  });
};

const getCountryData = function (country) {
  // Country 1
  getJSON(
    `https://restcountries.eu/rest/v2/name/${country}`,
    'Country not found'
  )
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      // console.log(neighbour); // undefined
      if (!neighbour) throw new Error(`No neighbour found!`);

      // Country 2
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not found'
      ); // new promise
    })
    .then((data) => renderCountry(data, 'neighbour'))
    .catch((err) => {
      console.error(`${err} 😅😅😅`); // handling error globally
      renderError(`Something went wrong 😅😅 ${err.message} Try again!`);
    })
    .finally(() => {
      // ex) hide rotating circle
      countriesContainer.style.opacity = 1;
    });
};

// btn.addEventListener('click', function () {
//   getCountryData('USA');
// });

// getCountryData('australia'); // 404 error

///////////////////////////////////////
// Coding Challenge #1

/* 

5. This API allows you to make only 3 requests per second. 
If you reload fast, you will get this error with code 403. 
This is an error with the request. Remember, 
fetch() does NOT reject the promise in this case. 
So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. 
So take the relevant attribute from the geocoding API result, 
and plug it into the countries API that we have been using.

7. Render the country and catch any errors, 
just like we have done in the last lecture 
(you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474
GOOD LUCK 😀
*/

// if (navigator.geolocation)
//   navigator.geolocation.getCurrentPosition((data) => {
//     const { latitude } = data.coords;
//     const { longitude } = data.coords;
//     whereAmI(latitude, longitude);
//   });

// function whereAmI(lat, lng) {
//   fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     .then((response) => {
//       // console.log(response.status);
//       if (!response.ok) throw new Error(`somthing is wrong`);
//       return response.json();
//     })
//     .then((data) => {
//       // console.log(`You are in ${data.region}, ${data.state}`);
//       return fetch(`https://restcountries.eu/rest/v2/name/${data.state}`);
//     })
//     .then((response) => response.json())
//     .then((data) => renderCountry(data[2]))
//     .catch((err) => console.error(`Oops, ${err.message}`))
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// }

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);

// console.log('Test start');
// setTimeout(() => console.log('0 sec timer'), 0);
// Promise.resolve('Resolved promise 1').then((res) => console.log(res));
// Promise.resolve('Resolved promise 2').then((res) => {
//   for (let i = 0; i < 1000000000; i++) {}
//   console.log(res);
// });
// console.log('Test end');

// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log('Lottery draw is happening😇');
//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve('You WIN 💰');
//     } else {
//       reject(new Error('You lost your money 😢'));
//     }
//   }, 2000);
// });

// lotteryPromise
//   .then((res) => console.log(res)) // prettier ignore
//   .catch((err) => console.log(err));

// // Promisifying setTimeout
// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// wait(1)
//   .then(() => {
//     console.log('1 second passed');
//     return wait(1);
//   })
//   .then(() => {
//     console.log('2 second passed');
//     return wait(1);
//   })
//   .then(() => {
//     console.log('3 second passed');
//     return wait(1);
//   })
//   .then(() => {
//     console.log('4 second passed');
//     return wait(1);
//   })
//   .then(() => console.log('5 second passed'));

// // setTimeout(() => {
// //   console.log('1 second passed');
// //   setTimeout(() => {
// //     console.log('2 second passed');
// //     setTimeout(() => {
// //       console.log('3 second passed');
// //       setTimeout(() => {
// //         console.log('4 second passed');
// //       }, 1000);
// //     }, 1000);
// //   }, 1000);
// // }, 1000);

// 앞에 나옴!
//  lotteryPromise Promise 먼저 실행되고, 왜냐! 먼저나온 마이크로 테스크니까
// Promise.resolve('abc').then((x) => console.log(x));
// Promise.reject(new Error('Problem!!')).catch((x) => console.error(x));

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => resolve(position),
    //   (err) => reject(err)
    // );
    // resolve 는 스스로 콜백함수입니다..
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then((pos) => console.log(pos));

const whereAmI = function () {
  console.log('hahaha');
  getPosition()
    .then((pos) => {
      // 디스트럭쳐링 구조분해할당하면서 새로운 이름주기!
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then((response) => {
      // console.log(response.status);
      if (!response.ok) throw new Error(`somthing is wrong`);
      return response.json();
    })
    .then((data) => {
      // console.log(`You are in ${data.region}, ${data.state}`);
      return fetch(`https://restcountries.eu/rest/v2/name/${data.state}`);
    })
    .then((response) => response.json())
    .then((data) => renderCountry(data[2]))
    .catch((err) => console.error(`Oops, ${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// btn.addEventListener('click', whereAmI);

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.
Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉
PART 1
1. Create a function 'createImage' which receives imgPath as an input. 
This function returns a promise which creates a new image 
(use document.createElement('img')) and sets the .src attribute to the provided image path. 
When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. 
The fulfilled value should be the image element itself. 
In case there is an error loading the image ('error' event), reject the promise.
If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;

3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;

4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image 
(HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);

5. After the second image has loaded, pause execution for 2 seconds again;

6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. 
Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.
GOOD LUCK 😀
*/

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

createImage('img/img-1.jpg').then((img) => {
  console.log('Image 1 loaded');
});
