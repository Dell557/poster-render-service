import React from "react";
import { PosterData, PosterVersion } from "./types/poster";
import { PosterDoctor } from "./components/PosterDoctor";
import { PosterProfessor } from "./components/PosterProfessor";

// 默认占位图
import defaultBgImgDoctor from "figma:asset/cd9dbc4f6eccfefbec7461e1a63df4996a487c50.png";
import defaultBgImgProfessor from "figma:asset/969c20950a91fe5192389fa556ab6d4f38950cc1.png";
import defaultQrImg from "figma:asset/bb4b9211c8126d935865a04d996ad2189b79bea2.png";

// 声明全局变量类型
declare global {
  interface Window {
    RENDER_VARIABLES?: Partial<PosterData> & {
      posterVersion?: PosterVersion;
      qrCodeDataUrl?: string; // 服务端生成的二维码 DataURL
    };
  }
}

// 获取渲染变量
function getRenderData(): { data: PosterData; version: PosterVersion } {
  const vars = typeof window !== 'undefined' ? window.RENDER_VARIABLES : undefined;
  
  // 获取版式，默认为博士版
  const version: PosterVersion = vars?.posterVersion || 'doctor';
  
  // 获取默认背景图
  const defaultBgImg = version === 'doctor' ? defaultBgImgDoctor : defaultBgImgProfessor;
  
  // 构建数据对象
  const data: PosterData = {
    posterImage: vars?.posterImage || defaultBgImg,
    qrCode: vars?.qrCodeDataUrl || vars?.qrCode || defaultQrImg,
    subjectCategory: vars?.subjectCategory || '',
    projectTitle: vars?.projectTitle || '',
    suitableMajor: vars?.suitableMajor || '',
    tutorBackground: vars?.tutorBackground || '',
    mainTitle: vars?.mainTitle,
    researchBenefit: vars?.researchBenefit,
    paperBenefit: vars?.paperBenefit,
    projectLabel: vars?.projectLabel,
    projectSubtitle: vars?.projectSubtitle,
    qrCaption: vars?.qrCaption,
    tutorBackgroundLabel: vars?.tutorBackgroundLabel,
    suitableMajorLabel: vars?.suitableMajorLabel,
  };
  
  return { data, version };
}

export default function App() {
  const { data, version } = getRenderData();
  
  return (
    <div id="poster-container">
      {version === 'doctor' ? (
        <PosterDoctor data={data} />
      ) : (
        <PosterProfessor data={data} />
      )}
    </div>
  );
}
