# Futon

Download movies from your IMDB watchlist automatically, effortlessly and in the best possible quality as soon as they become available. Set & forget!

### Description

Futon is a new kind of PVR for torrents (with newsnet support coming soon). It will periodically check your IMDB watchlist(s) for new movies. When it finds one, it will automatically find and download the highest quality torrent available. The aim is for Futon to mature into a complete replacement for CouchPotato.

## Development Status

Currently Futon is in pre-alpha, and is under active development. As such, you should expect the experience to be quite rough around the edges (like any other software at this stage of development).

## Features

- Support for Linux & OSX
- Periodically checks your IMDB watchlists for new movies
- Automatically downloads the highest quality torrent
- Simple & clean user interface
- Written with large movie libraries in mind
- Extensible architecture: easily add new downloaders, watchlist providers and torrent aggregators
- Built using state of the art web technologies (node.js + React)

## Prioritised Roadmap

- Plex & XBMC Integration - to check if a movie is present in the library before downloading
- Renaming and moving freshly downloaded movies
- Usenet support
- More downloaders, watchlist providers and torrent aggregators.
- Windows support (currently untested)

## Installation

#### Prerequisists

- [node.js](http://nodejs.org/)
- [redis](http://redis.io/)

#### Installation

```
$ npm install futon
```

## Configuration

Figure it out :)

### Contributing

Contributions are welcome, just issue a PR. You can install your development folder with:

    $ npm install


