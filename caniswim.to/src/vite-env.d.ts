declare module "*.geojson" {
  import type { FeatureCollection, Geometry } from "geojson";

  const value: FeatureCollection<
    Geometry,
    {
      _id: number;
      facilityName: string;
      address: string;
      estName: string;
      type: string;
      insStatus: string;
      insDate: string;
      observation: string;
      infCategory: string;
      defDesc: string;
      actionDesc: string;
    }
  >;

  export default value;
}
