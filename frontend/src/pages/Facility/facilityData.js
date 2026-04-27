import footballImg from '../../images/register_img.webp';
import tennisImg from '../../images/kort_tenisowy.jpg';
import squashImg from '../../images/squas.jpg';

const facilityData = {
  1: {
    name: 'Boisko do piłki nożnej',
    subtitle: 'Wybrałeś boisko do piłki nożnej,',
    description:
      'Pełnowymiarowe boisko z sztuczną nawierzchnią przeznaczone do profesjonalnych treningów jak i do amatorskich rozgrywek',
    surfaceType: 'Sztuczna',
    hoursWeekday: '9:00-21:00',
    hoursWeekend: '11:00-21:00',
    image: footballImg,
    slotDuration: 2,
    priceInfo: '300 zł / 2h',
  },
  2: {
    name: 'Kort do tenisa',
    subtitle: 'Wybrałeś kort do tenisa,',
    description:
      'Pełnowymiarowy kort do tenisa z wysokiej jakości sztuczną nawierzchnią, przystosowany zarówno do profesjonalnych treningów, jak i rekreacyjnych rozgrywek amatorskich',
    surfaceType: 'Mączka ceglana',
    hoursWeekday: '8:00-22:00',
    hoursWeekend: '10:00-20:00',
    image: tennisImg,
    slotDuration: 1,
    priceInfo: '80 zł / 1h',
  },
  3: {
    name: 'Sala do squasha',
    subtitle: 'Wybrałeś salę do squasha,',
    description:
      'Sala przeznaczona do gry w squasha w zamkniętej przestrzeni z czterema ścianami, umożliwiająca szybkie i dynamiczne zagrywki',
    surfaceType: 'Parkiet drewniany',
    hoursWeekday: '7:00-22:00',
    hoursWeekend: '9:00-21:00',
    image: squashImg,
    slotDuration: 1,
    priceInfo: '60 zł / 1h',
  },
};

export default facilityData;
