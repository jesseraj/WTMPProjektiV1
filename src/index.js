import SodexoData from './modules/sodexo-data';
import FazerData from './modules/fazer-data';
import {fetchData} from './modules/network';
import {getTodayIndex, todayDate} from './modules/tools';
import HSLData from './modules/hsl-data';


let language = 'fi';

/**
 * Renders menu courses on page
 */
const renderMenu = (data, targetId) => {
  const ulElement = document.querySelector('#' + targetId);
  ulElement.innerHTML = '';
  for (const item of data) {
    const listElement = document.createElement('li');
    listElement.textContent = item;
    ulElement.appendChild(listElement);
    listElement.classList.add('sodexo-item');
  }
};


/**
 * Display pages/vies in carousel mode
 *
 * @param {number} activeView - view index to be displayed
 * @param {number} duration - seconds between page updated
 */
const createViewCarousel = (activeView, duration) => {
  const views = document.querySelectorAll('section');
  for (const view of views) {
    view.style.display = 'none';
  }
  if (activeView === views.length) {
    activeView = 0;
  }
  views[activeView].style.display = 'block';
  setTimeout(() => {
    createViewCarousel(activeView + 1, duration);
  }, duration * 1000);

  // TODO: how frequently to update displayed data?

};


/**
 * Initialize application
 */
const init = () => {

  //createViewCarousel(0, 10);

  // TODO:
  // update sodexo data module to be similar than Fazer

  // Render Sodexo
  fetchData(SodexoData.dataUrlDaily).then(data => {
    console.log('sodexo', data);
    const courses = SodexoData.parseDayMenu(data.courses);
    renderMenu(courses, 'sodexo');
  });

  // // Render Fazer
  // fetchData(FazerData.dataUrlFi, {}, 'fazer-php').then(data => {
  //   console.log('fazer', data);
  //   const courses = FazerData.parseDayMenu(data.LunchMenus, getTodayIndex());
  //   renderMenu(courses, 'fazer');
  // });



  // fetch("https://www.foodandco.fi/api/restaurant/menu/week?language=en&restaurantPageId=270540&weekDate=" + todayDate)

  // .then(response => response.json())
  // .then(tulos => console.log(tulos));



  // fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits')
  // .then(response => response.json())
  // .then(commits => console.log(commits));






  // Playing with hsl data
  fetchData(HSLData.apiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/graphql'},
    body: HSLData.getQueryForNextRidesByStopId(2132207)
  }).then(response => {

    // TODO: create separate render HSL data functions (in HSLData module maybe?)
    console.log('hsl data', response.data.stop.stoptimesWithoutPatterns[0]);
    const stop = response.data.stop;

    let time = new Date((stop.stoptimesWithoutPatterns[0].realtimeArrival + stop.stoptimesWithoutPatterns[0].serviceDay) * 1000);
    let time2 = new Date((stop.stoptimesWithoutPatterns[1].realtimeArrival + stop.stoptimesWithoutPatterns[1].serviceDay) * 1000);
    let time3 = new Date((stop.stoptimesWithoutPatterns[2].realtimeArrival + stop.stoptimesWithoutPatterns[2].serviceDay) * 1000);



    document.querySelector('#hsl-data').innerHTML = `
    <h3 id="hsl-item">
       ${stop.name}
    </h3>
    <h3 id="hsl-item">
      ${stop.name}
    </h3>
    <h3 id="hsl-item">
      ${stop.name}
    </h3>
    `;

    document.querySelector('#hsl-data2').innerHTML = `
    <h3 id="hsl-item">
      ${stop.stoptimesWithoutPatterns[0].headsign}
    </h3>
    <h3 id="hsl-item">
      ${stop.stoptimesWithoutPatterns[1].headsign}
    </h3>
    <h3 id="hsl-item">
      ${stop.stoptimesWithoutPatterns[2].headsign}
    </h3>
    `;

    document.querySelector('#hsl-data3').innerHTML = `
    <h3 id="hsl-item">
      ${time.toLocaleString().substr(12, 5)}
    </h3>
    <h3 id="hsl-item">
      ${time2.toLocaleString().substr(12, 5)}
    </h3>
    <h3 id="hsl-item">
      ${time3.toLocaleString().substr(12, 5)}
    </h3>
    `;

  });

      // <br> Alla tietoja seuraavaksi saapuvista busseista:
      // <br>
      // <br> Mist??: ${stop.name}
      // <br> Minne: ${stop.stoptimesWithoutPatterns[0].headsign}
      // <br> Milloin seuraava: ${time.toLocaleString().substr(13, 5)}
      // <br>
      // <br> Mist??: ${stop.name}
      // <br> Minne: ${stop.stoptimesWithoutPatterns[1].headsign}
      // <br> Milloin: ${time2.toLocaleString().substr(13, 5)}
      // <br>
      // <br> Mist??: ${stop.name}
      // <br> Minne: ${stop.stoptimesWithoutPatterns[2].headsign}
      // <br> Milloin: ${time3.toLocaleString().substr(13, 5)}
      // <br> Milloin: ${time3.toISOString().substr(0, 10)}
      // <br>
      // <br> Yleisesti aika: ${time}



};
init();
