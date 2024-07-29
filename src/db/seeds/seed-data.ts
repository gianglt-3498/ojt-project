import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/models/user.entity';
import { Artist } from 'src/models/artist.entity';
import { Playlist } from 'src/models/playlist.entity';

export const seedData = async (
  manager: EntityManager,
  numUsers = 100,
  numArtists = 50,
  numPlaylists = 50,
): Promise<void> => {
  await seedUsers(numUsers);
  await seedArtists(numArtists);
  await seedPlayLists(numPlaylists);

  async function createUser() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('123456', salt);
    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuid4();
    return user;
  }

  async function seedUsers(num: number) {
    const users = [];
    for (let i = 0; i < num; i++) {
      const user = await createUser();
      users.push(user);
    }
    await manager.getRepository(User).save(users);
  }

  async function seedArtists(num: number) {
    const artists = [];
    for (let i = 0; i < num; i++) {
      const user = await createUser();
      const artist = new Artist();
      artist.user = user;
      artists.push(artist);
      await manager.getRepository(User).save(user); // Save user before assigning to artist
    }
    await manager.getRepository(Artist).save(artists);
  }

  async function seedPlayLists(num: number) {
    const playlists = [];
    for (let i = 0; i < num; i++) {
      const user = await createUser();
      const playList = new Playlist();
      playList.name = faker.music.genre();
      playList.user = user;
      playlists.push(playList);
      await manager.getRepository(User).save(user); // Save user before assigning to playlist
    }
    await manager.getRepository(Playlist).save(playlists);
  }
};
