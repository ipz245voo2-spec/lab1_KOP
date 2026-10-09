import axios from 'axios';

export class LaunchApiService {
  constructor(baseURL = 'https://ll.thespacedevs.com/2.2.0') {
    this.client = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
      },
      timeout: 10000,
    });
  }

  async getUpcomingLaunches({
    limit = 25,
    signal,
    simulateError = false,
    simulateEmpty = false,
  } = {}) {
    if (simulateError) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      throw new Error(
        'Змодельована помилка запиту до API: з’єднання перервано або статус 503 Service Unavailable',
      );
    }

    if (simulateEmpty) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    try {
      const response = await this.client.get('/launch/upcoming/', {
        params: { limit },
        signal,
      });

      const data = response.data;
      if (!data || !Array.isArray(data.results)) {
        throw new Error('Отримано неочікуваний формат відповіді від API');
      }

      return data.results;
    } catch (error) {
      if (
        axios.isCancel(error) ||
        error.name === 'CanceledError' ||
        error.name === 'AbortError'
      ) {
        throw error;
      }

      if (error.response) {
        const { status, statusText } = error.response;
        if (status === 429) {
          throw new Error(
            'Перевищено безкоштовний ліміт запитів API (15 запитів/год). Зачекайте декілька хвилин або перемкніться на резервні дані.',
            { cause: error },
          );
        }
        if (status >= 500) {
          throw new Error(
            `Сервер Space Devs тимчасово недоступний (HTTP ${status}). Спробуйте пізніше.`,
            { cause: error },
          );
        }
        throw new Error(
          `Помилка завантаження даних із сервера: HTTP ${status} (${statusText || 'Error'})`,
          { cause: error },
        );
      } else if (error.request) {
        throw new Error(
          'Не вдалося встановити з’єднання із сервером API. Перевірте інтернет-з’єднання.',
          { cause: error },
        );
      }

      throw error;
    }
  }

  async getLaunchById(id, { signal } = {}) {
    try {
      const response = await this.client.get(`/launch/${id}/`, { signal });
      return response.data;
    } catch (error) {
      if (
        axios.isCancel(error) ||
        error.name === 'CanceledError' ||
        error.name === 'AbortError'
      ) {
        throw error;
      }
      throw new Error(
        `Не вдалося отримати місію: ${error.response?.statusText || error.message}`,
        { cause: error },
      );
    }
  }
}

export const launchApiService = new LaunchApiService();

export const fetchUpcomingLaunches = (options) =>
  launchApiService.getUpcomingLaunches(options);

export const FALLBACK_LAUNCHES = [
  {
    id: 'll2-fallback-01',
    name: 'Long March 12 | Unknown Payload',
    net: '2026-10-14T19:25:00Z',
    orbital_launch_attempt_count_year: 238,
    status: {
      id: 1,
      name: 'Go for Launch',
      abbrev: 'Go',
      description: 'Час T-0 офіційно підтверджено джерелами.',
    },
    launch_service_provider: {
      id: 88,
      name: 'China Aerospace Science and Technology Corporation',
      type: 'Government',
    },
    rocket: {
      configuration: {
        name: 'Long March 12',
        family: 'Long March',
      },
    },
    mission: {
      name: 'Власне корисне навантаження',
      description:
        'Місія з виведення нового космічного апарату на задану орбіту комерційним космодромом Веньчан.',
      orbit: { name: 'Низька навколоземна' },
    },
    pad: {
      name: 'Commercial LC-2',
      location: {
        name: 'Wenchang Space Launch Site, People\'s Republic of China',
      },
    },
    image: null,
  },
  {
    id: 'll2-fallback-02',
    name: 'Falcon 9 Block 5 | SDA Tranche 1 Transport Layer A',
    net: '2026-10-18T14:00:00Z',
    orbital_launch_attempt_count_year: 239,
    status: {
      id: 1,
      name: 'Go for Launch',
      abbrev: 'Go',
      description: 'Передстартова підготовка триває у штатному режимі.',
    },
    launch_service_provider: {
      id: 121,
      name: 'SpaceX',
      type: 'Commercial',
    },
    rocket: {
      configuration: {
        name: 'Falcon 9',
        family: 'Falcon',
      },
    },
    mission: {
      name: 'SDA Tranche 1 Transport Layer A',
      description:
        'Угруповання супутників зв’язку нового покоління на низькій навколоземній орбіті.',
      orbit: { name: 'Полярна орбіта' },
    },
    pad: {
      name: 'Space Launch Complex 4E',
      location: {
        name: 'Vandenberg SFB, CA, USA',
      },
    },
    image: null,
  },
  {
    id: 'll2-fallback-03',
    name: 'Falcon 9 Block 5 | Starlink Group 15-25',
    net: '2026-10-21T08:30:00Z',
    orbital_launch_attempt_count_year: 240,
    status: {
      id: 1,
      name: 'Go for Launch',
      abbrev: 'Go',
      description: 'Готовий до старту.',
    },
    launch_service_provider: {
      id: 121,
      name: 'SpaceX',
      type: 'Commercial',
    },
    rocket: {
      configuration: {
        name: 'Falcon 9',
        family: 'Falcon',
      },
    },
    mission: {
      name: 'Starlink Group 15-25',
      description:
        'Виведення чергової партії супутників глобального широкосмугового інтернету Starlink.',
      orbit: { name: 'Низька навколоземна' },
    },
    pad: {
      name: 'Space Launch Complex 40',
      location: {
        name: 'Cape Canaveral SFS, FL, USA',
      },
    },
    image: null,
  },
  {
    id: 'll2-fallback-04',
    name: 'Electron | Five-Star Mission',
    net: '2026-10-25T11:15:00Z',
    orbital_launch_attempt_count_year: 241,
    status: {
      id: 2,
      name: 'To Be Confirmed',
      abbrev: 'TBC',
      description: 'Очікує фінального підтвердження вікна запуску.',
    },
    launch_service_provider: {
      id: 147,
      name: 'Rocket Lab',
      type: 'Commercial',
    },
    rocket: {
      configuration: {
        name: 'Electron',
        family: 'Electron',
      },
    },
    mission: {
      name: 'Five-Star Mission',
      description:
        'Комерційна місія з виведення малих супутників на навколоземну орбіту.',
      orbit: { name: 'Сонячно-синхронна' },
    },
    pad: {
      name: 'Launch Complex 1A',
      location: {
        name: 'Mahia Peninsula, New Zealand',
      },
    },
    image: null,
  },
  {
    id: 'll2-fallback-05',
    name: 'Ariane 62 | EarthCARE Mission',
    net: '2026-10-29T16:45:00Z',
    orbital_launch_attempt_count_year: 242,
    status: {
      id: 2,
      name: 'To Be Confirmed',
      abbrev: 'TBC',
      description: 'Очікує фінального вікна запуску.',
    },
    launch_service_provider: {
      id: 115,
      name: 'Arianespace',
      type: 'Commercial',
    },
    rocket: {
      configuration: {
        name: 'Ariane 6',
        family: 'Ariane',
      },
    },
    mission: {
      name: 'EarthCARE Mission',
      description:
        'Європейський науковий супутник вивчення хмар, аерозолів та радіаційного балансу Землі.',
      orbit: { name: 'Сонячно-синхронна' },
    },
    pad: {
      name: 'ELA-4',
      location: {
        name: 'Guiana Space Centre, French Guiana',
      },
    },
    image: null,
  },
];
