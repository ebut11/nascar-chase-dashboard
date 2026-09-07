export type ModelType = "basic" | "advanced";

export interface Race {
  chase_round: number;
  name: string;
  track: string;
  race_date: string | null;
  status: "upcoming" | "completed";
  winner: string | null;
  blend_note: string | null;
}

export interface Driver {
  name: string;
  car_number: number | null;
  is_chase_driver: boolean;
}

export interface Prediction {
  chase_round: number;
  driver: string;
  model_type: ModelType;
  projected_finish: number;
  data_source: string | null;
}

export interface RaceResult {
  chase_round: number;
  driver: string;
  start_pos: number | null;
  finish_pos: number;
  status: string | null;
  avg_running_position: number | null;
  fastest_laps: number | null;
  laps_led: number | null;
  pct_led: number | null;
  quality_passes: number | null;
  pct_top15: number | null;
}

export interface ModelScore {
  chase_round: number;
  model_type: ModelType;
  cv_mae: number | null;
  cv_r2: number | null;
  mae: number | null;
  rmse: number | null;
  r2: number | null;
  top5_hits: number | null;
  top10_hits: number | null;
  predicted_winner: string | null;
  predicted_winner_actual_finish: number | null;
}

export interface FeatureImportance {
  chase_round: number;
  model_type: ModelType;
  feature: string;
  importance: number;
}

export interface ChaseData {
  races: Race[];
  drivers: Driver[];
  predictions: Prediction[];
  results: RaceResult[];
  model_scores: ModelScore[];
  feature_importances: FeatureImportance[];
}

/** A single driver's row on a completed race's predicted-vs-actual board. */
export interface DriverRaceRow {
  driver: string;
  car_number: number | null;
  is_chase_driver: boolean;
  basic: number | null;
  advanced: number | null;
  actual: number | null;
  status: string | null;
  laps_led: number | null;
  avg_running_position: number | null;
  basic_error: number | null;
  advanced_error: number | null;
}
