export interface PlayerData {
    seas_id?: number | null;
    season?: number;
    player_id?: number;
    player?: string;
    pos?: string;
    age: number;
    tm?: string;
    g: number;
    gs: number;
    mp: number;
    fg: number;
    fga: number;
    fg_percent: number | null;
    x3p: number;
    x3pa: number;
    x3p_percent: number | null;
    x2p: number;
    x2pa: number;
    x2p_percent: number | null;
    e_fg_percent: number | null;
    ft: number;
    fta: number;
    ft_percent: number | null;
    orb: number;
    drb: number;
    trb: number;
    ast: number;
    stl: number;
    blk: number;
    tov: number;
    pf: number;
    pts: number;
    avg_dist_fga: number | null;
    percent_fga_from_x2p_range: number | null;
    percent_fga_from_x0_3_range: number | null;
    percent_fga_from_x3_10_range: number | null;
    percent_fga_from_x10_16_range: number | null;
    percent_fga_from_x16_3p_range: number | null;
    percent_fga_from_x3p_range: number | null;
    fg_percent_from_x2p_range: number | null;
    fg_percent_from_x0_3_range: number | null;
    fg_percent_from_x3_10_range: number | null;
    fg_percent_from_x10_16_range: number | null;
    fg_percent_from_x16_3p_range: number | null;
    fg_percent_from_x3p_range: number | null;
    percent_assisted_x2p_fg: number | null;
    percent_assisted_x3p_fg: number | null;
    percent_dunks_of_fga: number | null;
    num_of_dunks: number;
    percent_corner_3s_of_3pa: number | null;
    corner_3_point_percent: number | null;
    num_heaves_attempted: number;
    num_heaves_made: number;
}

export interface PlayerMap {
    player_id: number;
    player: string;
}

export interface TeamMap {
    abbreviation: string;
    teamName: string;
    primaryColor: string;
    secondaryColor: string;
}

export enum TeamsShort {
    Atl = "ATL",
    Bos = "BOS",
    Brk = "BRK",
    Cha = "CHA",
    Chi = "CHI",
    Cho = "CHO",
    Cle = "CLE",
    DAL = "DAL",
    Den = "DEN",
    Det = "DET",
    Gsw = "GSW",
    Hou = "HOU",
    Ind = "IND",
    Lac = "LAC",
    Lal = "LAL",
    Mem = "MEM",
    Mia = "MIA",
    Mil = "MIL",
    Min = "MIN",
    NOP = "NOP",
    Noh = "NOH",
    Nyk = "NYK",
    Okc = "OKC",
    Orl = "ORL",
    Phi = "PHI",
    Pho = "PHO",
    Por = "POR",
    SAS = "SAS",
    Sac = "SAC",
    Tor = "TOR",
    Tot = "TOT",
    Uta = "UTA",
    Was = "WAS",
}