import React from "react";
import { PosterData, defaultValueProfessor } from "../types/poster";

// 获取变量值，支持默认值
function getVal<K extends keyof PosterData>(data: PosterData, key: K, defaultVal: PosterData[K]): NonNullable<PosterData[K]> {
  const val = data[key];
  return (val !== undefined && val !== null && val !== '') ? val as NonNullable<PosterData[K]> : defaultVal as NonNullable<PosterData[K]>;
}

// 学科大类标签组件
function SubjectCategory({ text }: { text: string }) {
  return (
    <div className="absolute right-[50px] rounded-[16px] top-[237px]" data-name="变量：自适应方框">
      <div className="gap-[10px] grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid overflow-clip p-[10px] relative rounded-[inherit]">
        <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic place-self-center relative shrink-0 text-[#212121] text-[64px] text-center text-nowrap">
          <p className="leading-[64px] whitespace-pre-line">
            {text}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-black border-[5px] border-solid inset-[-2.5px] pointer-events-none rounded-[18.5px]" />
    </div>
  );
}

// 项目标签组件（自适应黑底矩形）
function ProjectLabel({ text }: { text: string }) {
  return (
    <div className="absolute bg-[#212121] grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid left-[36px] px-[20px] py-[9px] rounded-[12px] top-[1674px]" data-name="变量：自适应方框-项目标签">
      <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[36px] text-white text-center text-nowrap tracking-[2.16px]">
        <p className="leading-[normal]">{text}</p>
      </div>
    </div>
  );
}

// 装饰线条组件
function DecorationLine({ top }: { top: string }) {
  return (
    <div className="absolute h-0 left-[59px] w-[43px]" style={{ top }} data-name="固定内容：装饰条">
      <div className="absolute inset-[-0.5px_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 1">
          <path d="M0 0.5H43" stroke="white" />
        </svg>
      </div>
    </div>
  );
}

interface PosterProfessorProps {
  data: PosterData;
}

export function PosterProfessor({ data }: PosterProfessorProps) {
  // 获取所有变量值（带默认值）
  const posterImage = getVal(data, 'posterImage', defaultValueProfessor.posterImage);
  const qrCode = getVal(data, 'qrCode', defaultValueProfessor.qrCode);
  const subjectCategory = getVal(data, 'subjectCategory', defaultValueProfessor.subjectCategory);
  const projectTitle = getVal(data, 'projectTitle', defaultValueProfessor.projectTitle);
  const suitableMajor = getVal(data, 'suitableMajor', defaultValueProfessor.suitableMajor);
  const tutorBackground = getVal(data, 'tutorBackground', defaultValueProfessor.tutorBackground);
  const mainTitle = getVal(data, 'mainTitle', defaultValueProfessor.mainTitle);
  const researchBenefit = getVal(data, 'researchBenefit', defaultValueProfessor.researchBenefit);
  const paperBenefit = getVal(data, 'paperBenefit', defaultValueProfessor.paperBenefit);
  const projectLabel = getVal(data, 'projectLabel', defaultValueProfessor.projectLabel);
  const projectSubtitle = getVal(data, 'projectSubtitle', defaultValueProfessor.projectSubtitle);
  const qrCaption = getVal(data, 'qrCaption', defaultValueProfessor.qrCaption);
  const tutorBackgroundLabel = getVal(data, 'tutorBackgroundLabel', defaultValueProfessor.tutorBackgroundLabel);
  const suitableMajorLabel = getVal(data, 'suitableMajorLabel', defaultValueProfessor.suitableMajorLabel);

  // 处理项目副标题分隔
  const subtitleParts = projectSubtitle.split('|').map(s => s.trim());

  return (
    <div className="relative w-[1080px] h-[1920px] mx-auto overflow-hidden" data-name="教授版">
      {/* 底板 */}
      <div className="absolute bg-white h-[1920px] left-0 rounded-[16px] top-0 w-[1080px]" data-name="固定内容：底板" />
      
      {/* 海报底图 - 带遮罩和模糊背景 */}
      <div className="absolute h-[1150px] left-[15px] rounded-[16px] top-[417px] w-[1050px]" data-name="变量：海报底图">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" src={posterImage} />
          <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 rounded-[16px]" />
        </div>
      </div>
      
      {/* 遮罩层 */}
      <div className="absolute backdrop-blur-[1px] backdrop-filter bg-[rgba(255,255,255,0)] h-[1150px] left-[15px] rounded-[16px] top-[417px] w-[1050px]" data-name="固定内容：遮罩" />
      
      {/* 1V1大标题 */}
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[191px] not-italic text-[#212121] text-[235px] text-center text-nowrap top-[284px] tracking-[-18px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">{mainTitle}</p>
      </div>
      
      {/* 成果说明 - 科研（教授版格式：换行显示） */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold leading-[normal] left-[357px] not-italic text-[#212121] text-[33px] top-[185px] tracking-[-2.64px] w-[274px]">
        科研：
        <br aria-hidden="true" />
        {researchBenefit}
      </p>
      
      {/* 成果说明 - 论文（教授版格式：换行显示） */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[normal] left-[355px] not-italic text-[#212121] text-[33px] top-[281px] w-[276px]">
        论文：
        <br aria-hidden="true" />
        {paperBenefit}
      </p>
      
      {/* 学科大类标签 */}
      <SubjectCategory text={subjectCategory} />
      
      {/* 课题名称 */}
      <p className="absolute font-['Inter:Medium','Noto_Sans_SC:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[413px] leading-[normal] left-[61px] not-italic text-[64px] text-white top-[467px] tracking-[1.28px] w-[948px] whitespace-pre-line">{projectTitle}</p>
      
      {/* 适合专业标题 */}
      <div className="absolute flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold h-[49px] justify-center leading-[0] left-[60px] not-italic text-[36px] text-white top-[949.5px] translate-y-[-50%] w-[618px]">
        <p className="leading-[normal]">{suitableMajorLabel}</p>
      </div>
      
      {/* 装饰线条 */}
      <DecorationLine top="992px" />
      
      {/* 适合专业内容 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold h-[143px] leading-[normal] left-[60px] not-italic text-[36px] text-white top-[1014px] w-[945px] whitespace-pre-line">{suitableMajor}</p>
      
      {/* 参考导师背景标题 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[normal] left-[64px] not-italic text-[36px] text-nowrap text-white top-[1204px] tracking-[-2.88px]">{tutorBackgroundLabel}</p>
      
      {/* 装饰线条 */}
      <DecorationLine top="1271px" />
      
      {/* 导师背景内容 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[220px] leading-[normal] left-[64px] not-italic text-[28px] text-white top-[1293px] w-[747px] whitespace-pre-line">{tutorBackground}</p>
      
      {/* 项目标签（自适应黑底矩形） */}
      <ProjectLabel text={projectLabel} />
      
      {/* 项目形式说明 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[0] left-[51px] not-italic text-[#212121] text-[32px] text-nowrap top-[1746px]">
        <span className="leading-[normal]">{subtitleParts[0]} </span>
        <span className="leading-[25px]">|</span>
        <span className="leading-[normal]"> {subtitleParts[1] || ''}</span>
      </p>
      
      {/* 二维码 */}
      <div className="absolute left-[857px] rounded-[16px] size-[170px] top-[1635px]" data-name="变量：二维码">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={qrCode} />
      </div>
      
      {/* 二维码提示文字 */}
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[normal] left-[862px] not-italic text-[#212121] text-[20px] text-nowrap top-[1810px]">{qrCaption}</p>
    </div>
  );
}
