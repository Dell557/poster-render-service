import React from "react";
import { PosterData, defaultValueDoctor } from "../types/poster";

// 获取变量值，支持默认值
function getVal<K extends keyof PosterData>(data: PosterData, key: K, defaultVal: PosterData[K]): NonNullable<PosterData[K]> {
  const val = data[key];
  return (val !== undefined && val !== null && val !== '') ? val as NonNullable<PosterData[K]> : defaultVal as NonNullable<PosterData[K]>;
}

// 导师背景标签组件
function TutorBackgroundLabel({ text }: { text: string }) {
  return (
    <div className="absolute bg-white grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid left-[72px] px-[11px] py-0 rounded-[8px] top-[1314px]" data-name="变量：自适应方框-导师背景">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[36px] text-black text-center text-nowrap">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

// 适合专业标签组件
function SuitableMajorLabel({ text }: { text: string }) {
  return (
    <div className="absolute bg-white grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid left-[72px] px-[11px] py-0 rounded-[8px] top-[986px]" data-name="变量：自适应方框-适合专业">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[36px] text-black text-center text-nowrap">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

// 学科大类标签组件
function SubjectCategory({ text }: { text: string }) {
  return (
    <div className="absolute left-[414px] rounded-[12px] top-[186px]" data-name="变量：自适应方框（学科大类）">
      <div className="gap-[10px] grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid overflow-clip p-[10px] relative rounded-[inherit]">
        <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic place-self-center relative shrink-0 text-[64px] text-center text-nowrap text-white">
          <p className="leading-[64px] whitespace-pre-line">
            {text}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[5px] border-solid border-white inset-[-2.5px] pointer-events-none rounded-[14.5px]" />
    </div>
  );
}

// 装饰线条组件
function DecorationLine({ top }: { top: string }) {
  return (
    <div className="absolute h-0 left-[83px] w-[75px]" style={{ top }} data-name="固定内容：装饰条">
      <div className="absolute inset-[-1px_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 2">
          <path d="M0 1H75" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

interface PosterDoctorProps {
  data: PosterData;
}

export function PosterDoctor({ data }: PosterDoctorProps) {
  // 获取所有变量值（带默认值）
  const posterImage = getVal(data, 'posterImage', defaultValueDoctor.posterImage);
  const qrCode = getVal(data, 'qrCode', defaultValueDoctor.qrCode);
  const subjectCategory = getVal(data, 'subjectCategory', defaultValueDoctor.subjectCategory);
  const projectTitle = getVal(data, 'projectTitle', defaultValueDoctor.projectTitle);
  const suitableMajor = getVal(data, 'suitableMajor', defaultValueDoctor.suitableMajor);
  const tutorBackground = getVal(data, 'tutorBackground', defaultValueDoctor.tutorBackground);
  const mainTitle = getVal(data, 'mainTitle', defaultValueDoctor.mainTitle);
  const researchBenefit = getVal(data, 'researchBenefit', defaultValueDoctor.researchBenefit);
  const paperBenefit = getVal(data, 'paperBenefit', defaultValueDoctor.paperBenefit);
  const projectLabel = getVal(data, 'projectLabel', defaultValueDoctor.projectLabel);
  const projectSubtitle = getVal(data, 'projectSubtitle', defaultValueDoctor.projectSubtitle);
  const qrCaption = getVal(data, 'qrCaption', defaultValueDoctor.qrCaption);
  const tutorBackgroundLabel = getVal(data, 'tutorBackgroundLabel', defaultValueDoctor.tutorBackgroundLabel);
  const suitableMajorLabel = getVal(data, 'suitableMajorLabel', defaultValueDoctor.suitableMajorLabel);

  // 博士版格式化：科研权益和论文权益使用 "科研 - {xxx}" 格式
  const formattedResearchBenefit = `科研 - {${researchBenefit}}`;
  const formattedPaperBenefit = `论文 - {${paperBenefit}}`;

  // 处理项目副标题分隔
  const subtitleParts = projectSubtitle.split('|').map(s => s.trim());

  return (
    <div className="relative w-[1080px] h-[1920px] mx-auto overflow-hidden" data-name="博士版">
      {/* 底板 */}
      <div className="absolute bg-white h-[1920px] left-0 top-0 w-[1080px]" data-name="固定内容：底板" />
      
      {/* 海报背景图 */}
      <div className="absolute h-[1920px] left-0 top-0 w-[1080px]" data-name="变量：海报底图">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={posterImage} />
      </div>
      
      {/* 遮罩层 */}
      <div className="absolute backdrop-blur-[1px] backdrop-filter bg-[rgba(255,255,255,0)] h-[1920px] left-0 rounded-none top-0 w-[1080px]" data-name="固定内容：遮罩" />
      
      {/* 二维码背景板 */}
      <div className="absolute bg-white h-[224px] left-[819px] rounded-[8px] top-[1551px] w-[188px]" data-name="固定内容：二维码背景板" />
      
      {/* 二维码提示文字 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[34px] leading-[normal] left-[833px] not-italic text-[#212121] text-[20px] top-[1744px] w-[208px]">{qrCaption}</p>
      
      {/* 二维码 */}
      <div className="absolute left-[828px] rounded-[12px] size-[170px] top-[1569px]" data-name="变量：二维码">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12px] size-full" src={qrCode} />
      </div>
      
      {/* 项目形式说明 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[50px] leading-[0] left-[77px] not-italic text-[32px] text-white top-[1728px] w-[509px]">
        <span className="leading-[normal]">{subtitleParts[0]} </span>
        <span className="leading-[25px]">|</span>
        <span className="leading-[normal]"> {subtitleParts[1] || ''}</span>
      </p>
      
      {/* 项目标题 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold h-[44px] leading-[normal] left-[77px] not-italic text-[36px] text-white top-[1660px] tracking-[2.52px] w-[486px]">{projectLabel}</p>
      
      {/* 导师背景内容 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[122px] leading-[normal] left-[72px] not-italic text-[36px] text-white top-[1369px] w-[945px] whitespace-pre-line">{tutorBackground}</p>
      
      {/* 导师背景标签 */}
      <TutorBackgroundLabel text={tutorBackgroundLabel} />
      
      {/* 适合专业内容 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[143px] leading-[normal] left-[72px] not-italic text-[36px] text-white top-[1042px] w-[945px] whitespace-pre-line">{suitableMajor}</p>
      
      {/* 适合专业标签 */}
      <SuitableMajorLabel text={suitableMajorLabel} />
      
      {/* 装饰线条 */}
      <DecorationLine top="892px" />
      <DecorationLine top="1218px" />
      
      {/* 成果说明 - 论文 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold leading-[normal] left-[63px] not-italic text-[42px] text-white top-[402px] w-[480px]">{formattedPaperBenefit}</p>
      
      {/* 1V1大标题 */}
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[227px] not-italic text-[225px] text-center text-nowrap text-white top-[252px] tracking-[-18px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">{mainTitle}</p>
      </div>
      
      {/* 学科分类标签 */}
      <SubjectCategory text={subjectCategory} />
      
      {/* 成果说明 - 科研 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold leading-[normal] left-[63px] not-italic text-[42px] text-white top-[352px] w-[480px]">{formattedResearchBenefit}</p>
      
      {/* 项目主题 */}
      <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium','Noto_Sans_SC:Medium',sans-serif] font-medium h-[302px] leading-[normal] left-[63px] not-italic text-[72px] text-white top-[544px] tracking-[1.44px] w-[948px] whitespace-pre-line">{projectTitle}</p>
    </div>
  );
}
