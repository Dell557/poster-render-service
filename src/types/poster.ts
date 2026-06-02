// 海报版本类型
export type PosterVersion = 'doctor' | 'professor';

// 海报共享变量类型定义
export interface PosterData {
  // === 必填图片变量 ===
  posterImage: string;      // 海报底图
  qrCode: string;           // 二维码（URL或DataURL）
  
  // === 必填文本变量 ===
  subjectCategory: string;  // 学科大类（支持换行，如 "材料\n科学"）
  projectTitle: string;     // 项目/课题主题
  suitableMajor: string;    // 适合专业
  tutorBackground: string;  // 导师背景
  
  // === 可选变量（固定内容，有默认值）===
  mainTitle?: string;           // 主标题，默认 "1V1"
  researchBenefit?: string;     // 科研权益，默认 "专属导师推荐信"
  paperBenefit?: string;        // 论文权益，默认 "国际会议论文"
  projectLabel?: string;        // 项目标题，默认 "国内高校科研项目[1V1]"
  projectSubtitle?: string;     // 项目副标题，默认 "远程线上科研 | 全年滚动招生"
  qrCaption?: string;           // 二维码说明，默认 "扫码了解课题详情"
  tutorBackgroundLabel?: string; // 导师背景标签，博士版默认 "导师背景"，教授版默认 "参考导师背景"
  suitableMajorLabel?: string;   // 适合专业标签，默认 "适合专业"
}

// 默认值 - 博士版
export const defaultValueDoctor: Required<Omit<PosterData, 'posterImage' | 'qrCode'>> & Pick<PosterData, 'posterImage' | 'qrCode'> = {
  posterImage: '',
  qrCode: '',
  subjectCategory: '学科\n大类',
  projectTitle: '课题名称',
  suitableMajor: '适合专业',
  tutorBackground: '导师背景',
  mainTitle: '1V1',
  researchBenefit: '专属导师推荐信',
  paperBenefit: '国际会议论文',
  projectLabel: '国内高校科研项目[1V1]',
  projectSubtitle: '远程线上科研 | 全年滚动招生',
  qrCaption: '扫码了解课题详情',
  tutorBackgroundLabel: '导师背景',
  suitableMajorLabel: '适合专业',
};

// 默认值 - 教授版
export const defaultValueProfessor: Required<Omit<PosterData, 'posterImage' | 'qrCode'>> & Pick<PosterData, 'posterImage' | 'qrCode'> = {
  posterImage: '',
  qrCode: '',
  subjectCategory: '学科\n大类',
  projectTitle: '课题名称',
  suitableMajor: '适合专业',
  tutorBackground: '导师背景',
  mainTitle: '1V1',
  researchBenefit: '专属导师推荐信',
  paperBenefit: '国际会议论文',
  projectLabel: '国内高校科研项目[1V1]',
  projectSubtitle: '远程线上科研 | 全年滚动招生',
  qrCaption: '扫码了解课题详情',
  tutorBackgroundLabel: '参考导师背景',
  suitableMajorLabel: '适合专业',
};

// 合并数据与默认值
export function mergeWithDefaults(data: Partial<PosterData>, version: PosterVersion): Required<Omit<PosterData, 'posterImage' | 'qrCode'>> & Pick<PosterData, 'posterImage' | 'qrCode'> {
  const defaults = version === 'doctor' ? defaultValueDoctor : defaultValueProfessor;
  return {
    ...defaults,
    ...data,
  };
}
