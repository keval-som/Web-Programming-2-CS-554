import { gql } from "@apollo/client";

const GET_ARTISTS = gql`
  query Artists {
    artists {
      _id
      dateFormed
      members
      name
      numOfAlbums
    }
  }
`;

const ADD_ARTIST = gql`
  mutation addArtist(
    $name: String!
    $dateFormed: String!
    $members: [String!]!
  ) {
    addArtist(name: $name, date_formed: $dateFormed, members: $members) {
      _id
      dateFormed
      name
      numOfAlbums
      members
    }
  }
`;

const EDIT_ARTIST = gql`
  mutation EditArtist(
    $id: String!
    $name: String
    $dateFormed: String
    $members: [String!]
  ) {
    editArtist(
      _id: $id
      name: $name
      date_formed: $dateFormed
      members: $members
    ) {
      _id
      dateFormed
      members
      name
      numOfAlbums
    }
  }
`;

const DELETE_ARTIST = gql`
  mutation EditArtist($id: String!) {
    removeArtist(_id: $id) {
      _id
      dateFormed
      members
      name
      numOfAlbums
    }
  }
`;

const GET_ARTIST_BY_ID = gql`
  query GetArtistById($id: String!) {
    getArtistById(_id: $id) {
      _id
      albums {
        _id
        title
      }
      dateFormed
      members
      name
      numOfAlbums
    }
  }
`;

const GET_SONGS_BY_ARTIST_ID = gql`
  query GetSongsArtistById($artistId: String!) {
    getSongsByArtistId(artistId: $artistId) {
      _id
      albumId {
        _id
        title
      }
      duration
      title
    }
  }
`;

const GET_COMPANIES = gql`
  query Recordcompanies {
    recordcompanies {
      _id
      country
      foundedYear
      name
      numOfAlbums
    }
  }
`;

const EDIT_COMPANY = gql`
  mutation EditCompany(
    $id: String!
    $name: String
    $foundedYear: Int
    $country: String
  ) {
    editCompany(
      _id: $id
      name: $name
      founded_year: $foundedYear
      country: $country
    ) {
      _id
      country
      foundedYear
      name
      numOfAlbums
      albums {
        _id
        title
      }
    }
  }
`;

const ADD_COMPANY = gql`
  mutation AddCompany($name: String!, $foundedYear: Int!, $country: String!) {
    addCompany(name: $name, founded_year: $foundedYear, country: $country) {
      _id
      country
      foundedYear
      name
      numOfAlbums
    }
  }
`;

const DELETE_COMPANY = gql`
  mutation RemoveCompany($id: String!) {
    removeCompany(_id: $id) {
      _id
      country
      foundedYear
      name
      numOfAlbums
    }
  }
`;

const GET_COMPANY_BY_ID = gql`
  query GetCompanyById($id: String!) {
    getCompanyById(_id: $id) {
      _id
      albums {
        _id
        title
      }
      country
      foundedYear
      name
      numOfAlbums
    }
  }
`;

const GET_ALBUMS = gql`
  query Albums {
    albums {
      _id
      title
      artist {
        _id
        name
      }
      genre
      recordCompany {
        _id
        name
      }
      releaseDate
      songs {
        _id
        duration
        title
      }
    }
  }
`;

const ADD_ALBUM = gql`
  mutation AddAlbum(
    $title: String!
    $releaseDate: String!
    $genre: MusicGenre!
    $artistId: String!
    $companyId: String!
  ) {
    addAlbum(
      title: $title
      releaseDate: $releaseDate
      genre: $genre
      artistId: $artistId
      companyId: $companyId
    ) {
      _id
      title
      artist {
        _id
        name
      }
      genre
      recordCompany {
        _id
        name
      }
      releaseDate
      songs {
        _id
        duration
        title
      }
    }
  }
`;

const EDIT_ALBUM = gql`
  mutation EditAlbum(
    $id: String!
    $title: String
    $releaseDate: String
    $genre: MusicGenre
    $artistId: String
    $companyId: String
  ) {
    editAlbum(
      _id: $id
      title: $title
      releaseDate: $releaseDate
      genre: $genre
      artistId: $artistId
      companyId: $companyId
    ) {
      _id
      title
      artist {
        _id
        name
      }
      genre
      recordCompany {
        _id
        name
      }
      releaseDate
      songs {
        _id
        duration
        title
      }
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation RemoveAlbum($id: String!) {
    removeAlbum(_id: $id) {
      _id
      title
      artist {
        _id
        name
      }
      genre
      recordCompany {
        _id
        name
      }
      releaseDate
      songs {
        _id
        duration
        title
      }
    }
  }
`;

const GET_ALBUM_BY_ID = gql`
  query GetAlbumById($id: String!) {
    getAlbumById(_id: $id) {
      _id
      title
      artist {
        _id
        name
      }
      genre
      recordCompany {
        _id
        name
      }
      releaseDate
      songs {
        _id
        duration
        title
      }
    }
  }
`;

const GET_SONGS_BY_ALBUM_ID = gql`
  query GetSongsByAlbumId($id: String!) {
    getSongsByAlbumId(_id: $id) {
      _id
      duration
      title
      albumId {
        _id
        title
      }
    }
  }
`;

const GET_SONG_BY_ID = gql`
  query GetSongById($id: String!) {
    getSongById(_id: $id) {
      _id
      duration
      title
      albumId {
        _id
        title
      }
    }
  }
`;

const ADD_SONG = gql`
  mutation AddSong($title: String!, $duration: String!, $albumId: String!) {
    addSong(title: $title, duration: $duration, albumId: $albumId) {
      _id
      albumId {
        _id
        title
      }
      duration
      title
    }
  }
`;

const EDIT_SONG = gql`
  mutation EditSong(
    $id: String!
    $title: String
    $duration: String
    $albumId: String
  ) {
    editSong(_id: $id, title: $title, duration: $duration, albumId: $albumId) {
      _id
      albumId {
        _id
        title
      }
      duration
      title
    }
  }
`;

const DELETE_SONG = gql`
  mutation RemoveSong($id: String!) {
    removeSong(_id: $id) {
      _id
      albumId {
        _id
        title
      }
      duration
      title
    }
  }
`;

const GET_ALBUMS_BY_GENRE = gql`
  query AlbumsByGenre($genre: MusicGenre!) {
    albumsByGenre(genre: $genre) {
      _id
      genre
      releaseDate
      title
    }
  }
`;

const GET_COMPANY_BY_FOUNDED_YEAR = gql`
  query CompanyByFoundedYear($min: Int!, $max: Int!) {
    companyByFoundedYear(min: $min, max: $max) {
      _id
      country
      foundedYear
      name
      numOfAlbums
    }
  }
`;

const GET_ARTIST_BY_NAME = gql`
  query SearchArtistByArtistName($searchTerm: String!) {
    searchArtistByArtistName(searchTerm: $searchTerm) {
      _id
      dateFormed
      members
      name
      numOfAlbums
    }
  }
`;

const GET_SONG_BY_TITLE = gql`
  query SearchSongByTitle($searchTitleTerm: String!) {
    searchSongByTitle(searchTitleTerm: $searchTitleTerm) {
      _id
      duration
      title
    }
  }
`;

export default {
  GET_ARTISTS,
  ADD_ARTIST,
  EDIT_ARTIST,
  DELETE_ARTIST,
  GET_ARTIST_BY_ID,
  GET_SONGS_BY_ARTIST_ID,
  GET_COMPANIES,
  EDIT_COMPANY,
  ADD_COMPANY,
  DELETE_COMPANY,
  GET_COMPANY_BY_ID,
  GET_ALBUMS,
  ADD_ALBUM,
  EDIT_ALBUM,
  DELETE_ALBUM,
  GET_ALBUM_BY_ID,
  GET_SONGS_BY_ALBUM_ID,
  GET_SONG_BY_ID,
  ADD_SONG,
  EDIT_SONG,
  DELETE_SONG,
  GET_ALBUMS_BY_GENRE,
  GET_COMPANY_BY_FOUNDED_YEAR,
  GET_ARTIST_BY_NAME,
  GET_SONG_BY_TITLE,
};
