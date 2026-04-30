import footballImg from '../../images/register_img.webp';
import tennisImg from '../../images/kort_tenisowy.jpg';
import squashImg from '../../images/squas.jpg';

// Metadata that supplements API data (images and extra info not stored in DB)
const facilityMeta = {
  football: {
    image: footballImg,
    surfaceType: 'Sztuczna',
    slotDuration: 2,
    cardClass: 'facilityCard',
  },
  tennis: {
    image: tennisImg,
    surfaceType: 'Mączka ceglana',
    slotDuration: 1,
    cardClass: 'facilityCard2',
  },
  squash: {
    image: squashImg,
    surfaceType: 'Parkiet drewniany',
    slotDuration: 1,
    cardClass: 'facilityCard3',
  },
};

// Fallback for unknown types
const defaultMeta = {
  image: footballImg,
  surfaceType: 'Standardowa',
  slotDuration: 1,
  cardClass: 'facilityCard',
};

export function getFacilityMeta(type) {
  return facilityMeta[type] || defaultMeta;
}

export default facilityMeta;
