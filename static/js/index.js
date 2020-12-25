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


  set rating(val) { this._rating = val }
  set title(val) {
    var reg = /\(([^)]+)\)/;
    var formatted = val.split('-');

    if (formatted.length > 1)
      this._title = formatted[1].trim().replace(reg, '')
    else
      this._title = formatted[0].trim().replace(reg, '')


    updateTitle(this._title)
  }

  set author(val) {
    this._author = val.split('-')[0].trim()
    updateAuthor(this._author)
  }

  set description(val) {
    this._description = val
    updateDescription(this._description)
  }

  set thumbnail_url(val) {
    this._thumbnail_url = val
    updateThumbnail(this._thumbnail_url)
  }
}

var serverInfo = new ServerInfo();


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

function updateAuthor(val) {
  document.getElementById('author').innerHTML = val;
}

function updateTitle(val) {
  document.getElementById('title').innerHTML = val;
}

function updateDescription(val) {
  document.getElementById('description').innerHTML = val
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

// function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
//   const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
//   return {
//     x: centerX + (radius * Math.cos(angleInRadians)),
//     y: centerY + (radius * Math.sin(angleInRadians))
//   };
// }

// function polygon(centerX, centerY, points, radius) {
//   const degreeIncrement = 360 / (points);
//   const d = new Array(points).fill('foo').map((p, i) => {
//     const point = polarToCartesian(centerX, centerY, radius, degreeIncrement * i);
//     return `${ point.x },${ point.y }`;
//   });
//   return `M${ d }Z`;
// }

// (function () {
//   console.log(polygon(15, 15, 4, 15));
//   for (var coin of document.getElementsByClassName('coinPath'))
//     coin.setAttribute('d', polygon(15, 15, 4, 15))
// })();