import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { delay } from './utils.mock';

import {
  GET_NAME_URL,
  LOGIN_URL,
  SET_NAME_URL,
  GET_USER_LIST_URL,
} from '@/api/home';

export default [
  http.get(GET_USER_LIST_URL, async () => {
    await delay(3000);

    return HttpResponse.json(
      faker.helpers.multiple(
        () => ({
          userId: faker.string.uuid(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          password: faker.internet.password(),
          birthdate: faker.date.birthdate(),
          registeredAt: faker.date.past(),
        }),
        {
          count: 5,
        },
      ),
    );
  }),

  http.get(GET_NAME_URL, async () => {
    await delay(1000);

    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),

  http.post(LOGIN_URL, async () => {
    await delay(300);

    return HttpResponse.json(
      {
        message: 'Mocked response',
      },
      {
        status: 202,
        statusText: 'Mocked status',
      },
    );
  }),

  http.post(SET_NAME_URL, async () => {
    await delay(500);

    return HttpResponse.json([
      {
        id: 'f8dd058f-9006-4174-8d49-e3086bc39c21',
        title: `Avoid Nesting When You're Testing`,
      },
      {
        id: '8ac96078-6434-4959-80ed-cc834e7fef61',
        title: `How I Built A Modern Website In 2021`,
      },
    ]);
  }),
];
