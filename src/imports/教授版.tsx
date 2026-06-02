import img from "figma:asset/969c20950a91fe5192389fa556ab6d4f38950cc1.png";
import img1 from "figma:asset/bb4b9211c8126d935865a04d996ad2189b79bea2.png";

function Component() {
  return (
    <div className="absolute left-[calc(50%+322px)] rounded-[16px] top-[calc(50%-710px)] translate-x-[-50%] translate-y-[-50%]" data-name="变量：自适应方框">
      <div className="gap-[10px] grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] inline-grid overflow-clip p-[10px] relative rounded-[inherit]">
        <div className="[grid-area:1_/_1] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold justify-center leading-[0] not-italic place-self-center relative shrink-0 text-[#212121] text-[64px] text-center text-nowrap">
          <p className="leading-[64px]">
            学科
            <br aria-hidden="true" />
            大类
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#212121] border-[5px] border-solid inset-[-2.5px] pointer-events-none rounded-[18.5px]" />
    </div>
  );
}

export default function Component1() {
  return (
    <div className="relative size-full" data-name="教授版">
      <div className="absolute bg-white h-[1920px] left-1/2 rounded-[16px] top-0 translate-x-[-50%] w-[1080px]" data-name="固定内容：底板" />
      <div className="absolute backdrop-blur-[1px] backdrop-filter bg-[rgba(255,255,255,0)] h-[1150px] left-[15px] rounded-[16px] top-[417px] w-[1050px]" data-name="固定内容：遮罩" />
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[normal] left-[862px] not-italic text-[#212121] text-[20px] text-nowrap top-[1810px]">扫码了解课题详情</p>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[0] left-[51px] not-italic text-[#212121] text-[32px] text-nowrap top-[1752px]">
        <span className="leading-[normal]">{`远程线上科研 `}</span>
        <span className="leading-[25px]">|</span>
        <span className="leading-[normal]">{` 全年滚动招生`}</span>
      </p>
      <div className="absolute bg-[#212121] h-[60px] left-[36px] rounded-[12px] top-[1674px] w-[440px]" data-name="固定内容：黑底矩形" />
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold leading-[normal] left-[56px] not-italic text-[36px] text-nowrap text-white top-[1681px] tracking-[2.16px]">国内高校科研项目[1V1]</p>
      <div className="absolute h-[1150px] left-1/2 rounded-[16px] top-[417px] translate-x-[-50%] w-[1050px]" data-name="变量：海报底图">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" src={img} />
          <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 rounded-[16px]" />
        </div>
      </div>
      <div className="absolute h-0 left-[59px] top-[1271px] w-[43px]" data-name="固定内容：装饰条">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 1">
            <path d="M0 0.5H43" id="åºå®åå®¹ï¼è£é¥°æ¡" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[normal] left-[64px] not-italic text-[36px] text-nowrap text-white top-[1204px] tracking-[-2.88px]">参考导师背景</p>
      <div className="absolute h-0 left-[59px] top-[992px] w-[43px]" data-name="固定内容：装饰条">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 1">
            <path d="M0 0.5H43" id="åºå®åå®¹ï¼è£é¥°æ¡" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
      <div className="absolute flex flex-col font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold h-[49px] justify-center leading-[0] left-[60px] not-italic text-[36px] text-white top-[949.5px] translate-y-[-50%] w-[618px]">
        <p className="leading-[normal]">适合专业</p>
      </div>
      <div className="absolute left-[857px] rounded-[16px] size-[170px] top-[1635px]" data-name="变量：二维码">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={img1} />
      </div>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold h-[220px] leading-[normal] left-[64px] not-italic text-[28px] text-white top-[1293px] w-[747px]">导师背景</p>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold h-[143px] leading-[normal] left-[60px] not-italic text-[36px] text-white top-[1014px] w-[945px]">适合专业</p>
      <p className="absolute font-['Inter:Medium','Noto_Sans_SC:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[413px] leading-[normal] left-[61px] not-italic text-[64px] text-white top-[467px] tracking-[1.28px] w-[948px]">课题名称</p>
      <Component />
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_SC:Bold','Noto_Sans_JP:Bold',sans-serif] font-semibold leading-[normal] left-[355px] not-italic text-[#212121] text-[33px] top-[281px] w-[276px]">
        论文：
        <br aria-hidden="true" />
        国际会议论文
      </p>
      <p className="absolute font-['Inter:Semi_Bold','Noto_Sans_JP:Bold','Noto_Sans_SC:Bold',sans-serif] font-semibold leading-[normal] left-[357px] not-italic text-[#212121] text-[33px] top-[185px] tracking-[-2.64px] w-[274px]">
        科研：
        <br aria-hidden="true" />
        专属导师推荐信
      </p>
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[191px] not-italic text-[#212121] text-[225px] text-center text-nowrap top-[274px] tracking-[-18px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">1V1</p>
      </div>
    </div>
  );
}