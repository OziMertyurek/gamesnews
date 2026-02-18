/* eslint-disable */
export interface TgaCategoryWinner {
  category: string
  game: string
  studio: string | null
}

export interface TgaGameOfYearData {
  winner: string | null
  nominees: string[]
  nomineesSource: 'manual-curation' | 'thegameawards-winners-page'
}

export interface TgaYearRecord {
  year: number
  source: string
  gameOfTheYear: TgaGameOfYearData
  categoryWinners: TgaCategoryWinner[]
}

export interface TgaCurrentCategoryAward {
  slug: string
  category: string
  winner: string | null
  nominees: string[]
}

export const tgaCurrentAwardsYear = 2025

export const tgaYearRecords: TgaYearRecord[] = [
  {
    "year": 2018,
    "source": "https://thegameawards.com/rewind/year-2018",
    "gameOfTheYear": {
      "winner": "God of War",
      "nominees": [
        "Assassin's Creed Odyssey",
        "Celeste",
        "God of War",
        "Marvel's Spider-Man",
        "Monster Hunter: World",
        "Red Dead Redemption 2"
      ],
      "nomineesSource": "manual-curation"
    },
    "categoryWinners": [
      {
        "category": "Game of the Year",
        "game": "God of War",
        "studio": "Sony Santa Monica / SIE"
      },
      {
        "category": "Best Ongoing Game",
        "game": "Fortnite",
        "studio": "Epic Games"
      },
      {
        "category": "Best Game Direction",
        "game": "God of War",
        "studio": "Sony Santa Monica / SIE"
      },
      {
        "category": "Best Narrative",
        "game": "Red Dead Redemption 2",
        "studio": "Rockstar Games"
      },
      {
        "category": "Best Art Direction",
        "game": "Return of the Obra Dinn",
        "studio": "3909 LLC"
      },
      {
        "category": "BEST SCORE/MUSIC - PRESENTED BY SPOTIFY",
        "game": "Red Dead Redemption 2",
        "studio": "Woody Jackson / Daniel Lanois"
      },
      {
        "category": "BEST AUDIO DESIGN - PRESENTED BY DOLBY",
        "game": "Red Dead Redemption 2",
        "studio": "Rockstar Games"
      },
      {
        "category": "BEST PERFORMANCE",
        "game": "Roger Clark as Arthur Morgan",
        "studio": "Red Dead Redemption II"
      },
      {
        "category": "GAMES FOR IMPACT",
        "game": "Celeste",
        "studio": "Matt Makes Games"
      },
      {
        "category": "BEST INDEPENDENT GAME",
        "game": "Celeste",
        "studio": "Matt Makes Games"
      },
      {
        "category": "BEST MOBILE GAME",
        "game": "Florence",
        "studio": "Mountains"
      },
      {
        "category": "BEST VR/AR GAME",
        "game": "ASTRO BOT Rescue Mission",
        "studio": "SIE Japan Studio / SIE"
      },
      {
        "category": "BEST ACTION GAME",
        "game": "Dead Cells",
        "studio": "Motion Twin"
      },
      {
        "category": "BEST ACTION/ADVENTURE GAME",
        "game": "God of War",
        "studio": "Sony Santa Monica / SIE"
      },
      {
        "category": "BEST ROLE PLAYING GAME",
        "game": "Monster Hunter: World",
        "studio": "Capcom"
      },
      {
        "category": "BEST FIGHTING GAME",
        "game": "Dragon Ball FighterZ",
        "studio": "Arc System Works / BANDAI NAMCO Entertainment"
      },
      {
        "category": "BEST FAMILY GAME",
        "game": "Overcooked 2",
        "studio": "Ghost Town Games / Team 17"
      },
      {
        "category": "BEST STRATEGY GAME",
        "game": "Into the Breach",
        "studio": "Subset Games"
      },
      {
        "category": "BEST SPORTS/RACING GAME",
        "game": "Forza Horizon 4",
        "studio": "Playground Games / Turn 10 Studios / Microsoft Studios"
      },
      {
        "category": "BEST MULTIPLAYER GAME",
        "game": "Fortnite",
        "studio": "Epic Games"
      },
      {
        "category": "BEST STUDENT GAME",
        "game": "Combat 2018",
        "studio": "Inland Norway University of Applied Sciences - Norway"
      },
      {
        "category": "BEST DEBUT INDIE GAME",
        "game": "The Messenger",
        "studio": "Sabotage Studio"
      },
      {
        "category": "BEST ESPORTS GAME",
        "game": "Overwatch",
        "studio": "Blizzard"
      },
      {
        "category": "BEST ESPORTS PLAYER - PRESENTED BY OMEN BY HP",
        "game": "Dominique “SonicFox” McLean",
        "studio": "Echo Fox"
      },
      {
        "category": "BEST ESPORTS TEAM",
        "game": "Cloud9",
        "studio": "LOL"
      },
      {
        "category": "BEST ESPORTS COACH",
        "game": "Bok “Reapered” Han-gyu",
        "studio": "Cloud9"
      },
      {
        "category": "BEST ESPORTS EVENT",
        "game": "League of Legends World Championship",
        "studio": null
      },
      {
        "category": "BEST ESPORTS HOST",
        "game": "Eefje “Sjokz” Depoortere",
        "studio": null
      },
      {
        "category": "BEST ESPORTS MOMENT",
        "game": "C9 Comeback Win In Triple OT vs FAZE",
        "studio": "ELEAGUE"
      },
      {
        "category": "CONTENT CREATOR OF THE YEAR",
        "game": "Ninja",
        "studio": null
      }
    ]
  },
  {
    "year": 2019,
    "source": "https://thegameawards.com/rewind/year-2019",
    "gameOfTheYear": {
      "winner": "Sekiro: Shadows Die Twice",
      "nominees": [
        "Control",
        "Death Stranding",
        "Resident Evil 2",
        "Sekiro: Shadows Die Twice",
        "Super Smash Bros. Ultimate",
        "The Outer Worlds"
      ],
      "nomineesSource": "manual-curation"
    },
    "categoryWinners": [
      {
        "category": "Game of the Year",
        "game": "Sekiro: Shadows Die Twice",
        "studio": "Activision / FromSoftware"
      },
      {
        "category": "Best Ongoing Game",
        "game": "Fortnite",
        "studio": "Epic Games"
      },
      {
        "category": "Best Game Direction",
        "game": "Death Stranding",
        "studio": "Kojima Productions"
      },
      {
        "category": "Best Narrative",
        "game": "Disco Elysium",
        "studio": "ZA/UM"
      },
      {
        "category": "Best Art Direction",
        "game": "Control",
        "studio": "Remedy Entertainment"
      },
      {
        "category": "BEST SCORE/MUSIC - PRESENTED BY SPOTIFY",
        "game": "Death Stranding",
        "studio": "Sony Interactive"
      },
      {
        "category": "BEST AUDIO DESIGN - PRESENTED BY DOLBY",
        "game": "Call of Duty: Modern Warfare",
        "studio": "Activision / Infinity Ward"
      },
      {
        "category": "BEST PERFORMANCE",
        "game": "Mads Mikkelsen",
        "studio": "Death Stranding"
      },
      {
        "category": "GAMES FOR IMPACT",
        "game": "Gris",
        "studio": "Devolver Digital / Nomada Studio"
      },
      {
        "category": "BEST INDEPENDENT GAME",
        "game": "Disco Elysium",
        "studio": "ZA/UM"
      },
      {
        "category": "BEST MOBILE GAME",
        "game": "Call of Duty: Mobile",
        "studio": "Activision / TiMi Studios"
      },
      {
        "category": "BEST VR/AR GAME",
        "game": "Beat Saber",
        "studio": "Beat Games"
      },
      {
        "category": "BEST ACTION GAME",
        "game": "Devil May Cry 5",
        "studio": "Capcom"
      },
      {
        "category": "BEST ACTION/ADVENTURE GAME",
        "game": "Sekiro: Shadows Die Twice",
        "studio": "Activision / FromSoftware"
      },
      {
        "category": "BEST ROLE PLAYING GAME",
        "game": "Disco Elysium",
        "studio": "ZA/UM"
      },
      {
        "category": "BEST FIGHTING GAME",
        "game": "Super Smash Bros. Ultimate",
        "studio": "Nintendo / BANDAI NAMCO Studios"
      },
      {
        "category": "BEST FAMILY GAME",
        "game": "Luigi's Mansion 3",
        "studio": "Nintendo / Next Level Games"
      },
      {
        "category": "BEST STRATEGY GAME",
        "game": "Fire Emblem: Three Houses",
        "studio": "Intelligent Systems / Koei Tecmo / Nintendo"
      },
      {
        "category": "BEST SPORTS/RACING GAME",
        "game": "Crash Team Racing Nitro-Fueled",
        "studio": "Beenox / Activision"
      },
      {
        "category": "BEST MULTIPLAYER GAME",
        "game": "Apex Legends",
        "studio": "Respawn Entertainment / Electronic Arts"
      },
      {
        "category": "BEST COMMUNITY SUPPORT",
        "game": "Destiny 2",
        "studio": "Bungie"
      },
      {
        "category": "FRESH INDIE GAME PRESENTED BY SUBWAY",
        "game": "Disco Elysium",
        "studio": "ZA/UM"
      },
      {
        "category": "BEST ESPORTS GAME",
        "game": "League of Legends",
        "studio": "Riot Games"
      },
      {
        "category": "BEST ESPORTS PLAYER - PRESENTED BY OMEN BY HP",
        "game": "Kyle Giersdorf",
        "studio": "Fortnite"
      },
      {
        "category": "BEST ESPORTS TEAM",
        "game": "G2 Sports",
        "studio": "League of Legends"
      },
      {
        "category": "BEST ESPORTS COACH",
        "game": "Danny Sørensen",
        "studio": "Astralis"
      },
      {
        "category": "BEST ESPORTS EVENT",
        "game": "2019 League of Legends World Championship",
        "studio": "League of Legends"
      },
      {
        "category": "BEST ESPORTS HOST",
        "game": "Eefje “Sjokz” Depoortere",
        "studio": "League of Legends"
      },
      {
        "category": "CONTENT CREATOR OF THE YEAR",
        "game": "Michael 'Shroud' Grzesiek",
        "studio": null
      }
    ]
  },
  {
    "year": 2020,
    "source": "https://thegameawards.com/rewind/year-2020",
    "gameOfTheYear": {
      "winner": "THE LAST OF US PART II",
      "nominees": [
        "Animal Crossing: New Horizons",
        "DOOM Eternal",
        "Final Fantasy VII Remake",
        "Ghost of Tsushima",
        "Hades",
        "The Last of Us Part II"
      ],
      "nomineesSource": "manual-curation"
    },
    "categoryWinners": [
      {
        "category": "GAME OF THE YEAR",
        "game": "THE LAST OF US PART II",
        "studio": "NAUGHTY DOG/SIE"
      },
      {
        "category": "BEST GAME DIRECTION",
        "game": "THE LAST OF US PART II",
        "studio": "NAUGHTY DOG/SIE"
      },
      {
        "category": "BEST NARRAIVE",
        "game": "THE LAST OF US PART II",
        "studio": "WRITERS NEIL DRUCKMANN AND HALLEY GROSS"
      },
      {
        "category": "BEST ART DIRECTION",
        "game": "GHOST OF TSUSHIMA",
        "studio": "SUCKER PUNCH/SIE"
      },
      {
        "category": "BEST SCORE AND MUSIC",
        "game": "FINAL FANTASY VII REMAKE",
        "studio": "COMPOSED BY NOBUO UEMATSU, MASASHI HAMAUZU AND MITSUTO SUZUKI"
      },
      {
        "category": "BEST AUDIO DESIGN",
        "game": "THE LAST OF US PART II",
        "studio": "NAUGHTY DOG/SIE"
      },
      {
        "category": "BEST PERFORMANCE",
        "game": "LAURA BAILEY AS ABBY",
        "studio": "THE LAST OF US PART II"
      },
      {
        "category": "GAMES FOR IMPACT",
        "game": "TELL ME WHY",
        "studio": "DONTNOD ENTERTAINMENT/XBOX GAME STUDIOS"
      },
      {
        "category": "BEST ONGOING",
        "game": "NO MAN’S SKY",
        "studio": "HELLO GAMES"
      },
      {
        "category": "BEST INDIE",
        "game": "HADES",
        "studio": "SUPERGIANT GAMES"
      },
      {
        "category": "BEST MOBILE GAME",
        "game": "AMONG US",
        "studio": "INNERSLOTH"
      },
      {
        "category": "BEST COMMUNITY SUPPORT",
        "game": "FALL GUYS: ULTIMATE KNOCKOUT",
        "studio": "MEDIATONIC/DEVOLVER"
      },
      {
        "category": "BEST VR/AR",
        "game": "HALF-LIFE: ALYX",
        "studio": "VALVE"
      },
      {
        "category": "INNOVATION IN ACCESSIBILITY",
        "game": "THE LAST OF US PART II",
        "studio": "NAUGHTY DOG/SIE"
      },
      {
        "category": "BEST ACTION",
        "game": "HADES",
        "studio": "SUPERGIANT GAMES"
      },
      {
        "category": "BEST ACTION/ADVENTURE",
        "game": "THE LAST OF US PART II",
        "studio": "NAUGHTY DOG/SIE"
      },
      {
        "category": "BEST ROLE PLAYING",
        "game": "FINAL FANTASY VII REMAKE",
        "studio": "SQUARE ENIX"
      },
      {
        "category": "BEST FIGHTING",
        "game": "MORTAL KOMBAT 11 ULTIMATE",
        "studio": "NETHERREALM STUDIOS/WB GAMES"
      },
      {
        "category": "BEST FAMILY",
        "game": "ANIMAL CROSSING: NEW HORIZONS",
        "studio": "NINTENDO"
      },
      {
        "category": "BEST SIM/STRATEGY",
        "game": "MICROSOFT FLIGHT SIMULATOR",
        "studio": "ASOBO/XBOX GAME STUDIOS"
      },
      {
        "category": "BEST SPORTS/RACING",
        "game": "TONY HAWK’S PRO SKATER 1+2",
        "studio": "VICARIOUS VISIONS/ACTIVISION"
      },
      {
        "category": "BEST MULTIPLAYER",
        "game": "AMONG US",
        "studio": "INNERSLOTH"
      },
      {
        "category": "CONTENT CREATOR OF THE YEAR",
        "game": "VALKYRAE",
        "studio": null
      },
      {
        "category": "BEST DEBUT GAME",
        "game": "PHASMOPHOBIA",
        "studio": "KINETIC GAMES"
      },
      {
        "category": "BEST ESPORTS ATHLETE",
        "game": "HEO “SHOWMAKER” SU",
        "studio": "LEAGUE OF LEGENDS"
      },
      {
        "category": "BEST ESPORTS COACH",
        "game": "DANNY “ZONIC” SORENSEN",
        "studio": "CSGO"
      },
      {
        "category": "BEST ESPORTS EVENT",
        "game": "LEAGUE OF LEGENDS WORLD CHAMPIONSHIP 2020",
        "studio": "LEAGUE OF LEGENDS"
      },
      {
        "category": "BEST ESPORTS GAME",
        "game": "LEAGUE OF LEGENDS",
        "studio": "RIOT GAMES"
      },
      {
        "category": "BEST ESPORTS HOST",
        "game": "EEFJE “SJOKZ” DEPOORTERE",
        "studio": null
      },
      {
        "category": "BEST ESPORTS TEAM",
        "game": "G2 ESPORTS",
        "studio": "LEAGUE OF LEGENDS"
      }
    ]
  },
  {
    "year": 2021,
    "source": "https://thegameawards.com/rewind/year-2021",
    "gameOfTheYear": {
      "winner": "It Takes Two",
      "nominees": [
        "Deathloop",
        "It Takes Two",
        "Metroid Dread",
        "Psychonauts 2",
        "Ratchet & Clank: Rift Apart",
        "Resident Evil Village"
      ],
      "nomineesSource": "manual-curation"
    },
    "categoryWinners": [
      {
        "category": "GAME OF THE YEAR",
        "game": "It Takes Two",
        "studio": "Hazelight / Electronic Arts"
      },
      {
        "category": "BEST GAME DIRECTION",
        "game": "Deathloop",
        "studio": "Arkane Studios / Bethesda"
      },
      {
        "category": "BEST NARRATIVE",
        "game": "MARVEL's Guardians of the Galaxy",
        "studio": "Eidos Montreal / Square Enix"
      },
      {
        "category": "BEST ART DIRECTION",
        "game": "Deathloop",
        "studio": "Arkane Studios / Bethesda"
      },
      {
        "category": "BEST SCORE AND MUSIC",
        "game": "Nier Replicant Ver.1.22474487139",
        "studio": "Keiichi Okabe, Composer"
      },
      {
        "category": "BEST AUDIO DESIGN",
        "game": "FORZA Horizon 5",
        "studio": "Playground Games / Xbox Game Studios"
      },
      {
        "category": "BEST PERFORMANCE",
        "game": "MAGGIE ROBERTSON AS LADY DIMITRESCU",
        "studio": "RESIDENT EVIL VILLAGE"
      },
      {
        "category": "GAMES FOR IMPACT",
        "game": "LIFE IS STRANGE: TRUE COLORS",
        "studio": "Deck Nine / Square Enix"
      },
      {
        "category": "BEST ONGOING",
        "game": "Final FantasY XIV Online",
        "studio": "Square Enix"
      },
      {
        "category": "BEST INDIE",
        "game": "Kena: Bridge of Spirits",
        "studio": "Ember Lab"
      },
      {
        "category": "BEST MOBILE GAME",
        "game": "Genshin Impact",
        "studio": "MiHoYo"
      },
      {
        "category": "BEST COMMUNITY SUPPORT",
        "game": "Final Fantasy XIV Online",
        "studio": "Square Enix"
      },
      {
        "category": "INNOVATION IN ACCESSIBILITY",
        "game": "FORZA Horizon 5",
        "studio": "Playground Games / Xbox Game Studios"
      },
      {
        "category": "BEST VR/AR",
        "game": "Resident Evil 4",
        "studio": "Armature Studio / Capcom / Oculus Studios"
      },
      {
        "category": "BEST ACTION GAME",
        "game": "RETURNAL",
        "studio": "Housemarque / SIE"
      },
      {
        "category": "BEST ACTION/ADVENTURE",
        "game": "Metroid Dread",
        "studio": "Mercurysteam / Nintendo"
      },
      {
        "category": "BEST ROLE PLAYING",
        "game": "Tales of Arise",
        "studio": "Bandai Namco"
      },
      {
        "category": "BEST FIGHTING",
        "game": "Guilty Gear -Strive-",
        "studio": "ArcSystemWorks"
      },
      {
        "category": "BEST FAMILY",
        "game": "It Takes Two",
        "studio": "Hazelight / Electronic Arts"
      },
      {
        "category": "BEST SIM/STRATEGY",
        "game": "Age of Empires IV",
        "studio": "Relic Entertainment / Xbox Game Studios"
      },
      {
        "category": "BEST SPORTS/RACING",
        "game": "FORZA Horizon 5",
        "studio": "Playground Games / Xbox Game Studios"
      },
      {
        "category": "BEST MULTIPLAYER",
        "game": "IT TAKES TWO",
        "studio": "Hazelight / Electronic Arts"
      },
      {
        "category": "CONTENT CREATOR OF THE YEAR",
        "game": "DREAM",
        "studio": null
      },
      {
        "category": "BEST DEBUT INDIE",
        "game": "Kena: Bridge of Spirits",
        "studio": "Ember Lab"
      },
      {
        "category": "MOST ANTICIPATED GAME",
        "game": "Elden Ring",
        "studio": "FromSoftware / Bandai Namco"
      },
      {
        "category": "BEST ESPORTS GAME",
        "game": "League of Legends",
        "studio": "Riot Games"
      },
      {
        "category": "BEST ESPORTS ATHLETE",
        "game": "Oleksandr \"S1mple\" Kostyliev",
        "studio": null
      },
      {
        "category": "BEST ESPORTS TEAM",
        "game": "Natus Vincere",
        "studio": "Counter-Strike: Global Offensive"
      },
      {
        "category": "BEST ESPORTS COACH",
        "game": "Kim \"Kkoma\" Jeong-Gyun",
        "studio": null
      },
      {
        "category": "BEST ESPORTS EVENT",
        "game": "2021 League of Legends World Championship",
        "studio": null
      }
    ]
  },
  {
    "year": 2022,
    "source": "https://thegameawards.com/rewind/year-2022",
    "gameOfTheYear": {
      "winner": "Elden Ring",
      "nominees": [
        "A Plague Tale: Requiem",
        "Elden Ring",
        "God of War Ragnarok",
        "Horizon Forbidden West",
        "Stray",
        "Xenoblade Chronicles 3"
      ],
      "nomineesSource": "manual-curation"
    },
    "categoryWinners": [
      {
        "category": "GAME OF THE YEAR",
        "game": "Elden Ring",
        "studio": "From Software/Bandai Namco"
      },
      {
        "category": "BEST GAME DIRECTION",
        "game": "Elden Ring",
        "studio": "From Software / Bandai Namco"
      },
      {
        "category": "BEST NARRATIVE",
        "game": "God of War Ragnarok",
        "studio": "Santa Monica Studio / SIE"
      },
      {
        "category": "BEST ART DIRECTION",
        "game": "Elden Ring",
        "studio": "From Software / Bandai Namco"
      },
      {
        "category": "BEST SCORE AND MUSIC",
        "game": "God of War Ragnarok",
        "studio": "Bear McCreary"
      },
      {
        "category": "BEST AUDIO DESIGN",
        "game": "God of War Ragnarok",
        "studio": "Santa Monica Studio / SIE"
      },
      {
        "category": "BEST PERFORMANCE",
        "game": "Christopher Judge as Kratos",
        "studio": "God of War Ragnarok"
      },
      {
        "category": "GAMES FOR IMPACT",
        "game": "As Dusk Falls",
        "studio": "Interior Night / Xbox Game Studios"
      },
      {
        "category": "BEST ONGOING",
        "game": "Final FantasY XIV Online",
        "studio": "Square Enix"
      },
      {
        "category": "BEST INDIE",
        "game": "Stray",
        "studio": "BlueTwelve Studio / Annapurna Interactive"
      },
      {
        "category": "BEST MOBILE GAME",
        "game": "Marvel SNAP",
        "studio": "Second Dinner / Nuverse"
      },
      {
        "category": "BEST COMMUNITY SUPPORT",
        "game": "Final Fantasy XIV Online",
        "studio": "Square Enix"
      },
      {
        "category": "INNOVATION IN ACCESSIBILITY",
        "game": "God of War Ragnarok",
        "studio": "Santa Monica Studio / SIE"
      },
      {
        "category": "BEST VR/AR",
        "game": "Moss: Book II",
        "studio": "Polyarc"
      },
      {
        "category": "BEST ACTION GAME",
        "game": "Bayonetta 3",
        "studio": "PlatinumGames / Nintendo"
      },
      {
        "category": "BEST ACTION/ADVENTURE",
        "game": "God of War Ragnarok",
        "studio": "Santa Monica Studio / SIE"
      },
      {
        "category": "BEST ROLE PLAYING",
        "game": "Elden Ring",
        "studio": "From Software / Bandai Namco"
      },
      {
        "category": "BEST FIGHTING",
        "game": "MultiVersus",
        "studio": "Player First Games / WB Games"
      },
      {
        "category": "BEST FAMILY",
        "game": "Kirby and the Forgotten Land",
        "studio": "HAL Laboratory / Nintendo"
      },
      {
        "category": "BEST SIM/STRATEGY",
        "game": "Mario + Rabbids Sparks of Hope",
        "studio": "Ubisoft Milan/Paris, Ubisoft"
      },
      {
        "category": "BEST SPORTS/RACING",
        "game": "Gran Turismo 7",
        "studio": "Polyphony Digital / SIE"
      },
      {
        "category": "BEST MULTIPLAYER",
        "game": "Splatoon 3",
        "studio": "Nintendo EPD / Nintendo"
      },
      {
        "category": "CONTENT CREATOR OF THE YEAR",
        "game": "Ludwig Ahgren",
        "studio": null
      },
      {
        "category": "BEST DEBUT INDIE",
        "game": "Stray",
        "studio": "BlueTwelve Studio / Annapurna Interactive"
      },
      {
        "category": "MOST ANTICIPATED GAME",
        "game": "The Legend of Zelda: Tears of the Kingdom",
        "studio": "Nintendo EPD / Nintendo"
      },
      {
        "category": "BEST ADAPTATION",
        "game": "Arcane",
        "studio": "Fortiche / Riot Games / Netflix"
      },
      {
        "category": "PLAYERS' VOICE",
        "game": "Genshin Impact",
        "studio": "MiHoYo"
      },
      {
        "category": "BEST ESPORTS GAME",
        "game": "Valorant",
        "studio": "Riot Games"
      },
      {
        "category": "BEST ESPORTS ATHLETE",
        "game": "Jacob \"yay\" Whiteaker",
        "studio": null
      },
      {
        "category": "BEST ESPORTS TEAM",
        "game": "LOUD",
        "studio": "Valorant"
      },
      {
        "category": "BEST ESPORTS COACH",
        "game": "Matheus \"bzkA\" Tarasconi",
        "studio": null
      },
      {
        "category": "BEST ESPORTS EVENT",
        "game": "2022 League of Legends World Championship",
        "studio": null
      }
    ]
  },
  {
    "year": 2023,
    "source": "https://thegameawards.com/rewind/year-2023",
    "gameOfTheYear": {
      "winner": "Baldur's Gate 3",
      "nominees": [
        "Alan Wake 2",
        "Baldur's Gate 3",
        "Marvel's Spider-Man 2",
        "Resident Evil 4",
        "Super Mario Bros. Wonder",
        "The Legend of Zelda: Tears of the Kingdom"
      ],
      "nomineesSource": "manual-curation"
    },
    "categoryWinners": [
      {
        "category": "GAME OF THE YEAR",
        "game": "Baldur's Gate 3",
        "studio": "Larian Studios"
      },
      {
        "category": "BEST GAME DIRECTION",
        "game": "Alan Wake 2",
        "studio": "Remedy Entertainment / Epic Games Publishing"
      },
      {
        "category": "BEST NARRATIVE",
        "game": "Alan Wake 2",
        "studio": "Remedy Entertainment / Epic Games Publishing"
      },
      {
        "category": "BEST ART DIRECTION",
        "game": "Alan Wake 2",
        "studio": "Remedy Entertainment / Epic Games Publishing"
      },
      {
        "category": "BEST SCORE AND MUSIC",
        "game": "Final Fantasy XVI",
        "studio": "Masayoshi Soken"
      },
      {
        "category": "BEST AUDIO DESIGN",
        "game": "Hi-Fi Rush",
        "studio": "Tango Gameworks / Bethesda Softworks"
      },
      {
        "category": "BEST PERFORMANCE",
        "game": "Neil Newbon",
        "studio": "Baldur's Gate 3"
      },
      {
        "category": "GAMES FOR IMPACT",
        "game": "Tchia",
        "studio": "Awaceb / Kepler Interactive"
      },
      {
        "category": "BEST ONGOING",
        "game": "Cyberpunk 2077",
        "studio": "CD Projekt Red"
      },
      {
        "category": "BEST INDEPENDENT GAME",
        "game": "Sea of Stars",
        "studio": "Sabotage Studio"
      },
      {
        "category": "BEST MOBILE GAME",
        "game": "Honkai: Star Rail",
        "studio": "HoYoverse"
      },
      {
        "category": "BEST COMMUNITY SUPPORT",
        "game": "Baldur's Gate 3",
        "studio": "Larian Studios"
      },
      {
        "category": "INNOVATION IN ACCESSIBILITY",
        "game": "Forza Motorsport",
        "studio": "Turn 10 Studios / Xbox Game Studios"
      },
      {
        "category": "BEST VR/AR",
        "game": "Resident Evil Village VR Mode",
        "studio": "Capcom"
      },
      {
        "category": "BEST ACTION GAME",
        "game": "Armored Core VI: Fires of Rubicon",
        "studio": "FromSoftware / Bandai Namco"
      },
      {
        "category": "BEST ACTION/ADVENTURE",
        "game": "The Legend of Zelda: Tears of the Kingdom",
        "studio": "Nintendo EPD / Nintendo"
      },
      {
        "category": "BEST ROLE PLAYING",
        "game": "Baldur's Gate 3",
        "studio": "Larian Studios"
      },
      {
        "category": "BEST FIGHTING",
        "game": "Street Fighter 6",
        "studio": "Capcom"
      },
      {
        "category": "BEST FAMILY",
        "game": "Super Mario Bros Wonder",
        "studio": "Nintendo EPD / Nintendo"
      },
      {
        "category": "BEST SIM/STRATEGY",
        "game": "Pikmin 4",
        "studio": "Nintendo EPD / Nintendo"
      },
      {
        "category": "BEST SPORTS/RACING",
        "game": "Forza Motorsport",
        "studio": "Turn 10 Studios / Xbox Game Studios"
      },
      {
        "category": "BEST MULTIPLAYER",
        "game": "Baldur's Gate 3",
        "studio": "Larian Studios"
      },
      {
        "category": "CONTENT CREATOR OF THE YEAR",
        "game": "Ironmouse",
        "studio": null
      },
      {
        "category": "BEST DEBUT INDIE",
        "game": "Cocoon",
        "studio": "Geometric Interactive / Annapurna Interactive"
      },
      {
        "category": "MOST ANTICIPATED GAME",
        "game": "Final Fantasy VII Rebirth",
        "studio": "Square Enix"
      },
      {
        "category": "BEST ADAPTATION",
        "game": "The Last of Us",
        "studio": "PlayStation Productions / HBO"
      },
      {
        "category": "PLAYERS' VOICE",
        "game": "Genshin Impact",
        "studio": "MiHoYo"
      },
      {
        "category": "BEST ESPORTS GAME",
        "game": "Valorant",
        "studio": "Riot Games"
      },
      {
        "category": "BEST ESPORTS ATHLETE",
        "game": "Lee \"Faker\" Sang-Hyeok",
        "studio": "League of Legends"
      },
      {
        "category": "BEST ESPORTS TEAM",
        "game": "JD Gaming",
        "studio": "League of Legends"
      },
      {
        "category": "BEST ESPORTS COACH",
        "game": "Christine \"Potter\" Chi",
        "studio": "Evil Geniuses - Valorant"
      },
      {
        "category": "BEST ESPORTS EVENT",
        "game": "2023 League of Legends World Championship",
        "studio": null
      }
    ]
  },
  {
    "year": 2024,
    "source": "https://thegameawards.com/rewind/year-2024",
    "gameOfTheYear": {
      "winner": "astro bot",
      "nominees": [
        "Astro Bot",
        "Balatro",
        "Black Myth: Wukong",
        "Elden Ring: Shadow of the Erdtree",
        "Final Fantasy VII Rebirth",
        "Metaphor: ReFantazio"
      ],
      "nomineesSource": "manual-curation"
    },
    "categoryWinners": [
      {
        "category": "game of the year",
        "game": "astro bot",
        "studio": "team asobi/sie"
      },
      {
        "category": "best game direction",
        "game": "astro bot",
        "studio": "team asobi/sie"
      },
      {
        "category": "best narrative",
        "game": "metaphor: refantazi",
        "studio": "studio zero/atlus/sega"
      },
      {
        "category": "BEST ART DIRECTION",
        "game": "metaphor: refantazi",
        "studio": "studio zero/atlus/sega"
      },
      {
        "category": "BEST SCORE AND MUSIC",
        "game": "final fantasy VII REBIRTH",
        "studio": "square enix"
      },
      {
        "category": "BEST AUDIO DESIGN",
        "game": "SENUA’S SAGA: HELLBLADE 2",
        "studio": "NINJA THEORY / XBOX GAME STUDIOS"
      },
      {
        "category": "BEST PERFORMANCE",
        "game": "MELINA JUERGENS",
        "studio": "SENUA’S SAGA: HELLBLADE 2"
      },
      {
        "category": "INNOVATION IN ACCESSIBILITY",
        "game": "PRINCE OF PERSIA: THE LOST CROWN",
        "studio": "UBISOFT MONTPELLIER/UBISOFT"
      },
      {
        "category": "GAMES FOR IMPACT",
        "game": "NEVA",
        "studio": "NOMADA STUDIO / DEVOLVER"
      },
      {
        "category": "BEST ONGOING",
        "game": "HELLDIVERS 2",
        "studio": "ARROWHEAD GAME STUDIOS/SIE"
      },
      {
        "category": "BEST COMMUNITY SUPPORT",
        "game": "baldur’s gate 3",
        "studio": "larian studios"
      },
      {
        "category": "best independent game",
        "game": "BALATRO",
        "studio": "LOCALTHUNK/PLAYSTACK"
      },
      {
        "category": "best DEBUT INDIE",
        "game": "BALATRO",
        "studio": "LOCALTHUNK/PLAYSTACK"
      },
      {
        "category": "BEST MOBILE GAME",
        "game": "BALATRO",
        "studio": "LOCALTHUNK/PLAYSTACK"
      },
      {
        "category": "BEST VR/AR",
        "game": "BATMAN: ARKHAM SHADOW",
        "studio": "CAMOUFLAJ/OCULUS STUDIOS"
      },
      {
        "category": "BEST ACTION GAME",
        "game": "BLACK MYTH: WUKONG",
        "studio": "GAME SCIENCE"
      },
      {
        "category": "BEST ACTION/ADVENTURE",
        "game": "astro bot",
        "studio": "team asobi/sie"
      },
      {
        "category": "BEST RPG",
        "game": "metaphor: refantazi",
        "studio": "studio zero/atlus/sega"
      },
      {
        "category": "BEST FIGHTING",
        "game": "TEKKEN 8",
        "studio": "BANDAI NAMCO"
      },
      {
        "category": "BEST FAMILY",
        "game": "astro bot",
        "studio": "team asobi/sie"
      },
      {
        "category": "BEST SIM/STRATEGY",
        "game": "FROSTPUNK 2",
        "studio": "11 BIT STUDIOS"
      },
      {
        "category": "BEST SPORTS/RACING",
        "game": "EA SPORTS FC 25",
        "studio": "EA VANCOUVER/EA ROMANIA/EA SPORTS"
      },
      {
        "category": "BEST MULTIPLAYER",
        "game": "HELLDIVERS 2",
        "studio": "ARROWHEAD GAME STUDIOS/SIE"
      },
      {
        "category": "BEST ADAPTATION",
        "game": "FALLOUT",
        "studio": "BETHESDA/KILTER FILMS/AMAZON MGM STUDIOS"
      },
      {
        "category": "MOST ANTICIPATED GAME",
        "game": "GRAND THEFT AUTO VI",
        "studio": "ROCKSTAR GAMES"
      },
      {
        "category": "CONTENT CREATOR OF THE YEAR",
        "game": "CASEOH",
        "studio": null
      },
      {
        "category": "BEST ESPORTS GAME",
        "game": "LEAGUE OF LEGENDS",
        "studio": "RIOT GAMES"
      },
      {
        "category": "BEST ESPORTS ATHLETE",
        "game": "FAKER",
        "studio": "LEE SAng-hyeok"
      },
      {
        "category": "BEST ESPORTS TEAM",
        "game": "t1",
        "studio": "league of legends"
      },
      {
        "category": "PLAYERS' VOICE",
        "game": "Black Myth: Wukong",
        "studio": "GAME SCIENCE"
      }
    ]
  }
]

export const tgaCurrentCategoryAwards: TgaCurrentCategoryAward[] = [
  {
    "slug": "game-of-the-year",
    "category": "Game of the Year",
    "winner": "Clair Obscur: Expedition 33",
    "nominees": []
  },
  {
    "slug": "best-game-direction",
    "category": "Best Game Direction",
    "winner": "Clair Obscur: Expedition 33",
    "nominees": []
  },
  {
    "slug": "best-narrative",
    "category": "Best Narrative",
    "winner": "Clair Obscur: Expedition 33",
    "nominees": []
  },
  {
    "slug": "best-art-direction",
    "category": "Best Art Direction",
    "winner": "Clair Obscur: Expedition 33",
    "nominees": []
  },
  {
    "slug": "best-score-and-music",
    "category": "Best Score and Music",
    "winner": "Lorien Testard",
    "nominees": []
  },
  {
    "slug": "best-audio-design",
    "category": "Best Audio Design",
    "winner": "Battlefield 6",
    "nominees": []
  },
  {
    "slug": "best-performance",
    "category": "Best Performance",
    "winner": "Jennifer English",
    "nominees": []
  },
  {
    "slug": "innovation-in-accessibility",
    "category": "Innovation in Accessibility",
    "winner": "Doom: The Dark Ages",
    "nominees": []
  },
  {
    "slug": "games-for-impact",
    "category": "Games for Impact",
    "winner": "South of Midnight",
    "nominees": []
  },
  {
    "slug": "best-ongoing",
    "category": "Best Ongoing",
    "winner": "No Man’s Sky",
    "nominees": []
  },
  {
    "slug": "best-community-support",
    "category": "Best Community Support",
    "winner": "Baldur’s Gate 3",
    "nominees": []
  },
  {
    "slug": "best-independent-game",
    "category": "Best Independent Game",
    "winner": "Clair Obscur: Expedition 33",
    "nominees": []
  },
  {
    "slug": "best-debut-indie-game",
    "category": "Best Debut Indie Game",
    "winner": "Clair Obscur: Expedition 33",
    "nominees": []
  },
  {
    "slug": "best-mobile-game",
    "category": "Best Mobile Game",
    "winner": "Umamusume: Pretty Derby",
    "nominees": []
  },
  {
    "slug": "best-vr-ar",
    "category": "Best VR / AR",
    "winner": "The Midnight Walk",
    "nominees": []
  },
  {
    "slug": "best-action",
    "category": "Best Action Game",
    "winner": "Hades II",
    "nominees": []
  },
  {
    "slug": "best-action-adventure",
    "category": "Best Action / Adventure",
    "winner": "Hollow Knight: Silksong",
    "nominees": []
  },
  {
    "slug": "best-role-playing",
    "category": "Best RPG",
    "winner": "Clair Obscur: Expedition 33",
    "nominees": []
  },
  {
    "slug": "best-fighting",
    "category": "Best Fighting",
    "winner": "Fatal Fury: City of the Wolves",
    "nominees": []
  },
  {
    "slug": "best-family",
    "category": "Best Family",
    "winner": "Donkey Kong Bananza",
    "nominees": []
  },
  {
    "slug": "best-sim-strategy",
    "category": "Best Sim / Strategy",
    "winner": "FINAL FANTASY TACTICS - The Ivalice Chronicles",
    "nominees": []
  },
  {
    "slug": "best-sports-racing",
    "category": "Best Sports / Racing",
    "winner": "Mario Kart World",
    "nominees": []
  },
  {
    "slug": "best-multiplayer",
    "category": "Best Multiplayer",
    "winner": "Arc Raiders",
    "nominees": []
  },
  {
    "slug": "best-adaptation",
    "category": "Best Adaptation",
    "winner": "The Last of Us: Season 2",
    "nominees": []
  },
  {
    "slug": "most-anticipated-game",
    "category": "Most Anticipated Game",
    "winner": "Grand Theft Auto VI",
    "nominees": []
  },
  {
    "slug": "content-creator-of-the-year",
    "category": "Content Creator of the Year",
    "winner": "MoistCr1TiKaL",
    "nominees": []
  },
  {
    "slug": "best-esports-game",
    "category": "Best Esports Game",
    "winner": "Counter-Strike 2",
    "nominees": []
  },
  {
    "slug": "best-esports-athlete",
    "category": "Best Esports Athlete",
    "winner": "Chovy - Jeong Ji-hoon",
    "nominees": []
  },
  {
    "slug": "best-esports-team",
    "category": "Best Esports Team",
    "winner": "Team Vitality",
    "nominees": []
  }
]
