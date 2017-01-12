const addRegionHelpers = (regions, features) => {
  return Object.keys(regions).map(r => {
    return {
      label: regions[r].label,
      isFeature: regions[r].isFeature,
      features: features.filter(f => f.regions.indexOf(regions[r]) !== -1),
      toString: () => regions[r].label,
    };
  });
};

const PLANES = [
  {
    label: 'Axial',
  },
  {
    label: 'Coronal',
  },
  {
    label: 'Sagittal',
  },
  {
    isFeature: true,
    label: 'Garbage',
  },
];

const REGIONS = {
  ARM: {
    isFeature: true,
    label: 'Arm',
  },
  LEG: {
    isFeature: true,
    label: 'Leg',
  },
  ABOVE_CLAVICLE: {
    label: 'Above the clavicle',
  },
  BELOW_CLAVICLE: {
    label: 'Below the clavicle',
  },
};

const FEATURES = [
  {
    label: 'Vertebrae',
    regions: [REGIONS.ABOVE_CLAVICLE, REGIONS.BELOW_CLAVICLE],
  },
  {
    label: 'Mandible',
    regions: [REGIONS.ABOVE_CLAVICLE],
  },
  {
    label: 'Brain',
    regions: [REGIONS.ABOVE_CLAVICLE],
  },
  {
    label: 'Cranium',
    regions: [REGIONS.ABOVE_CLAVICLE],
  },
  {
    label: 'Pharynx',
    regions: [REGIONS.ABOVE_CLAVICLE],
  },
  {
    label: 'Heart',
    regions: [REGIONS.BELOW_CLAVICLE],
  },
  {
    label: 'Lungs',
    regions: [REGIONS.BELOW_CLAVICLE],
  },
  {
    label: 'Stomach',
    regions: [REGIONS.BELOW_CLAVICLE],
  },
  {
    label: 'Spleen',
    regions: [REGIONS.BELOW_CLAVICLE],
  },
  {
    label: 'Kidneys',
    regions: [REGIONS.BELOW_CLAVICLE],
  },
  {
    label: 'Liver',
    regions: [REGIONS.BELOW_CLAVICLE],
  },
  {
    label: 'Pelvis',
    regions: [REGIONS.BELOW_CLAVICLE],
  },
];

module.exports = {
  MONGO_URL: 'mongodb://localhost:27017/ctcrowdsource',
  REGIONS: addRegionHelpers(REGIONS, FEATURES),
  FEATURES,
  PLANES,
};
