import { GraphQLError } from "graphql";
import { v4 as uuid } from "uuid";
import redis from "redis";
import { ObjectId } from "mongodb";
import {
  strCheck,
  isValidId,
  isValidInt,
  isValidDate,
  validateName,
} from "./helpers.js";
const client = redis.createClient();
client.connect().then(() => {});

import {
  artists as artistCollection,
  albums as albumCollection,
  recordcompanies as recordCompanyCollection,
  songs as songCollection,
} from "./config/mongoCollections.js";

const redisTimeout = 3600;

export const resolvers = {
  Query: {
    artists: async () => {
      let exists = await client.get("allArtists");
      let allArtists;
      if (exists) {
        allArtists = JSON.parse(exists);
        console.log("Data fetched from cache");
        return allArtists;
      }
      const artist = await artistCollection();
      allArtists = await artist.find({}).toArray();
      if (allArtists.length === 0) {
        throw new GraphQLError("No artists found in the database");
      }
      await client.set("allArtists", JSON.stringify(allArtists));
      await client.expire("allArtists", redisTimeout);

      return allArtists;
    },

    albums: async () => {
      let exists = await client.get("allAlbums");
      let allAlbums;
      if (exists) {
        allAlbums = JSON.parse(exists);
        console.log("Data fetched from cache");
        return allAlbums;
      }
      const album = await albumCollection();
      allAlbums = await album.find({}).toArray();
      if (allAlbums.length === 0) {
        throw new GraphQLError("No albums found in the database");
      }
      await client.set("allAlbums", JSON.stringify(allAlbums));
      await client.expire("allAlbums", redisTimeout);

      return allAlbums;
    },

    recordcompanies: async () => {
      let exists = await client.get("allRecordCompanies");
      let allRecordCompanies;
      if (exists) {
        allRecordCompanies = JSON.parse(exists);
        console.log("Data fetched from cache");
        return allRecordCompanies;
      }
      const recordCompany = await recordCompanyCollection();
      allRecordCompanies = await recordCompany.find({}).toArray();
      if (allRecordCompanies.length === 0) {
        throw new GraphQLError("No record companies found in the database");
      }
      await client.set(
        "allRecordCompanies",
        JSON.stringify(allRecordCompanies)
      );
      await client.expire("allRecordCompanies", redisTimeout);

      return allRecordCompanies;
    },

    getArtistById: async (_, args) => {
      let artistId = args._id;
      artistId = strCheck(artistId);
      isValidId(artistId);

      let exists = await client.get(artistId);
      let artist;
      if (exists) {
        artist = JSON.parse(exists);
        return artist;
      } else {
        const artistCol = await artistCollection();
        artist = await artistCol.findOne({ _id: new ObjectId(artistId) });
        if (!artist) {
          throw new GraphQLError("No artist found with that id", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        await client.set(artistId, JSON.stringify(artist));
      }
      return artist;
    },

    getAlbumById: async (_, args) => {
      let albumId = args._id;
      albumId = strCheck(albumId);
      isValidId(albumId);

      let exists = await client.get(albumId);
      let album;
      if (exists) {
        album = JSON.parse(exists);
        return album;
      } else {
        const albumCol = await albumCollection();
        album = await albumCol.findOne({ _id: new ObjectId(albumId) });
        if (!album) {
          throw new GraphQLError("No album found with that id", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        await client.set(albumId, JSON.stringify(album));
      }
      return album;
    },

    getCompanyById: async (_, args) => {
      let companyId = args._id;
      companyId = strCheck(companyId);
      isValidId(companyId);

      let exists = await client.get(companyId);
      let company;
      if (exists) {
        company = JSON.parse(exists);
        return company;
      } else {
        const companyCol = await recordCompanyCollection();
        company = await companyCol.findOne({ _id: new ObjectId(companyId) });
        if (!company) {
          throw new GraphQLError("No record company found with that id", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        await client.set(companyId, JSON.stringify(company));
      }
      return company;
    },
    getSongsByArtistId: async (_, args) => {
      let artistId = args.artistId;
      artistId = isValidId(artistId);

      let exists = await client.get("songs:" + artistId);
      let songs = [];
      if (exists) {
        songs = JSON.parse(exists);
      } else {
        let albums = await albumCollection();
        let albumList = await albums
          .find({ artistId: new ObjectId(artistId) })
          .toArray();
        if (!albumList || albumList.length === 0) {
          throw new GraphQLError("No albums found for this artist", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let songCol = await songCollection();
        for (let album of albumList) {
          let songList = album.songs;
          songs = songs.concat(songList);
        }
        if (songs.length === 0) {
          throw new GraphQLError("No songs found for this artist", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        let songsObj = [];
        for (let songId of songs) {
          let song = await songCol.findOne({ _id: songId });
          songsObj.push(song);
        }
        songs = songsObj;
        await client.set("songs:" + artistId, JSON.stringify(songs));
        await client.expire("songs:" + artistId, redisTimeout);
      }
      return songs;
    },

    albumsByGenre: async (_, args) => {
      let genre = args.genre;
      genre = strCheck(genre);
      genre = genre.toUpperCase();
      let exists = await client.get(genre);
      let genreAlbums;
      if (exists) {
        genreAlbums = JSON.parse(exists);
      } else {
        let albums = await albumCollection();
        genreAlbums = await albums
          .find({ genre: genre.toUpperCase() })
          .toArray();
        if (!genreAlbums || genreAlbums.length === 0) {
          throw new GraphQLError("No albums found for this genre", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        await client.set(genre, JSON.stringify(genreAlbums));
        await client.expire(genre, redisTimeout);
      }
      return genreAlbums;
    },

    companyByFoundedYear: async (_, args) => {
      let min = args.min;
      let max = args.max;

      isValidInt(min, "min");
      isValidInt(max, "max");
      if (min < 1900) {
        throw new GraphQLError("min must be >= 1900", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if (max <= min || max >= 2025) {
        throw new GraphQLError(
          "max must be an integer value greater than min and before 2025",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }

      let companyList = [];
      let exists = await client.get(min + ":" + max);
      if (exists) {
        companyList = JSON.parse(exists);
      } else {
        let companies = await recordCompanyCollection();
        companyList = await companies
          .find({ foundedYear: { $gte: min, $lte: max } })
          .toArray();
        if (!companyList || companyList.length === 0) {
          throw new GraphQLError("No companies found for this range of years", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        await client.set(min + ":" + max, JSON.stringify(companyList));
        await client.expire(min + ":" + max, redisTimeout);
      }
      return companyList;
    },
    searchArtistByArtistName: async (_, args) => {
      let searchTerm = args.searchTerm;
      searchTerm = strCheck(searchTerm).toLowerCase();

      let exists = await client.get(searchTerm);
      let artistList;

      if (exists) {
        artistList = JSON.parse(exists);
      } else {
        let artists = await artistCollection();
        artistList = await artists
          .find({ name: { $regex: searchTerm, $options: "i" } })
          .toArray();
        if (!artistList || artistList.length === 0) {
          throw new GraphQLError("No artists found with that name", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        await client.set(searchTerm, JSON.stringify(artistList));
        await client.expire(searchTerm, redisTimeout);
      }
      return artistList;
    },

    getSongById: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let exists = await client.get(id);
      let song;
      if (exists) {
        song = JSON.parse(exists);
      } else {
        let songs = await songCollection();
        song = await songs.findOne({ _id: new ObjectId(id) });
        if (!song) {
          throw new GraphQLError("No song found with that id", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        await client.set(id, JSON.stringify(song));
      }
      return song;
    },

    getSongsByAlbumId: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let exists = await client.get("songs:" + id);
      let songs;
      var songL = [];
      if (exists) {
        songL = JSON.parse(exists);
      } else {
        let albums = await albumCollection();
        let album = await albums.findOne({ _id: new ObjectId(id) });
        if (!album) {
          throw new GraphQLError("No album found with that id", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        songs = album.songs;
        let allSongs = await songCollection();
        for (let songId of songs) {
          let song = await allSongs.findOne({ _id: songId });
          songL.push(song);
        }
        if (songL.length === 0) {
          throw new GraphQLError("No songs found for this album", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await client.set("songs:" + id, JSON.stringify(songL));
      }
      return songL;
    },

    searchSongByTitle: async (_, args) => {
      let title = args.searchTitleTerm;
      title = strCheck(title).toLowerCase();
      let exists = await client.get("songsTitle:" + title);
      let songList;
      if (exists) {
        songList = JSON.parse(exists);
      } else {
        let songs = await songCollection();
        songList = await songs
          .find({ title: { $regex: title, $options: "i" } })
          .toArray();
        if (!songList || songList.length === 0) {
          throw new GraphQLError("No songs found with that title", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        await client.set("songsTitle:" + title, JSON.stringify(songList));
        await client.expire("songsTitle:" + title, redisTimeout);
      }
      return songList;
    },
  },

  Album: {
    artist: async (parentValue) => {
      const artists = await artistCollection();
      let artist = await artists.findOne({
        _id: new ObjectId(parentValue.artistId),
      });
      if (!artist) {
        artist = [];
      }
      return artist;
    },
    recordCompany: async (parentValue) => {
      const companies = await recordCompanyCollection();
      let company = await companies.findOne({
        _id: new ObjectId(parentValue.recordCompanyId),
      });
      if (!company) {
        company = [];
      }
      return company;
    },
    songs: async (parentValue) => {
      const songs = await songCollection();
      let songList = await songs
        .find({ albumId: new ObjectId(parentValue._id) })
        .toArray();
      if (!songList) {
        songList = [];
      }
      return songList;
    },
  },
  Artist: {
    albums: async (parentValue) => {
      const albums = await albumCollection();
      let artistAlbums = await albums
        .find({ artistId: new ObjectId(parentValue._id) })
        .toArray();
      if (!artistAlbums) {
        artistAlbums = [];
      }
      return artistAlbums;
    },
    numOfAlbums: async (parentValue) => {
      const albums = await albumCollection();
      let countAlbums = await albums.count({
        artistId: new ObjectId(parentValue._id),
      });
      return countAlbums;
    },
  },
  RecordCompany: {
    albums: async (parentValue) => {
      const albums = await albumCollection();
      let companyAlbums = await albums
        .find({ recordCompanyId: new ObjectId(parentValue._id) })
        .toArray();
      if (!companyAlbums) {
        companyAlbums = [];
      }
      return companyAlbums;
    },
    numOfAlbums: async (parentValue) => {
      const albums = await albumCollection();
      let countAlbums = await albums.count({
        recordCompanyId: new ObjectId(parentValue._id),
      });
      return countAlbums;
    },
  },
  Song: {
    albumId: async (parentValue) => {
      const albums = await albumCollection();
      let album = await albums.findOne({
        _id: new ObjectId(parentValue.albumId),
      });
      if (!album) {
        throw new GraphQLError("No album found for this song", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return album;
    },
  },

  Mutation: {
    addArtist: async (_, args) => {
      let name = args.name;
      let dateFormed = args.date_formed;
      let members = args.members;
      name = strCheck(name, "name");
      dateFormed = isValidDate(dateFormed, "date_formed");
      if (!members || members.length === 0) {
        throw new GraphQLError("You must provide at least one member", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      members = members.map((member) => validateName(member, "member"));

      let newArtist = {
        name: name,
        dateFormed: dateFormed,
        members: members,
        albums: [],
      };
      const artist = await artistCollection();
      const insertInfo = await artist.insertOne(newArtist);
      if (insertInfo.insertedCount === 0) {
        throw new GraphQLError("Could not add artist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }

      let newId = insertInfo.insertedId;
      newId = newId.toString();
      newArtist._id = newId;
      await client.set(newId, JSON.stringify(newArtist));

      if (await client.exists("allArtists")) {
        await client.del("allArtists");
      }

      return newArtist;
    },

    editArtist: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let artist = await artistCollection();
      let artistInfo = await artist.findOne({ _id: new ObjectId(id) });
      if (!artistInfo) {
        throw new GraphQLError("No artist found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let name = args.name;
      let dateFormed = args.date_formed;
      let members = args.members;

      if (!name && !dateFormed && !members) {
        throw new GraphQLError(
          "You must provide at least one field to update",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      let updatedArtist = {};
      if (name) {
        name = strCheck(name, "name");
        updatedArtist.name = name;
      }
      if (dateFormed) {
        dateFormed = isValidDate(dateFormed, "date_formed");
        updatedArtist.dateFormed = dateFormed;
      }
      if (members) {
        if (members.length === 0) {
          throw new GraphQLError("You must provide at least one member", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        members = members.map((member) => validateName(member, "member"));
        updatedArtist.members = members;
      }
      let updatedInfo = await artist.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedArtist }
      );
      if (updatedInfo.modifiedCount === 0) {
        throw new GraphQLError("Could not update artist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      updatedInfo = await artist.findOne({ _id: new ObjectId(id) });
      await client.set(id, JSON.stringify(updatedInfo));
      if (await client.exists("allArtists")) {
        await client.del("allArtists");
      }
      return updatedInfo;
    },

    removeArtist: async (_, args) => {
      let id = args._id;
      id = isValidId(id);

      let artist = await artistCollection();

      let removedArtist = await artist.findOne({ _id: new ObjectId(id) });
      if (!removedArtist) {
        throw new GraphQLError("No artist found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      let albums = await albumCollection();
      let removedAlbumsList = removedArtist.albums;
      for (let i in removedAlbumsList) {
        let album = await albums.findOne({
          _id: new ObjectId(removedAlbumsList[i]),
        });
        if (album) {
          let recordCompanyCol = await recordCompanyCollection();
          let recordComp = await recordCompanyCol.findOneAndUpdate(
            { _id: new ObjectId(album.recordCompanyId) },
            { $pull: { albums: album._id } },
            { returnDocument: "after" }
          );
          await albums.deleteOne({ _id: new ObjectId(removedAlbumsList[i]) });
          await client.del(removedAlbumsList[i].toString());
          await client.del("allAlbums");
          await client.del(recordComp._id.toString());
          await client.del("allRecordCompanies");
        }
      }
      let deletedInfo = await artist.deleteOne({ _id: new ObjectId(id) });
      if (deletedInfo.deletedCount === 0) {
        throw new GraphQLError("Could not delete artist", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      await client.del(id);
      await client.del("allArtists");
      return removedArtist;
    },

    addCompany: async (_, args) => {
      let name = args.name;
      let founded_year = args.founded_year;
      let country = args.country;
      name = validateName(name, "name");
      isValidInt(founded_year, "founded_year");
      if (founded_year < 1900 || founded_year >= 2025) {
        throw new GraphQLError(
          "founded_year must be an integer value greater than 1900 and before 2025",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      country = strCheck(country, "country");
      let newCompany = {
        name: name,
        foundedYear: founded_year,
        country: country,
        albums: [],
      };
      const company = await recordCompanyCollection();
      const insertInfo = await company.insertOne(newCompany);
      if (insertInfo.insertedCount === 0) {
        throw new GraphQLError("Could not add record company", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      let newId = insertInfo.insertedId;
      let insertedCompany = await company.findOne({ _id: new ObjectId(newId) });
      await client.set(
        insertedCompany._id.toString(),
        JSON.stringify(insertedCompany)
      );
      if (await client.exists("allRecordCompanies")) {
        await client.del("allRecordCompanies");
      }
      return insertedCompany;
    },

    editCompany: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let company = await recordCompanyCollection();
      let companyInfo = await company.findOne({ _id: new ObjectId(id) });
      if (!companyInfo) {
        throw new GraphQLError("No record company found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let name = args.name;
      let founded_year = args.founded_year;
      let country = args.country;
      if (!name && !founded_year && !country) {
        throw new GraphQLError(
          "You must provide at least one field to update",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      let updatedCompany = {};
      if (name) {
        name = validateName(name, "name");
        updatedCompany.name = name;
      }
      if (founded_year) {
        isValidInt(founded_year, "founded_year");
        if (founded_year < 1900 || founded_year >= 2025) {
          throw new GraphQLError(
            "founded_year must be an integer value greater than 1900 and before 2025",
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }
        updatedCompany.foundedYear = founded_year;
      }
      if (country) {
        country = strCheck(country, "country");
        updatedCompany.country = country;
      }
      let updatedInfo = await company.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCompany }
      );
      if (updatedInfo.modifiedCount === 0) {
        throw new GraphQLError("Could not update record company", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      updatedInfo = await company.findOne({ _id: new ObjectId(id) });
      await client.set(id, JSON.stringify(updatedInfo));
      if (await client.exists("allRecordCompanies")) {
        await client.del("allRecordCompanies");
      }
      return updatedInfo;
    },
    removeCompany: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let company = await recordCompanyCollection();
      let removedCompany = await company.findOne({ _id: new ObjectId(id) });
      if (!removedCompany) {
        throw new GraphQLError("No record company found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let albums = await albumCollection();
      let removedAlbumsList = removedCompany.albums;
      for (let i in removedAlbumsList) {
        let album = await albums.findOne({
          _id: new ObjectId(removedAlbumsList[i]),
        });
        if (album) {
          let artistCol = await artistCollection();
          let artist = await artistCol.findOneAndUpdate(
            { _id: new ObjectId(album.artistId) },
            { $pull: { albums: album._id } },
            { returnDocument: "after" }
          );

          let songsList = album.songs;
          for (let songId of songsList) {
            let song = await songCollection();
            await song.deleteOne({ _id: songId });
            await client.del(songId.toString());
          }

          await albums.deleteOne({ _id: new ObjectId(removedAlbumsList[i]) });
          await client.del(removedAlbumsList[i].toString());
          await client.del("allAlbums");
          if (await client.exists(artist._id.toString())) {
            await client.set(artist._id.toString(), JSON.stringify(artist));
          }
          if (await client.exists("allArtists")) {
            await client.del("allArtists");
          }
        }
      }
      let deletedInfo = await company.deleteOne({ _id: new ObjectId(id) });
      if (deletedInfo.deletedCount === 0) {
        throw new GraphQLError("Could not delete record company", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      await client.del(id);
      await client.del("allRecordCompanies");

      return removedCompany;
    },

    addAlbum: async (_, args) => {
      let title = args.title;
      title = strCheck(title, "title");
      let releaseDate = args.releaseDate;
      releaseDate = isValidDate(releaseDate, "releaseDate");
      let genre = args.genre;
      genre = strCheck(genre, "genre");
      const MusicGenre = {
        POP: "POP",
        ROCK: "ROCK",
        HIP_HOP: "HIP_HOP",
        COUNTRY: "COUNTRY",
        JAZZ: "JAZZ",
        CLASSICAL: "CLASSICAL",
        ELECTRONIC: "ELECTRONIC",
        R_AND_B: "R_AND_B",
        INDIE: "INDIE",
        ALTERNATIVE: "ALTERNATIVE",
      };

      if (!Object.values(MusicGenre).includes(genre.toUpperCase())) {
        throw new GraphQLError("Invalid genre provided", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      genre = genre.toUpperCase();
      let artistId = args.artistId;
      artistId = isValidId(artistId);
      const artistCol = await artistCollection();
      let artist = await artistCol.findOne({
        _id: new ObjectId(artistId),
      });
      if (!artist) {
        throw new GraphQLError("No artist found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let companyId = args.companyId;
      companyId = isValidId(companyId);
      let companyCollection = await recordCompanyCollection();
      let company = await companyCollection.findOne({
        _id: new ObjectId(companyId),
      });
      if (!company) {
        throw new GraphQLError("No record company found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let newAlbum = {
        title: title,
        releaseDate: releaseDate,
        genre: genre,
        artistId: new ObjectId(artistId),
        recordCompanyId: new ObjectId(companyId),
        songs: [],
      };
      let album = await albumCollection();
      let insertInfo = await album.insertOne(newAlbum);
      if (insertInfo.insertedCount === 0) {
        throw new GraphQLError("Could not add album", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      let newId = insertInfo.insertedId;
      let insertedAlbum = await album.findOne({ _id: new ObjectId(newId) });
      let artistUpdate = await artistCol.findOneAndUpdate(
        { _id: new ObjectId(artistId) },
        { $push: { albums: insertedAlbum._id } },
        { returnDocument: "after" }
      );
      if (await client.exists(artistId)) {
        await client.set(artistId, JSON.stringify(artistUpdate));
        await client.del("allArtists");
      }
      let companyUpdate = await companyCollection.findOneAndUpdate(
        { _id: new ObjectId(companyId) },
        { $push: { albums: insertedAlbum._id } },
        { returnDocument: "after" }
      );
      await client.set(companyId, JSON.stringify(companyUpdate));
      await client.del("allRecordCompanies");
      await client.del("allAlbums");
      return insertedAlbum;
    },

    editAlbum: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let albumCol = await albumCollection();
      let album = await albumCol.findOne({ _id: new ObjectId(id) });
      if (!album) {
        throw new GraphQLError("No album found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      let title = args.title;
      let releaseDate = args.releaseDate;
      let genre = args.genre;
      let artistId = args.artistId;
      let companyId = args.companyId;
      if (!title && !releaseDate && !genre && !artistId && !companyId) {
        throw new GraphQLError(
          "You must provide at least one field to update",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      let updatedAlbum = {};
      if (title) {
        title = strCheck(title, "title");
        updatedAlbum.title = title;
      }
      if (releaseDate) {
        releaseDate = isValidDate(releaseDate, "releaseDate");
        updatedAlbum.releaseDate = releaseDate;
      }
      if (genre) {
        const MusicGenre = {
          POP: "POP",
          ROCK: "ROCK",
          HIP_HOP: "HIP_HOP",
          COUNTRY: "COUNTRY",
          JAZZ: "JAZZ",
          CLASSICAL: "CLASSICAL",
          ELECTRONIC: "ELECTRONIC",
          R_AND_B: "R_AND_B",
          INDIE: "INDIE",
          ALTERNATIVE: "ALTERNATIVE",
        };
        if (!Object.values(MusicGenre).includes(genre.toUpperCase())) {
          throw new GraphQLError("Invalid genre provided", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        updatedAlbum.genre = genre.toUpperCase();
      }
      if (artistId) {
        artistId = isValidId(artistId);
        let artistCol = await artistCollection();
        let artist = await artistCol.findOne({ _id: new ObjectId(artistId) });
        if (!artist) {
          throw new GraphQLError("No artist found with that id", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let oldArtist = await artistCol.findOneAndUpdate(
          { albums: new ObjectId(id) },
          { $pull: { albums: new ObjectId(id) } },
          { returnDocument: "after" }
        );
        let newArtist = await artistCol.findOneAndUpdate(
          { _id: new ObjectId(artistId) },
          { $push: { albums: new ObjectId(id) } },
          { returnDocument: "after" }
        );
        if (await client.exists(oldArtist._id.toString())) {
          await client.set(oldArtist._id.toString(), JSON.stringify(oldArtist));
        }
        if (await client.exists(newArtist._id.toString())) {
          await client.set(newArtist._id.toString(), JSON.stringify(newArtist));
        }
        await client.del("allArtists");
        updatedAlbum.artistId = new ObjectId(artistId);
      }
      if (companyId) {
        companyId = isValidId(companyId);
        let companyCol = await recordCompanyCollection();
        let company = await companyCol.findOne({
          _id: new ObjectId(companyId),
        });
        if (!company) {
          throw new GraphQLError("No record company found with that id", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let oldCompany = await companyCol.findOneAndUpdate(
          { albums: new ObjectId(id) },
          { $pull: { albums: new ObjectId(id) } },
          { returnDocument: "after" }
        );
        let newCompany = await companyCol.findOneAndUpdate(
          { _id: new ObjectId(companyId) },
          { $push: { albums: new ObjectId(id) } },
          { returnDocument: "after" }
        );
        if (await client.exists(oldCompany._id.toString())) {
          await client.set(
            oldCompany._id.toString(),
            JSON.stringify(oldCompany)
          );
        }
        if (await client.exists(newCompany._id.toString())) {
          await client.set(
            newCompany._id.toString(),
            JSON.stringify(newCompany)
          );
        }
        await client.del("allRecordCompanies");
        updatedAlbum.recordCompanyId = new ObjectId(companyId);
      }
      let updatedInfo = await albumCol.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedAlbum },
        { returnDocument: "after" }
      );
      await client.set(id, JSON.stringify(updatedInfo));
      if (await client.exists("allAlbums")) {
        await client.del("allAlbums");
      }
      return updatedInfo;
    },

    removeAlbum: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let albumCol = await albumCollection();
      let album = await albumCol.findOne({ _id: new ObjectId(id) });
      if (!album) {
        throw new GraphQLError("No album found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let artistCol = await artistCollection();
      let artist = await artistCol.findOneAndUpdate(
        { _id: album.artistId },
        {
          $pull: { albums: new ObjectId(id) },
        }
      );
      if (await client.exists(artist._id.toString())) {
        await client.set(artist._id.toString(), JSON.stringify(artist));
        await client.del("allArtists");
      }
      let companyCol = await recordCompanyCollection();
      let company = await companyCol.findOneAndUpdate(
        { _id: album.recordCompanyId },
        { $pull: { albums: new ObjectId(id) } }
      );
      if (await client.exists(company._id.toString())) {
        await client.set(company._id.toString(), JSON.stringify(company));
        await client.del("allRecordCompanies");
      }

      let songCol = await songCollection();
      let songs = album.songs;
      for (let i in songs) {
        await songCol.deleteOne({ _id: new ObjectId(songs[i]) });
        if (await client.exists(songs[i].toString())) {
          await client.del(songs[i].toString());
        }
      }

      let deletedAlbum = await albumCol.deleteOne({ _id: new ObjectId(id) });
      if (deletedAlbum.deletedCount === 0) {
        throw new GraphQLError("Could not delete album", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      if (await client.exists(id)) {
        await client.del(id);
        await client.del("allAlbums");
      }
      return album;
    },

    addSong: async (_, args) => {
      let title = args.title;
      title = validateName(title, "title");
      let duration = args.duration;
      duration = strCheck(duration, "duration");
      const durationPattern = /^[0-5][0-9]:[0-5][0-9]$/;
      if (!durationPattern.test(duration)) {
        throw new GraphQLError(
          "Invalid duration format. It should be in MM:SS format",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      let albumId = args.albumId;
      albumId = isValidId(albumId);
      let albumCol = await albumCollection();
      let album = await albumCol.findOne({ _id: new ObjectId(albumId) });
      if (!album) {
        throw new GraphQLError("No album found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let newSong = {
        title: title,
        duration: duration,
        albumId: new ObjectId(albumId),
      };
      let songCol = await songCollection();
      let insertInfo = await songCol.insertOne(newSong);
      if (insertInfo.insertedCount === 0) {
        throw new GraphQLError("Could not add song", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      let newId = insertInfo.insertedId;
      let insertedSong = await songCol.findOne({ _id: new ObjectId(newId) });
      let updatedAlbum = await albumCol.findOneAndUpdate(
        { _id: new ObjectId(albumId) },
        { $push: { songs: insertedSong._id } },
        { returnDocument: "after" }
      );
      await client.set(
        insertedSong._id.toString(),
        JSON.stringify(insertedSong)
      );
      await client.set(albumId, JSON.stringify(updatedAlbum));
      await client.del("allAlbums");

      return insertedSong;
    },

    editSong: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let songCol = await songCollection();
      let song = await songCol.findOne({ _id: new ObjectId(id) });
      if (!song) {
        throw new GraphQLError("No song found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let title = args.title;
      let duration = args.duration;
      let albumId = args.albumId;
      if (!title && !duration && !albumId) {
        throw new GraphQLError(
          "You must provide at least one field to update",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      let updatedSong = {};
      if (title) {
        title = validateName(title, "title");
        updatedSong.title = title;
      }
      if (duration) {
        duration = strCheck(duration, "duration");
        const durationPattern = /^[0-5][0-9]:[0-5][0-9]$/;
        if (!durationPattern.test(duration)) {
          throw new GraphQLError(
            "Invalid duration format. It should be in MM:SS format",
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }
        updatedSong.duration = duration;
      }
      if (albumId) {
        albumId = isValidId(albumId);
        let albumCol = await albumCollection();
        let album = await albumCol.findOne({ _id: new ObjectId(albumId) });
        if (!album) {
          throw new GraphQLError("No album found with that id", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        updatedSong.albumId = new ObjectId(albumId);
        let oldAlbum = await albumCol.findOneAndUpdate(
          { songs: new ObjectId(id) },
          { $pull: { songs: new ObjectId(id) } },
          { returnDocument: "after" }
        );
        let newAlbum = await albumCol.findOneAndUpdate(
          { _id: new ObjectId(albumId) },
          { $push: { songs: new ObjectId(id) } },
          { returnDocument: "after" }
        );
        await client.set(albumId, JSON.stringify(newAlbum));
        await client.set(oldAlbum._id.toString(), JSON.stringify(oldAlbum));
        await client.del("allAlbums");
      }
      let updatedInfo = await songCol.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedSong },
        { returnDocument: "after" }
      );
      await client.set(id, JSON.stringify(updatedInfo));
      return updatedInfo;
    },

    removeSong: async (_, args) => {
      let id = args._id;
      id = isValidId(id);
      let songCol = await songCollection();
      let song = await songCol.findOne({ _id: new ObjectId(id) });
      if (!song) {
        throw new GraphQLError("No song found with that id", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      let albumCol = await albumCollection();
      let album = await albumCol.findOneAndUpdate(
        { _id: song.albumId },
        { $pull: { songs: new ObjectId(id) } },
        { returnDocument: "after" }
      );
      await songCol.deleteOne({ _id: new ObjectId(id) });
      if (await client.exists(id)) {
        await client.del(id);
      }
      await client.set(album._id.toString(), JSON.stringify(album));
      await client.del("allAlbums");
      return song;
    },
  },
};
