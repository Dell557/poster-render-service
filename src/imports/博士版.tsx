import img from "figma:asset/cd9dbc4f6eccfefbec7461e1a63df4996a487c50.png";
import img1 from "figma:asset/bb4b9211c8126d935865a04d996ad2189b79bea2.png";

function Component() {
  return (
    <div className="absolute bg-white grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid left-[72px] px-[11px] py-0 rounded-[4px] top-[1314px]" data-name="变量：自适应方框-导师背景">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[36px] text-black text-center text-nowrap">
        <p className="leading-[normal]">导师背景</p>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute bg-white grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid left-[72px] px-[11px] py-0 rounded-[4px] top-[986px]" data-name="变量：自适应方框-适合专业">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[36px] text-black text-center text-nowrap">
        <p className="leading-[normal]">适合专业</p>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="absolute left-[414px] rounded-[12px] top-[186px]" data-name="变量：自适应方框（学科大类）">
      <div className="gap-[10px] grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid overflow-clip p-[10px] relative rounded-[inherit]">
        <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic place-self-center relative shrink-0 text-[64px] text-center text-nowrap text-white">
          <p className="leading-[64px]">
            材料
            <br aria-hidden="true" />
            科学
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[5px] border-solid border-white inset-[-2.5px] pointer-events-none rounded-[14.5px]" />
    </div>
  );
}

export default function Component3() {
  return (
    <div className="relative size-full" data-name="博士版">
      <div className="absolute bg-white h-[1920px] left-1/2 top-0 translate-x-[-50%] w-[1080px]" data-name="固定内容：底板" />
      <div className="absolute h-[1920px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[1080px]" data-name="变量：海报底图">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img} />
      </div>
      <div className="absolute bg-white h-[224px] left-[819px] rounded-[8px] top-[1551px] w-[188px]" data-name="固定内容：二维码背景板" />
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[34px] leading-[normal] left-[833px] not-italic text-[#212121] text-[20px] top-[1744px] w-[208px]">扫码了解课题详情</p>
      <div className="absolute left-[828px] rounded-[12px] size-[170px] top-[1569px]" data-name="变量：二维码">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12px] size-full" src={img1} />
      </div>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[50px] leading-[0] left-[77px] not-italic text-[32px] text-white top-[1728px] w-[509px]">
        <span className="leading-[normal]">{`远程线上科研 `}</span>
        <span className="leading-[25px]">|</span>
        <span className="leading-[normal]">{` 全年滚动招生`}</span>
      </p>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold h-[44px] leading-[normal] left-[77px] not-italic text-[36px] text-white top-[1660px] tracking-[2.52px] w-[486px]">国内高校科研项目[1V1]</p>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[122px] leading-[normal] left-[72px] not-italic text-[36px] text-white top-[1369px] w-[945px]">国内高校博士</p>
      <Component />
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[143px] leading-[normal] left-[72px] not-italic text-[36px] text-white top-[1042px] w-[945px]">物理类 | 化学类</p>
      <Component1 />
      <div className="absolute h-0 left-[83px] top-[892px] w-[75px]" data-name="固定内容：装饰条2">
        <div className="absolute inset-[-1px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 2">
            <path d="M0 1H75" id="åºå®åå®¹ï¼è£é¥°æ¡2" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[83px] top-[1218px] w-[75px]" data-name="固定内容：装饰条1">
        <div className="absolute inset-[-1px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 2">
            <path d="M0 1H75" id="åºå®åå®¹ï¼è£é¥°æ¡2" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold leading-[normal] left-[63px] not-italic text-[42px] text-white top-[402px] w-[480px]">{`论文 - {国际会议论文}`}</p>
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[227px] not-italic text-[225px] text-center text-nowrap text-white top-[252px] tracking-[-18px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">1V1</p>
      </div>
      <Component2 />
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold leading-[normal] left-[63px] not-italic text-[42px] text-white top-[352px] w-[480px]">{`科研 - {专属导师推荐信}`}</p>
      <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium','Noto_Sans_SC:Medium',sans-serif] font-medium h-[302px] leading-[normal] left-[63px] not-italic text-[72px] text-white top-[544px] tracking-[1.44px] w-[948px]">新能源电池材料与技术新能源电池材料与</p>
    </div>
  );
}