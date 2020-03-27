const main = document.querySelector('main')
const footer = document.querySelector('footer')

// insert icon from array based on icon number from API
let iconsArray = [
  '<i class="fas fa-question" style="color:#888;"></i>',
  '<i class="fas fa-wind" style="color:#6699cc;"></i>',
  '<i class="fas fa-ambulance" style="color:#b30e17;"></i>',
  '<i class="fas fa-car-crash" style="color:#214fc6;"></i>',
  '<i class="fas fa-fire" style="color:#ff7b00;"></i>',
  '<i class="fas fa-skull-crossbones" style="color:#8009A9;"></i>',
  '<i class="fas fa-bolt" style="color:#fcd01c;"></i>',
  '<i class="fas fa-bomb" style="color:#000;"></i>',
  '<i class="fas fa-exclamation" style="color:#fa1e1e;"></i>'
]

//not in use, for reference
let iconsColorsArray = ['#888', '#6699cc', '#b30e17', '#214fc6', '#ff7b00', '#8009A9', '#fcd01c', '#000', '#fa1e1e']

// number of events loaded on start
let initialEventNumber = 10

// load events on start
for (let i = 0; i < initialEventNumber; i++) {
  getEvent(i)
}

// load event when you scroll to bottom and increases initialEventNumber
window.onscroll = function() {
  var pageHeight = document.documentElement.offsetHeight,
    windowHeight = window.innerHeight,
    scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop + ((document.documentElement && document.documentElement.scrollTop) || 0)
  if (pageHeight - 1 <= windowHeight + scrollPosition) {
    getEvent(initialEventNumber)
    initialEventNumber++
  }
}

// load one event with index i
function getEvent(i) {
  fetch('https://spin3.sos112.si/api/javno/lokacijalist')
    .then(res => res.json())
    .then(data => {
      let eventDate = data.value[i].prijavaCas.split('-')
      let eventDateDay = eventDate[2].split('T')[0]
      let eventDateMonth = eventDate[1]
      let eventDateYear = eventDate[0]
      let eventTime = data.value[i].prijavaCas.split('T')[1].substring(0, 5)
      let description = data.value[i].besedilo
      let eventTitle = data.value[i].intervencijaVrstaNaziv
      if (!description) {
        description = 'Informacije še niso na voljo ...'
      }
      if (data.value[i].dogodekNaziv) {
        eventTitle = data.value[i].dogodekNaziv
      }
      main.innerHTML += `<div class="event-container">
                          <div class=event-container__row-one>
                            <div class="event-container__title">${eventTitle}</div>
                            <div class="event-container__icon">${iconsArray[data.value[i].ikona]}</div> 
                          </div>
                          <div class=event-container__row-two>
                            <div class="event-container__location"><img src="images/pin.svg" alt="" /> <a href="https://maps.google.com/?q=${data.value[i].wgsLat},${data.value[i].wgsLon}">${
        data.value[i].obcinaNaziv
      }</a></div>
                            <div class="event-container__date">${eventDateDay}.${eventDateMonth}.${eventDateYear}, ${eventTime}</div>
                          </div>                          
                          <div class="event-container__description">${description}</div>
                         </div>`
      const eventContainer = document.querySelectorAll('.event-container')
      eventContainer[i].classList.add('event-container--box-shadow-' + data.value[i].ikona)
      console.log(i)
    })
    .catch(err => {
      console.log(err)
      footer.innerHTML = '<p>&copy; 112 Dogodki 2020</p><p><a href="#">Na vrh <i class="fas fa-arrow-up"></i></p>'
    })
}

//------------------------------ start light/dark mode switch ------------------------------------------

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]')
const logo = document.getElementById('logo').src

// function that changes data-theme attribute, logo and sets localstorage variable
function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.getElementById('logo').src = 'images/logo-dark.svg'
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
    document.getElementById('logo').src = 'images/logo-light.svg'
    localStorage.setItem('theme', 'light')
  }
}

// call switchTheme function on toggleSwitch change
toggleSwitch.addEventListener('change', switchTheme, false)

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null

if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme)
  if (currentTheme === 'dark') {
    toggleSwitch.checked = true
    document.getElementById('logo').src = 'images/logo-dark.svg'
  }
}

//------------------------------ end light/dark mode switch ------------------------------------------
