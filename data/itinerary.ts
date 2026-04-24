export type ActivityType =
  | 'transport'
  | 'sightseeing'
  | 'meal'
  | 'accommodation'
  | 'entertainment'
  | 'free'

export interface MealAlternative {
  id: string
  name: string
  address?: string
  note?: string
  lat?: number
  lng?: number
}

export interface Activity {
  id: string
  time?: string
  title: string
  description?: string
  highlight?: string
  note?: string
  type: ActivityType
  address?: string
  lat?: number
  lng?: number
  alternatives?: MealAlternative[]
  isTBD?: boolean
}

export interface Accommodation {
  id: string
  name: string
  type: 'hotel' | 'rental' | 'ryokan'
  checkIn: string
  checkOut: string
  nights: number
  address: string
  bookingUrl?: string
  notes?: string
  isTBD?: boolean
}

export interface Day {
  id: string
  dayNumber: number
  date: string
  dayLabel: string
  title: string
  leg: 'golden-week' | 'hokkaido'
  travelers: string
  activities: Activity[]
  ideas?: string[]
  summary?: string
}

export interface Leg {
  id: 'golden-week' | 'hokkaido'
  title: string
  subtitle: string
  dateRange: string
  travelers: string
  days: Day[]
  accommodations: Accommodation[]
}

const goldenWeekDays: Day[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    date: '2026-05-01',
    dayLabel: 'Friday, May 1',
    title: 'Arrival & Wagyu Welcome',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "Your Japan adventure begins with a smooth arrival into Haneda and a short monorail ride to Shinagawa. Tonight kicks off with a memorable wagyu feast at one of Tokyo's finest grilled meat restaurants — the perfect first dinner in Japan.",
    activities: [
      {
        id: 'd1-a1',
        time: '4:15 PM',
        type: 'transport',
        title: 'Arrive at Haneda Airport (HND)',
        description:
          'Terminal 3 for international arrivals. Clear customs, collect luggage, meet at the arrivals gate.',
      },
      {
        id: 'd1-a2',
        time: '4:45 PM',
        type: 'transport',
        title: 'Tokyo Monorail → Tennozu Isle Station',
        description:
          'Take the Tokyo Monorail from Haneda Airport Terminal 3 Station toward Hamamatsucho. Exit at Tennozu Isle (20 mins, ~¥500). The hotel area is a short walk from the station.',
        lat: 35.6284,
        lng: 139.7387,
      },
      {
        id: 'd1-a3',
        time: '5:15 PM',
        type: 'accommodation',
        title: 'Check into hotel — sync up with the group',
        address: 'Shinagawa area, Tokyo, Japan',
        description:
          'Drop bags, freshen up, and gather everyone together before heading to dinner.',
        lat: 35.6284,
        lng: 139.7387,
      },
      {
        id: 'd1-a4',
        time: '6:30 PM',
        type: 'transport',
        title: 'Bus to dinner — Route 96 Bus',
        description:
          'Take the 96 bus from the hotel toward the restaurant. Buses run every 8 minutes. Short ride (~10 mins).',
      },
      {
        id: 'd1-a5',
        time: '7:00 PM',
        type: 'meal',
        title: 'Matsuzaka Ushi · Sandai Wagyu Tabekurabe Shabu Ki',
        address: 'Japan, 〒108-0075 Tokyo, Minato City, Konan, 2 Chome-16-1 1F',
        lat: 35.6267,
        lng: 139.7404,
        description:
          'A premium grilled meat restaurant specializing in a three-way wagyu comparison — Matsuzaka, Kobe, and Omi beef side by side. Shabu-shabu style with high-marbled cuts.',
        highlight:
          'Three-way wagyu comparison — cook your own premium beef at the table. The perfect first dinner in Japan.',
      },
      {
        id: 'd1-a6',
        time: '8:30 PM',
        type: 'transport',
        title: 'Return to hotel — rest',
        description:
          'Head back on the 96 bus or grab a taxi. Early night — jet lag is real.',
      },
    ],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    date: '2026-05-02',
    dayLabel: 'Saturday, May 2',
    title: 'The Old & The New',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "A tale of two Tokyos: start your morning in ancient Asakusa at Japan's most famous temple, then cross the city to the electric chaos of Shibuya Crossing. Dinner is an izakaya feast with tempura and sake in Shinjuku.",
    activities: [
      {
        id: 'd2-a1',
        time: '9:00 AM',
        type: 'transport',
        title: 'Hotel → Senso-ji Temple, Asakusa',
        description:
          'Tokyo Monorail to Hamamatsucho, then Asakusa Line to Asakusa Station (45 mins total, ~¥600). Or drive 21 minutes by taxi (~¥2,500).',
      },
      {
        id: 'd2-a2',
        time: '10:00 AM',
        type: 'sightseeing',
        title: 'Senso-ji Temple',
        address: '2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032',
        lat: 35.7147,
        lng: 139.7967,
        description:
          "Tokyo's oldest and most significant Buddhist temple, founded in 628 AD. The massive Kaminarimon (Thunder Gate) leads to the Nakamise shopping street, lined with traditional snacks and souvenirs. The main hall enshrines a golden image of Kannon, goddess of mercy.",
        highlight:
          'Arrive by 10am — the crowd builds fast. Best photos of Thunder Gate from outside facing in.',
      },
      {
        id: 'd2-a3',
        time: '11:30 AM',
        type: 'sightseeing',
        title: 'Nakamise Shopping Street',
        address: '1 Chome Asakusa, Taito City, Tokyo 111-0032',
        lat: 35.7136,
        lng: 139.7957,
        description:
          '250-meter covered shopping street leading to Senso-ji. Over 50 shops selling traditional snacks (ningyo-yaki, senbei, melonpan), fans, lacquerware, and chopsticks. Great for edible souvenirs.',
      },
      {
        id: 'd2-a4',
        time: '12:00 PM',
        type: 'meal',
        title: 'Lunch near Asakusa',
        isTBD: true,
        lat: 35.7147,
        lng: 139.7967,
        description:
          'Explore the market stalls or find a restaurant in Asakusa. Look for tendon (tempura rice bowl), monjayaki, or ramen in the side streets.',
      },
      {
        id: 'd2-a5',
        time: '1:00 PM',
        type: 'free',
        title: 'Return to hotel — rest',
        description: 'Head back for a midday rest before the afternoon in Shibuya.',
      },
      {
        id: 'd2-a6',
        time: '4:00 PM',
        type: 'sightseeing',
        title: 'Shibuya Crossing',
        address: '2 Chome-2 Dogenzaka, Shibuya City, Tokyo 150-0043',
        lat: 35.6598,
        lng: 139.7006,
        description:
          "The world's busiest pedestrian crossing — up to 3,000 people cross simultaneously when the light changes. Surrounded by giant video screens and department stores. Watch from the elevated walkway at Shibuya Station or from the Starbucks window above.",
        highlight:
          "View from the Shibuya Station bridge or nearby Mag's Park rooftop for the best overhead angle.",
        note:
          "Rush hour (5-8pm) is the most dramatic. Stand your ground and join the flow — it's organized chaos.",
      },
      {
        id: 'd2-a7',
        time: '7:00 PM',
        type: 'meal',
        title: 'Taishu Sakaba Mata Ai ni Yukimasu · Shinjuku',
        address: '〒160-0023 Tokyo, Shinjuku City, Nishishinjuku, 7 Chome-17-6 第三和幸ビル ホーム 1',
        lat: 35.6938,
        lng: 139.6921,
        description:
          'A lively izakaya serving Tempura and traditional Japanese pub fare. Casual atmosphere with shared dishes, cold beer, and sake. Classic Japanese drinking culture experience.',
      },
    ],
    ideas: [
      'Alt morning A — Gardens & Towers: Hamarikyu Gardens (traditional tidal garden) → Kyū Shiba-rikyū Gardens → Zojo-ji Temple (Buddhist temple behind Tokyo Tower) → Shiba Daijingū Shrine → Hachan Ramen for lunch',
      'Alt morning B — Shibuya late start: Meiji Jingu (forested Shinto shrine, ~700m of tree-lined paths) → Yoyogi Park → Shibuya Crossing & dinner',
    ],
  },
  {
    id: 'day-3',
    dayNumber: 3,
    date: '2026-05-03',
    dayLabel: 'Sunday, May 3',
    title: 'Shinagawa Locals Tour & Kyoto Arrival',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "Start the day with an exclusive insider tour of Shinagawa with Julio — see his school, neighborhood, and local spots that no tourist guide would find. Then board the Shinkansen for Kyoto, check into the Airbnb, and ease into your new base with a relaxed evening dinner.",
    activities: [
      {
        id: 'd3-a1',
        time: 'Morning',
        type: 'entertainment',
        title: 'Shinagawa Tour with Julio',
        description:
          "Private local tour of Shinagawa — visit Julio's school, favorite spots, and his apartment. See the neighborhood through a resident's eyes rather than a tourist's. Walking tour through local streets, parks, and hidden corners.",
        highlight:
          "Exclusive local access — the kind of morning you can't book on a travel site.",
        lat: 35.6284,
        lng: 139.7387,
      },
      {
        id: 'd3-a2',
        time: '11:45 AM',
        type: 'meal',
        title: 'Lunch at Shinagawa Station',
        isTBD: true,
        lat: 35.6284,
        lng: 139.7387,
        description:
          "Grab a quick lunch at Shinagawa Station's eclectic food floor while waiting for the train. Great ramen, sushi, and bento options available throughout the station.",
      },
      {
        id: 'd3-a3',
        time: '12:55 PM',
        type: 'transport',
        title: 'Shinkansen Shinagawa → Kyoto Station',
        description:
          'Board the Shinkansen at Shinagawa Station platform. Approximately 2 hours to Kyoto. Mount Fuji visible on the right side (seats A/B) on clear days. Arrives Kyoto ~3:00 PM.',
        lat: 34.9858,
        lng: 135.7587,
      },
      {
        id: 'd3-a4',
        time: '3:15 PM',
        type: 'transport',
        title: 'Kyoto Station → Airbnb',
        address: '74-1-1 Kamisuzuyachō, Kyōto-shi, 600-8312',
        description:
          'Three options from Kyoto Station: Taxi (6 mins, ~¥1,000) — easiest with luggage. City Bus 50 (18 mins, ¥230). Walk (20 mins) if feeling energetic.',
        lat: 34.9977,
        lng: 135.759,
      },
      {
        id: 'd3-a5',
        time: '3:30 PM',
        type: 'free',
        title: 'Settle into Airbnb — relax',
        address: '74-1-1 Kamisuzuyachō, Kyōto-shi, 600-8312',
        description:
          'Unpack, explore the rental, and decompress after the travel day. The Airbnb is centrally located in Shimogyo Ward — well-positioned for all Kyoto sightseeing.',
        lat: 34.9977,
        lng: 135.759,
      },
      {
        id: 'd3-a6',
        time: '5:00 PM',
        type: 'entertainment',
        title: 'Optional Evening Activities',
        description: 'Choose how to spend the first Kyoto evening before dinner.',
        lat: 34.9921,
        lng: 135.7527,
        alternatives: [
          {
            id: 'd3-a6-alt1',
            name: 'Hot tub at Airbnb',
            note: 'Stay in and enjoy the Airbnb hot tub — perfect after a travel day',
          },
          {
            id: 'd3-a6-alt2',
            name: 'Nishi Hongan-ji Temple',
            address: '〒600-8501 Kyoto, Shimogyo Ward, Honganji Monzencho',
            note: 'UNESCO World Heritage Site — massive Buddhist complex 5 min walk. Beautiful at dusk. Free entry.',
            lat: 34.9921,
            lng: 135.7527,
          },
          {
            id: 'd3-a6-alt3',
            name: 'Shoseien Garden (Kikoku-tei)',
            address: '〒600-8190 Kyoto, Shimogyo Ward, Higashitamamizucho 658',
            note: 'Serene traditional garden attached to Higashi Hongan-ji. Pond, stone bridges, teahouse. 10 min walk.',
            lat: 34.9935,
            lng: 135.7578,
          },
        ],
      },
      {
        id: 'd3-a7',
        time: '7:00 PM',
        type: 'meal',
        title: 'Dinner · Tatsu-ya',
        address: '〒600-8177 Kyoto, Shimogyo Ward, Osakacho, 383-6 MILLY烏丸五条 1F',
        lat: 34.9977,
        lng: 135.759,
        description:
          "A well-regarded local restaurant close to the Airbnb. Kyoto-style cuisine in a comfortable setting — a great introduction to the city's refined food culture.",
        note: '5 min walk from the Airbnb — easy first night out.',
      },
    ],
  },
  {
    id: 'day-4',
    dayNumber: 4,
    date: '2026-05-04',
    dayLabel: 'Monday, May 4',
    title: 'Hiroshima & Miyajima Day Trip',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      'A powerful and unforgettable day — the Peace Memorial Park in Hiroshima offers profound reflection, then a ferry to Miyajima Island reveals the iconic floating torii gate of Itsukushima Shrine. Back in Kyoto by evening for a relaxed izakaya dinner.',
    activities: [
      {
        id: 'd4-a1',
        time: '9:33 AM',
        type: 'transport',
        title: 'Shinkansen Kyoto → Hiroshima Station',
        description:
          'Departs Kyoto Station. Arrives Hiroshima 11:11 AM (~1.5 hrs, Nozomi/Sakura service). Reserve seats in advance — Golden Week trains fill quickly.',
        lat: 34.3963,
        lng: 132.4595,
      },
      {
        id: 'd4-a2',
        time: '11:20 AM',
        type: 'transport',
        title: 'Hiroshima Station → Peace Memorial Park',
        description:
          'Two options: Bus 103 from Platform 5 (5 stops to Shirakamisha-mae, ~15 mins, ¥220). Or Taxi (~8 mins, ¥1,000). The museum is visible from the Aioi Bridge.',
        lat: 34.3955,
        lng: 132.4533,
      },
      {
        id: 'd4-a3',
        time: '12:00 PM',
        type: 'sightseeing',
        title: 'Peace Memorial Park & Museum',
        address: 'Nakajimacho, Naka Ward, Hiroshima, 730-0811',
        lat: 34.3955,
        lng: 132.4533,
        description:
          'The park and museum commemorate the atomic bombing of August 6, 1945. The A-Bomb Dome (Genbaku Dome) is the skeletal ruin of the former Hiroshima Prefectural Industrial Promotion Hall — preserved as a UNESCO World Heritage Site. The museum inside is deeply moving with personal artifacts and survivor accounts. Budget 1.5-2 hours.',
        highlight:
          "The A-Bomb Dome and the Children's Peace Monument. The museum is essential — don't skip the main building even if time is short.",
        note: 'Museum entry: ¥200 adults. Audio guides available in English.',
      },
      {
        id: 'd4-a4',
        time: '1:45 PM',
        type: 'meal',
        title: 'Yabuki Ramen · Hiroshima',
        address: '〒730-0032 Hiroshima, Naka Ward, Tatemachi, 6-13 立町ビル 103',
        lat: 34.3963,
        lng: 132.4601,
        description:
          'Local ramen shop in central Hiroshima known for Hiroshima-style ramen — soy-based broth with flat noodles, different from Tokyo or Sapporo styles.',
        alternatives: [
          {
            id: 'd4-a4-alt1',
            name: 'Nigiriya Kenta · Seafood',
            address: '〒730-0035 Hiroshima, Naka Ward, Hondori, 4-11 ル・フェール広島本通りビル 2階',
            note: 'Fresh seafood restaurant on the Hondori covered arcade. Hiroshima oysters and local seafood.',
            lat: 34.3967,
            lng: 132.4591,
          },
          {
            id: 'd4-a4-alt2',
            name: 'Teki Kushiyaki · Yakitori',
            address: '1 Chome-5-5 Kamiyacho, Naka Ward, Hiroshima, 730-0031',
            note: 'Grilled yakitori skewers near the Peace Park. Quick and satisfying.',
            lat: 34.3956,
            lng: 132.4555,
          },
        ],
      },
      {
        id: 'd4-a5',
        time: '2:45 PM',
        type: 'transport',
        title: 'Return to Hiroshima Station',
        description:
          'Reverse the morning route — Bus or taxi back to Hiroshima Station. Allow 20 mins.',
        lat: 34.3963,
        lng: 132.4595,
      },
      {
        id: 'd4-a6',
        time: '3:29 PM',
        type: 'transport',
        title: 'Shinkansen Hiroshima → Kyoto (Train 166, Car 110, Seats 7A-D)',
        description: 'Confirmed seats: Train 166, Car 110, Seats 7A-D. Arrives Kyoto 5:12 PM.',
        lat: 34.9858,
        lng: 135.7587,
      },
      {
        id: 'd4-a7',
        time: '5:30 PM',
        type: 'free',
        title: 'Rest at Airbnb',
        description: 'Decompress after an intense and emotional day. Freshen up before dinner.',
        lat: 34.9977,
        lng: 135.759,
      },
      {
        id: 'd4-a8',
        time: '8:00 PM',
        type: 'meal',
        title: 'Sumiro Man · Izakaya',
        address: '〒604-8126 Kyoto, Nakagyo Ward, Kaiyacho, 561',
        lat: 35.0082,
        lng: 135.7608,
        description:
          'A local izakaya in central Kyoto. Grilled skewers, seasonal small plates, and cold Sapporo draft. Comfortable and unpretentious — a good neighborhood spot for a relaxed evening after a heavy day.',
      },
    ],
  },
  {
    id: 'day-5',
    dayNumber: 5,
    date: '2026-05-05',
    dayLabel: 'Tuesday, May 5',
    title: 'Castles, Slopes & Wagyu Feast',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "Start with a Shogun's castle and its chirping 'nightingale floors,' then wind through the preserved Higashiyama slopes past Sannenzaka and Kiyomizudera's dramatic wooden stage. The evening brings Kyoto's geisha district and the trip's biggest beef splurge.",
    activities: [
      {
        id: 'd5-a1',
        time: '9:00 AM',
        type: 'sightseeing',
        title: 'Nijo Castle',
        address: '541 Nijo-jo-cho, Nakagyo Ward, Kyoto 604-8301',
        lat: 35.0142,
        lng: 135.748,
        description:
          "A UNESCO World Heritage flatland castle built in 1603 as the Kyoto residence of Tokugawa Ieyasu, the first Edo shogun. Famous for its 'uguisubari' (nightingale floors) — polished wooden corridors designed to squeak underfoot to alert guards of intruders. The castle grounds include elaborate Ninomaru Palace with stunning Kano school artwork and a beautiful Japanese garden.",
        highlight:
          'Listen for the nightingale floors — the squeak gets louder in the driest rooms. The Ninomaru Palace gardens are excellent in late spring.',
        note: 'Bus 50 from Kyoto Station (15 mins, every 12 mins, ¥230). Or taxi 7 mins (~¥1,000).',
        alternatives: [
          {
            id: 'd5-a1-alt1',
            name: 'Fushimi Inari Taisha',
            address: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto',
            note: 'Walk through thousands of iconic vermilion torii gates. Allow 2-4 hours. Arrive before 9am to beat Golden Week crowds.',
            lat: 34.9671,
            lng: 135.7727,
          },
        ],
      },
      {
        id: 'd5-a2',
        time: '11:00 AM',
        type: 'meal',
        title: 'Menbaka Fire Ramen',
        address: 'Kamigyo Ward, Kyoto (near Nijo Castle)',
        lat: 35.0082,
        lng: 135.7594,
        description:
          "Kyoto's most theatrical ramen experience — the chef dramatically flambes green onions right over your bowl with a giant ladle of hot oil. The flavored broth is excellent beyond the spectacle. Very popular — expect a short queue.",
        highlight:
          'The fire show at your table is unmissable. Go for the standard bowl and watch the staff work the flames.',
        alternatives: [
          {
            id: 'd5-a2-alt1',
            name: 'Local Soba nearby',
            note: 'For a quieter, more casual lunch — any soba shop near Nijo Castle works well',
          },
        ],
      },
      {
        id: 'd5-a3',
        time: 'Afternoon',
        type: 'free',
        title: 'Return to rental — rest',
        description:
          'Head back to the Airbnb for a couple of hours before the afternoon sightseeing push.',
      },
      {
        id: 'd5-a4',
        time: '2:00 PM',
        type: 'sightseeing',
        title: 'Sannenzaka · Ninenzaka — Preserved Historic Streets',
        address: '2 Chome-211 Kiyomizu, Higashiyama Ward, Kyoto, 605-0862',
        lat: 34.9978,
        lng: 135.7833,
        description:
          "A network of beautifully preserved stone-paved lanes from the Edo period leading up to Kiyomizudera. Lined with traditional wooden machiya townhouses converted into tea shops, pottery studios, sake sellers, and craft stores. Sannenzaka ('three year slope') and Ninenzaka ('two year slope') are the main streets — legend says tripping on these stones brings 2-3 years of bad luck.",
        highlight:
          "Browse the pottery and lacquerware shops — this is one of Kyoto's best souvenir streets. Try the matcha soft serve.",
      },
      {
        id: 'd5-a5',
        time: '3:30 PM',
        type: 'sightseeing',
        title: 'Kiyomizu-dera Temple',
        address: '1 Chome-294 Kiyomizu, Higashiyama Ward, Kyoto, 605-0862',
        lat: 34.9948,
        lng: 135.785,
        description:
          "One of Japan's most celebrated temples, founded in 778 AD and rebuilt in 1633 without a single nail. The massive wooden stage (butai) juts out 13 meters over a cliff with panoramic views of Kyoto. The name means 'pure water' — spring water flows from three separate streams below the main hall, each granting a different wish. UNESCO World Heritage Site.",
        highlight:
          "'Jumping off the stage at Kiyomizudera' is a Japanese idiom for taking a bold leap — the stage is 13m high. Arrive for golden hour light on the city.",
        note: 'Entry: ¥500 adults. The approach up from Sannenzaka takes about 15 minutes.',
      },
      {
        id: 'd5-a6',
        time: '4:30 PM',
        type: 'entertainment',
        title: 'Gion District Exploration',
        address: 'Gionmachi, Higashiyama Ward, Kyoto',
        lat: 35.0036,
        lng: 135.7757,
        description:
          "Kyoto's famous geisha (geiko) and maiko district, centered around Hanamikoji Street. Traditional ochaya (teahouses) line the preserved machiya streetscape. If lucky, spot a geiko hurrying to an evening appointment after 5pm.",
        highlight:
          'Nishi-Hanamikoji Street at dusk is one of the most atmospheric walks in Japan. Stay quiet and respectful — residents still live and work here.',
        alternatives: [
          {
            id: 'd5-a6-alt1',
            name: 'Matsui Sake Brewery',
            address: '〒606-8305 Kyoto, Sakyo Ward, Yoshidakawaracho, 1-6',
            note: 'Working sake brewery with tastings and tours. Excellent if done before — also good to revisit with new appreciation after the canal tour.',
            lat: 35.0267,
            lng: 135.782,
          },
          {
            id: 'd5-a6-alt2',
            name: 'Yasaka Shrine',
            address: '625 Gionmachi Kitagawa, Higashiyama Ward, Kyoto 605-0073',
            note: 'Free entry — the main shrine of Gion with a famous stone lantern gate. Particularly beautiful at night when lanterns are lit.',
            lat: 35.0036,
            lng: 135.7785,
          },
          {
            id: 'd5-a6-alt3',
            name: 'Nishi-Hanamikoji Street',
            address: '570-123 Gionmachi Minamigawa, Higashiyama Ward, Kyoto 605-0074',
            note: 'The most photogenic street in Gion — traditional ochaya facades, stone lanterns, wooden lattice windows.',
            lat: 35.0025,
            lng: 135.7757,
          },
        ],
      },
      {
        id: 'd5-a7',
        time: '6:00 PM',
        type: 'meal',
        title: 'Kobe Beef Steak Mouriya Gion',
        address: '〒605-0802 Kyoto, Higashiyama Ward, Yamatocho, 7-1 祇園モーリヤビル 1F',
        lat: 35.0033,
        lng: 135.7745,
        description:
          "One of Kyoto's most prestigious Kobe beef restaurants, operating since 1895. Cook-your-own style BBQ — premium A5 Kobe beef brought to the table raw and grilled on an iron plate at your seat. The marbling level is extraordinary — fat melts at body temperature.",
        highlight:
          "Order the course menu for the full Kobe beef experience. The ribeye cut is exceptional. This is the trip's most special dinner.",
        note: 'Reservation essential — book at least 2 weeks in advance. Smart casual dress.',
      },
    ],
    ideas: [
      'Alt morning: Fushimi Inari Taisha — walk through thousands of iconic vermilion torii gates (68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto). Allow 2-4 hours for the full hike to the summit. Arrive before 9am during Golden Week to avoid crowds.',
    ],
  },
  {
    id: 'day-6',
    dayNumber: 6,
    date: '2026-05-06',
    dayLabel: 'Wednesday, May 6',
    title: 'Bamboo & Osaka Night',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "An early morning in Arashiyama's bamboo forest before the crowds arrive, then an afternoon in Osaka taking in the castle grounds and Dotonbori's neon-soaked food streets. Back to Kyoto by night.",
    activities: [
      {
        id: 'd6-a1',
        time: '8:30 AM',
        type: 'sightseeing',
        title: 'Arashiyama Bamboo Forest',
        address: 'Sagaogurayama Tabuchiyamacho, Ukyo Ward, Kyoto, 616-8394',
        lat: 35.0173,
        lng: 135.6721,
        description:
          'A towering grove of Moso bamboo on the western edge of Kyoto. The stalks rise 20+ meters creating a cathedral-like canopy that sways and rustles in the wind. The main path through the grove is short (~500m) but the surrounding temple trails extend the experience significantly.',
        highlight:
          'Arrive before 9am — the bamboo grove gets very crowded by mid-morning during Golden Week. Early morning light through the bamboo is magical.',
        note:
          'JR Sagano Line from Kyoto Station to Saga-Arashiyama (15 mins, ¥240). Then 10 min walk. Or taxi 30 mins (~¥3,500).',
        alternatives: [
          {
            id: 'd6-a1-alt1',
            name: 'Fushimi Inari Taisha',
            address: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto',
            note: 'Walk through thousands of torii gates. Allow 2-4 hours. Arrive before 8am during Golden Week.',
            lat: 34.9671,
            lng: 135.7727,
          },
        ],
      },
      {
        id: 'd6-a2',
        time: '1:22 PM',
        type: 'transport',
        title: 'Train → Osaka Shin-Osaka Station',
        description:
          'Shinkansen or rapid train from Kyoto Station to Shin-Osaka (14 mins by Shinkansen, ~¥1,490). Or JR Special Rapid (30 mins, ¥570). Arrives Shin-Osaka 1:40 PM.',
        lat: 34.7334,
        lng: 135.5003,
      },
      {
        id: 'd6-a3',
        time: '2:30 PM',
        type: 'sightseeing',
        title: 'Osaka Castle',
        address: '1-1 Osakajo, Chuo Ward, Osaka 540-0002',
        lat: 34.6873,
        lng: 135.5259,
        description:
          "One of Japan's most iconic castles, originally built by Toyotomi Hideyoshi in 1583. The current main tower (rebuilt 1931) is an 8-story museum with excellent historical exhibits on the castle's role in the unification of Japan. The surrounding 106-hectare park has dramatic stone walls, moats, and gates.",
        highlight:
          'The views from the top floor of the castle tower over Osaka are excellent. The stone walls and moats are more impressive than any photo suggests.',
        note:
          'Castle tower entry: ¥600. 20-min walk from Shin-Osaka Station or take subway to Tanimachi 4-chome Station.',
      },
      {
        id: 'd6-a4',
        time: '4:30 PM',
        type: 'sightseeing',
        title: 'Dotonbori',
        address: 'Dotonbori, Chuo Ward, Osaka 542-0071',
        lat: 34.6687,
        lng: 135.5014,
        description:
          "Osaka's most famous entertainment and dining district, centered on the Dotonbori canal. Packed with giant mechanical restaurant signs — the rotating crab of Kani Doraku, the Glico Running Man billboard, the Kuidaore Taro drum-playing clown. The area is a food lover's paradise: takoyaki (octopus balls), okonomiyaki, kushikatsu, ramen, and more at every turn.",
        highlight:
          'The Glico Running Man sign is the photo everyone takes. For the best shot, stand on the Ebisubashi Bridge looking west at dusk.',
      },
      {
        id: 'd6-a5',
        time: '6:00 PM',
        type: 'meal',
        title: 'Street Food Dinner · Dotonbori',
        address: 'Dotonbori, Chuo Ward, Osaka 542-0071',
        lat: 34.6687,
        lng: 135.5014,
        description:
          "Graze through Dotonbori's street food stalls — takoyaki from Kukuru or Aizuya, okonomiyaki from any griddle shop, fresh kushikatsu at a standing bar. Osaka is Japan's food capital (kuidaore = 'eat until you drop') — this is the city's best introduction.",
        highlight:
          "Takoyaki and Osaka-style okonomiyaki are mandatory. Try both — they're entirely different dishes.",
        alternatives: [
          {
            id: 'd6-a5-alt1',
            name: 'Kani Doraku Dotonbori Main Branch',
            address: '1 Chome-6-18 Dotonbori, Chuo Ward, Osaka, 542-0071',
            note: 'The iconic crab restaurant under the giant mechanical crab sign. Fresh Hokkaido crab in a sit-down setting. Book ahead or expect a queue.',
            lat: 34.6688,
            lng: 135.5013,
          },
        ],
      },
      {
        id: 'd6-a6',
        time: '8:33 PM',
        type: 'transport',
        title: 'Train → Kyoto Station',
        description:
          'JR Rapid or Shinkansen from Shin-Osaka or Osaka Station. Arrives Kyoto 8:50 PM (~30 mins, ¥570-1,490 depending on service).',
        lat: 34.9858,
        lng: 135.7587,
      },
    ],
    ideas: [
      'Alt morning: Fushimi Inari Taisha — walk through thousands of iconic vermilion torii gates (68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto). Allow 2-4 hours. Arriving before 8am during Golden Week is essential.',
    ],
  },
  {
    id: 'day-7',
    dayNumber: 7,
    date: '2026-05-07',
    dayLabel: 'Thursday, May 7',
    title: 'Canal, Sake & Sushi',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "A leisurely day in Kyoto's historic Fushimi sake district — a scenic canal boat ride, a brewery tour with sake tasting at the legendary Gekkeikan, and a final Kyoto sushi dinner before packing for Tokyo.",
    activities: [
      {
        id: 'd7-a1',
        time: '9:00 AM',
        type: 'transport',
        title: 'Head to Fushimi Sake District',
        description:
          'Two options: Subway from Gojo Station (Karasuma Line, Platform 1) → Takeda Station → transfer to Kintetsu-Kyoto Line (Express toward Tenri) → Momoyamagoryo-mae Station (~40 mins, ¥400 total). Or Taxi from Airbnb (~30 mins, ¥3,000).',
        lat: 34.9438,
        lng: 135.7674,
      },
      {
        id: 'd7-a2',
        time: '10:00 AM',
        type: 'entertainment',
        title: 'Fushimi Canal Boat Tour (1 hour)',
        address: 'Fushimi Port Park, Fushimi Ward, Kyoto',
        lat: 34.9445,
        lng: 135.7665,
        description:
          "A traditional wooden sightseeing boat along the Uji River canal through the historic sake-brewing district of Fushimi. The canal is lined with old sake brewery warehouses and weeping willows — one of Kyoto's most photogenic waterways.",
        highlight:
          'Peaceful and beautiful — one of the most underrated experiences in Kyoto. The sake district seen from the water is completely different from street level.',
        note: 'Book in advance: https://kyoto-fushimi.or.jp/fune/unkou/ — available in Japanese only, worth a call.',
      },
      {
        id: 'd7-a3',
        time: '11:30 AM',
        type: 'meal',
        title: 'Teppan Kushiyaki Sakura · Fushimi',
        address: '〒612-8045 Kyoto, Fushimi Ward, Minamihamacho, 259 竜馬通り商店街内',
        lat: 34.9432,
        lng: 135.7668,
        description:
          'A teppanyaki grill and kushiyaki (skewer) restaurant on the historic Ryoma Street shopping arcade in Fushimi. Perfect spot for a casual lunch before the brewery tour.',
        alternatives: [
          {
            id: 'd7-a3-alt1',
            name: 'Daikoku Ramen Main Shop',
            address: '118 Kyomachi Daikokucho, Fushimi Ward, Kyoto 612-8087',
            note: 'Local Fushimi ramen shop — hearty tonkotsu-soy broth. Very popular with locals.',
            lat: 34.9441,
            lng: 135.766,
          },
        ],
      },
      {
        id: 'd7-a4',
        time: '1:00 PM',
        type: 'entertainment',
        title: 'Gekkeikan Okura Sake Museum — Brewery Tour & Tasting',
        address: '697 Motozaimokucho, Fushimi Ward, Kyoto',
        lat: 34.9438,
        lng: 135.7674,
        description:
          "Gekkeikan is one of Japan's largest and most storied sake breweries, founded in 1637 in Fushimi — Japan's premier sake-brewing region due to its exceptionally soft water. The museum occupies a 300-year-old brewery with original fermentation tanks, barrels, and tools. The tasting flight includes classic junmai, nigori, and seasonal varieties.",
        highlight:
          "The atmospheric old brewery is worth more time than most people give it. The premium tasting set includes bottles you can't easily find outside Fushimi.",
        note: 'Meet the guide inside the museum entrance. Admission: ¥600 including one sample. Additional tastings available for purchase.',
      },
      {
        id: 'd7-a5',
        time: '4:30 PM',
        type: 'transport',
        title: 'Return to Airbnb',
        description:
          "Head back to Kamisuzuyacho. Reverse the morning route. Take time to pack for tomorrow's departure to Tokyo.",
        lat: 34.9977,
        lng: 135.759,
      },
      {
        id: 'd7-a6',
        time: '7:00 PM',
        type: 'meal',
        title: 'Higo Hisa Sushi',
        address: '〒600-8074 Kyoto, Shimogyo Ward, Higashimaecho, 402',
        lat: 34.9956,
        lng: 135.761,
        description:
          "A refined Kyoto sushi restaurant close to the Airbnb. Kyoto-style sushi (Kyozushi) differs from Tokyo — often using pickled or marinated fish rather than raw, reflecting the city's landlocked history. A fitting farewell dinner before heading east.",
        highlight:
          'Last dinner in Kyoto — try the saba (mackerel) and kohada (shad) which are Kyoto sushi classics.',
      },
    ],
    ideas: [
      "Nishiki Market — Kyoto's Kitchen: covered 400-year-old market street with 100+ shops selling Kyoto pickles, grilled skewers, soy milk donuts, dashi, and kitchen knives. 5 min walk from Karasuma-Oike Station.",
      "To-ji Temple — 1 Kujocho, Minami Ward, Kyoto 601-8473: Japan's tallest wooden pagoda (57m, 5 stories) built in 796 AD. Flea market on the 21st of each month. 15 min walk from Kyoto Station.",
    ],
  },
  {
    id: 'day-8',
    dayNumber: 8,
    date: '2026-05-08',
    dayLabel: 'Friday, May 8',
    title: 'Return to Tokyo — Omori Base',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      'An easy travel day back to Tokyo, settling into the Omori Airbnb for the final leg. Sabrina arrives in the evening, completing the group. A quiet dinner together before the big museum day tomorrow.',
    activities: [
      {
        id: 'd8-a1',
        time: '10:30 AM',
        type: 'transport',
        title: 'Shinkansen Kyoto → Tokyo Shinagawa',
        description:
          'Departs Kyoto Station. Nozomi service recommended — fastest option, arrives Shinagawa 12:40 PM (~2h10m). Purchase tickets at the station or reserve in advance.',
        lat: 35.6284,
        lng: 139.7387,
      },
      {
        id: 'd8-a2',
        time: '1:30 PM',
        type: 'accommodation',
        title: 'Check into Omori Airbnb',
        address: '3-chōme-11-9 Ōmorikita, Ota City, Tokyo 143-0016',
        lat: 35.5793,
        lng: 139.7348,
        description:
          'The final Tokyo base for Days 8-10. Omori is a quiet residential neighborhood in Ota City — well-connected to central Tokyo by JR Keihin-Tohoku Line (20 mins to Shinagawa, 30 mins to Akihabara).',
        note: 'Check-in instructions from Airbnb app. Drop bags and explore the local neighborhood.',
      },
      {
        id: 'd8-a3',
        time: 'Afternoon',
        type: 'meal',
        title: 'Lunch around the Airbnb',
        isTBD: true,
        lat: 35.5793,
        lng: 139.7348,
        description:
          'Explore the local Omori neighborhood for lunch. The Togoshi Ginza shopping street nearby has good casual options.',
      },
      {
        id: 'd8-a4',
        time: '2:00 PM',
        type: 'free',
        title: 'Rest until Sabrina arrives',
        description:
          "Optional afternoon activities nearby: Tokyo Port Wild Bird Park (a peaceful waterside nature reserve, 15 min walk) or Togoshi Ginza Shopping Street (Japan's longest shotengai shopping street — 1.3km of local shops).",
        lat: 35.5793,
        lng: 139.7348,
      },
      {
        id: 'd8-a5',
        time: '5:30 PM',
        type: 'free',
        title: 'Sabrina arrives at the Airbnb',
        description:
          'Sabrina lands at HND at 4:15 PM. Tokyo Monorail to Hamamatsucho then JR to Omori (~45 mins total). The group is now complete for the final Tokyo stretch.',
      },
      {
        id: 'd8-a6',
        time: '7:00 PM',
        type: 'meal',
        title: 'Dinner — TBD',
        isTBD: true,
        lat: 35.5793,
        lng: 139.7348,
        description:
          'Flexible dinner to welcome Sabrina. Options range from local exploration to cooking in.',
        alternatives: [
          {
            id: 'd8-a6-alt1',
            name: 'Dinner around the Airbnb — Omori local spots',
            note: 'Explore the neighborhood — izakayas, ramen, and sushi all within walking distance of the Airbnb',
          },
          {
            id: 'd8-a6-alt2',
            name: 'Cook at home',
            note: 'Pick up groceries from a local supermarket — good option after a travel day',
          },
          {
            id: 'd8-a6-alt3',
            name: 'Order delivery',
            note: 'Uber Eats / Demae-can local delivery — easy option to stay in',
          },
        ],
      },
    ],
  },
  {
    id: 'day-9',
    dayNumber: 9,
    date: '2026-05-09',
    dayLabel: 'Saturday, May 9',
    title: 'Gardens, Ramen & Nightlife',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "A relaxed day balancing great food with peaceful green space — Ichiran's iconic solo ramen booths, Shinjuku Gyoen's manicured gardens, and a traditional tea ceremony. The evening offers options from mellow to lively.",
    activities: [
      {
        id: 'd9-a1',
        time: 'Late morning',
        type: 'free',
        title: 'Slow morning at Omori rental',
        description: 'Sleep in, make coffee, and take it easy. No agenda until noon.',
      },
      {
        id: 'd9-a2',
        time: '12:30 PM',
        type: 'meal',
        title: 'ICHIRAN Ramen · Shinjuku Central East Exit',
        address: '3-34-11 Shinjuku, Shinjuku City, Tokyo 160-0022',
        lat: 35.6918,
        lng: 139.7003,
        description:
          "Japan's most famous solo-ramen concept — individual wooden booths with a curtain separating you from the kitchen. Order by checkbox form, customize broth intensity and noodle firmness. The tonkotsu broth is rich, milky, and deeply savory. No shared tables — everyone faces the wall in focused ramen meditation.",
        highlight:
          "Fill in the order form carefully — 'rich' broth, 'firm' noodles, extra green onion. Add a soft-boiled egg. The experience is as memorable as the ramen itself.",
      },
      {
        id: 'd9-a3',
        time: 'Afternoon',
        type: 'free',
        title: 'Rest at Omori rental',
        description: 'Head back for an afternoon break before the garden visit.',
      },
      {
        id: 'd9-a4',
        time: '2:00 PM',
        type: 'sightseeing',
        title: 'Shinjuku Gyoen National Garden',
        address: '11 Naitomachi, Shinjuku City, Tokyo 160-0014',
        lat: 35.6852,
        lng: 139.71,
        description:
          "One of Tokyo's largest and most beautiful parks — 58 hectares combining Japanese traditional garden, French formal garden, and English landscape garden styles. Famous for late-season cherry blossoms and spectacular maple in autumn. The greenhouse contains tropical plants and a towering banana palm. Peaceful despite being in central Shinjuku.",
        highlight:
          'The Japanese garden section with the koi pond and teahouse is the most photogenic. Allow 1.5-2 hours to properly explore all three garden styles.',
        note:
          'Entry: ¥500 adults. No alcohol permitted inside (unlike most Tokyo parks). Open 9am-5:30pm.',
      },
      {
        id: 'd9-a5',
        time: '3:30 PM',
        type: 'entertainment',
        title: 'Tea Ceremony · Shinjuku Garden (MAI-KO)',
        address: '3-8-3 Shinjuku, Shinjuku City, Tokyo 160-0022',
        lat: 35.6898,
        lng: 139.7002,
        description:
          "A traditional matcha tea ceremony experience with English-speaking guides. Learn the ritual of preparing and drinking matcha — the precise movements, the seasonal sweets (wagashi), and the philosophy of 'ichi-go ichi-e' (one moment, one meeting). Optional kimono or yukata rental available.",
        highlight:
          'Try the wagashi (traditional sweets) served before the bitter matcha — they balance each other perfectly.',
        note:
          'Book via https://mai-ko.com/tour/tea-ceremony-and-kimono-experience-kyoto-maikoya-at-shinjuku/',
      },
      {
        id: 'd9-a6',
        time: 'Evening',
        type: 'entertainment',
        title: 'Evening Plans — TBD',
        isTBD: true,
        alternatives: [
          {
            id: 'd9-a6-alt1',
            name: 'Early night — rest up for Day 10',
            note: 'Day 10 has museums, sumo lunch, and a farewell dinner — save your energy',
          },
          {
            id: 'd9-a6-alt2',
            name: 'Dinner or drinks with Regina — TBD location',
            note: 'Coordinate with Regina on location and meeting time',
          },
          {
            id: 'd9-a6-alt3',
            name: 'Yurakucho — train tracks street food with Regina',
            address: '2 Chome-1 Yurakucho, Chiyoda City, Tokyo 100-0006',
            note: 'Retro yakitori bars built under the railway tracks. Cold Sapporo draft and grilled skewers with Tokyo station views.',
            lat: 35.6753,
            lng: 139.7634,
          },
          {
            id: 'd9-a6-alt4',
            name: 'Piss Alley (Omoide Yokocho) · Shinjuku',
            address: '1 Chome Nishishinjuku, Shinjuku City, Tokyo 160-0023',
            note: 'Labyrinth of tiny smoky yakitori bars under the Shinjuku tracks. Atmospheric, cheap, and lively. Max 10 people per bar.',
            lat: 35.6938,
            lng: 139.6994,
          },
        ],
      },
    ],
  },
  {
    id: 'day-10',
    dayNumber: 10,
    date: '2026-05-10',
    dayLabel: 'Sunday, May 10',
    title: 'Mom & Museum Day',
    leg: 'golden-week',
    travelers: '5 Adults',
    summary:
      "The grand finale of Golden Week — a full day of Edo-period immersion in Ryogoku, Tokyo's historic sumo district. Walk through a life-size recreation of old Tokyo, watch a sumo-themed lunch show, and cap the trip with a farewell seafood feast at Shinagawa.",
    activities: [
      {
        id: 'd10-a1',
        time: 'Morning',
        type: 'sightseeing',
        title: 'Fukagawa Edo Museum',
        address: '1-3-28 Shirakawa, Koto City, Tokyo 135-0021',
        lat: 35.6897,
        lng: 139.7975,
        description:
          'A full-scale indoor recreation of a Tokyo shitamachi (downtown) neighborhood from circa 1840 — the Fukagawa Sagacho district near the Sumida River. 11 buildings including houses, shops, a theater, a boathouse, a tavern, and a fire tower, all constructed using traditional techniques. Lighting changes to simulate different times of day. Volunteer English-speaking guides available.',
        highlight:
          'You can take off your shoes and walk inside the houses. The fire tower and canal boathouse are the standouts. Budget 1.5 hours minimum.',
        note:
          'Entry: ¥400. 3-min walk from Kiyosumi-Shirakawa Station (Oedo and Hanzomon Lines). Open 9:30am-5pm.',
      },
      {
        id: 'd10-a2',
        time: '1:00 PM',
        type: 'meal',
        title: 'Yokozuna Tonkatsu Dosukoi Tanaka · Ryogoku',
        address: '2-13-1 Ryogoku, Sumida City, Tokyo 130-0026',
        lat: 35.6966,
        lng: 139.7939,
        description:
          'A sumo-themed tonkatsu (breaded pork cutlet) restaurant in Ryogoku — the historic sumo district of Tokyo. Massive portions in keeping with the sport, sumo-themed décor, and the occasional appearance of sumo wrestlers from the nearby Kokugikan arena. The chanko nabe (sumo stew) is also available.',
        highlight:
          'Order the extra-thick tonkatsu set. The portions are genuinely sumo-sized — share or come very hungry.',
      },
      {
        id: 'd10-a3',
        time: '3:00 PM',
        type: 'sightseeing',
        title: 'Edo-Tokyo Museum',
        address: '1-4-1 Yokoami, Sumida City, Tokyo 130-0015',
        lat: 35.6966,
        lng: 139.7963,
        description:
          "One of Tokyo's landmark museums documenting the city's transformation from Edo castle town to modern metropolis. Iconic brutalist architecture — the building is shaped like a raised traditional Japanese storehouse. Inside: life-sized reconstructions of Nihonbashi Bridge, a replica Edo-period townscape, and massive dioramas showing Tokyo before and after WWII bombing.",
        highlight:
          'The life-sized Nihonbashi Bridge replica on the 6th floor is extraordinary. The museum is massive — the Edo period sections (floors 5-6) are the highlights.',
        note: 'Entry: ¥600 adults. JR Ryogoku Station (Sobu Line), 3-min walk.',
      },
      {
        id: 'd10-a4',
        time: '7:00 PM',
        type: 'meal',
        title: 'Farewell Dinner · Kani Isshin Shinagawa',
        address: '〒108-0075 Tokyo, Minato City, Konan, 2 Chome-2-10 鳳和ビル 4F',
        lat: 35.6284,
        lng: 139.7387,
        description:
          'A premium crab and seafood restaurant in Shinagawa, specializing in Hokkaido snow crab, king crab, and seasonal seafood alongside carefully selected Japanese sake. Course menus feature multiple preparations of crab — steamed, grilled, as sashimi, in shabu-shabu. A grand finale dinner for the full Golden Week group.',
        highlight:
          "Order the full crab course — it includes preparations you won't find elsewhere. The sake pairing is worth the extra cost.",
        note:
          '4th floor of the Howa Building — easy from the Omori Airbnb via JR Keihin-Tohoku Line.',
      },
    ],
    ideas: [
      'TeamLab Borderless or Planets — immersive digital art experience. Book tickets weeks in advance at teamlab.art. Best for an evening addition if the afternoon allows.',
    ],
  },
]

const hokkaidoDays: Day[] = [
  {
    id: 'day-11',
    dayNumber: 11,
    date: '2026-05-11',
    dayLabel: 'Monday, May 11',
    title: 'Arrival & Sapporo City',
    leg: 'hokkaido',
    travelers: 'John & Sabrina',
    summary:
      "Fly north to Hokkaido — Japan's wild northern island — and land in Sapporo, the island's vibrant capital. An afternoon in the park, panoramic night views from Mt. Moiwa, and your first taste of Genghis Khan BBQ lamb.",
    activities: [
      {
        id: 'd11-a1',
        time: '10:15 AM',
        type: 'transport',
        title: 'Fly Haneda (HND) → New Chitose Airport (CTS)',
        description:
          "Air Do HD19 / ANA NH4719. Departs HND 10:15 AM, arrives CTS 11:45 AM (~1.5 hrs). New Chitose is Hokkaido's main airport, 40km south of Sapporo city.",
        lat: 42.7752,
        lng: 141.6921,
      },
      {
        id: 'd11-a2',
        time: '12:30 PM',
        type: 'transport',
        title: 'JR Rapid Airport Train → Sapporo Station',
        description:
          'The fastest and easiest way into the city. JR Rapid Airport Express runs every 15 minutes from CTS to Sapporo Station (37 mins, ¥1,150). Reserved seating available.',
        lat: 43.0686,
        lng: 141.3508,
      },
      {
        id: 'd11-a3',
        time: '1:30 PM',
        type: 'meal',
        title: 'Soup Curry · Tenmna',
        address: '〒060-0005 Hokkaido, Sapporo, Chuo Ward, Kita 5 Jonishi, 3 Chome 札幌ステラプレイス 6F',
        lat: 43.0686,
        lng: 141.3508,
        description:
          "Soup curry is Sapporo's signature local dish — a thin, heavily spiced broth (lighter than Indian curry) loaded with large roasted vegetables and your choice of protein. Completely unlike Southern Japanese curry. Tenmna is inside Stellar Place at Sapporo Station — convenient for arriving travelers.",
        highlight:
          'Order the chicken leg set — the bone-in chicken simmers in the broth and pulls apart perfectly. Adjust spice level at ordering (1-10+).',
      },
      {
        id: 'd11-a4',
        time: '3:00 PM',
        type: 'accommodation',
        title: 'Check into The Royal Park Canvas – Sapporo Odori Park',
        address: '1 Chome-12 Odorinishi, Chuo Ward, Sapporo, Hokkaido 060-0042',
        lat: 43.0686,
        lng: 141.3508,
        description:
          "A contemporary design hotel on Odori Park — Sapporo's leafy central park. Well-positioned for the TV Tower, Susukino entertainment district, and subway access.",
      },
      {
        id: 'd11-a5',
        time: '4:00 PM',
        type: 'sightseeing',
        title: 'Nakajima Park',
        address: '1 Nakajima Park, Chuo Ward, Sapporo, Hokkaido 064-0931',
        lat: 43.0502,
        lng: 141.3543,
        description:
          'A beautiful 21-hectare urban park in southern Sapporo with a large pond, concert hall (Kitara), Japanese garden, and historic Hoheikan — an 1880 Western-style guest house designated as an Important Cultural Property. In May, the park is lush and green with wisteria and early summer flowers.',
        highlight:
          'Walk around Shobu Pond and peek into the Hasso-an tea house garden. The Hoheikan exterior is worth photographing.',
        note: '2-min walk from Nakajima Koen Subway Station (Namboku Line). Free entry to the park.',
      },
      {
        id: 'd11-a6',
        time: '6:15 PM',
        type: 'sightseeing',
        title: 'Mt. Moiwa Ropeway',
        address: '1 Moiwayama, Minami Ward, Sapporo, Hokkaido 005-0041',
        lat: 43.0283,
        lng: 141.3094,
        description:
          "A two-stage ropeway ascent to the 531m summit of Mt. Moiwa. The panoramic view of Sapporo's grid-pattern city spread between surrounding mountains is exceptional at dusk and night. The summit has an observatory, a restaurant, and a 'love bell' tradition.",
        highlight:
          "One of Japan's most spectacular city night views — Sapporo's grid lit up between dark mountain ridges. Allow 1.5 hours including travel and the summit.",
        note: 'Allow 30 mins from Nakajima Park. Ropeway: ¥2,100 round trip. Last gondola down at 10pm.',
      },
      {
        id: 'd11-a7',
        time: '8:00 PM',
        type: 'meal',
        title: 'Jingisukan Marutake · Susukino Honten',
        address: '6 Chome Minami 5 Jonishi, Chuo Ward, Sapporo, Hokkaido 064-0805',
        lat: 43.0552,
        lng: 141.353,
        description:
          "Genghis Khan (Jingisukan) is Hokkaido's most iconic dish — marinated lamb grilled on a domed iron skillet with vegetables. Named after the Mongol conqueror. Marutake in Susukino is a classic, beloved local spot in Sapporo's vibrant nightlife district.",
        highlight:
          'Order the set with multiple lamb cuts — the marinated shoulder and the raw leg cuts cook differently on the dome. Wrap in lettuce with the dipping sauce.',
      },
    ],
  },
  {
    id: 'day-12',
    dayNumber: 12,
    date: '2026-05-12',
    dayLabel: 'Tuesday, May 12',
    title: 'Tulip Festival & Jozankei Arrival',
    leg: 'hokkaido',
    travelers: 'John & Sabrina',
    summary:
      'Check out of Sapporo and head to Takino Suzuran Park for the spectacular hillside tulip festival, then journey into the mountains to the secluded Jozankei hot spring resort. Tonight begins your ryokan experience with kaiseki dinner and private onsen.',
    activities: [
      {
        id: 'd12-a1',
        time: '9:00 AM',
        type: 'accommodation',
        title: 'Check out of Sapporo hotel',
        description:
          'Pack and check out. Drop luggage in lockers at Sapporo Station (¥300-700/bag depending on size) before heading to the tulip festival.',
      },
      {
        id: 'd12-a2',
        time: '9:30 AM',
        type: 'free',
        title: 'Drop luggage at Sapporo Station lockers',
        address: 'Kita 5 Jonishi, Chuo Ward, Sapporo Station, Hokkaido',
        lat: 43.0686,
        lng: 141.3508,
        description:
          'Use coin lockers at Sapporo Station for day bags while visiting the tulip festival. Retrieve before heading to Jozankei.',
      },
      {
        id: 'd12-a3',
        time: '10:00 AM',
        type: 'sightseeing',
        title: 'Takino Suzuran Hillside Park — Tulip Festival',
        address: '247 Takino, Minami Ward, Sapporo, Hokkaido 005-0862',
        lat: 42.9602,
        lng: 141.2949,
        description:
          "One of Hokkaido's most celebrated spring events — hundreds of thousands of tulips across sweeping hillside gardens. The park's sculpted terrain creates dramatic views of colorful fields against the surrounding forests. In May, the tulips peak alongside cherry blossoms and daffodils in perfect Hokkaido spring conditions.",
        highlight:
          'The upper hillside fields offer the best views — walk up the main path for the panoramic angle. Morning light is beautiful here.',
        note:
          'Bus from Makomanai Subway Station (~35 mins). Admission: ¥700 adults during tulip season. Peak bloom typically May 10-20.',
      },
      {
        id: 'd12-a4',
        time: '12:00 PM',
        type: 'transport',
        title: 'Travel back to Sapporo Station (1 hr)',
        description:
          'Return bus to Makomanai Station, then subway back to Sapporo. Collect bags from station lockers.',
        lat: 43.0686,
        lng: 141.3508,
      },
      {
        id: 'd12-a5',
        time: '1:00 PM',
        type: 'meal',
        title: 'Lunch at Sapporo Station',
        isTBD: true,
        lat: 43.0686,
        lng: 141.3508,
        description:
          'Quick lunch at Sapporo Station before heading to the mountains. Stellar Place food floor has excellent options.',
        alternatives: [
          {
            id: 'd12-a5-alt1',
            name: 'Tokachi Butadon Ippin · Stellar Place',
            note: 'Hokkaido-style pork rice bowl (butadon) — sweet soy-glazed pork over rice. A regional specialty from Obihiro.',
            lat: 43.0686,
            lng: 141.3508,
          },
          {
            id: 'd12-a5-alt2',
            name: 'Ramen Yoshiyama Shouten',
            note: 'Sapporo-style miso ramen — thick, rich broth with butter and corn. A Hokkaido staple.',
            lat: 43.0686,
            lng: 141.3508,
          },
        ],
      },
      {
        id: 'd12-a6',
        time: '2:30 PM',
        type: 'transport',
        title: 'Bus → Jozankei Yurakusoan Ryokan',
        description:
          'Jotetsu Bus from Sapporo Station North Exit (Kita 7-jo nishi 3-chome) toward Jozankei. ~1hr 15 mins, ¥800. The road follows the Toyohira River into the mountains — a beautiful journey as the city gives way to forested gorges.',
        lat: 42.9984,
        lng: 141.1243,
      },
      {
        id: 'd12-a7',
        time: '3:30 PM',
        type: 'accommodation',
        title: 'Check into Jozankei Yurakusoan Ryokan',
        address: '3 Chome-228-1 Jozankeionsenhigashi, Minami Ward, Sapporo, Hokkaido 061-2301',
        lat: 42.9984,
        lng: 141.1243,
        description:
          'A premium ryokan (traditional Japanese inn) in the Jozankei onsen resort town, 30km south of Sapporo in the Toyohira River valley. Features private in-room cedar hot spring tubs fed by natural spring water, plus four shared kashikiri (private reservation) outdoor baths. Yukata provided, kaiseki dinner and breakfast included.',
        highlight:
          'The private in-room onsen is the main event — plan to use it multiple times during the stay. The water is naturally sulfur-rich and deeply relaxing.',
        note: 'Ryokan check-in often includes a welcome tea. Change into yukata, explore the grounds, and settle in before dinner.',
      },
      {
        id: 'd12-a8',
        time: '4:30 PM',
        type: 'free',
        title: 'Explore Jozankei village',
        address: 'Jozankei, Minami Ward, Sapporo, Hokkaido',
        lat: 42.9984,
        lng: 141.1243,
        description:
          'A short walk around the small hot spring resort town. Options include Futami Suspension Bridge (a picturesque gorge bridge over the Toyohira River) and Iwato Kannondo Temple, or simply walking the riverside path through the forested valley.',
        note: 'The Toyohira River walk behind the main street is particularly peaceful at dusk.',
      },
      {
        id: 'd12-a9',
        time: 'Dinner',
        type: 'meal',
        title: 'Traditional Kaiseki Dinner at Ryokan',
        isTBD: true,
        lat: 42.9984,
        lng: 141.1243,
        description:
          "A multi-course kaiseki meal served in your room or the dining hall. Hokkaido kaiseki emphasizes the island's exceptional seafood — snow crab, uni (sea urchin), Hokkaido wagyu, and seasonal mountain vegetables. Beautifully plated in traditional lacquerware with local sake pairings.",
        highlight:
          'Hokkaido kaiseki is arguably the finest regional cuisine in Japan. Eat slowly and appreciate each course.',
      },
    ],
  },
  {
    id: 'day-13',
    dayNumber: 13,
    date: '2026-05-13',
    dayLabel: 'Wednesday, May 13',
    title: 'Jozankei — Hike & Onsen',
    leg: 'hokkaido',
    travelers: 'John & Sabrina',
    summary:
      'A full mountain day in the Jozankei backcountry — choose your trail from a gentle forest loop to a demanding summit with views across Hokkaido. Return to the ryokan for a private outdoor onsen soak and another kaiseki dinner.',
    activities: [
      {
        id: 'd13-a1',
        time: 'Morning',
        type: 'sightseeing',
        title: 'Mountain Hike in Jozankei',
        lat: 42.9984,
        lng: 141.1243,
        description:
          'Choose your hiking trail based on fitness and ambition. Both trails start from near the ryokan and offer classic Hokkaido forest landscapes with river views.',
        highlight:
          'Mt. Asahi is accessible and rewarding in 2-3 hours. Mt. Jozankei Tengu is a serious mountain day with exceptional summit views.',
        alternatives: [
          {
            id: 'd13-a1-alt1',
            name: 'Mt. Asahi (598m) — 2.5-3 hours round trip',
            note: 'Trail starts behind the shrine at the top of the village. Forest path winds up through birch and spruce, returns along the Toyohira River. Perfect before a post-hike soak. Moderate difficulty.',
            lat: 43.01,
            lng: 141.12,
          },
          {
            id: 'd13-a1-alt2',
            name: 'Mt. Jozankei Tengu (1,145m) — 5-6 hours round trip',
            note: 'Steeper and more demanding — dramatic summit with views of Lake Sapporo, surrounding peaks, and Mt. Yotei. Pack lunch, trekking poles recommended. Serious mountain day.',
            lat: 42.98,
            lng: 141.08,
          },
        ],
      },
      {
        id: 'd13-a2',
        time: 'Midday',
        type: 'meal',
        title: 'Lunch — TBD',
        isTBD: true,
        lat: 42.9984,
        lng: 141.1243,
        description:
          'Lunch options in Jozankei village — several small restaurants and cafes along the main street. The ryokan may also provide a boxed lunch if requested in advance.',
      },
      {
        id: 'd13-a3',
        time: 'Late Afternoon',
        type: 'free',
        title: 'Private Onsen at Ryokan',
        lat: 42.9984,
        lng: 141.1243,
        description:
          "Return from the hike and soak in the ryokan's private in-room cedar tub or reserve one of the four kashikiri outdoor baths. Jozankei's spring water is naturally sodium chloride with sulfur content — known for softening skin and easing muscle fatigue. A private outdoor bath (rotemburo) surrounded by forest is available.",
        highlight:
          'The outdoor bath (rotemburo) surrounded by forest is the most memorable onsen experience. Book a kashikiri slot in advance at the front desk.',
      },
      {
        id: 'd13-a4',
        time: 'Dinner',
        type: 'meal',
        title: 'Dinner at Ryokan — TBD',
        isTBD: true,
        lat: 42.9984,
        lng: 141.1243,
        description:
          "Second kaiseki dinner at the ryokan. Likely to feature different seasonal preparations from the first night — ask staff about what's featured tonight.",
      },
    ],
  },
  {
    id: 'day-14',
    dayNumber: 14,
    date: '2026-05-14',
    dayLabel: 'Thursday, May 14',
    title: 'Return to Sapporo & Lilac Festival',
    leg: 'hokkaido',
    travelers: 'John & Sabrina',
    summary:
      'Check out of the ryokan and return to Sapporo for the Lilac Festival — 400 lilac trees in full bloom across 12 city blocks of Odori Park with outdoor wine stalls. Cap the night with a guided bar hopping food tour through Susukino.',
    activities: [
      {
        id: 'd14-a1',
        time: '10:30 AM',
        type: 'transport',
        title: 'Check out — Bus → Sapporo Station',
        description:
          'Jotetsu Bus back to Sapporo from Jozankei. ~1hr 15 mins. Arrive Sapporo ~11:45 AM.',
        lat: 43.0686,
        lng: 141.3508,
      },
      {
        id: 'd14-a2',
        time: '11:00 AM',
        type: 'free',
        title: 'Drop bags at The Royal Park Canvas – Sapporo Odori Park',
        address: '1 Chome-12 Odorinishi, Chuo Ward, Sapporo, Hokkaido 060-0042',
        lat: 43.0686,
        lng: 141.3508,
        description:
          'Return to the same hotel for the final night. Drop bags before the early check-in time if needed — the hotel will hold bags.',
      },
      {
        id: 'd14-a3',
        time: '12:30 PM',
        type: 'meal',
        title: 'Miso Ramen · Ganso Ramen Yokocho Sapporo',
        address: '〒064-0805 Hokkaido, Sapporo, Chuo Ward, Minami 5 Jonishi, 3 Chome-8 Ｎ・グランデビル 1F',
        lat: 43.0552,
        lng: 141.353,
        description:
          "Sapporo's legendary Ramen Alley (Ramen Yokocho) — a narrow lane of small ramen shops that has operated since 1951. Sapporo-style miso ramen is the local specialty: a rich, slightly sweet miso broth made with chicken or pork stock, topped with butter, corn, and sometimes a whole Hokkaido crab leg.",
        highlight:
          "Sapporo miso ramen with butter and corn is one of Japan's greatest regional dishes. The lane is atmospheric even before you eat — tiny shops, steam, the smell of broth.",
      },
      {
        id: 'd14-a4',
        time: '2:00 PM',
        type: 'sightseeing',
        title: 'Odori Park — Lilac Festival',
        address: 'Odori Nishi, Chuo Ward, Sapporo, Hokkaido 060-0042',
        lat: 43.0602,
        lng: 141.3527,
        description:
          "Odori Park is Sapporo's magnificent central green corridor — a 13-block, 1.5km linear park stretching west from the Sapporo TV Tower. During the Lilac Festival (typically mid-May), approximately 400 lilac trees bloom in lavender, white, and purple, filling the park with fragrance. Outdoor wine gardens serve Hokkaido wines and seasonal food stalls dot the route.",
        highlight:
          "Walk the full length of the park from the TV Tower west — the lilac concentration increases toward the western blocks. The outdoor wine stalls serve Hokkaido's excellent small-producer wines.",
        note:
          "Festival typically runs May 15-27 — you'll be there right at the opening days. Check the Sapporo city website for exact dates and concert schedule.",
      },
      {
        id: 'd14-a5',
        time: '6:00 PM',
        type: 'entertainment',
        title: 'Sapporo Bar Hopping Food Tour',
        address: 'Susukino Station, Minami 4 Jonishi, Chuo Ward, Sapporo',
        lat: 43.0552,
        lng: 141.353,
        description:
          "A guided bar hop through Susukino — Sapporo's famous entertainment district with over 4,500 bars, restaurants, and clubs. The tour visits multiple local spots sampling Hokkaido-specific foods and drinks: crab, uni, Sapporo draft beer, Hokkaido sake, and Nikka whisky (distilled locally in nearby Yoichi).",
        highlight:
          "Susukino is one of Japan's great nightlife districts — the energy at 8pm rivals Shinjuku. The NIKKA sign (giant illuminated whisky ad) is the iconic landmark.",
        note: 'Meet under the giant NIKKA Sign outside Susukino Station. Confirm tour meeting time and details with booking confirmation.',
      },
      {
        id: 'd14-a6',
        time: '10:00 PM',
        type: 'free',
        title: 'Back to hotel — sleep',
        description: 'Early morning tomorrow for the airport — get a good night rest.',
      },
    ],
  },
  {
    id: 'day-15',
    dayNumber: 15,
    date: '2026-05-15',
    dayLabel: 'Friday, May 15',
    title: 'The Easy Return',
    leg: 'hokkaido',
    travelers: 'John & Sabrina',
    summary:
      'A smooth, unhurried departure from Sapporo — no rush, no stress. The airport train from downtown makes this the easiest possible travel day. A final Royce Chocolate shopping stop at the airport, then home via Haneda.',
    activities: [
      {
        id: 'd15-a1',
        time: '8:30 AM',
        type: 'accommodation',
        title: 'Check out of hotel',
        description:
          'Pack and check out of Royal Park Canvas. The hotel is minutes from Sapporo Station and the airport train — no rush.',
      },
      {
        id: 'd15-a2',
        time: '8:45 AM',
        type: 'transport',
        title: 'JR Rapid Airport Train → New Chitose Airport (CTS)',
        address: 'New Chitose Airport, Chitose, Hokkaido 066-0012',
        lat: 42.7752,
        lng: 141.6921,
        description:
          'From Sapporo Station Platform 5 — JR Rapid Airport Express to New Chitose Airport. 37 minutes, ¥1,150. Runs every 15 minutes. Buy tickets at the JR ticket counter or use IC card.',
      },
      {
        id: 'd15-a3',
        time: '10:00 AM',
        type: 'free',
        title: 'Airport souvenirs — Royce Chocolate, Shiroi Koibito, Butter Sand',
        address: 'New Chitose Airport, Chitose, Hokkaido 066-0012',
        lat: 42.7752,
        lng: 141.6921,
        description:
          'New Chitose Airport has the best Hokkaido souvenir shopping in the world — the Royce Chocolate Factory (you can watch chocolate being made), Shiroi Koibito cookies (the most famous Hokkaido souvenir), butter sand cookies, Yoichi whisky bottles, and countless seafood products. Allow at least 45-60 minutes.',
        highlight:
          "Royce Chocolate's nama (fresh cream) chocolate in the airport is a Hokkaido icon — buy several boxes. They must stay refrigerated. The airport has a dedicated Royce store with flavors unavailable elsewhere.",
        note:
          'Fresh chocolate products need refrigeration — airport duty-free bags with ice packs available at purchase.',
      },
      {
        id: 'd15-a4',
        time: '10:15 AM',
        type: 'transport',
        title: 'Fly CTS → HND — Air Do HD18',
        description:
          "Departs New Chitose 10:15 AM, arrives Haneda 12:00 PM (~1.5 hrs). Air Do is a reliable regional carrier — Hokkaido's local airline.",
        lat: 35.5494,
        lng: 139.7798,
      },
      {
        id: 'd15-a5',
        time: '4:30 PM',
        type: 'transport',
        title: 'International flight departs Haneda (HND)',
        address: 'Haneda Airport Terminal 3, Ota City, Tokyo 144-0041',
        lat: 35.5494,
        lng: 139.7798,
        description:
          'Allow 2+ hours before departure from arrival at HND (12pm → 4:30pm departure gives comfortable time for customs, transfer, and boarding). Terminal 3 for international departures.',
      },
    ],
  },
]

const goldenWeekAccommodations: Accommodation[] = [
  {
    id: 'gw-stay-1',
    name: 'Holiday Inn Express · Shinagawa Area',
    type: 'hotel',
    checkIn: 'May 1',
    checkOut: 'May 3',
    nights: 2,
    address: 'Shinagawa, Tokyo, Japan',
    bookingUrl: '',
    notes: '',
  },
  {
    id: 'gw-stay-2',
    name: 'Rental Home · Kamisuzuyachō',
    type: 'rental',
    checkIn: 'May 3',
    checkOut: 'May 8',
    nights: 5,
    address: '74-1-1 Kamisuzuyachō, Kyōto-shi, 600-8312',
    bookingUrl: '',
    notes: '',
  },
  {
    id: 'gw-stay-3',
    name: 'Rental Home · Omori',
    type: 'rental',
    checkIn: 'May 8',
    checkOut: 'May 10',
    nights: 2,
    address: '3-chōme-11-9 Ōmorikita, Ota City, Tokyo 143-0016',
    bookingUrl: '',
    notes: '',
  },
]

const hokkaidoAccommodations: Accommodation[] = [
  {
    id: 'hk-stay-1',
    name: 'The Royal Park Canvas – Sapporo Odori Park',
    type: 'hotel',
    checkIn: 'May 11',
    checkOut: 'May 12',
    nights: 1,
    address: '1 Chome-12 Odorinishi, Chuo Ward, Sapporo, Hokkaido 060-0042',
    bookingUrl: '',
    notes: '',
  },
  {
    id: 'hk-stay-2',
    name: 'Jozankei Yurakusoan Ryokan',
    type: 'ryokan',
    checkIn: 'May 12',
    checkOut: 'May 14',
    nights: 2,
    address: '3 Chome-228-1 Jozankeionsenhigashi, Minami Ward, Sapporo, Hokkaido 061-2301',
    bookingUrl: '',
    notes:
      'Private in-room onsen in every room. Four free kashikiri private baths. Kaiseki dinner included.',
  },
  {
    id: 'hk-stay-3',
    name: 'The Royal Park Canvas – Sapporo Odori Park (Return)',
    type: 'hotel',
    checkIn: 'May 14',
    checkOut: 'May 15',
    nights: 1,
    address: '1 Chome-12 Odorinishi, Chuo Ward, Sapporo, Hokkaido 060-0042',
    bookingUrl: '',
    notes: '',
  },
]

export const legs: Record<'golden-week' | 'hokkaido', Leg> = {
  'golden-week': {
    id: 'golden-week',
    title: 'Golden Week',
    subtitle: 'Tokyo · Kyoto · Hiroshima · Osaka',
    dateRange: 'May 1–10, 2026',
    travelers: '5 Adults',
    days: goldenWeekDays,
    accommodations: goldenWeekAccommodations,
  },
  hokkaido: {
    id: 'hokkaido',
    title: 'Hokkaido',
    subtitle: 'Sapporo & Jozankei',
    dateRange: 'May 11–15, 2026',
    travelers: 'John & Sabrina',
    days: hokkaidoDays,
    accommodations: hokkaidoAccommodations,
  },
}

export function getLeg(id: string): Leg | undefined {
  if (id === 'golden-week' || id === 'hokkaido') return legs[id]
  return undefined
}
