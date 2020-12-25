from pytube import YouTube
from datetime import datetime


def getVideoData(url):
    return YouTube(url)


def getVideoInfoFrom(url):
    data = getVideoData(url)
    return {
        'title': data.title,
        'length': data.length,
        'views': data.views,
        'published': data.publish_date.strftime("%d/%m/%Y, %H:%M:%S") if data.publish_date is not None else 'Data não consta',
        'rating': data.rating,
        'author': data.author,
        'description': data.description,
        'url': data.embed_url,
        'thumbnail_url': data.thumbnail_url
    }
