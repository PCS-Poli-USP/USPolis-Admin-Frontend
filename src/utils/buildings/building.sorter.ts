import { BuildingResponse } from "models/http/responses/building.response.models";

export function sortBuildingsResponse(a: BuildingResponse, b: BuildingResponse) {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  return 0;
}