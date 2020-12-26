class ServerInfo {

  constructor() {
    this._title = ''
    this._length = ''
    this._views = ''
    this._published = ''
    this._rating = ''
    this._author = ''
    this._description = ''
    this._url = ''
    this._thumbnail_url = ''
  }


  renew({ title, length, views, published, rating, author, description, url, thumbnail_url }) {
    this.title = title
    this.length = length
    this.views = views
    this.published = published
    this.rating = rating
    this.author = author
    this.description = description
    this.url = url
    this.thumbnail_url = thumbnail_url
  }


  set length(val) { this._length = val }
  set views(val) { this._views = val }
  set published(val) { this._published = val }

  set url(val) { this._url = val }


  set rating(val) {
    this._rating = parseFloat(val.toFixed(1))
    updateRating(this._rating)
  }

  set title(val) {
    var reg = /\(([^)]+)\)/gm;
    var formatted = val.split('-');

    if (formatted.length > 1)
      this._title = formatted[1].trim().replace(reg, '')
    else
      this._title = formatted[0].trim().replace(reg, '')


    updateElementInfo(this._title, 'title')
  }

  set author(val) {
    this._author = val.split('-')[0].trim()
    updateElementInfo(this._author, 'author')
  }

  set description(val) {
    this._description = val
    updateElementInfo(this._description, 'description')
  }

  set thumbnail_url(val) {
    this._thumbnail_url = val
    updateThumbnail(this._thumbnail_url)
  }
}

var serverInfo = new ServerInfo();

function updateRating(rate) {
  // Recebendo todas as moedinhas
  var coins = document.getElementsByClassName('coin');

  // Limpando a avaliação anterior
  for (var i = 0; i < coins.length; ++i) {
    coins[i].classList.remove('third');
    coins[i].classList.remove('half');
    coins[i].classList.remove('three-quarter');
    coins[i].classList.remove('almost-there');
    coins[i].classList.remove('full');
    coins[i].setAttribute('fill', 'rgba(0,0,0, 0)')
  }

  // Preenchendo os pontos que devem ser preenchidos completamente
  var rateFloor = Math.floor(rate);
  var lastCoin = 0;
  for (var i = 0; i < rateFloor; ++i, ++lastCoin) {
    coins[i].classList.add('full');
    coins[i].setAttribute('fill', 'rgba(250,200,0, 1)')
  }

  // Avaliando quanto o vídeo merece do ultimo ponto
  var lastCoinThreshold = (getDecimal(rate).toFixed(1) * 10)
  if (lastCoinThreshold != 0) {
    if (lastCoinThreshold <= 3) {
      coins[lastCoin].classList.add('third');
    } else if (lastCoinThreshold <= 4) {
      coins[lastCoin].classList.add('half');
    } else if (lastCoinThreshold <= 7) {
      coins[lastCoin].classList.add('three-quarter');
    } else if (lastCoinThreshold <= 8) {
      coins[lastCoin].classList.add('almost-there');
    } else {
      coins[lastCoin].classList.add('full');
    }
    coins[lastCoin].setAttribute('fill', 'rgba(250,200,0, 1)')
  }
}

function updateThumbnail(src) {
  document
    .getElementById('bg')
    .setAttribute('src', src)

  document
    .getElementById('thumbnail')
    .setAttribute('src', src)

  document.getElementById('main-content').classList.remove('on-search')
  document.getElementById('main-content').classList.add('on-result')
}

function updateElementInfo(val, elementId) {
  document.getElementById(elementId).innerHTML = val;
}


const responseUpdating =
  () =>
    document
      .getElementById('updater')
      .classList.add('updating')

const responseSuccess =
  () => {
    document
      .getElementById('updater')
      .classList.remove('updating')
    document
      .getElementById('updater')
      .classList.add('success')
    setTimeout(() => {
      document
        .getElementById('updater')
        .classList.remove('success')
    }, 1000);
  }

const responseError =
  () => {
    document
      .getElementById('updater')
      .classList.remove('updating')
    document
      .getElementById('updater')
      .classList.add('error')
  }



const requestVideo =
  url => {
    const isYoutubeLink = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[^&\s\?]+(?!\S))\/)|(?:\S*v=|v\/)))([^&\s\?]+)/
    if (isYoutubeLink.test(url))
      $.ajax({
        url: "/getvid",
        type: "POST",
        data: JSON.stringify({ "url": url }),
        contentType: 'application/json charset=utf-8',
        dataType: 'json',
        beforeSend: () => {
          responseUpdating()
        },
        success: ((response) => {
          responseSuccess()
          serverInfo.renew(response)
        })
      })
    else
      return
  }


function getDecimal(n) {
  return (n - Math.floor(n));
}