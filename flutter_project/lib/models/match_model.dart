// Match and Prediction Models for Football and Basketball in Zinna Tips

enum SportType { football, basketball }

class MatchModel {
  final String id;
  final SportType sport;
  final String league;
  final String homeTeam;
  final String awayTeam;
  final String homeLogo;
  final String awayLogo;
  final String matchTime;
  final String status; // 'upcoming', 'live', 'finished'
  final String? liveScore;
  final String? liveMinute;
  
  // Statistical Inputs analyzed by AI
  final List<String> homeForm; // e.g. ['W', 'W', 'D', 'W', 'L']
  final List<String> awayForm;
  final String headToHeadSummary;
  final String tableStanding; // e.g. 'Arsenal 1st vs Chelsea 5th'
  final String injuriesReport;

  // AI Prediction outputs
  final int confidencePercent; // e.g. 84%
  final String prediction1X2; // '1' (Home Win), 'X' (Draw), '2' (Away Win)
  final String doubleChance; // '1X', 'X2', '12'
  final String overUnder; // 'Over 2.5', 'Under 2.5'
  final String btts; // 'Yes', 'No'
  
  // Basketball specific prediction
  final String? basketballWinner;
  final String? basketballOverUnderPoints; // e.g. 'Over 218.5 Points'

  final String whyThisPrediction; // AI explanation text under each game

  MatchModel({
    required this.id,
    required this.sport,
    required this.league,
    required this.homeTeam,
    required this.awayTeam,
    required this.homeLogo,
    required this.awayLogo,
    required this.matchTime,
    required this.status,
    this.liveScore,
    this.liveMinute,
    required this.homeForm,
    required this.awayForm,
    required this.headToHeadSummary,
    required this.tableStanding,
    required this.injuriesReport,
    required this.confidencePercent,
    required this.prediction1X2,
    required this.doubleChance,
    required this.overUnder,
    required this.btts,
    this.basketballWinner,
    this.basketballOverUnderPoints,
    required this.whyThisPrediction,
  });

  factory MatchModel.fromJson(Map<String, dynamic> json) {
    return MatchModel(
      id: json['id'] ?? '',
      sport: json['sport'] == 'basketball' ? SportType.basketball : SportType.football,
      league: json['league'] ?? '',
      homeTeam: json['homeTeam'] ?? '',
      awayTeam: json['awayTeam'] ?? '',
      homeLogo: json['homeLogo'] ?? '',
      awayLogo: json['awayLogo'] ?? '',
      matchTime: json['matchTime'] ?? '',
      status: json['status'] ?? 'upcoming',
      liveScore: json['liveScore'],
      liveMinute: json['liveMinute'],
      homeForm: List<String>.from(json['homeForm'] ?? ['W', 'D', 'W']),
      awayForm: List<String>.from(json['awayForm'] ?? ['L', 'D', 'W']),
      headToHeadSummary: json['headToHeadSummary'] ?? '',
      tableStanding: json['tableStanding'] ?? '',
      injuriesReport: json['injuriesReport'] ?? '',
      confidencePercent: json['confidencePercent'] ?? 80,
      prediction1X2: json['prediction1X2'] ?? '1X',
      doubleChance: json['doubleChance'] ?? '1X',
      overUnder: json['overUnder'] ?? 'Over 2.5',
      btts: json['btts'] ?? 'Yes',
      basketballWinner: json['basketballWinner'],
      basketballOverUnderPoints: json['basketballOverUnderPoints'],
      whyThisPrediction: json['whyThisPrediction'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sport': sport == SportType.basketball ? 'basketball' : 'football',
      'league': league,
      'homeTeam': homeTeam,
      'awayTeam': awayTeam,
      'homeLogo': homeLogo,
      'awayLogo': awayLogo,
      'matchTime': matchTime,
      'status': status,
      'liveScore': liveScore,
      'liveMinute': liveMinute,
      'homeForm': homeForm,
      'awayForm': awayForm,
      'headToHeadSummary': headToHeadSummary,
      'tableStanding': tableStanding,
      'injuriesReport': injuriesReport,
      'confidencePercent': confidencePercent,
      'prediction1X2': prediction1X2,
      'doubleChance': doubleChance,
      'overUnder': overUnder,
      'btts': btts,
      'basketballWinner': basketballWinner,
      'basketballOverUnderPoints': basketballOverUnderPoints,
      'whyThisPrediction': whyThisPrediction,
    };
  }
}
