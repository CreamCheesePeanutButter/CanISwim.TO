class BeachDTO {
  constructor(
    id,
    facilityName,
    address,
    type,
    inspectionStatus,
    lastInspectionDate,
    observation,
    infCategory,
    defectDescription,
    actionDescription,
    geometry,
  ) {
    this.id = id;
    this.facilityName = facilityName;
    this.address = address;
    this.type = type;
    this.inspectionStatus = inspectionStatus;
    this.lastInspectionDate = lastInspectionDate;
    this.observation = observation;
    this.infCategory = infCategory;
    this.defectDescription = defectDescription;
    this.actionDescription = actionDescription;
    this.geometry = geometry;
  }
}

module.exports = BeachDTO;
