
import React, { useState, useEffect, useRef } from 'react';
import { EdgeTXTheme, ThemeVariable } from '../types.ts';

type ScreenID = 'screenshot1' | 'screenshot2' | 'screenshot3';

interface PreviewProps {
  theme: EdgeTXTheme;
  onVariableClick: (variable: ThemeVariable) => void;
  hoveredVar: ThemeVariable | null;
  droneImage?: string;
  backgroundImage?: string | null;
  activeScreen: ScreenID;
  setActiveScreen: (id: ScreenID) => void;
  modelLabel: string;
}

const Preview: React.FC<PreviewProps> = ({ 
  theme, 
  onVariableClick, 
  hoveredVar,
  droneImage = "assets/drone.png",
  backgroundImage = null,
  activeScreen,
  setActiveScreen,
  modelLabel
}) => {
  const [now, setNow] = useState(new Date());
  const [imgError, setImgError] = useState(false);
  const [isFirstToggleFocused, setIsFirstToggleFocused] = useState(false);
  const [isSecondToggleFocused, setIsSecondToggleFocused] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Gestione responsive scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Calcoliamo lo scale basandoci sulla larghezza target di 800px
        const newScale = containerWidth / 800;
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    // Usiamo ResizeObserver per una precisione maggiore durante il resize dei contenitori flex/grid
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [droneImage]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const getHighlightStyle = (variable: ThemeVariable) => {
    if (hoveredVar === variable) {
      return {
        outline: '3px solid #3b82f6',
        outlineOffset: '-3px',
        zIndex: 100,
        filter: 'brightness(1.1)',
        boxShadow: '0 0 15px rgba(59,130,246,0.5)'
      };
    }
    return {};
  };

  const EqualizerIcon = ({ isFirst = false }: { isFirst?: boolean }) => (
    <div 
      className="w-8 h-8 flex items-center justify-center rounded-sm border-2 transition-all"
      style={{ 
        borderColor: theme.primary2, 
        backgroundColor: isFirst ? theme.focus : 'transparent'
      }}
    >
      <div className="flex items-end gap-[2px] h-4">
        <div className="w-[3px] h-[40%]" style={{ backgroundColor: theme.primary2 }}></div>
        <div className="w-[3px] h-[80%]" style={{ backgroundColor: theme.primary2 }}></div>
        <div className="w-[3px] h-[60%]" style={{ backgroundColor: theme.primary2 }}></div>
        <div className="w-[3px] h-[100%]" style={{ backgroundColor: theme.primary2 }}></div>
      </div>
    </div>
  );

  const EdgeTXIcon = ({ theme }: { theme: EdgeTXTheme }) => (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 30 30" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all"
    >
      <rect width="30" height="30" fill="transparent"/>
      <g clipPath="url(#clip0_4670_1719)">
        <path fillRule="evenodd" clipRule="evenodd" d="M21.3843 14.7638L24.1796 9.48982H29.3168L23.931 19.4949L29.3168 29.5H24.1796L21.3843 24.226L18.5453 29.5H13.5739L18.8768 19.4949L13.5739 9.48982H18.5453L21.3843 14.7638ZM0.509625 9.48982L12.7597 9.50605L12.7453 13.9229L8.85988 13.9508L8.85105 29.5H4.45961L4.46331 13.9759L0.5 13.9618L0.509625 9.48982V9.48982ZM1.89105 8.45429C0.614025 8.45429 0.648188 7.29428 0.648188 7.29428V1.8257C0.646757 0.501949 1.89105 0.5 1.89105 0.5H6.62982V1.8257H2.96818V3.31713H5.95104V4.80856H2.96818V6.96286H6.62982L6.61391 8.45429C6.61391 8.45429 3.00174 8.45191 1.89105 8.45429ZM24.578 8.45429C23.301 8.45429 23.3351 7.29428 23.3351 7.29428V1.8257C23.3337 0.501949 24.578 0.5 24.578 0.5H29.3168V1.8257H25.6551V3.31713H28.638V4.80856H25.6551V6.96286H29.3168L29.3008 8.45429C29.3008 8.45429 25.6887 8.45191 24.578 8.45429ZM16.8054 8.45429C15.5284 8.45429 15.5626 7.29428 15.5626 7.29428V1.8257C15.5611 0.501949 16.8054 0.5 16.8054 0.5H22.0254V1.8257H17.8826V6.96286H19.6225V3.31713H22.0254V7.21143C22.0254 7.89988 21.2904 8.45429 20.6996 8.45429C19.5426 8.45429 17.5249 8.45274 16.8054 8.45429V8.45429ZM13.0767 8.45429C14.3537 8.45429 14.3195 7.29428 14.3195 7.29428V1.8257C14.3209 0.501949 13.0767 0.5 13.0767 0.5H7.85677V1.8257H11.9995V6.96286H10.1768V2.73714H7.85677V8.45429C7.85677 8.45429 12.3572 8.45274 13.0767 8.45429V8.45429Z" fill={theme.primary2}/>
      </g>
      <defs>
        <clipPath id="clip0_4670_1719">
          <rect width="30" height="30" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const ModelSetupIcon = () => (
    <svg viewBox="0 0 30 30" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 1C7.27325 1 1 7.27307 1 15.0001C1 22.7269 7.27325 29 15 29C22.7267 29 29 22.7269 29 15.0001C29 7.27307 22.7267 1 15 1ZM15 2.96872C21.6401 2.96872 27.0313 8.35969 27.0313 15.0001C27.0313 21.6403 21.6401 27.0313 15 27.0313C8.35986 27.0313 2.96871 21.6403 2.96871 15.0001C2.96871 8.35969 8.35986 2.96872 15 2.96872Z"
          fill={theme.primary2}
        />
        <path
          d="M12.8811 6.72184C12.8811 6.72184 13.5574 6.02484 14.8404 6.00004C16.3617 5.99356 16.7544 6.80694 16.7544 6.80694V9.31138L24 10.9246V15.5096H16.7544V19.9666H19.1696V24H10.6026V19.9666H12.8811V15.5096H6V10.9246L12.6987 9.26939H12.8811V6.72184Z"
          fill={theme.primary2}
        />
      </g>
    </svg>
  );

  const ModelNotesIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fillRule="evenodd" clipRule="evenodd" d="M29 4.19432C29 2.43133 27.569 1 25.8065 1H4.19379C2.43124 1 1 2.43133 1 4.19432V25.8057C1 27.5687 2.43124 29 4.19379 29H25.8065C27.569 29 29 27.5687 29 25.8057V4.19432ZM26.8141 4.19432V25.8057C26.8141 26.362 26.3626 26.8136 25.8065 26.8136H4.19379C3.63737 26.8136 3.18587 26.362 3.18587 25.8057V4.19432C3.18587 3.63776 3.63737 3.18617 4.19379 3.18617H25.8065C26.3626 3.18617 26.8141 3.63776 26.8141 4.19432ZM21.833 20.3686C21.833 19.9524 21.4955 19.6145 21.0794 19.6145H8.88961C8.47353 19.6145 8.13575 19.9524 8.13575 20.3686V21.8638C8.13575 22.28 8.47353 22.6178 8.88961 22.6178H21.0794C21.4955 22.6178 21.833 22.28 21.833 21.8638V20.3686ZM21.833 14.3292C21.833 13.9133 21.4955 13.5754 21.0794 13.5754H8.88961C8.47353 13.5754 8.13575 13.9133 8.13575 14.3292V15.8246C8.13575 16.2406 8.47353 16.5784 8.88961 16.5784H21.0794C21.4955 16.5784 21.833 16.2406 21.833 15.8246V14.3292ZM21.833 8.28979C21.833 7.87386 21.4955 7.53599 21.0794 7.53599H8.88961C8.47353 7.53599 8.13575 7.87386 8.13575 8.28979V9.78522C8.13575 10.2012 8.47353 10.539 8.88961 10.539H21.0794C21.4955 10.539 21.833 10.2012 21.833 9.78522V8.28979Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelFlightModesIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M5.95274 1L9.18073 15.0196L5.95274 29H12.7629L15.9909 15.0196L12.7629 1H5.95274ZM7.96038 2.60999H11.4247L14.3771 15.0196L11.3458 27.5471H8.03923L10.9128 15.0196L7.96038 2.60999ZM1 23.2941L2.95428 14.8116L1 6.32895H5.11417L7.06872 14.8116L5.11417 23.2941H1ZM16.3975 23.1505L18.3518 14.6681L16.3975 6.18538H20.5119L22.4662 14.6681L20.5119 23.1505H16.3975ZM22.9313 23.1435L24.8856 14.661L22.9313 6.17836H27.0457L29 14.661L27.0457 23.1435H22.9313Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelInputsIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M1 14.9882V25.2025L18.6916 14.9882L1 4.77382V14.9882ZM3.82186 20.3148V9.66152L13.0479 14.9882L3.82186 20.3148ZM16.988 1V1.0434C16.8731 1.0434 16.2741 1.02599 15.5329 1.26379C14.7257 1.52212 13.7142 2.08087 12.7991 3.07156C11.7534 4.20389 10.8666 5.85313 10.2858 8.23032L10.6826 8.45096L14.1659 10.435C14.5926 7.85531 15.3252 6.54443 15.8856 5.93759C16.2964 5.49266 16.6242 5.33621 16.8115 5.27618C16.8677 5.25799 16.8461 5.23953 16.8557 5.23303H28.9475V1H16.988Z" fill="currentColor"/>
        <path d="M14.1659 19.5193L10.6826 21.5477L10.2858 21.7681C10.8671 24.1123 11.7658 25.7639 12.7991 26.883C13.7142 27.8739 14.7257 28.4324 15.5329 28.6907C15.5329 28.6907 16.2898 29 17.1203 29H29V24.767L16.988 24.6783H16.8557C16.8461 24.6783 16.8677 24.6513 16.8115 24.6349C16.6242 24.5744 16.2964 24.4626 15.8856 24.0177C15.3284 23.4143 14.5939 22.0849 14.1659 19.5204V19.5193Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelMixerIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M7.67038 20.9717C5.37646 22.9492 2.98448 24.2088 1 24.6484V29C4.37982 28.637 7.68668 26.7528 10.7361 24.0075L7.67038 20.9717V20.9717ZM22.3296 20.9701C24.6233 22.9476 27.0155 24.2072 29 24.6468V28.9984C25.6202 28.6355 22.3133 26.7513 19.2639 24.0059L22.3296 20.9701V20.9701ZM16.6626 5.64668C15.6851 4.6731 14.1022 4.6775 13.1301 5.65626L5.61268 13.2247C4.64062 14.2035 4.64501 15.7885 5.6225 16.7618L13.3485 24.4557C14.326 25.429 15.9087 25.4246 16.8807 24.4458L24.3982 16.8773C25.3702 15.8986 25.3658 14.3139 24.3886 13.3403L16.6626 5.64668V5.64668ZM15.7762 6.53866L23.5022 14.2325C23.9881 14.7162 23.9902 15.5038 23.5071 15.99L15.9896 23.5585C15.5068 24.0448 14.7203 24.0471 14.2347 23.5634L6.50867 15.8696C6.02303 15.3859 6.02069 14.5983 6.50375 14.112L14.0212 6.54358C14.5043 6.0573 15.2906 6.05523 15.7762 6.53866ZM20.9894 15.002L10.7286 10.797L13.4453 15.0286L10.9731 19.4136L20.9894 15.002ZM1 1.00157V5.35316C2.80259 5.74591 4.92652 6.83556 6.99664 8.49023L10.0624 5.42052C7.20569 2.99848 4.13195 1.34302 1 1.00157V1.00157ZM29 1V5.35161C27.1974 5.7441 25.0735 6.83399 23.0034 8.48867L19.9376 5.41895C22.7943 2.99691 25.868 1.34145 29 1V1Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelOutputsIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M13.3902 23.9061C13.0401 24.2304 12.7557 24.3539 12.5859 24.4087C12.4876 24.4399 12.5058 24.4391 12.519 24.4424H12.4183L1 24.5428L1.03346 29H12.4183C12.539 29 13.1467 28.914 13.9265 28.6649C14.7756 28.3931 15.846 27.797 16.8086 26.7547C17.2536 26.2729 17.6651 25.6838 18.0484 25.012L13.3902 23.9061ZM7.93772 21.2894L25.7888 25.4728L25.596 25.4028C25.9486 25.4365 26.4276 25.419 26.9357 25.2154C27.5184 24.9817 28.1911 24.5102 28.6652 23.4449C29.1269 22.4077 29.0392 21.5947 28.8297 20.9976C28.5082 20.0808 27.8182 19.6098 27.6854 19.5233C27.6718 19.5143 27.6581 19.5058 27.645 19.4979C27.663 19.5089 12.877 9.96093 12.877 9.96093L12.8041 9.91383L12.7261 9.87574C12.7261 9.87574 10.9598 8.98935 8.93815 9.65929C7.70585 10.0677 6.30983 11.0422 5.28111 13.3528C4.41763 15.2924 4.48815 16.8379 4.87061 18.0118C5.48933 19.9102 7.00628 20.8995 7.47264 21.1299C7.63607 21.2109 7.79127 21.2622 7.93772 21.2894ZM26.0248 21.9843C26.0179 22.023 25.9939 22.1478 25.9538 22.2379C25.9211 22.3109 25.8678 22.3907 25.8354 22.4353L8.73943 18.4293C8.44989 18.1837 6.99574 16.7991 7.99254 14.5599C8.54795 13.3127 9.20682 12.6971 9.87187 12.4768C10.5601 12.2487 11.1765 12.4453 11.3613 12.5164L11.3654 12.5179L26.0248 21.9843ZM28.3512 15.8172C28.3512 15.8172 28.3587 14.6034 28.369 12.8574L25.4092 12.8396C25.3986 14.5857 25.3915 15.7994 25.3915 15.7994L28.3512 15.8172ZM1.03346 1.01517V5.47235H12.5524C12.5625 5.4829 12.5269 5.48651 12.5859 5.50581C12.783 5.56912 13.1256 5.74157 13.5577 6.20947C14.0624 6.75587 14.7393 7.86334 15.2 9.86236L20.0592 12.9454C19.7107 7.95909 18.4501 4.97073 16.8086 3.19357C15.846 2.15121 14.081 1.55488 13.2319 1.28335C12.4523 1.03345 11.8444 1.04863 11.7237 1.04863V1.01517H1.03346ZM28.387 9.89762C28.3927 8.92861 28.3989 7.91996 28.4048 6.93757L25.445 6.91982C25.4391 7.90221 25.4329 8.91085 25.427 9.8796L28.387 9.89762ZM28.4225 3.97779C28.4302 2.70225 28.4367 1.64213 28.4403 1.018L25.4805 1C25.4766 1.62439 25.4705 2.6845 25.4627 3.96004L28.4225 3.97779Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelCurvesIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M19.2757 1V7.26346C16.8427 7.9113 15.0665 10.1489 15.0665 12.786C15.0665 15.4231 16.8427 17.6273 19.2757 18.2749V29H22.1045V18.3085C24.5973 17.7023 26.4485 15.4655 26.4485 12.786C26.4485 10.1095 24.5934 7.87276 22.1045 7.26346V1H19.2757ZM10.4889 8.89663C9.30733 8.83611 8.22294 9.03214 7.00175 9.55869C3.37153 11.1246 2.48913 15.802 2.0112 19.2462C1.48673 23.027 1 28.9834 1 28.9834H3.81326C3.81326 28.9834 4.29221 23.3203 4.91109 19.7694C5.51263 16.3187 6.32805 13.0823 8.14949 12.1635C9.94869 11.3232 12.299 12.2346 13.1527 12.6422C13.3614 12.7423 13.5926 12.854 13.815 12.9512C13.8135 12.8918 13.815 12.8338 13.815 12.7746C13.815 11.8177 13.994 10.911 14.3447 10.0819C14.326 10.0679 14.3191 10.0464 14.3004 10.0376C13.1281 9.55455 11.8136 8.96516 10.4889 8.89663Z" fill="currentColor"/>
        <path d="M20.7576 9.55326C22.5372 9.55326 23.9565 11.0064 23.9565 12.786C23.9565 14.5658 22.5372 15.9851 20.7576 15.9851C18.9778 15.9851 17.5249 14.5658 17.5249 12.786C17.5249 11.0064 18.9778 9.55326 20.7576 9.55326Z" fill="currentColor"/>
        <path d="M26.1749 3.76901C26.1749 3.76901 25.8661 5.48857 24.9387 7.30044C25.7701 7.93716 26.4513 8.74041 26.9251 9.68437C28.5992 7.01725 29 4.16625 29 4.16625L26.1749 3.76901Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelGvarsIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fillRule="evenodd" clipRule="evenodd" d="M29 4.18883C29 2.42902 27.5735 1 25.8165 1H4.18348C2.42651 1 1 2.42902 1 4.18883V25.8112C1 27.5712 2.42651 29 4.18348 29H25.8165C27.5735 29 29 27.5712 29 25.8112V4.18883ZM26.9584 4.18883V25.8112C26.9584 26.4424 26.4469 26.9551 25.8165 26.9551H4.18348C3.5531 26.9551 3.04162 26.4424 3.04162 25.8112V4.18883C3.04162 3.5576 3.5531 3.0452 4.18348 3.0452H25.8165C26.4469 3.0452 26.9584 3.5576 26.9584 4.18883ZM14.5679 24.9638H12.1715L17.1148 19.0314L12.209 12.0933H16.1612L19.2602 16.4673L22.9114 12.0933H25.3079L20.3643 18.0258L25.2827 24.9638H21.3179L18.2189 20.5899L14.5679 24.9638V24.9638Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelLogicalSwitchesIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.1921 1.00025L12.0576 1C7.73881 1 4.24744 4.45784 4.24744 8.71069C4.24744 9.04277 4.27692 9.36809 4.32398 9.68771C1.38721 12.6998 0.964446 15.4973 1.0022 19.071C1.0552 24.089 5.30574 29 10.5861 29L22.8984 28.879L22.9372 28.8756C26.2905 28.5742 29 24.7884 29 21.0559C29 18.8633 28.5775 16.2324 26.7159 14.4313C27.1125 13.5295 27.3395 12.5237 27.3395 11.4558C27.3395 7.5496 24.3939 4.42174 20.8123 4.42174C20.1028 4.42174 19.4334 4.56066 18.8023 4.79796C17.4663 2.55912 15.0086 1.04673 12.1921 1.00025ZM12.0576 2.96881L12.0589 2.96804C14.4816 2.96855 16.5714 4.40565 17.4593 6.47288L17.8846 7.46339L18.8281 6.94775C19.4326 6.61723 20.0899 6.39084 20.8123 6.39084C23.3576 6.39084 25.3788 8.6798 25.3788 11.4558C25.3788 12.4617 25.1037 13.3925 24.6445 14.1838L24.2005 14.9482L24.9103 15.4727C26.7699 16.8472 27.0391 19.1842 27.0391 21.0559C27.0391 22.7433 26.3324 24.4657 25.2195 25.6221C24.5457 26.3224 23.7204 26.8154 22.8053 26.9105C22.7981 26.911 10.5825 27.0309 10.5825 27.0309C6.36119 27.0288 3.00529 23.0621 2.96289 19.0502C2.92953 15.8863 3.27058 13.4192 6.05738 10.7346L6.44652 10.3594L6.33946 9.82868C6.26629 9.46571 6.20813 9.0947 6.20813 8.71069C6.20813 5.53456 8.83227 2.96881 12.0576 2.96881ZM19.8474 24.3343H9.68375L14.7655 15.496L19.8474 24.3343ZM7.56663 16.896L22.0341 13.0035L21.5 11.0415L7 14.9482L7.56663 16.896Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelSpecialFunctionsIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.956 1C2.46138 1 1 2.50287 1 4.61083V25.3889C1 27.4969 2.46138 29 3.956 29H22.4718C23.2638 29 23.9238 28.6138 24.4223 27.9205C24.831 27.3526 25.1218 26.5123 25.3589 25.8084L29 15.0001L25.3589 4.19131C25.1218 3.48745 24.831 2.64739 24.4223 2.0792C23.9235 1.38625 23.2638 1 22.4718 1H3.956V1ZM22.2609 3.64729C22.312 3.72709 22.3859 3.84745 22.426 3.93504C22.5874 4.28516 22.711 4.68257 22.8281 5.0306L26.1865 15.0001L22.8281 24.9694C22.711 25.3172 22.5874 25.7146 22.426 26.065C22.3859 26.1526 22.312 26.2732 22.2609 26.3527H4.00132C3.97093 26.3207 3.87346 26.2147 3.83259 26.1357C3.72439 25.9272 3.66834 25.6681 3.66834 25.3889V4.61083C3.66834 4.33168 3.7244 4.07279 3.83234 3.86433C3.87347 3.78532 3.97093 3.67927 4.00132 3.64729H22.2609V3.64729ZM6.01991 18.9593L11.1648 24.336L19.3277 14.1954L17.0642 12.358L11.0962 19.9124L8.07783 16.7135L6.01991 18.9593V18.9593Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelMixerScriptsIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M11.5317 7.25177C5.73286 7.25177 1 12.1145 1 18.126C1 24.1376 5.73286 29 11.5317 29C17.3306 29 22.021 24.1376 22.021 18.126C22.021 12.1145 17.3306 7.25177 11.5317 7.25177ZM25.574 25.6418L24.9818 26.8266L26.8005 27.7909L27.3927 26.6072V26.5637L27.4349 26.5202L27.6887 25.8187L25.8278 25.0295L25.574 25.6418ZM26.8005 21.3449H26.8428L26.5891 22.748H26.5467L26.4622 23.1427L28.4078 23.7126L28.4923 23.3618V23.3184L28.5348 23.2749L28.8309 21.6523V21.477L26.8428 21.2578L26.8005 21.3449ZM26.8852 17.2671L26.9696 18.1439V19.2844H29V18.0571L28.9153 17.0485L26.8852 17.2671ZM14.6617 10.8035C16.8526 10.8035 18.6374 12.6097 18.6374 14.8813C18.6374 17.1528 16.8526 19.0031 14.6617 19.0031C12.4705 19.0031 10.6857 17.1528 10.6857 14.8813C10.6857 12.6097 12.4705 10.8035 14.6617 10.8035ZM26.3775 13.3646L26.0392 13.453V13.54H26.0814L26.5044 15.0307V15.1193L26.5467 15.2946L28.5348 14.8999L28.4923 14.593V14.5494L28.4501 14.5059L27.9426 12.8399V12.7529L27.9001 12.6646L26.3775 13.3646ZM22.9517 3.1313C25.0751 3.1313 26.7992 4.91863 26.7992 7.12018C26.7992 9.32173 25.0751 11.1091 22.9517 11.1091C20.828 11.1091 19.104 9.32173 19.104 7.12018C19.104 4.91863 20.828 3.1313 22.9517 3.1313ZM4.00303 2.79761H3.96084L3.91834 2.84138L2.98785 3.36744L3.96084 5.20909L4.80657 4.72679H4.84908L4.89126 4.6833L5.6948 4.33258L4.89126 2.40312L4.00303 2.79761ZM15.0422 3.49902H15.2114L15.3383 3.54253L16.6496 3.93702L16.8187 4.02402L17.58 2.05078L17.4109 2.00728L17.3687 1.96379H17.3261L15.8036 1.48148H15.7191L15.423 1.43826L15.0422 3.49902ZM7.34439 1.52579H7.25995L6.92137 1.65766L7.51352 3.67492L7.76741 3.58657L7.85211 3.54307L9.28999 3.23585H9.37475L9.20529 2.35907L9.16311 2.18372L9.07867 1.17509H8.95172L7.34439 1.52579ZM11.1935 3.10427H12.3778V3.06078L13.1391 3.14912L13.3504 1.08834L12.5044 1H11.1935V3.10427Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const ModelTelemetryIcon = () => (
    <svg viewBox="0 0 30 30" className="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M12.8625 13.7301C3.9812 13.7301 1 20.6078 1 20.6078V21.4675C1 21.4675 3.67631 29 12.8205 29C21.2891 29 24.0521 21.5493 24.0521 21.5493V20.6078C24.0521 20.6078 21.1071 13.7301 12.8625 13.7301V13.7301ZM12.0633 14.8766C12.2825 14.8549 12.5113 14.8766 12.7364 14.8766C16.3367 14.8766 19.2567 17.6771 19.2567 21.1808C19.2567 24.6845 16.3367 27.5262 12.7364 27.5262C9.13609 27.5262 6.21611 24.6845 6.21611 21.1808C6.21611 17.8962 8.7761 15.2013 12.0633 14.8766ZM12.7252 18.1124C14.5701 18.1124 16.0677 19.5698 16.0677 21.3649C16.0677 23.1603 14.5701 24.6178 12.7252 24.6178C10.8806 24.6178 9.38299 23.1603 9.38299 21.3649C9.38299 19.5698 10.8806 18.1124 12.7252 18.1124ZM12.1317 9.59696V11.7258C15.1432 11.7913 17.8351 12.7897 20.2084 14.264L21.8909 12.9539C19.0635 11.0371 15.8081 9.66506 12.1317 9.59696ZM12.1317 5.21678V7.30447C16.5833 7.37645 20.6734 8.85515 23.9944 11.2755L25.6349 9.92449C21.8888 7.06522 17.2272 5.29161 12.1317 5.21678ZM12.1317 1V3.04702C17.9474 3.12418 23.2093 5.1896 27.4015 8.53253L29 7.22264C24.4081 3.45741 18.5759 1.07923 12.1317 1V1Z" fill="currentColor"/>
      </g>
    </svg>
  );

  const TopBarSvgIcon = ({ children, active = false }: { children: React.ReactNode; active?: boolean }) => (
    <div
      className="w-12 h-12 flex items-center justify-center rounded-xl transition-all"
      style={{
        backgroundColor: active ? theme.active : 'transparent',
        border: 'none',
        color: active ? theme.secondary1 : theme.primary2
      }}
    >
      {children}
    </div>
  );

  const renderTopBar = () => {
    const isMixerScreen = activeScreen === 'screenshot2';
    const leftIcon = isMixerScreen ? <ModelSetupIcon /> : <EdgeTXIcon theme={theme} />;
    const icons = isMixerScreen ? [
      <ModelNotesIcon />,
      <ModelFlightModesIcon />,
      <ModelInputsIcon />,
      <ModelMixerIcon />,
      <ModelOutputsIcon />,
      <ModelCurvesIcon />,
      <ModelGvarsIcon />,
      <ModelLogicalSwitchesIcon />,
      <ModelSpecialFunctionsIcon />,
      <ModelMixerScriptsIcon />,
      <ModelTelemetryIcon />
    ] : Array(5).fill(null).map((_, i) => <EqualizerIcon key={i} isFirst={i === 0} />);

    return (
      <div className="flex flex-col">
        <div 
          className="w-full flex items-center cursor-pointer relative transition-colors duration-200 overflow-hidden shrink-0"
          style={{ 
            height: '60px', 
            backgroundColor: theme.secondary1, 
            ...getHighlightStyle('secondary1') 
          }}
          onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}
        >
          <div 
            className="h-full flex items-center justify-center pr-6 transition-all cursor-pointer relative z-40"
            style={{ 
              backgroundColor: theme.focus,
              clipPath: 'polygon(0 0, 80% 0, 100% 100%, 0% 100%)',
              width: '110px',
              ...getHighlightStyle('focus')
            }}
            onClick={(e) => { e.stopPropagation(); onVariableClick('focus'); }}
          >
            <div 
              className="h-full flex items-center justify-center cursor-pointer"
              style={{ ...getHighlightStyle('primary2') }}
              onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}
            >
              {leftIcon}
            </div>
          </div>

          {activeScreen !== 'screenshot1' && (
            <div className="flex items-center gap-0">
              {icons.map((icon, i) => (
                <div key={i} className={isMixerScreen ? 'px-[3px]' : ''} onClick={(e) => { e.stopPropagation(); onVariableClick(isMixerScreen && i === 3 ? 'active' : 'primary2'); }}>
                  {isMixerScreen && i === 3 ? (
                    <div style={{ backgroundColor: theme.focus, padding: '6px 2px' }}>
                      {icon}
                    </div>
                  ) : (
                    icon
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex-grow"></div>

          <div className="flex items-end gap-5 mr-4 h-full pb-3">
            <div className="flex flex-col items-end leading-[0.9] font-bold text-white ml-1 pointer-events-none">
              <span className="text-[11px] tracking-tight mb-[1px] uppercase">{formatDate(now)}</span>
              <span className="text-[18px] font-black tracking-tight">{formatTime(now)}</span>
            </div>
          </div>
        </div>
        {isMixerScreen && (
          <div className="w-full h-8 flex items-center justify-start border-b-[1px] shrink-0 mt-[3px]" style={{ backgroundColor: theme.secondary1, borderColor: theme.primary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>
            <span className="text-[14px] font-bold uppercase tracking-tight pl-[15px]" style={{ color: theme.primary2, ...getHighlightStyle('primary2') }} onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}>MIXES</span>
          </div>
        )}
      </div>
    );
  };

  const Handle = () => (
    <div 
      className="w-[22px] h-[22px] rounded-sm flex flex-shrink-0 flex-col items-center justify-center shadow-lg cursor-pointer border-[1.5px] border-black/40 z-50 transform hover:scale-105 transition-transform"
      style={{ backgroundColor: theme.focus, ...getHighlightStyle('focus') }}
      onClick={(e) => { e.stopPropagation(); onVariableClick('focus'); }}
    >
      <div className="w-3 h-[1px] bg-white/60 mb-[2px]"></div>
      <div className="w-3 h-[1px] bg-white/60"></div>
    </div>
  );

  const VerticalSlot = ({ railPos = '50%', scalePos = '50%', isLeft = true }: { railPos?: string, scalePos?: string, isLeft?: boolean }) => (
    <div className={`flex items-center h-full gap-3 ${!isLeft ? 'flex-row-reverse' : ''}`}>
      <div className="flex flex-col items-center justify-between h-full py-2 relative w-[24px]">
        {Array.from({ length: 31 }).map((_, i) => (
          <div 
            key={i} 
            className={`h-[1px] ${i % 5 === 0 ? 'w-5' : 'w-2.5'}`}
            style={{ backgroundColor: theme.primary1, opacity: 0.4 }}
          ></div>
        ))}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ top: scalePos }}>
           <Handle />
        </div>
      </div>
      <div 
        className="w-[12px] h-full rounded-full border border-black/40 relative shadow-inner cursor-pointer"
        style={{ backgroundColor: theme.secondary1, ...getHighlightStyle('secondary1') }}
        onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-0">
          <div className="absolute left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ top: railPos }}>
            <Handle />
          </div>
        </div>
      </div>
    </div>
  );

  const HorizontalSlot = ({ railPos = '50%', scalePos = '50%' }: { railPos?: string, scalePos?: string }) => (
    <div className="flex flex-col items-center gap-3 w-full">
      <div 
        className="h-[12px] w-full rounded-full border border-black/40 relative shadow-inner cursor-pointer"
        style={{ backgroundColor: theme.secondary1, ...getHighlightStyle('secondary1') }}
        onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}
      >
        <div className="absolute left-0 right-0 top-1/2 h-0">
           <div className="absolute top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ left: railPos }}>
             <Handle />
           </div>
        </div>
      </div>
      <div className="w-full relative h-[24px]">
        <div className="flex justify-between items-center w-full h-full">
          {Array.from({ length: 31 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-[1px] ${i % 5 === 0 ? 'h-6' : 'h-3'}`}
              style={{ backgroundColor: theme.primary1, opacity: 0.4 }}
            ></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-0">
          <div className="absolute top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ left: railPos }}>
            <Handle />
          </div>
        </div>
      </div>
    </div>
  );

  const renderChannel = (id: number, usValue = "1500us", percValue = "0%", isAlt = false, isCH03 = false) => {
    const chLabel = `CH${id < 10 ? '0' + id : id}`;
    return (
      <div className="flex flex-col w-full text-[13px] font-bold select-none">
        <div className="flex justify-between w-full px-1">
          <span className="opacity-90" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>{chLabel}</span>
          <span className="opacity-90" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>{usValue}</span>
        </div>
        <div className="flex items-center w-full mt-0.5">
          <span className="text-[17px] leading-none opacity-60 cursor-pointer" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>[</span>
          <div className="flex-grow mx-1 h-[20px] relative flex items-center justify-center border border-black/10 overflow-hidden rounded-sm shadow-inner" style={{ backgroundColor: theme.primary2, ...getHighlightStyle('primary2') }} onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}>
            {isAlt && <div className={`absolute h-full shadow-[inset_0_0_4px_rgba(0,0,0,0.1)] ${isCH03 ? 'left-0 w-[50%]' : 'left-0 w-[45%]'}`} style={{ backgroundColor: isCH03 ? theme.active : theme.focus, ...getHighlightStyle(isCH03 ? 'active' : 'focus') }} onClick={(e) => { e.stopPropagation(); onVariableClick(isCH03 ? 'active' : 'focus'); }} />}
            <span className={`z-10 text-[12px] font-mono tracking-tighter ${isCH03 ? 'relative left-[20px]' : ''}`} style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>{percValue}</span>
            <div className="absolute left-1/2 w-[1.5px] h-full bg-black/20"></div>
          </div>
          <span className="text-[17px] leading-none opacity-60 cursor-pointer" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>]</span>
        </div>
        <div className="flex items-center w-full mt-0.5 pb-1">
          <span className="text-[17px] leading-none opacity-60 cursor-pointer" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>[</span>
          <div className="flex-grow mx-1 h-[20px] relative flex items-center justify-center border border-black/10 overflow-hidden rounded-sm shadow-inner" style={{ backgroundColor: theme.primary2, ...getHighlightStyle('primary2') }} onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}>
            {isAlt && <div className={`absolute h-full shadow-[inset_0_0_4px_rgba(0,0,0,0.1)] ${isCH03 ? 'left-0 w-[50%]' : 'left-0 w-[45%]'}`} style={{ backgroundColor: theme.focus, ...getHighlightStyle('focus') }} onClick={(e) => { e.stopPropagation(); onVariableClick('focus'); }} />}
            <span className={`z-10 text-[12px] font-mono tracking-tighter ${isCH03 ? 'relative left-[20px]' : ''}`} style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>{percValue}</span>
            <div className="absolute left-1/2 w-[1.5px] h-full bg-black/20"></div>
          </div>
          <span className="text-[17px] leading-none opacity-60 cursor-pointer" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>]</span>
        </div>
      </div>
    );
  };

  const renderScreenshot1 = () => (
    <div className="flex-grow flex flex-col relative overflow-hidden p-6">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex h-[70%] items-center z-20">
        <VerticalSlot railPos="20%" scalePos="45%" isLeft={true} />
      </div>
      <div className="absolute right-[13px] top-1/2 -translate-y-1/2 flex h-[70%] items-center z-20">
        <VerticalSlot railPos="60%" scalePos="30%" isLeft={false} />
      </div>

      <div className="flex-grow flex items-center justify-center px-16 -mt-8">
        <div className="w-full max-w-[650px] grid grid-cols-[45%_55%] gap-8">
          <div className="flex flex-col justify-center translate-y-[20px]">
            <div className="border-[1.5px] overflow-hidden shadow-lg rounded-sm" style={{ borderColor: theme.primary1, ...getHighlightStyle('primary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('primary1'); }}>
              <div className="bg-black/5 px-2 py-1 border-b text-[10px] font-black uppercase tracking-widest" style={{ borderColor: theme.primary1, color: theme.primary1 }}>Widget &gt; Outputs</div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ch) => (
                <div key={ch} className="grid grid-cols-[50px_1fr_50px] h-[22px] items-center border-b last:border-b-0" style={{ borderColor: theme.primary1, backgroundColor: 'transparent' }}>
                  <div className="px-2 font-black text-[12px]" style={{ color: theme.primary1 }}>CH{ch}</div>
                  <div className="h-full border-x flex items-center px-1" style={{ borderColor: theme.primary1 }}>
                    <div className="h-[60%] rounded-full shadow-inner" style={{ width: ch === 3 ? '60%' : (ch === 1 ? '40%' : (ch === 7 ? '20%' : (ch === 9 ? '35%' : '10%'))), backgroundColor: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}></div>
                  </div>
                  <div className="px-2 text-right font-bold text-[12px]" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>{ch === 3 ? '60%' : (ch === 1 ? '40%' : (ch === 7 ? '20%' : (ch === 9 ? '35%' : '0%')))}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center pt-[20px]">
            <div className="relative w-full flex flex-col items-center justify-center">
              <div className="absolute z-30 text-[20px] font-black italic tracking-tighter leading-none opacity-80 left-[40px] top-0" style={{ color: theme.secondary1, ...getHighlightStyle('secondary1') }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>{modelLabel}</div>
              <div className="w-full flex items-center justify-center">
                {(!droneImage || droneImage === "assets/drone.png" || imgError) ? (
                  <div className="w-[300px] h-[280px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center opacity-20 shrink-0 bg-black/5" style={{ borderColor: theme.primary1 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-2" fill="none" viewBox="0 0 24 24" stroke={theme.primary1}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.primary1 }}>No Model Image</span>
                  </div>
                ) : (
                  <img src={droneImage} alt="Drone" className="w-[300px] h-[280px] object-contain drop-shadow-xl shrink-0" onError={() => setImgError(true)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-between w-full px-24 pb-10 z-20">
        <div className="w-[47%] relative -left-[50px] top-[50px]">
          <HorizontalSlot railPos="40%" scalePos="20%" />
        </div>
        <div className="w-[46%] relative top-[49px] left-[40px]">
          <HorizontalSlot railPos="70%" scalePos="55%" />
        </div>
      </div>
    </div>
  );

  const renderScreenshot2 = () => {
    const MixerRow = ({ channel, name, active = false }: { channel: string; name: string; active?: boolean }) => (
      <div className="flex items-center gap-3 rounded-2xl overflow-hidden border shadow-sm" style={{ backgroundColor: theme.secondary3, borderColor: active ? theme.focus : theme.secondary2, borderWidth: active ? '3px' : '1px' }}>
        <div className="min-w-[55px] px-3 py-2 rounded-l-2xl font-bold uppercase text-[12px]" style={{ color: theme.primary1 }}>{channel}</div>
        <div className="flex-1 flex items-center justify-between gap-4 px-4 py-3 rounded-r-2xl" style={{ backgroundColor: theme.active, color: theme.primary1 }}>
          <div className="font-black text-sm">100%</div>
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase">
            {name}
          </div>
        </div>
      </div>
    );

    return (
      <div className="flex-grow flex flex-col overflow-hidden relative" style={{ backgroundColor: theme.secondary3 }}>
        <div className="px-4 space-y-3 flex-1 overflow-hidden mt-[10px]">
          <MixerRow channel="CH1" name="Ail" active />
          <MixerRow channel="CH2" name="Ele" />
          <MixerRow channel="CH3" name="Thr" />
          <MixerRow channel="CH4" name="Rud" />
          <MixerRow channel="CH5" name="MOD" />
          <MixerRow channel="CH6" name="FLP" />
        </div>
      </div>
    );
  };

  const renderScreenshot3 = () => {
    // Fixed: Properly type the Key component as React.FC to include standard props like 'key'
    const Key: React.FC<{ label?: string, variant?: 'standard' | 'active' | 'focus', flex?: number, icon?: React.ReactNode }> = ({ label, variant = 'standard', flex = 1, icon }) => {
      let bgColor = theme.primary2; 
      let varKey: ThemeVariable = 'primary2';
      let borderColor = 'rgba(0,0,0,0.2)';

      if (variant === 'active') { bgColor = theme.active; varKey = 'active'; }
      if (variant === 'focus') { bgColor = theme.focus; varKey = 'focus'; borderColor = theme.focus; }
      
      return (
        <div 
          className="h-full rounded-md flex items-center justify-center border-2 shadow-sm cursor-pointer select-none transition-transform active:scale-95"
          style={{ 
            backgroundColor: bgColor, 
            borderColor: borderColor,
            flex: flex, 
            ...getHighlightStyle(varKey) 
          }}
          onClick={(e) => { e.stopPropagation(); onVariableClick(varKey); }}
        >
          {icon ? icon : <span className="text-[14px] font-bold" style={{ color: theme.primary1 }}>{label}</span>}
        </div>
      );
    };

    return (
      <div className="flex-grow flex flex-col p-2 gap-0.5 overflow-hidden" style={{ backgroundColor: theme.secondary3 }}>
        <div className="flex px-4 gap-4 items-start mb-2 shrink-0 relative">
          <div className="w-[150px] h-[150px] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-full h-full cursor-pointer" fill={theme.warning} style={getHighlightStyle('warning')} onClick={(e) => { e.stopPropagation(); onVariableClick('warning'); }}>
              <path d="M12 2L1 21h22L12 2zm0 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4.31c0 .55-.45 1-1 1s-1-.45-1-1V10c0-.55.45-1 1-1s1 .45 1 1v4.69z" />
            </svg>
          </div>

          <div className="flex-grow flex flex-col gap-1">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="w-[calc(92%-10px)] ml-auto h-10 border border-black/10 rounded-md overflow-hidden flex shadow-sm shrink-0">
                <div 
                  className="w-24 h-full flex items-center px-3 font-black text-[13px] shrink-0 cursor-pointer" 
                  style={{ backgroundColor: theme.primary2, color: theme.primary1, ...getHighlightStyle('primary2') }}
                  onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}
                >
                  CH{id}
                </div>
                <div className="flex-grow h-full border-[2.5px] flex items-center px-4 gap-2 cursor-pointer shadow-inner" 
                     style={{ backgroundColor: theme.active, borderColor: theme.focus, ...getHighlightStyle('active') }}
                     onClick={(e) => { e.stopPropagation(); onVariableClick('active'); }}>
                  <span className="font-black text-[14px]" style={{ color: theme.primary1 }}>100%</span>
                  <span className="font-mono font-bold text-[14px]" style={{ color: theme.primary1 }}>
                    I_{id === 1 ? 'Ail' : id === 2 ? 'Ele' : id === 3 ? 'Thr' : 'Rud'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-2 h-7 mb-1 shrink-0">
          <div className="w-full h-7 rounded-md border-[2px] flex items-center px-3 gap-1 cursor-pointer shadow-inner" 
               style={{ backgroundColor: theme.edit, borderColor: theme.focus, color: 'white', ...getHighlightStyle('edit') }}
               onClick={(e) => { e.stopPropagation(); onVariableClick('edit'); }}>
            <span className="text-[12px] font-mono font-bold">MODE</span>
            <div className="w-[1px] h-3 bg-white/60 animate-pulse ml-0.5"></div>
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-1 p-1">
           <div className="flex gap-1 h-8">
             <Key label="1#" variant="active" />
             {['Q','W','E','R','T','Y','U','I','O','P'].map(k => <Key key={k} label={k} />)}
             <Key variant="active" icon={<svg viewBox="0 0 24 24" className="w-4 h-4" fill={theme.primary1}><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/></svg>} />
           </div>
           <div className="flex gap-1 h-8">
             <Key label="abc" variant="active" flex={1.5} />
             <Key label="A" />
             {['S','D'].map(k => <Key key={k} label={k} />)}
             <Key label="F" variant="focus" />
             {['G','H','J','K','L'].map(k => <Key key={k} label={k} />)}
             <Key variant="active" flex={1.5} icon={<svg viewBox="0 0 24 24" className="w-4 h-4" fill={theme.primary1}><path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7h-2z"/></svg>} />
           </div>
           <div className="flex gap-1 h-8">
             <Key label="_" variant="active" /> <Key label="-" variant="active" />
             {['Z','X','C','V','B','N','M'].map(k => <Key key={k} label={k} />)}
             <Key label="." variant="active" /> <Key label="," variant="active" /> <Key label=":" variant="active" />
           </div>
           <div className="flex gap-1 h-8">
             <Key variant="active" icon={<svg viewBox="0 0 24 24" className="w-4 h-4" fill={theme.primary1}><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>} />
             <Key variant="active" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill={theme.primary1}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>} />
             <div 
               className="flex-[4] rounded-md border border-black/10 shadow-inner cursor-pointer" 
               style={{ backgroundColor: theme.primary2, ...getHighlightStyle('primary2') }}
               onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}
             ></div>
             <Key variant="active" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill={theme.primary1}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>} />
             <Key variant="active" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill={theme.primary1}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>} />
           </div>
        </div>

        <div className="flex items-center gap-2 px-2 h-9 mb-1 shrink-0">
          <div className="flex gap-3 items-center mr-2">
            <div className="w-14 h-7 rounded-full border-[2.5px] flex items-center justify-start px-0.5 cursor-pointer transition-all shadow-sm" 
                 style={{ 
                   backgroundColor: theme.primary2, 
                   borderColor: isFirstToggleFocused ? theme.focus : theme.secondary2,
                   ...getHighlightStyle('primary2') 
                 }}
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   setIsFirstToggleFocused(!isFirstToggleFocused);
                   onVariableClick('primary2'); 
                 }}>
              <div className="w-5 h-5 rounded-full shadow-md border border-black/5" 
                   style={{ backgroundColor: theme.secondary1, ...getHighlightStyle('secondary1') }} 
                   onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>
              </div>
            </div>

            <div className="w-14 h-7 rounded-full border-[2.5px] flex items-center justify-end px-0.5 cursor-pointer transition-all shadow-sm" 
                 style={{ 
                   backgroundColor: theme.active, 
                   borderColor: isSecondToggleFocused ? theme.focus : theme.secondary2,
                   ...getHighlightStyle('active') 
                 }}
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   setIsSecondToggleFocused(!isSecondToggleFocused);
                   onVariableClick('active'); 
                 }}>
              <div className="w-5 h-5 rounded-full shadow-md border border-black/5" 
                   style={{ backgroundColor: theme.secondary1, ...getHighlightStyle('secondary1') }} 
                   onClick={(e) => { e.stopPropagation(); onVariableClick('secondary1'); }}>
              </div>
            </div>
          </div>

          <div className="flex-grow flex gap-1 h-full items-center">
            <div className="flex-1 h-7 rounded-md border-2 flex items-center justify-center text-[10px] font-black uppercase cursor-pointer transition-all shadow-sm" 
                 style={{ backgroundColor: theme.active, color: theme.primary1, borderColor: theme.secondary2, ...getHighlightStyle('active') }}
                 onClick={(e) => { e.stopPropagation(); onVariableClick('active'); }}>
              Active
            </div>
            <div className="flex-1 h-7 rounded-md border-2 flex items-center justify-center text-[10px] font-black uppercase cursor-pointer transition-all shadow-sm" 
                 style={{ backgroundColor: theme.primary2, color: theme.secondary1, borderColor: theme.secondary2, ...getHighlightStyle('primary2') }}
                 onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}>
              Regular
            </div>
            <div className="flex-1 h-7 rounded-md border-2 flex items-center justify-center text-[10px] font-black uppercase cursor-pointer transition-all shadow-sm" 
                 style={{ backgroundColor: theme.edit, color: 'white', borderColor: theme.focus, ...getHighlightStyle('edit') }}
                 onClick={(e) => { e.stopPropagation(); onVariableClick('edit'); }}>
              Edit
            </div>
            <div className="flex-1 h-7 rounded-md border-2 flex items-center justify-center text-[10px] font-black uppercase cursor-pointer transition-all shadow-sm" 
                 style={{ backgroundColor: theme.primary2, color: theme.secondary1, borderColor: theme.focus, ...getHighlightStyle('primary2') }}
                 onClick={(e) => { e.stopPropagation(); onVariableClick('primary2'); }}>
              Focus
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-5xl mx-auto transition-all">
      <div className="relative p-6 bg-slate-900 rounded-[3rem] shadow-2xl border-[6px] border-slate-800 w-full overflow-hidden">
        
        {/* Container del simulatore con Scaling Dinamico */}
        <div 
          ref={containerRef}
          className="w-full relative overflow-hidden bg-slate-950 rounded-[4px] shadow-2xl"
          style={{ height: 480 * scale }}
        >
          <div 
            className="preview-screen-capture absolute top-0 left-0 edgetx-font select-none flex flex-col origin-top-left"
            style={{ 
              width: '800px', 
              height: '480px',
              backgroundColor: theme.secondary3, 
              transform: `scale(${scale})`,
              ...getHighlightStyle('secondary3') 
            }}
            onClick={() => onVariableClick('secondary3')}
          >
            {backgroundImage && (
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <img src={backgroundImage} alt="Background" className="w-full h-full object-cover opacity-100" />
              </div>
            )}

            <div className="relative z-10 flex flex-col h-full">
              {renderTopBar()}
              <div className="h-[3px] w-full shrink-0" style={{ backgroundColor: backgroundImage ? 'transparent' : theme.secondary3 }} onClick={(e) => { e.stopPropagation(); onVariableClick('secondary3'); }}></div>
              {activeScreen === 'screenshot1' && renderScreenshot1()}
              {activeScreen === 'screenshot2' && renderScreenshot2()}
              {activeScreen === 'screenshot3' && renderScreenshot3()}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center select-none">
          <div className="text-[13px] font-black tracking-[0.7em] text-slate-500 uppercase opacity-40">
            EDGETX COLOR DESIGNER • 800X480
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col xl:flex-row gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-sm w-full xl:w-auto">
        {(['screenshot1', 'screenshot2', 'screenshot3'] as ScreenID[]).map((id) => (
          <button
            key={id}
            onClick={() => setActiveScreen(id)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 uppercase tracking-tighter flex items-center gap-2 justify-center ${
              activeScreen === id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-105' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeScreen === id ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></div>
            {id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Preview;
