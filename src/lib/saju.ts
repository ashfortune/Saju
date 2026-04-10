import { Solar, Lunar } from 'lunar-javascript';
import stemsData from '../data/stems.json';
import branchesData from '../data/branches.json';

export interface SajuChar {
  char: string;
  name: string;
  element: string;
  yinYang: string;
  god?: string;
}

export interface SajuResult {
  year: { stem: SajuChar; branch: SajuChar };
  month: { stem: SajuChar; branch: SajuChar };
  day: { stem: SajuChar; branch: SajuChar };
  time: { stem: SajuChar; branch: SajuChar };
  elementsCount: Record<string, number>;
  dayMaster: SajuChar;
}

const getGod = (dayMasterElement: string, dayMasterYinYang: string, targetElement: string, targetYinYang: string) => {
  if (dayMasterElement === targetElement) {
    return dayMasterYinYang === targetYinYang ? '비견' : '겁재';
  }
  
  const elementCycle = ['목', '화', '토', '금', '수'];
  const dmIdx = elementCycle.indexOf(dayMasterElement);
  const targetIdx = elementCycle.indexOf(targetElement);
  
  const diff = (targetIdx - dmIdx + 5) % 5;
  
  if (diff === 1) {
    return dayMasterYinYang === targetYinYang ? '식신' : '상관';
  } else if (diff === 2) {
    return dayMasterYinYang === targetYinYang ? '편재' : '정재';
  } else if (diff === 3) {
    return dayMasterYinYang === targetYinYang ? '편관' : '정관';
  } else if (diff === 4) {
    return dayMasterYinYang === targetYinYang ? '편인' : '정인';
  }
  
  return '';
};

export const calculateSaju = (
  birthDate: string,
  birthTime: string,
  isLunar: boolean,
  gender: 'M' | 'F'
): SajuResult => {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);

  let lunar;
  if (isLunar) {
    lunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
  } else {
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    lunar = solar.getLunar();
  }

  const eightChar = lunar.getEightChar();
  
  const yearStem = eightChar.getYearGan();
  const yearBranch = eightChar.getYearZhi();
  const monthStem = eightChar.getMonthGan();
  const monthBranch = eightChar.getMonthZhi();
  const dayStem = eightChar.getDayGan();
  const dayBranch = eightChar.getDayZhi();
  const timeStem = eightChar.getTimeGan();
  const timeBranch = eightChar.getTimeZhi();

  const getStemInfo = (char: string): SajuChar => ({
    char,
    ...(stemsData as any)[char]
  });

  const getBranchInfo = (char: string): SajuChar => ({
    char,
    ...(branchesData as any)[char]
  });

  const dayMasterInfo = getStemInfo(dayStem);

  const addGod = (info: SajuChar, isDayMaster: boolean = false): SajuChar => {
    if (isDayMaster) return { ...info, god: '일간' };
    return {
      ...info,
      god: getGod(dayMasterInfo.element, dayMasterInfo.yinYang, info.element, info.yinYang)
    };
  };

  const result: SajuResult = {
    year: { stem: addGod(getStemInfo(yearStem)), branch: addGod(getBranchInfo(yearBranch)) },
    month: { stem: addGod(getStemInfo(monthStem)), branch: addGod(getBranchInfo(monthBranch)) },
    day: { stem: addGod(getStemInfo(dayStem), true), branch: addGod(getBranchInfo(dayBranch)) },
    time: { stem: addGod(getStemInfo(timeStem)), branch: addGod(getBranchInfo(timeBranch)) },
    elementsCount: { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 },
    dayMaster: dayMasterInfo
  };

  const allChars = [
    result.year.stem, result.year.branch,
    result.month.stem, result.month.branch,
    result.day.stem, result.day.branch,
    result.time.stem, result.time.branch
  ];

  allChars.forEach(char => {
    if (char && char.element) {
      result.elementsCount[char.element]++;
    }
  });

  return result;
};
