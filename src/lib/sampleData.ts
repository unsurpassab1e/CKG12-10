// Sample data for the application
export const sampleTournaments = [
  {
    id: "t1",
    title: "Spring Classic Championship",
    date: "April 15-17, 2024",
    location: "Central Sports Complex, Phoenix, AZ",
    spotsPerAgeGroup: [
      { ageGroup: "8U", spots: 4 },
      { ageGroup: "10U", spots: 6 },
      { ageGroup: "12U", spots: 3 },
      { ageGroup: "14U", spots: 5 }
    ],
    entryFee: "$450 per team",
    type: "baseball",
    imageUrl: "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?auto=format&fit=crop&q=80"
  },
  {
    id: "t2",
    title: "Summer Softball Series",
    date: "June 22-24, 2024",
    location: "Victory Fields, Dallas, TX",
    spotsPerAgeGroup: [
      { ageGroup: "10U", spots: 3 },
      { ageGroup: "12U", spots: 4 },
      { ageGroup: "14U", spots: 2 },
      { ageGroup: "16U", spots: 5 }
    ],
    entryFee: "$400 per team",
    type: "softball",
    imageUrl: "https://images.unsplash.com/photo-1531068525540-80c506217c04?auto=format&fit=crop&q=80"
  },
  {
    id: "t3",
    title: "Youth Baseball Championship",
    date: "May 10-12, 2024",
    location: "Grand Slam Park, Miami, FL",
    spotsPerAgeGroup: [
      { ageGroup: "8U", spots: 5 },
      { ageGroup: "10U", spots: 3 },
      { ageGroup: "12U", spots: 4 },
      { ageGroup: "14U", spots: 2 }
    ],
    entryFee: "$375 per team",
    type: "baseball",
    imageUrl: "https://images.unsplash.com/photo-1544975414-c0e7ac276faa?auto=format&fit=crop&q=80"
  }
];

export const sampleResults = [
  {
    id: "r1",
    tournamentId: "t1",
    tournamentTitle: "Winter Baseball Classic",
    date: "January 15-17, 2024",
    type: "baseball",
    ageGroup: "12U",
    teams: [
      { name: "Phoenix Heat", wins: 4, losses: 1, runsScored: 32, runsAllowed: 18 },
      { name: "Desert Dragons", wins: 3, losses: 2, runsScored: 28, runsAllowed: 22 },
      { name: "Scottsdale Sluggers", wins: 3, losses: 2, runsScored: 25, runsAllowed: 24 },
      { name: "Mesa Miners", wins: 2, losses: 3, runsScored: 20, runsAllowed: 26 },
      { name: "Tempe Thunder", wins: 2, losses: 3, runsScored: 18, runsAllowed: 28 },
      { name: "Glendale Giants", wins: 1, losses: 4, runsScored: 15, runsAllowed: 30 }
    ],
    bracket: [
      {
        id: "g1",
        homeTeam: "Phoenix Heat",
        awayTeam: "Mesa Miners",
        homeScore: 6,
        awayScore: 2,
        winner: "Phoenix Heat",
        round: 1,
        matchNumber: 1
      },
      {
        id: "g2",
        homeTeam: "Desert Dragons",
        awayTeam: "Tempe Thunder",
        homeScore: 5,
        awayScore: 3,
        winner: "Desert Dragons",
        round: 1,
        matchNumber: 2
      },
      {
        id: "g3",
        homeTeam: "Phoenix Heat",
        awayTeam: "Desert Dragons",
        homeScore: 4,
        awayScore: 2,
        winner: "Phoenix Heat",
        round: 2,
        matchNumber: 1
      }
    ]
  },
  {
    id: "r2",
    tournamentId: "t2",
    tournamentTitle: "Holiday Softball Tournament",
    date: "December 8-10, 2023",
    type: "softball",
    ageGroup: "14U",
    teams: [
      { name: "Lady Lightning", wins: 5, losses: 0, runsScored: 38, runsAllowed: 12 },
      { name: "Diamond Divas", wins: 4, losses: 1, runsScored: 32, runsAllowed: 18 },
      { name: "Storm Select", wins: 3, losses: 2, runsScored: 28, runsAllowed: 22 },
      { name: "Power Elite", wins: 2, losses: 3, runsScored: 20, runsAllowed: 28 },
      { name: "Thunder Angels", wins: 1, losses: 4, runsScored: 16, runsAllowed: 32 },
      { name: "Firecrackers", wins: 0, losses: 5, runsScored: 12, runsAllowed: 36 }
    ],
    bracket: [
      {
        id: "g1",
        homeTeam: "Lady Lightning",
        awayTeam: "Power Elite",
        homeScore: 7,
        awayScore: 2,
        winner: "Lady Lightning",
        round: 1,
        matchNumber: 1
      },
      {
        id: "g2",
        homeTeam: "Diamond Divas",
        awayTeam: "Storm Select",
        homeScore: 5,
        awayScore: 4,
        winner: "Diamond Divas",
        round: 1,
        matchNumber: 2
      },
      {
        id: "g3",
        homeTeam: "Lady Lightning",
        awayTeam: "Diamond Divas",
        homeScore: 6,
        awayScore: 3,
        winner: "Lady Lightning",
        round: 2,
        matchNumber: 1
      }
    ]
  }
];

export const sampleMatchups = {
  r1: [
    {
      team1: "Phoenix Heat",
      team2: "Mesa Miners",
      date: "January 15, 2024",
      score: {
        team1: 6,
        team2: 2
      },
      stats: {
        wins: {
          team1: 4,
          team2: 2
        },
        losses: {
          team1: 1,
          team2: 3
        },
        runsScored: {
          team1: 32,
          team2: 20
        },
        runsAllowed: {
          team1: 18,
          team2: 26
        }
      }
    },
    {
      team1: "Desert Dragons",
      team2: "Phoenix Heat",
      date: "January 16, 2024",
      score: {
        team1: 3,
        team2: 5
      },
      stats: {
        wins: {
          team1: 3,
          team2: 4
        },
        losses: {
          team1: 2,
          team2: 1
        },
        runsScored: {
          team1: 28,
          team2: 32
        },
        runsAllowed: {
          team1: 22,
          team2: 18
        }
      }
    }
  ],
  r2: [
    {
      team1: "Lady Lightning",
      team2: "Power Elite",
      date: "December 8, 2023",
      score: {
        team1: 7,
        team2: 2
      },
      stats: {
        wins: {
          team1: 5,
          team2: 2
        },
        losses: {
          team1: 0,
          team2: 3
        },
        runsScored: {
          team1: 38,
          team2: 20
        },
        runsAllowed: {
          team1: 12,
          team2: 28
        }
      }
    },
    {
      team1: "Diamond Divas",
      team2: "Lady Lightning",
      date: "December 9, 2023",
      score: {
        team1: 3,
        team2: 6
      },
      stats: {
        wins: {
          team1: 4,
          team2: 5
        },
        losses: {
          team1: 1,
          team2: 0
        },
        runsScored: {
          team1: 32,
          team2: 38
        },
        runsAllowed: {
          team1: 18,
          team2: 12
        }
      }
    }
  ]
};

export const samplePickUpPlayers = [
  {
    id: "p1",
    playerName: "Alex Rodriguez",
    age: "12U",
    position: "Pitcher/Shortstop",
    experience: "A",
    availability: "Weekends",
    email: "alex.r@example.com",
    phone: "(555) 123-4567",
    datePosted: "2024-03-01"
  },
  {
    id: "p2",
    playerName: "Sarah Johnson",
    age: "14U",
    position: "Catcher",
    experience: "B",
    availability: "Summer tournaments",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    datePosted: "2024-03-05"
  },
  {
    id: "p3",
    playerName: "Mike Thompson",
    age: "10U",
    position: "Outfield",
    experience: "C",
    availability: "Spring season",
    email: "mike.t@example.com",
    phone: "(555) 345-6789",
    datePosted: "2024-03-10"
  }
];

export const sampleSponsors = [
  {
    id: "s1",
    name: "Smash It Sports",
    tier: "Diamond",
    logo: "https://images.unsplash.com/photo-1584285418504-045785c9eedc?auto=format&fit=crop&q=80",
    description: "Official Equipment Provider",
    website: "https://www.smashitsports.com"
  },
  {
    id: "s2",
    name: "Local Sports Medicine",
    tier: "Gold",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80",
    description: "Medical Support Partner",
    website: "#"
  },
  {
    id: "s3",
    name: "Regional Bank",
    tier: "Silver",
    logo: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80",
    description: "Financial Services Partner",
    website: "#"
  }
];