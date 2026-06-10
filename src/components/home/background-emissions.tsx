const emissionFlowPaths = [
  "M570 720C560 675 590 642 635 615C705 574 680 525 750 485C825 442 792 380 870 332C952 280 920 208 1005 148C1075 98 1160 88 1250 55C1380 8 1510 -82 1690 -205",
  "M645 750C620 700 650 662 700 632C770 590 748 548 815 506C890 458 865 402 930 350C1005 292 985 226 1055 172C1120 120 1205 108 1295 70C1430 14 1560 -76 1730 -205",
  "M730 775C700 730 725 690 775 658C845 612 828 574 888 530C955 480 940 430 1000 380C1068 320 1058 258 1120 198C1178 142 1260 124 1345 82C1475 18 1610 -70 1770 -205",
];

export function BackgroundEmissions() {
  return (
    <div
      aria-hidden="true"
      className="preview-emission-origin pointer-events-none absolute -right-[60rem] -top-[23rem] z-0 hidden h-[53rem] w-[112rem] overflow-visible opacity-75 md:block"
    >
      <svg
        viewBox="0 0 2300 900"
        className="preview-emission-field h-full w-full"
        preserveAspectRatio="xMidYMin slice"
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

        <g transform="translate(-20 -71)">
          <path
            className="preview-emission-band preview-emission-band--peach"
            d="M520 770C500 705 530 650 595 618C680 576 642 515 720 472C810 423 770 350 858 300C958 244 910 160 1012 98C1100 44 1195 55 1290 24C1420 -22 1545 -108 1720 -225H2600V990H520Z"
            fill="url(#emission-base)"
          />

          <path
            className="preview-emission-band preview-emission-band--coral"
            d="M588 780C566 716 595 666 654 633C735 588 700 535 778 492C860 446 825 378 908 326C998 270 962 188 1048 124C1120 72 1210 72 1305 38C1440 -10 1570 -100 1750 -225H2600V990H588Z"
            fill="url(#emission-coral)"
          />
          <path
            className="preview-emission-band preview-emission-band--pink"
            d="M664 790C634 730 662 682 718 648C795 602 768 554 838 512C918 464 892 400 958 350C1038 290 1015 214 1084 152C1145 100 1230 94 1322 56C1455 2 1590 -94 1780 -225H2600V1000H664Z"
            fill="url(#emission-pink)"
          />
          <path
            className="preview-emission-band preview-emission-band--violet"
            d="M748 800C712 746 740 700 790 666C862 618 842 576 902 534C974 484 954 426 1014 376C1084 316 1070 244 1124 184C1175 132 1255 116 1340 76C1470 14 1615 -88 1810 -225H2600V1010H748Z"
            fill="url(#emission-violet)"
          />
          <path
            className="preview-emission-band preview-emission-band--deep"
            d="M838 810C792 762 820 720 866 686C932 638 920 600 974 558C1040 506 1030 454 1080 404C1140 344 1134 276 1172 214C1212 160 1285 134 1360 94C1490 24 1640 -82 1840 -225H2600V1020H838Z"
            fill="#533b82"
            fillOpacity="0.25"
          />

          <path
            className="preview-emission-highlight"
            d="M558 765C542 704 568 660 628 628C710 584 674 526 754 484C840 438 800 364 890 316C984 264 940 176 1038 112L1062 98C966 180 1008 270 912 330C824 384 864 458 782 502C704 544 748 602 664 646C606 676 590 718 598 765Z"
            fill="url(#emission-shine)"
          />

          <g className="preview-emission-lines preview-emission-lines--base">
            {emissionFlowPaths.map((path) => (
              <path key={path} d={path} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
