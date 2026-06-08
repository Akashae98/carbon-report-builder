export function BackgroundEmissions() {
  return (
    <div
      aria-hidden="true"
      className="emission-origin-shell pointer-events-none absolute -right-[29rem] -top-[25rem] z-0 hidden h-[46rem] w-[86rem] overflow-visible opacity-90 md:block"
    >
      <svg
        viewBox="0 0 1200 700"
        className="emission-field h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="emission-base" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff1e9" stopOpacity="0.72" />
            <stop offset="42%" stopColor="#ffd8cb" stopOpacity="0.78" />
            <stop offset="76%" stopColor="#ffc1b8" stopOpacity="0.76" />
            <stop offset="100%" stopColor="#f6a9b4" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="emission-coral" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffd9ca" stopOpacity="0.12" />
            <stop offset="55%" stopColor="#ff9f91" stopOpacity="0.54" />
            <stop offset="100%" stopColor="#f08db2" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="emission-pink" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#f5bad8" stopOpacity="0.16" />
            <stop offset="58%" stopColor="#d97fc0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#aa72c2" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="emission-violet" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#c5a5df" stopOpacity="0.14" />
            <stop offset="60%" stopColor="#8663bc" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#584087" stopOpacity="0.36" />
          </linearGradient>
          <linearGradient id="emission-shine" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="52%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        <g className="emission-upper-stream" transform="translate(-110 82)">
          <path
            d="M510 760C500 700 520 650 585 620C670 580 625 515 710 475C800 432 750 350 845 305C945 258 890 165 1000 105C1085 58 1105 -10 1140 -90H1320V780H510Z"
            fill="url(#emission-base)"
          />

          <path
            className="emission-wave emission-wave--coral"
            d="M575 770C560 710 585 665 645 635C725 595 685 535 765 495C850 452 810 378 895 330C985 278 945 190 1035 130C1105 82 1135 8 1165 -90H1320V780H575Z"
            fill="url(#emission-coral)"
          />
          <path
            className="emission-wave emission-wave--pink"
            d="M650 780C625 725 655 680 710 650C785 608 755 555 825 515C905 470 875 402 945 355C1025 300 1000 218 1070 158C1125 110 1160 28 1188 -90H1320V790H650Z"
            fill="url(#emission-pink)"
          />
          <path
            className="emission-wave emission-wave--violet"
            d="M735 790C700 742 730 698 780 668C850 625 828 578 890 538C960 492 940 430 1000 382C1070 325 1055 250 1110 190C1155 140 1180 52 1208 -90H1320V800H735Z"
            fill="url(#emission-violet)"
          />
          <path
            className="emission-wave emission-wave--deep"
            d="M825 800C780 758 810 718 855 688C920 645 905 602 960 562C1025 514 1015 458 1065 410C1125 352 1118 282 1158 220C1192 168 1205 75 1228 -90H1320V810H825Z"
            fill="#533b82"
            fillOpacity="0.25"
          />

          <path
            d="M545 755C535 700 560 660 620 630C700 590 660 528 742 487C828 444 786 366 878 320C972 272 925 180 1025 118L1048 105C950 185 995 278 900 335C812 388 850 462 770 505C692 548 735 605 652 648C595 678 575 716 585 755Z"
            fill="url(#emission-shine)"
          />

          <g className="emission-upper-details">
            <path d="M548 675C625 622 670 585 690 530C712 468 765 438 805 398C855 348 842 292 902 247C968 198 962 138 1028 82C1092 28 1185 -4 1325 -24" />
            <path d="M620 705C690 654 735 615 755 565C778 510 825 477 865 438C912 392 908 337 958 292C1015 240 1012 178 1072 116C1132 54 1218 18 1335 2" />
            <path d="M705 730C765 682 810 642 830 595C852 545 895 512 932 475C975 432 978 380 1020 338C1068 290 1072 225 1122 158C1172 92 1245 50 1340 30" />
            <circle cx="690" cy="530" r="4" />
            <circle cx="958" cy="292" r="3.5" />
            <circle cx="1122" cy="158" r="4" />
            <circle cx="1245" cy="50" r="3" />
          </g>
        </g>
      </svg>
    </div>
  );
}
