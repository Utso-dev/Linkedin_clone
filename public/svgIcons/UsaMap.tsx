import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { USAMapType } from "@/lib/type";

type MapPopupProps = {
  name: string;
  count: number;
  countLabel?: string;
};

const MapPopup = ({ name, count, countLabel = "Resources" }: MapPopupProps) => (
  <div
    className="bg-white p-3 space-y-1 rounded-lg relative"
    style={{
      boxShadow: "0 -2px 5px 0 rgba(0, 0, 0, 0.15)",
    }}
  >
    <h2 className="text-[#404040] text-xl font-semibold leading-[130%] tracking-[0.1px]">
      {name}
    </h2>
    <p className="text-[#777980] ">Total {count} {countLabel}</p>
    <div className="text-white text-3xl absolute -bottom-4.5 left-1/2 -translate-x-1/2">
      <IoMdArrowDropdown />
    </div>
  </div>
);

// Complete state mapping with coordinates for positioning
const STATE_DATA = [
  {
    id: "AL",
    name: "Alabama",
    group: "south",
    x: 1403,
    y: 836,
    defaultColor: "#D0D0D0",
    labelX: 643,
    labelY: 467,
  },
  {
    id: "AK",
    name: "Alaska",
    group: "west",
    x: 322.6,
    y: 1000,
    defaultColor: "#D0D0D0",
    labelX: 100,
    labelY: 580,
  },
  {
    id: "AZ",
    name: "Arizona",
    group: "west",
    x: 516.6,
    y: 740.1,
    defaultColor: "#D0D0D0",
    labelX: 140,
    labelY: 388,
  },
  {
    id: "AR",
    name: "Arkansas",
    group: "south",
    x: 1191,
    y: 766,
    defaultColor: "#D0D0D0",
    labelX: 584,
    labelY: 367,
  },
  {
    id: "CA",
    name: "California",
    group: "west",
    x: 264.6,
    y: 580.1,
    defaultColor: "#D0D0D0",
    labelX: 70,
    labelY: 366,
  },
  {
    id: "CO",
    name: "Colorado",
    group: "west",
    x: 744.6,
    y: 570.1,
    defaultColor: "#D0D0D0",
    labelX: 375,
    labelY: 323,
  },
  {
    id: "CT",
    name: "Connecticut",
    group: "northeast",
    x: 1863,
    y: 427,
    defaultColor: "#D0D0D0",
    labelX: 874,
    labelY: 179,
  },
  {
    id: "DE",
    name: "Delaware",
    group: "northeast",
    x: 1809,
    y: 519,
    defaultColor: "#D0D0D0",
    labelX: 822,
    labelY: 227,
  },
  {
    id: "FL",
    name: "Florida",
    group: "south",
    x: 1621,
    y: 1020,
    defaultColor: "#D0D0D0",
    labelX: 752,
    labelY: 445,
  },
  {
    id: "GA",
    name: "Georgia",
    group: "south",
    x: 1519,
    y: 828,
    defaultColor: "#D0D0D0",
    labelX: 762,
    labelY: 414,
  },
  {
    id: "HI",
    name: "Hawaii",
    group: "west",
    x: 662.6,
    y: 1126,
    defaultColor: "#D0D0D0",
    labelX: 317,
    labelY: 554,
  },
  {
    id: "ID",
    name: "Idaho",
    group: "west",
    x: 509,
    y: 326,
    defaultColor: "#D0D0D0",
    labelX: 165,
    labelY: 183,
  },
  {
    id: "IL",
    name: "Illinois",
    group: "midwest",
    x: 1297,
    y: 528,
    defaultColor: "#D0D0D0",
    labelX: 624,
    labelY: 266,
  },
  {
    id: "IN",
    name: "Indiana",
    group: "midwest",
    x: 1395,
    y: 524,
    defaultColor: "#D0D0D0",
    labelX: 629,
    labelY: 215,
  },
  {
    id: "IA",
    name: "Iowa",
    group: "midwest",
    x: 1155,
    y: 452,
    defaultColor: "#D0D0D0",
    labelX: 557,
    labelY: 183,
  },
  {
    id: "KS",
    name: "Kansas",
    group: "midwest",
    x: 989,
    y: 606,
    defaultColor: "#D0D0D0",
    labelX: 459,
    labelY: 260,
  },
  {
    id: "KY",
    name: "Kentucky",
    group: "south",
    x: 1447,
    y: 624,
    defaultColor: "#D0D0D0",
    labelX: 692,
    labelY: 323,
  },
  {
    id: "LA",
    name: "Louisiana",
    group: "south",
    x: 1199,
    y: 924,
    defaultColor: "#D0D0D0",
    labelX: 603,
    labelY: 473,
  },
  {
    id: "ME",
    name: "Maine",
    group: "northeast",
    x: 1871,
    y: 198,
    defaultColor: "#D0D0D0",
    labelX: 875,
    labelY: 129,
  },
  {
    id: "MD",
    name: "Maryland",
    group: "northeast",
    x: 1806,
    y: 573,
    defaultColor: "#D0D0D0",
    labelX: 823,
    labelY: 269,
  },
  {
    id: "MA",
    name: "Massachusetts",
    group: "northeast",
    x: 1902,
    y: 313,
    defaultColor: "#D0D0D0",
    labelX: 900,
    labelY: 174,
  },
  {
    id: "MI",
    name: "Michigan",
    group: "midwest",
    x: 1417,
    y: 376,
    defaultColor: "#D0D0D0",
    labelX: 663,
    labelY: 210,
  },
  {
    id: "MN",
    name: "Minnesota",
    group: "midwest",
    x: 1111,
    y: 272,
    defaultColor: "#D0D0D0",
    labelX: 465,
    labelY: 69,
  },
  {
    id: "MS",
    name: "Mississippi",
    group: "south",
    x: 1295,
    y: 846,
    defaultColor: "#D0D0D0",
    labelX: 624,
    labelY: 469,
  },
  {
    id: "MO",
    name: "Missouri",
    group: "midwest",
    x: 1181,
    y: 610,
    defaultColor: "#D0D0D0",
    labelX: 555,
    labelY: 249,
  },
  {
    id: "MT",
    name: "Montana",
    group: "west",
    x: 669,
    y: 210,
    defaultColor: "#D0D0D0",
    labelX: 247,
    labelY: 131,
  },
  {
    id: "NE",
    name: "Nebraska",
    group: "midwest",
    x: 955,
    y: 474,
    defaultColor: "#D0D0D0",
    labelX: 403,
    labelY: 191,
  },
  {
    id: "NV",
    name: "Nevada",
    group: "west",
    x: 386.6,
    y: 492.1,
    defaultColor: "#D0D0D0",
    labelX: 168,
    labelY: 297,
  },
  {
    id: "NH",
    name: "New Hampshire",
    group: "northeast",
    x: 1780,
    y: 173,
    defaultColor: "#D0D0D0",
    labelX: 863,
    labelY: 94,
  },
  {
    id: "NJ",
    name: "New Jersey",
    group: "northeast",
    x: 1820,
    y: 468,
    defaultColor: "#D0D0D0",
    labelX: 843,
    labelY: 195,
  },
  {
    id: "NM",
    name: "New Mexico",
    group: "west",
    x: 710.6,
    y: 756.1,
    defaultColor: "#D0D0D0",
    labelX: 358,
    labelY: 333,
  },
  {
    id: "NY",
    name: "New York",
    group: "northeast",
    x: 1717,
    y: 342,
    defaultColor: "#D0D0D0",
    labelX: 873,
    labelY: 182,
  },
  {
    id: "NC",
    name: "North Carolina",
    group: "south",
    x: 1663,
    y: 684,
    defaultColor: "#D0D0D0",
    labelX: 829,
    labelY: 300,
  },
  {
    id: "ND",
    name: "North Dakota",
    group: "midwest",
    x: 937,
    y: 218,
    defaultColor: "#D0D0D0",
    labelX: 465,
    labelY: 69,
  },
  {
    id: "OH",
    name: "Ohio",
    group: "midwest",
    x: 1497,
    y: 500,
    defaultColor: "#D0D0D0",
    labelX: 686,
    labelY: 209,
  },
  {
    id: "OK",
    name: "Oklahoma",
    group: "south",
    x: 1027,
    y: 740,
    defaultColor: "#D0D0D0",
    labelX: 502,
    labelY: 399,
  },
  {
    id: "OR",
    name: "Oregon",
    group: "west",
    x: 315,
    y: 276,
    defaultColor: "#D0D0D0",
    labelX: 94,
    labelY: 167,
  },
  {
    id: "PA",
    name: "Pennsylvania",
    group: "northeast",
    x: 1661,
    y: 446,
    defaultColor: "#D0D0D0",
    labelX: 826,
    labelY: 189,
  },
  {
    id: "RI",
    name: "Rhode Island",
    group: "northeast",
    x: 1909,
    y: 400,
    defaultColor: "#D0D0D0",
    labelX: 883,
    labelY: 171,
  },
  {
    id: "SC",
    name: "South Carolina",
    group: "south",
    x: 1611,
    y: 768,
    defaultColor: "#D0D0D0",
    labelX: 772,
    labelY: 350,
  },
  {
    id: "SD",
    name: "South Dakota",
    group: "midwest",
    x: 935,
    y: 346,
    defaultColor: "#D0D0D0",
    labelX: 397,
    labelY: 126,
  },
  {
    id: "TN",
    name: "Tennessee",
    group: "south",
    x: 1405,
    y: 708,
    defaultColor: "#D0D0D0",
    labelX: 621,
    labelY: 365,
  },
  {
    id: "TX",
    name: "Texas",
    group: "south",
    x: 968,
    y: 922.3,
    defaultColor: "#D0D0D0",
    labelX: 282,
    labelY: 429,
  },
  {
    id: "UT",
    name: "Utah",
    group: "west",
    x: 556.6,
    y: 536.1,
    defaultColor: "#D0D0D0",
    labelX: 233,
    labelY: 218,
  },
  {
    id: "VT",
    name: "Vermont",
    group: "northeast",
    x: 1719,
    y: 190,
    defaultColor: "#D0D0D0",
    labelX: 859,
    labelY: 102,
  },
  {
    id: "VA",
    name: "Virginia",
    group: "south",
    x: 1655,
    y: 594,
    defaultColor: "#D0D0D0",
    labelX: 835,
    labelY: 265,
  },
  {
    id: "WA",
    name: "Washington",
    group: "west",
    x: 355,
    y: 138,
    defaultColor: "#D0D0D0",
    labelX: 162,
    labelY: 84,
  },
  {
    id: "WV",
    name: "West Virginia",
    group: "south",
    x: 1569,
    y: 568,
    defaultColor: "#D0D0D0",
    labelX: 723,
    labelY: 298,
  },
  {
    id: "WI",
    name: "Wisconsin",
    group: "midwest",
    x: 1263,
    y: 338,
    defaultColor: "#D0D0D0",
    labelX: 611,
    labelY: 144,
  },
  {
    id: "WY",
    name: "Wyoming",
    group: "west",
    x: 699,
    y: 386,
    defaultColor: "#D0D0D0",
    labelX: 355,
    labelY: 144,
  },
  {
    id: "WADC",
    name: "Washington DC",
    group: "south",
    x: 1620,
    y: 550,
    defaultColor: "#D0D0D0",
    labelX: 800,
    labelY: 250,
  },
];

type UsaMapProps = {
  redirect?: string;
  className?: string;
  data: USAMapType[] | any[] | null;
  countLabel?: string;
  countKey?: string;
  onStateClick?: (state: (typeof STATE_DATA)[0], stateItem?: any) => void;
};

export const UsaMapIcon = ({
  data,
  redirect = "",
  className,
  countLabel = "Resources",
  countKey,
  onStateClick,
}: UsaMapProps) => {
  const POPUP_WIDTH = 150;
  const POPUP_HEIGHT = 80;
  const washingtonDcState = STATE_DATA.find((state) => state.id === "WADC");
  const [hoveredState, setHoveredState] = useState<{
    id: string;
    name: string;
    count: number;
  } | null>(null);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const router = useRouter();

  // Create a map for quick lookup
  const stateDataMap = useMemo(() => {
    const map = new Map();
    data?.forEach((state: any) => {
      const rawCode = state.state_code || state.code;
      if (!rawCode) return;
      const stateCode = String(rawCode).toUpperCase();
      map.set(stateCode, state);

      if (stateCode === "DC" || stateCode === "WADC") {
        map.set("DC", state);
        map.set("WADC", state);
      }
    });
    return map;
  }, [data]);

  const getStateFill = (
    stateId: string,
    group: string,
    isHovered: boolean,
  ): string => {
    if (isHovered) return "#07C3BB";
    const stateData = STATE_DATA.find((s) => s.id === stateId);
    return stateData?.defaultColor || "#D0D0D0";
  };

  const getStateCount = (stateId: string): number => {
    const stateData = stateDataMap.get(stateId === "WADC" ? "DC" : stateId);
    if (!stateData) return 0;
    if (countKey && stateData[countKey] !== undefined) {
      return stateData[countKey] ?? 0;
    }
    if (stateData.active_jobs_count !== undefined) {
      return stateData.active_jobs_count ?? 0;
    }
    return stateData.total_resources ?? 0;
  };

  const updatePopupPosition = (clientX: number, clientY: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = clientX - POPUP_WIDTH / 2;
    let y = clientY - POPUP_HEIGHT - 20;

    const maxX = viewportWidth - POPUP_WIDTH;
    const maxY = viewportHeight - POPUP_HEIGHT;

    x = Math.max(0, Math.min(x, maxX));

    if (clientY - POPUP_HEIGHT - 20 < 0) {
      y = clientY + 20;
      y = Math.min(y, maxY);
    } else {
      y = Math.max(0, Math.min(y, maxY));
    }

    setPopupPosition({ x, y });
  };

  // Effect to track mouse movement when popup is visible
  useEffect(() => {
    if (!hoveredState) return;

    const handleMouseMove = (event: MouseEvent) => {
      updatePopupPosition(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hoveredState]);

  const handleStateMouseMove = (
    event: React.MouseEvent,
    state: (typeof STATE_DATA)[0],
  ) => {
    // Only update if the state changed
    if (hoveredStateId !== state.id) {
      setHoveredStateId(state.id);
      setHoveredState({
        id: state.id,
        name: state.name,
        count: getStateCount(state.id),
      });
    }
    // Always update position
    updatePopupPosition(event.clientX, event.clientY);
  };

  const handleMouseLeave = () => {
    setHoveredStateId(null);
    setHoveredState(null);
  };

  const params = useParams();
  const muId = params.id as string;
  const baseUrl = muId ? `/mu/${muId}` : "/mu";

  const handleClick = (state: (typeof STATE_DATA)[0]) => {
    const stateItem = stateDataMap.get(state.id === "WADC" ? "DC" : state.id);
    if (onStateClick) {
      onStateClick(state, stateItem);
      return;
    }
    router.push(
      `${baseUrl}/academia/${state.id}?redirect=${redirect ? redirect + "_" : ""}stateacademia:${state.id}:${state.name}`,
    );
  };

  return (
    <div className={`relative inline-block ${className || ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 959 593"
        className="w-full h-auto"
        style={{ cursor: "pointer" }}
      >
        <title>Map of the United States</title>
        <defs>
          <style>
            {`
              .state { 
                transition: fill 0.2s ease; 
                cursor: pointer;
              }
              .borders { 
                stroke: #FFFFFF; 
                strokeWidth: 1; 
                fill: none;
              }
              .dccircle { 
                                display: inline; 
              }
              .separator1 { 
                stroke: #B0B0B0; 
                strokeWidth: 2; 
                fill: none;
              }
              .state-label {
                font-size: 6px;
                font-weight: bold;
                fill: #ffffff;
                text-anchor: middle;
                pointer-events: none;
                font-family: Arial, sans-serif;
              }
            `}
          </style>
        </defs>

        <g className="state">
          {/* Alabama */}
          <path
            className="al"
            d="m 643,467.4 .4,-7.3 -.9,-1.2 -1.7,-.7 -2.5,-2.8 .5,-2.9 48.8,-5.1 -.7,-2.2 -1.5,-1.5 -.5,-1.4 .6,-6.3 -2.4,-5.7 .5,-2.6 .3,-3.7 2.2,-3.8 -.2,-1.1 -1.7,-1 v -3.2 l -1.8,-1.9 -2.9,-6.1 -12.9,-45.8 -45.7,4 1.3,2 -1.3,67 4.4,33.2 .9,-.5 1.3,.1 .6,.4 .8,-.1 2,-3.8 v -2.3 l 1.1,-1.1 1.4,.5 3.4,6.4 v .9 l -3.3,2.2 3.5,-.4 4.9,-1.6 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "AL");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "AL");
              if (state) handleClick(state);
            }}
            fill={getStateFill("AL", "south", hoveredStateId === "AL")}
          />

          {/* Alaska */}
          <path
            className="ak"
            d="m 15.8,572 h 2.4 l .7,.7 -1,1.2 -1.9,.2 -2.5,1.3 -3.7,-.1 2.2,-.9 .3,-1.1 2.5,-.3 z m 8.3,-1.7 1.3,.5 h .9 l .5,1.2 .3,-.6 .9,.2 1.1,1.5 0,.5 -4.2,1.9 -2.4,-.1 -1,-.5 -1.1,.7 -2,0 -1.1,-1.4 4.7,-.5 z m 5.4,-.1 1,.1 .7,.7 v 1 l -1.3,.1 -.9,-1.1 z m 2.5,.3 1.3,-.1 -.1,1 -1.1,.6 z m .3,2.2 3.4,-.1 .2,1.1 -1.3,.1 -.3,-.5 -.8,.6 -.4,-.6 -.9,-.2 z m 166.3,7.6 2.1,.1 -1,1.9 -1.1,-.1 -.4,-.8 .5,-1.3 m -1.1,-2.9 .6,-1.3 -.2,-2.3 2.4,-.5 4.5,4.4 1.3,3.4 1.9,1.6 .3,5.1 -1.4,0 -1.3,-2.3 -3.1,-2.4 h -.6 l 1.1,2.8 1.7,.2 .2,2.1 -.9,.1 -4.1,-4.4 -.1,-.9 1.9,-1 0,-1 -.5,-.8 -1.6,-.6 -1.7,-1.3 1.4,.1 .5,-.4 -.6,-.9 -.6,.5 z m -3.6,-9.1 1.3,.1 2.4,2.5 -.2,.8 -.8,-.1 -.1,1.8 .5,.5 0,1.5 -.8,.3 -.4,1.2 -.8,-.4 -.4,-2.2 1.1,-1.4 -2.1,-2.2 .1,-1.2 z m 1.5,-1.5 1.9,.2 2.5,.1 3.4,3.2 -.2,.5 -1.1,.6 -1.1,-.2 -.1,-.7 -1.2,-1.6 -.3,.7 1,1.3 -.2,1.2 -.8,-.1 -1.3,.2 -.1,-1.7 -2.6,-2.8 z m -12.7,-8.9 .9,-.4 h 1.6 l .7,-.5 4.1,2.2 .1,1.5 -.5,.5 h -.8 l -1.4,-.7 1.1,1.3 1.8,0 .5,2 -.9,0 -2.2,-1.5 -1.1,-.2 .6,1.3 .1,.9 .8,-.6 1.7,1.2 1.3,-.1 -.2,.8 1.9,4.3 0,3.4 .4,2.1 -.8,.3 -1.2,-2 -.5,-1.5 -1.6,-1.6 -.2,-2.7 -.6,-1.7 h -.7 l .3,1.1 0,.5 -1.4,1 .1,-3.3 -1.6,-1.6 -1.3,-2.3 -1.2,-1.2 z m 7.2,-2.3 1.1,1.8 2.4,-.1 1,2.1 -.6,.6 2,3.2 v 1.3 l -1.2,.8 v .7 l -2,1.9 -.5,-1.4 -.1,-1.3 .6,-.7 v -1.1 l -1.5,-1.9 -.5,-3.7 -.9,-1.5 z m -56.7,-18.3 -4,4.1 v 1.6 l 2.1,-.8 .8,-1.9 2.2,-2.4 z m -31.6,16.6 0,.6 1.8,1.2 .2,-1.4 .6,.9 3.5,.1 .7,-.6 .2,-1.8 -.5,-.7 -1.4,0 0,-.8 .4,-.6 v -.4 l -1.5,-.3 -3.3,3.6 z m -8.1,6.2 1.5,5.8 h 2.1 l 2.4,-2.5 .3,1.2 6.3,-4 .7,-1 -1,-1.1 v -.7 l .5,-1.3 -.9,-.1 -2,1 0,-1.2 -2.7,-.6 -2.4,.3 -.2,3.4 -.8,-2 -1.5,-.1 -1,.6 z m -2.2,8.2 .1,-.7 2.1,-1.3 .6,.3 1.3,.2 1.3,1.2 -2.2,-.2 -.4,-.6 -1,.6 z m -5.2,3.3 -1.1,.8 1.5,1.4 .8,-.7 -.1,-1.3 z m -6.3,-7.9 1.4,.1 .4,.6 -1.8,.1 z m -13.9,11.9 v .5 l .7,.1 -.1,-.6 z m -.4,-3.2 -1,1 v .5 l .7,1.1 1,-1 -.7,-.1 z m -2,-.8 -.3,1 -1.3,.1 -.4,.2 0,1.3 -.5,.9 .6,0 .7,-.9 .8,-.1 .9,-1 .2,-1.3 z m -4.4,-2 -.2,1.8 1.4,.8 1.2,-.6 0,-1 1.7,-.3 -.1,-.6 -.9,-.2 -.7,.6 -.9,-.5 z m -4.9,-.1 1,.7 -.3,1.2 -1.4,-1.1 z m -4.2,1.3 1.4,.1 -.7,.8 z m -3.5,3 1.8,1.1 -1.7,.1 z m -25.4,-31.2 1.2,.6 -.8,.6 z m -.7,-6.3 .4,1.2 .8,-1.2 z m 24.3,-19.3 1.5,-.1 .9,.4 1.1,-.5 1.3,-.1 1.6,.8 .8,1.9 -.1,.9 -1.2,2 -2.4,-.2 -2.1,-1.8 -1,-.4 -1.1,-2 z m -21.1,-14.4 .1,1.9 2,2 v .5 l -.8,-.2 -1.7,-.8 -.3,-1.1 -.3,-1.6 z m 18.3,-23.3 v 1.2 l 1.9,1.8 h 2.3 l .6,1.1 v 1.6 l 2.1,1.9 1.8,1.2 -.1,.7 -.7,1.1 -1.4,-1.2 -2.1,.1 -.8,-.8 -.9,-2.1 -1.5,-2.2 -2.6,-.1 -1,-.7 1,-2.1 z m 16.8,-4.5 1,0 .1,1.1 h -1 z m 16.2,19.7 .9,.1 0,1.2 -1.7,-.5 z m 127.8,77.7 -1.2,.4 -.1,1.1 h 1.2 z m -157.6,-4.5 -1.3,-.4 -4.1,.6 -2.8,1.4 -.1,1.9 1.9,.7 1.5,-.9 1.7,-.1 4.7,1.4 .1,-1.3 -1.6,-1.1 z m 2.1,2.3 -.4,-1.4 1.2,.2 .1,1.4 1.8,0 .4,-2.5 .3,2.4 2.5,-.1 3.2,-3.3 .8,.1 -.7,1.3 1.4,.9 4.2,-.2 2.6,-1.2 1.4,-.1 .3,1.5 .6,-.5 .4,-1.4 5.9,.2 1.9,-1.6 -1.3,-1.1 .6,-1.2 2.6,.2 -.2,-1.2 2.5,.2 .7,-1.1 1.1,.2 4.6,-1.9 .2,-1.7 5.6,-2.4 2,-1.9 1.2,-.6 1.3,.8 2.3,-.9 1.1,-1.9 .5,-1.3 1.7,-.9 1.5,-.7 .4,-1.4 -1.1,-1.7 -2.2,-.2 -.2,-1.3 .8,-1.6 1.4,-.2 1.3,-1.5 1.9,-.1 3.4,-3.2 .4,-1.4 1.5,-2.3 3.8,-4.1 2.5,-.9 1.9,-.9 2.1,.8 1.4,2.6 -1.5,0 -1.4,-1.5 -3,2 -1.7,.1 -.2,3.1 -3.1,4.9 .6,2 2.3,0 -.6,1 -1.4,.1 -2.4,1.8 0,.9 1.9,1 3.4,-.6 1.4,-1.7 1.4,.1 3,-1.7 .5,-2.3 1.6,-.1 6.3,.8 1,-1.1 1,-4.5 -1.6,1.1 .6,-2.2 -1.6,-1.4 .8,-1.5 .1,1.5 3.4,0 .7,-1 1.6,-.1 -.3,1.7 1.9,.1 -1.9,1.3 4.1,1.1 -3.5,.4 -1.3,1.2 .9,1.4 4.6,-1.7 2.3,1.7 .7,-.9 .6,1.4 4,2.3 h 2.9 l 3.9,-.5 4.3,1.1 2,1.9 4.5,.4 1.8,-1.5 .8,2.4 -1.8,.7 1.2,1.2 7.4,3.8 1.4,2.5 5.4,4.1 3.3,-2 -.6,-2.2 -3.5,-2 3.1,1.2 .5,-.7 .9,1.3 0,2.7 2.1,-.6 2.1,1.8 -2.5,-9.8 1.2,1.3 1.4,6 2.2,2.5 2.4,-.4 1.8,3.5 h .9 l .6,5.6 3.4,.5 1.6,2.2 1.8,1.1 .4,2.8 -1.8,2.6 2.9,1.6 1.2,-2.4 -.2,3.1 -.8,.9 1.4,1.7 .7,-2.4 -.2,-1.2 .8,.2 .6,2.3 -1,1.4 .6,2.6 .5,.4 .3,-1.6 .7,.6 -.3,2 1.2,.2 -.4,.9 1.7,-.1 0,-1 h -1 l .1,-1.7 -.8,-.6 1.7,-.3 .5,-.8 0,-1.6 .5,1.3 -.6,1.8 1.2,3.9 1.8,.1 2.2,-4.2 .1,-1.9 -1.3,-4 -.1,-1.2 .5,-1.2 -.7,-.7 -1.7,.1 -2.5,-2 -1.7,0 -2,-1.4 -1.5,0 -.5,-1.6 -1.4,-.3 -.2,-1.5 -1,-.5 .1,-1.7 -5.1,-7.4 -1.8,-1.5 v -1.2 l -4.3,-3.5 -.7,-1.1 -1.6,-2 -1.9,-.6 0,-2.2 -1.2,-1.3 -1.7,-.7 -2.1,1.3 -1.6,2.1 -.4,2.4 -1.5,.1 -2.5,2.7 -.8,-.3 v -2.5 l -2.4,-2.2 -2.3,-2 -.5,-2 -2.5,-1.3 .2,-2.2 -2.8,-.1 -.7,1.1 -1.2,0 -.7,-.7 -1.2,.8 -1.8,-1.2 0,-85.8 -6.9,-4.1 -1.8,-.5 -2.2,1.1 -2.2,.1 -2.3,-1.6 -4.3,-.6 -5.8,-3.6 -5.7,-.4 -2,.5 -.2,-1.8 -1.8,-.7 1.1,-1 -.2,-.9 -3.2,-1.1 h -2.4 l -.4,.4 -.9,-.6 .1,-2.6 -.8,-.9 -2.5,2.9 -.8,-.1 v -.8 l 1.7,-.8 v -.8 l -1.9,-2.4 -1.1,-.1 -4.5,3.1 h -3.9 l .4,-.9 -1.8,-.1 -5.2,3.4 -1.8,0 -.6,-.8 -2.7,1.5 -3.6,3.7 -2.8,2.7 -1.5,1.2  -2.6,.1 -2.2,-.4 -2.3,-1.3 v 0 l -2.8,3.9 -.1,2.4 2.6,2.4 2.1,4.5 .2,5.3 2.9,2 3.4,.4 .7,.8 -1.5,2.3 .7,2.7 -1.7,-2.6 v -2.4 l -1.5,-.3 .1,1.2 .7,2.1 2.9,3.7 h -1.4 l -2.2,1.1 -6.2,-2.5 -.1,-2 1.4,-1.3 0,-1.4 -2.1,-.5 -2.3,.2 -4.8,.2 1.5,2.3 -1.9,-1.8 -8.4,1.2 -.8,1.5 4.9,4.7 -.8,1.4 -.3,2 -.7,.8 -.1,1.9 4.4,3.6 4.1,.2 4.6,1.9 h 2 l .8,-.6 3.8,.1 .1,-.8 1.2,1.1 .1,2 -2.5,-.1 .1,3.3 .5,3.2 -2.9,2.7 -1.9,-.1 -2,-.8 -1,.1 -3.1,2.1 -1.7,.2 -1.4,-2.8 -3.1,0 -2.2,2 -.5,1.8 -3.3,1.8 -5.3,4.3 -.3,3.1 .7,2.2 1,1.2 1,-.4 .9,1 -.8,.6 -1.5,.9 1.1,1.5 -2.6,1.1 .8,2.2 1.7,2.3 .8,4.1 4,1.5 2.6,-.8 1.7,-1.1 .5,2.1 .3,4.4 -1.9,1.4 0,4.4 -.6,.9 h -1.7 l 1.7,1.2 2.1,-.1 .4,-1 4.6,-.6 2,2.6 1.3,-.7 1.3,5.1 1,.5 1,-.7 .1,-2.4 .9,-1 .7,1.1 .2,1.6 1.6,.4 4.7,-1.2 .2,1.2 -2,1.1 -1.6,1.7 -2.8,7 -4.3,2 -1.4,1.5 -.3,1.4 -1,-.6 -9.3,3.3 -1.8,4.1 -1.3,-.4 .5,-1.1 -1.5,-1.4 -3.5,-.2 -5.3,3.2 -2.2,1.3 -2.3,0 -.5,2.4 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "AK");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "AK");
              if (state) handleClick(state);
            }}
            fill={getStateFill("AK", "west", hoveredStateId === "AK")}
          />

          {/* Arizona */}
          <path
            className="az"
            d="m 139.6,387.6 3,-2.2 .8,-2.4 -1,-1.6 -1.8,-.2 -1.1,-1.6 1.1,-6.9 1.6,-.3 2.4,-3.2 1.6,-7 2.4,-3.6 4.8,-1.7 1.3,-1.3 -.4,-1.9 -2.3,-2.5 -1.2,-5.8 -1.4,-1.8 -1.3,-3.4 .9,-2.1 1.4,-3 .5,-2.9 -.5,-4.9 1,-13.6 3.5,-.6 3.7,1.4 1.2,2.7 h 2 l 2.4,-2.9 3.4,-17.5 46.2,8.2 40,6 -17.4,124.1 -37.3,-5.4 -64.2,-37.5 .5,-2.9 2,-1.8 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "AZ");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "AZ");
              if (state) handleClick(state);
            }}
            fill={getStateFill("AZ", "west", hoveredStateId === "AZ")}
          />

          {/* Arkansas */}
          <path
            className="ar"
            d="m 584.2,367 .9,-2.2 1.2,.5 .7,-1 -.8,-.7 .3,-1.5 -1.1,-.9 .6,-1 -.1,-1.5 -1.1,-.1 .8,-.8 1.3,.8 .3,-1.4 -.4,-1.1 .1,-.7 2,.6 -.4,-1.5 1.6,-1.3 -.5,-.9 -1.1,.1 -.6,-.9 .9,-.9 1.6,-.2 .5,-.8 1.4,-.2 -.1,-.8 -.9,-.9 v -.5 h 1.5 l .4,-.7 -1.4,-1 -.1,-.6 -11.2,.8 2.8,-5.1 1.7,-1.5 v -2.2 l -1.6,-2.5 -39.8,2 -39.1,.7 4.1,24.4 -.7,39 2.6,2.3 2.8,-1.3 3.2,.8 .2,11.9 52.3,-1.3 1.2,-1.5 .5,-3 -1.5,-2.3 -.5,-2.2 .9,-.7 v -.8 l -1.7,-1.1 -.1,-.7 1.6,-.9 -1.2,-1.1 1.7,-7.1 3.4,-1.6 v -.8 l -1.1,-1.4 2.9,-5.4 h 1.9 l 1.5,-1.2 -.3,-5.2 3.1,-4.5 1.8,-.6 -.5,-3.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "AR");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "AR");
              if (state) handleClick(state);
            }}
            fill={getStateFill("AR", "south", hoveredStateId === "AR")}
          />

          {/* California */}
          <path
            className="ca"
            d="m 69.4,365.6 3.4,5.2 -1.4,.1 -1.8,-1.9 z m 1.9,-9.8 1.8,4.1 2.6,1 .7,-.6 -1.3,-2.5 -2.6,-2.4 z m -19.9,-19 v 2.4 l 2,1.2 4.4,-.2 1,-1 -3.1,-.2 z m -5.9,.1 3.3,.5 1.4,2.2 h -3.8 z m 47.9,45.5 -1,-3 .2,-3 -.4,-7.9 -1.8,-4.8 -1.2,-1.4 -.6,-1.5 -7,-8.6 -3.6,.1 -2,-1.9 1.1,-1.8 -.7,-3.7 -2.2,-1.2 -3.9,-.6 -2.8,-1.3 -1.5,-1.9 -4.5,-6.6 -2.7,-2.2 -3.7,-.5 -3.1,-2.3 -4.7,-1.5 -2.8,-.3 -2.5,-2.5 .2,-2.8 .8,-4.8 1.8,-5.1 -1.4,-1.6 -4,-9.4 -2.7,-3.7 -.4,-3 -1.6,-2.3 .2,-2.5 -2,-5 -2.9,-2.7 .6,-7.1 2.4,-.8 1.8,-3.1 -.4,-3.2 -1,-.9 h -2.5 l -2.5,-3.3 -1.5,-3.5 v -7.5 l 1.2,-4.2 .2,-2.1 2.5,.2 -.1,1.6 -.8,.7 v 2.5 l 3.7,3.2 v -4.7 l -1.4,-3.4 .5,-1.1 -1,-1.7 2.8,-1.5 -1.9,-3 -1.4,.5 -1.5,3.8 .5,1.3 -.8,1 -.9,-.1 -5.4,-6.1 .7,-5.6 -1.1,-3.9 -6.5,-12.8 .8,-10.7 2.3,-3.6 .2,-6.4 -5.5,-11.1 .3,-5.2 6.9,-7.5 1.7,-2.4 -.1,-1.4 4,-9.2 .1,-8.4 .9,-2.5 66.1,18.6 -16.4,63.1 1.1,3.5 70.4,105 -.9,2.1 1.3,3.4 1.4,1.8 1.2,5.8 2.3,2.5 .4,1.9 -1.3,1.3 -4.8,1.7 -2.4,3.6 -1.6,7 -2.4,3.2 -1.6,.3 -1.1,6.9 1.1,1.6 1.8,.2 1,1.6 -.8,2.4 -3,2.2 -2.2,-.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "CA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "CA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("CA", "west", hoveredStateId === "CA")}
          />

          {/* Colorado */}
          <path
            className="co"
            d="m 374.6,323.3 -16.5,-1 -51.7,-4.8 -52.6,-6.5 11.5,-88.3 44.9,5.7 37.5,3.4 33.1,2.4 -1.4,22.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "CO");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "CO");
              if (state) handleClick(state);
            }}
            fill={getStateFill("CO", "west", hoveredStateId === "CO")}
          />

          {/* Connecticut */}
          <path
            className="ct"
            d="m 873.5,178.9 .4,-1.1 -3.2,-12.3 -.1,-.3 -14.9,3.4 v .7 l -.9,.3 -.5,-.7 -10.5,2.4 2.8,16.3 1.8,1.5 -3.5,3.4 1.7,2.2 5.4,-4.5 1.7,-1.3 h .8 l 2.4,-3.1 1.4,.1 2.9,-1.1 h 2.1 l 5.3,-2.7 2.8,-.9 1,-1 1.5,.5 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "CT");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "CT");
              if (state) handleClick(state);
            }}
            fill={getStateFill("CT", "northeast", hoveredStateId === "CT")}
          />

          {/* Delaware */}
          <path
            className="de"
            d="m 822.2,226.6 -1.6,.3 -1.5,1.1 -1.2,2.1 7.6,27.1 10.9,-2.3 -2.2,-7.6 -1.1,.5 -3.3,-2.6 -.5,-1.7 -1.8,-1 -.2,-3.7 -2.1,-2.2 -1.1,-.8 -1.2,-1.1 -.4,-3.2 .3,-2.1 1,-2.2 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "DE");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "DE");
              if (state) handleClick(state);
            }}
            fill={getStateFill("DE", "northeast", hoveredStateId === "DE")}
          />

          {/* Florida */}
          <path
            className="fl"
            d="m 751.7,445.1 -4,-.7 -1.7,-.9 -2.2,1.4 v 2.5 l 1.4,2.1 -.5,4.3 -2.1,.6 -1,-1.1 -.6,-3.2 -50.1,3.3 -3.3,-6 -48.8,5.1 -.5,2.9 2.5,2.8 1.7,.7 .9,1.2 -.4,7.3 -1.1,.6 .5,.4 1,-.3 .7,-.8 10.5,-2.7 9.2,-.5 8.1,1.9 8.5,5 2.4,.8 2.2,2 -.1,2.7 h 2.4 l 1.9,-1 2.5,.1 2,-.8 2.9,-2 3.1,-2.9 1.1,-.4 .6,.5 h 1.4 l .5,-.8 -.5,-1.2 -.6,-.6 .2,-.8 2,-1.1 5,-.4 .8,1 1,.1 2.3,1 3,1.8 1.2,1.7 1.1,1.2 2.8,1.4 v 2.4 l 2.8,1.9 1,.1 1.6,1.4 .7,1.6 1,.2 .8,2.1 .7,.6 1,-1.1 2.9,.1 .5,1.4 1.1,.9 v 1.3 l 2.9,2.2 .2,9.6 -1.8,5.8 1,1.2 -.2,3.4 -.8,1.4 .7,1.2 2.3,2.3 .3,1.5 .8,1 -.4,-1.9 1.3,-.6 .8,-3.6 -3,-1.2 .1,-.6 2.6,-.4 .9,2.6 1.1,.6 .1,-2 1.1,.3 .6,.8 -.1,.7 -2.9,4.2 -.2,1.1 -1.7,1.9 v 1.1 l 3.7,3.8 5.3,7.9 1.8,2.1 v 1.8 l 2.8,4.6 2.3,.6 .7,-1.2 -2.1,.3 -3,-4.5 .2,-1.4 1.5,-.8 v -1.5 l -.6,-1.3 .9,-.9 .4,.9 .7,.5 v 4 l -1.2,-.6 -.8,.9 1.4,1.6 1,2.6 1.2,-.6 2.3,1.2 2.1,2.2 1.6,5.1 3.1,4.8 .8,-1.3 2.8,-.5 3.2,1.3 .3,1.7 3.3,3.8 .1,1.1 2.2,2.7 -.7,.5 v 2.7 l 2.7,1.4 h 1.5 l 2.7,-1.8 1.5,.3 1.1,.4 2.3,-1.7 .2,-.7 1.2,.3 2.4,-1.7 1.3,-2.3 -.7,-3.2 -.2,-1.3 1.1,-4 .6,-.2 .6,1.6 .8,-1.8 -.8,-7.2 -.4,-10.5 -1,-6.8 -.7,-1.7 -6.6,-11.1 -5.2,-9.1 -2.2,-3.3 -1.3,-3.6 -.2,-3.4 .9,-.3 v -.9 l -1.1,-2.2 -4,-4 -7.6,-9.7 -5.7,-10.4 -4.3,-10.7 -.6,-3.7 -1.2,-1 -.5,-3.8 z m 9.2,134.5 1.7,-.1 -.7,-1 z m 7.3,-1.1 v -.7 l 1.6,-.2 3.7,-3.3 1.5,-.6 2.4,-.9 .3,1.3 1.7,.8 -2.6,1.2 h -2.4 l -3.9,2.5 z m 17.2,-7.6 -3,1.4 -1,1.3 1.1,.1 z m 3.8,-2.9 -1.1,.3 -1.4,2 1.1,-.2 1.5,-1.6 z m 8.3,-15.7 -1.7,5.6 -.8,1 -1,2.6 -1.2,1.6 -.7,1.7 -1.9,2.2 v .9 l 2.7,-2.8 2.4,-3.5 .6,-2 2.1,-4.9 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "FL");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "FL");
              if (state) handleClick(state);
            }}
            fill={getStateFill("FL", "south", hoveredStateId === "FL")}
          />

          {/* Georgia */}
          <path
            className="ga"
            d="m 761.8,414.1 v 1.4 l -4.2,6.2 -1.2,.2 1.5,.5 v 2 l -.9,1.1 -.6,6 -2.3,6.2 .5,2 .7,5.1 -3.6,.3 -4,-.7 -1.7,-.9 -2.2,1.4 v 2.5 l 1.4,2.1 -.5,4.3 -2.1,.6 -1,-1.1 -.6,-3.2 -50.1,3.3 -3.3,-6 -.7,-2.2 -1.5,-1.5 -.5,-1.4 .6,-6.3 -2.4,-5.7 .5,-2.6 .3,-3.7 2.2,-3.8 -.2,-1.1 -1.7,-1 v -3.2 l -1.8,-1.9 -2.9,-6.1 -12.9,-45.8 22.9,-2.9 21.4,-3 -.1,1.9 -1.9,1 -1.4,3.2 .2,1.3 6.1,3.8 2.6,-.3 3.1,4 .4,1.7 4.2,5.1 2.6,1.7 1.4,.2 2.2,1.6 1.1,2.2 2,1.6 1.8,.5 2.7,2.7 .1,1.4 2.6,2.8 5,2.3 3.6,6.7 .3,2.7 3.9,2.1 2.5,4.8 .8,3.1 4.2,.4 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "GA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "GA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("GA", "south", hoveredStateId === "GA")}
          />

          {/* Hawaii */}
          <path
            className="hi"
            d="m 317,553.7 -.2,3.2 1.7,1.9 .1,1.2 -4.8,4.5 -.1,1.2 1.9,3.2 1.7,4.2 v 2.6 l -.5,1.2 .1,3.4 4.1,2.1 1.1,1.1 1.2,-1.1 2.1,-3.6 4.5,-2.9 3.3,-.5 2.5,-1 1.7,-1.2 3.2,-3.5 -2.8,-1.1 -1.4,-1.4 .1,-1.7 -.5,-.6 h -2 l .2,-2.5 -.7,-1.2 -2.6,-2.3 -4.5,-1.9 -2.8,-.2 -3.3,-2.7 -1.2,-.6 z m -15.3,-17 -1.1,1.5 -.1,1.7 2.7,2.4 1.9,.5 .6,1 .4,3 3.6,.2 5.3,-2.6 -.1,-2.5 -1.4,-.5 -3.5,-2.6 -1.8,-.3 -2.9,1.3 -1.5,-2.7 z m -1.5,11.5 .9,-1.4 2.5,-.3 .6,1.8 z m -7,-8.7 1.7,4 3.1,-.6 .3,-2 -1.4,-1.5 z m -4.1,-6.7 -1.1,2.4 h 5 l 4.8,1.6 2.5,-1.6 .2,-1.5 -4.8,.2 z m -16,-10.6 -1.9,2.1 -2.9,.6 .8,2.2 2.2,2.8 .1,1 2.1,-.3 2.3,.1 1.7,1.2 3.5,-.8 v -.7 l -1,-.8 -.5,-2.1 -.8,-.3 -.5,1 -1.2,-1.3 .2,-1.4 -1.8,-3.3 -1.1,-.7 z m -31.8,-12.4 -4.2,2.9 .2,2.3 2.4,1.2 1.9,1.3 2.7,.4 2.6,-2.2 -.2,-1.9 .8,-1.7 v -1.4 l -1,-.9 z m -10.8,4.8 -.3,1.2 -1.9,.9 -.6,1.8 1,.8 1.1,-1.5 1.9,-.6 .4,-2.6 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "HI");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "HI");
              if (state) handleClick(state);
            }}
            fill={getStateFill("HI", "west", hoveredStateId === "HI")}
          />

          {/* Idaho */}
          <path
            className="id"
            d="m 165.3,183.1 -24.4,-5.4 8.5,-37.3 2.9,-5.8 .4,-2.1 .8,-.9 -.9,-2 -2.9,-1.2 .2,-4.2 4,-5.8 2.5,-.8 1.6,-2.3 -.1,-1.6 1.8,-1.6 3.2,-5.5 4.2,-4.8 -.5,-3.2 -3.5,-3.1 -1.6,-3.6 1.1,-4.3 -.7,-4 12.7,-56.1 14.2,3 -4.8,22 3.7,7.4 -1.6,4.8 3.6,4.8 1.9,.7 3.9,8.3 v 2.1 l 2.3,3 h .9 l 1.4,2.1 h 3.2 v 1.6 l -7.1,17 -.5,4.1 1.4,.5 1.6,2.6 2.8,-1.4 3.6,-2.4 1.9,1.9 .5,2.5 -.5,3.2 2.5,9.7 2.6,3.5 2.3,1.4 .4,3 v 4.1 l 2.3,2.3 1.6,-2.3 6.9,1.6 2.1,-1.2 9,1.7 2.8,-3.3 1.8,-.6 1.2,1.8 1.6,4.1 .9,.1 -8.5,54.8 -47.9,-8.2 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "ID");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "ID");
              if (state) handleClick(state);
            }}
            fill={getStateFill("ID", "west", hoveredStateId === "ID")}
          />

          {/* Illinois */}
          <path
            className="il"
            d="m 623.5,265.9 -1,5.2 v 2 l 2.4,3.5 v .7 l -.3,.9 .9,1.9 -.3,2.4 -1.6,1.8 -1.3,4.2 -3.8,5.3 -.1,7 h -1 l .9,1.9 v .9 l -2.2,2.7 .1,1.1 1.5,2.2 -.1,.9 -3.7,.6 -.6,1.2 -1.2,-.6 -1,.5 -.4,3.3 1.7,1.8 -.4,2.4 -1.5,.3 -6.9,-3 -4,3.7 .3,1.8 h -2.8 l -1.4,-1.5 -1.8,-3.8 v -1.9 l .8,-.6 .1,-1.3 -1.7,-1.9 -.9,-2.5 -2.7,-4.1 -4.8,-1.3 -7.4,-7.1 -.4,-2.4 2.8,-7.6 -.4,-1.9 1.2,-1.1 v -1.3 l -2.8,-1.5 -3,-.7 -3.4,1.2 -1.3,-2.3 .6,-1.9 -.7,-2.4 -8.6,-8.4 -2.2,-1.5 -2.5,-5.9 -1.2,-5.4 1.4,-3.7 .7,-.7 .1,-2.3 -.7,-.9 1,-1.5 1.8,-.6 .9,-.3 1,-1.2 v -2.4 l 1.7,-2.4 .5,-.5 .1,-3.5 -.9,-1.4 -1,-.3 -1.1,-1.6 1,-4 3,-.8 h 2.4 l 4.2,-1.8 1.7,-2.2 .1,-2.4 1.1,-1.3 1.3,-3.2 -.1,-2.6 -2.8,-3.5 h -1.2 l -.9,-1.1 .2,-1.6 -1.7,-1.7 -2.5,-1.3 .5,-.6 45.9,-2.8 .1,4.6 3.4,4.6 1.2,4.1 1.6,3.2 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "IL");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "IL");
              if (state) handleClick(state);
            }}
            fill={getStateFill("IL", "midwest", hoveredStateId === "IL")}
          />

          {/* Indiana */}
          <path
            className="in"
            d="m 629.2,214.8 -5.1,2.3 -4.7,-1.4 4.1,50.2 -1,5.2 v 2 l 2.4,3.5 v .7 l -.3,.9 .9,1.9 -.3,2.4 -1.6,1.8 -1.3,4.2 -3.8,5.3 -.1,7 h -1 l .9,1.9 1.1,.8 .6,-1 -.7,-1.7 4.6,-.5 .2,1.2 1.1,.2 .4,-.9 -.6,-1.3 .3,-.8 1.3,.8 1.7,-.4 1.7,.6 3.4,2.1 1.8,-2.8 3.5,-2.2 3,3.3 1.6,-2.1 .3,-2.7 3.8,-2.3 .2,1.3 1.9,1.2 3,-.2 1.2,-.7 .1,-3.4 2.5,-3.7 4.6,-4.4 -.1,-1.7 1.2,-3.8 2.2,1 6.7,-4.5 -.4,-1.7 -1.5,-2.1 1,-1.9 -6.6,-57.2 -.1,-1.4 -32.4,3.4 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "IN");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "IN");
              if (state) handleClick(state);
            }}
            fill={getStateFill("IN", "midwest", hoveredStateId === "IN")}
          />

          {/* Iowa */}
          <path
            className="ia"
            d="m 556.9,183 2.1,1.6 .6,1.1 -1.6,3.3 -.1,2.5 2,5.5 2.7,1.5 3.3,.7 1.3,2.8 -.5,.6 2.5,1.3 1.7,1.7 -.2,1.6 .9,1.1 h 1.2 l 2.8,3.5 .1,2.6 -1.3,3.2 -1.1,1.3 -.1,2.4 -1.7,2.2 -4.2,1.8 h -2.4 l -3,.8 -1,4 1.1,1.6 1,.3 .9,1.4 -.1,3.5 -.5,.5 -1.7,2.4 v 2.4 l -1,1.2 -.9,.3 -1.8,.6 -1,1.5 .7,.9 -.1,2.3 -.7,.7 -1.5,-.8 -1.1,-1.1 -.6,-1.6 -1.7,-1.3 -14.3,.8 -27.2,1.2 -25.9,-.1 -1.8,-4.4 .7,-2.2 -.8,-3.3 .2,-2.9 -1.3,-.7 -.4,-6.1 -2.8,-5 -.2,-3.7 -2.2,-4.3 -1.3,-3.7 v -1.4 l -.6,-1.7 v -2.3 l -.5,-.9 -.7,-1.7 -.3,-1.3 -1.3,-1.2 1,-4.3 1.7,-5.1 -.7,-2 -1.3,-.4 -.4,-1.6 1,-.5 .1,-1.1 -1.3,-1.5 .1,-1.6 2.2,.1 h 28.2 l 36.3,-.9 18.6,-.7 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "IA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "IA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("IA", "midwest", hoveredStateId === "IA")}
          />

          {/* Kansas */}
          <path
            className="ks"
            d="m 459.1,259.5 -43.7,-1.2 -36,-2 -4.8,67 67.7,2.9 62,.1 -.5,-48.1 -3.2,-.7 -2.6,-4.7 -2.5,-2.5 .5,-2.3 2.7,-2.6 .1,-1.2 -1.5,-2.1 -.9,1 -2,-.6 -2.9,-3 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "KS");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "KS");
              if (state) handleClick(state);
            }}
            fill={getStateFill("KS", "midwest", hoveredStateId === "KS")}
          />

          {/* Kentucky */}
          <path
            className="ky"
            d="m 692.1,322.5 -20.5,1.4 -5.2,.8 -17.4,1 -2.6,.8 -22.6,2 -.7,-.6 h -3.7 l 1.2,3.2 -.6,.9 -23.3,1.5 1,-2.7 1.4,.9 .7,-.4 1.2,-4.1 -1,-1 1,-2 .2,-.9 -1.3,-.8 -.3,-1.8 4,-3.7 6.9,3 1.5,-.3 .4,-2.4 -1.7,-1.8 .4,-3.3 1,-.5 1.2,.6 .6,-1.2 3.7,-.6 .1,-.9 -1.5,-2.2 -.1,-1.1 2.2,-2.7 0,-.9 1.1,.8 .6,-1 -.7,-1.7 4.6,-.5 .2,1.2 1.1,.2 .4,-.9 -.6,-1.3 .3,-.8 1.3,.8 1.7,-.4 1.7,.6 3.4,2.1 1.8,-2.8 3.5,-2.2 3,3.3 1.6,-2.1 .3,-2.7 3.8,-2.3 .2,1.3 1.9,1.2 3,-.2 1.2,-.7 .1,-3.4 2.5,-3.7 4.6,-4.4 -.1,-1.7 1.2,-3.8 2.2,1 6.7,-4.5 -.4,-1.7 -1.5,-2.1 1,-1.9 1.3,.5 2.2,.1 1.9,-.8 2.9,1.2 2.2,3.4 v 1 l 4.1,.7 2.3,-.2 1.9,2.1 2.2,.2 v -1 l 1.9,-.8 3,.8 1.2,.8 1.3,-.7 h .9 l .6,-1.7 3.4,-1.8 .5,.8 .8,2.9 3.5,1.4 1.2,2.1 -.1,1.1 .6,1 -.6,3.6 1.9,1.6 .8,1.1 1,.6 -.1,.9 4.4,5.6 h 1.4 l 1.5,1.8 1.2,.3 1.4,-.1 -4.9,6.6 -2.9,1 -3,3 -.4,2.2 -2.1,1.3 -.1,1.7 -1.4,1.4 -1.8,.5 -.5,1.9 -1,.4 -6.9,4.2 z m -98,11.3 -.7,-.7 .2,-1 h 1.1 l .7,.7 -.3,1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "KY");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "KY");
              if (state) handleClick(state);
            }}
            fill={getStateFill("KY", "south", hoveredStateId === "KY")}
          />

          {/* Louisiana */}
          <path
            className="la"
            d="m 602.5,472.8 -1.2,-1.8 .3,-1.3 -4.8,-6.8 .9,-4.6 1,-1.4 .1,-1.4 -36,2 1.7,-11.9 2.4,-4.8 6,-8.4 -1.8,-2.5 h 2 v -3.3 l -2.4,-2.5 .5,-1.7 -1.2,-1 -1.6,-7.1 .6,-1.4 -52.3,1.3 .5,19.9 .7,3.4 2.6,2.8 .7,5.4 3.8,4.6 .8,4.3 h 1 l -.1,7.3 -3.3,6.4 1.3,2.3 -1.3,1.5 .7,3 -.1,4.3 -2.2,3.5 -.1,.8 -1.7,1.2 1,1.8 1.2,1.1 1.6,-1.3 5.3,-.9 6.1,-.1 9.6,3.8 8,1 1.5,-1.4 1.8,-.2 4.8,2.2 1.6,-.4 1.1,-1.5 -4.2,-1.8 -2.2,1 -1.1,-.2 -1.4,-2 3.3,-2.2 1.6,-.1 v 1.7 l 1.5,-.1 3.4,-.3 .4,2.3 1.1,.4 .6,1.9 4.8,1 1.7,1.6 v .7 h -1.2 l -1.5,1.7 1.7,1.2 5.4,1 2.7,2.8 4.4,-1 -3.7,.2 -.1,-.6 2.8,-.7 .2,-1.8 1.2,-.3 v -1.4 l 1.1,.1 v 1.6 l 2.5,.1 .8,-1.9 .9,.3 .2,2.5 1.2,.2 -1.8,2 2.6,-.9 2,-1.1 2.9,-3.3 h -.7 l -1.3,1.2 -.4,-.1 -.5,-.8 .9,-1.2 v -2.3 l 1.1,-.8 .7,.7 1,-.8 1,-.1 .6,1.3 -.6,1.9 h 2.4 l 5.1,1.7 .5,1.3 1.6,1.4 2.8,.1 1.3,.7 1.8,-1 .9,-1.7 v -1.7 h -1.4 l -1.2,-1.4 -1.1,-1.1 -3.2,-.9 -2.6,.2 -4.2,-2.4 v -2.3 l 1.3,-1 2.4,.6 -3.1,-1.6 .2,-.8 h 3.6 l 2.6,-3.5 -2.6,-1.8 .8,-1.5 -1.2,-.8 h -.8 l -2,2.1 v 2.1 l -.6,.7 -1.1,-.1 -1.6,-1.4 h -1.3 v -1.5 l .6,-.7 .8,.7 1.7,-1.6 .7,-1.6 .8,-.3 z m -10.3,-2.7 1.9,1 .8,1.1 2.5,.1 1.5,.8 .2,1.4 -.4,.6 -.9,-1.5 -1.4,1.2 -.9,1.4 -2.8,.8 -1.6,.1 -3.7,-1 .1,-1.7 2,-2 1.1,-2.4 z m -4.7,1.2 v 1.1 l -1.8,2 h -1.2 v -2.2 l 1.6,-1.5 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "LA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "LA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("LA", "south", hoveredStateId === "LA")}
          />

          {/* Maine */}
          <path
            className="me"
            d="m 875,128.7 .6,4 3.2,2 .8,2.2 2.3,1.4 1.4,-.3 1,-3 -.8,-2.9 1.6,-.9 .5,-2.8 -.6,-1.3 3.3,-1.9 -2.2,-2.3 .9,-2.4 1.4,-2.2 .5,3.2 1.6,-2 1.3,.9 1.2,-.8 v -1.7 l 3.2,-1.3 .3,-2.9 2.5,-.2 2.7,-3.7 v -.7 l -.9,-.5 -.1,-3.3 .6,-1.1 .2,1.6 1,-.5 -.2,-3.2 -.9,.3 -.1,1.2 -1.2,-1.4 .9,-1.4 .6,.1 1.1,-.4 .5,2.8 2,-.3 2.9,.7 v -1 l -1.1,-1.2 1.3,.1 .1,-2.3 .6,.8 .3,1.9 2.1,1.5 .2,-1 .9,-.2 -.3,-.8 .8,-.6 -.1,-1.6 -1.6,-.2 -2,.7 1.4,-1.6 .7,-.8 1.3,-.2 .4,1.3 1.7,1.6 .4,-2.1 2.3,-1.2 -.9,-1.3 .1,-1.7 1.1,.5 h .7 l 1.7,-1.4 .4,-2.3 2.2,.3 .1,-.7 .2,-1.6 .5,1.4 1.5,-1 2.3,-4.1 -.1,-2.2 -1.4,-2 -3,-3.2 h -1.9 l -.8,2.2 -2.9,-3 .3,-.8 v -1.5 l -1.6,-4.5 -.8,-.2 -.7,.4 h -4.8 l -.3,-3.6 -8.1,-26 -7.3,-3.7 -2.9,-.1 -6.7,6.6 -2.7,-1 -1,-3.9 h -2.7 l -6.9,19.5 .7,6.2 -1.7,2.4 -.4,4.6 1.3,3.7 .8,.2 v 1.6 l -1.6,4.5 -1.5,1.4 -1.3,2.2 -.4,7.8 -2.4,-1 -1.5,.4 z m 34.6,-24.7 -1,.8 v 1.3 l .7,-.8 .9,.8 .4,-.5 1.1,.2 -1,-.8 .4,-.8 z m -1.7,2.6 -1,1.1 .5,.4 -.1,1 h 1.1 v -1.8 z m -3,-1.6 .9,1.3 1,.5 .3,-1 v -1.8 l -1.3,-.7 -.4,1.2 z m -1,5 -1.7,-1.7 1.6,-2.4 .8,.3 .2,1.1 1,.8 v 1.1 l -1,1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "ME");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "ME");
              if (state) handleClick(state);
            }}
            fill={getStateFill("ME", "northeast", hoveredStateId === "ME")}
          />

          {/* Maryland */}
          <path
            className="md"
            d="m 822.9,269.3 0,-1.7 h -.8 l 0,1.8 z m 11.8,-3.9 1.2,-2.2 .1,-2.5 -.6,-.6 -.7,.9 -.2,2.1 -.8,1.4 -.3,1.1 -4.6,1.6 -.7,.8 -1.3,.2 -.4,.9 -1.3,.6 -.3,-2.5 .4,-.7 -.8,-.5 .2,-1.5 -1.6,1 v -2 l 1.2,-.3 -1.9,-.4 -.7,-.8 .4,-1.3 -.8,-.6 -.7,1.6 .5,.8 -.7,.6 -1.1,.5 -2,-1 -.2,-1.2 -1,-1.1 -1.4,-1.7 1.5,-.8 -1,-.6 v -.9 l .6,-1 1.7,-.3 -1.4,-.6 -.1,-.7 -1.3,-.1 -.4,1.1 -.6,.3 .1,-3.4 1,-1 .8,.7 .1,-1.6 -1,-.9 -.9,1.1 -1,1.4 -.6,-1 .2,-2.4 .9,-1 .9,.9 1.2,-.7 -.4,-1.7 -1,1 -.9,-2.1 -.2,-1.7 1.1,-2.4 1.1,-1.4 1.4,-.2 -.5,-.8 .5,-.6 -.3,-.7 .2,-2.1 -1.5,.4 -.8,1.1 1,1.3 -2.6,3.6 -.9,-.4 -.7,.9 -.6,2.2 -1.8,.5 1.3,.6 1.3,1.3 -.2,.7 .9,1.2 -1.1,1 .5,.3 -.5,1.3 v 2.1 l -.5,1.3 .9,1.1 .7,3.4 1.3,1.4 1.6,1.4 .4,2.8 1.6,2 .4,1.4 v 1 h -.7 l -1.5,-1.2 -.4,.2 -1.2,-.2 -1.7,-1.4 -1.4,-.3 -1,.5 -1.2,-.3 -.4,.2 -1.7,-.8 -1,-1 -1,-1.3 -.6,-.2 -.8,.7 -1.6,1.3 -1.1,-.8 -.4,-2.3 .8,-2.1 -.3,-.5 .3,-.4 -.7,-1 1,-.1 1,-.9 .4,-1.8 1.7,-2.6 -2.6,-1.8 -1,1.7 -.6,-.6 h -1 l -.6,-.1 -.4,-.4 .1,-.5 -1.7,-.6 -.8,.3 -1.2,-.1 -.7,-.7 -.5,-.2 -.2,-.7 .6,-.8 v -.9 l -1.2,-.2 -1,-.9 -.9,.1 -1.6,-.3 -.9,-.4 .2,-1.6 -1,-.5 -.2,-.7 h -.7 l -.8,-1.2 .2,-1 -2.6,.4 -2.2,-1.6 -1.4,.3 -.9,1.4 h -1.3 l -1.7,2.9 -3.3,.4 -1.9,-1 -2.6,3.8 -2.2,-.3 -3.1,3.9 -.9,1.6 -1.8,1.6 -1.7,-11.4 60.5,-11.8 7.6,27.1 10.9,-2.3 0,5.3 -.1,3.1 -1,1.8 z m -13.4,-1.8 -1.3,.9 .8,1.8 1.7,.8 -.4,-1.6 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "MD");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "MD");
              if (state) handleClick(state);
            }}
            fill={getStateFill("MD", "northeast", hoveredStateId === "MD")}
          />

          {/* Massachusetts */}
          <path
            className="ma"
            d="m 899.9,174.2 h 3.4 l .9,-.6 .1,-1.3 -1.9,-1.8 .4,1 -1.5,1.5 h -2.3 l .1,.8 z m -9,1.8 -1.2,-.6 1,-.8 .6,-2.1 1.2,-1 .8,-.2 .6,.9 1.1,.2 .6,-.6 .5,1.9 -1.3,.3 -2.8,.7 z m -34.9,-23.4 18.4,-3.8 1,-1.5 .3,-1.7 1.9,-.6 .5,-1.1 1.7,-1.1 1.3,.3 1.7,3.3 1,.4 1.1,-1.3 .8,1.3 v 1.1 l -3,2.4 .2,.8 -.9,1 .4,.8 -1.3,.3 .9,1.2 -.8,.7 .6,1 .9,-.2 .3,-.8 1.1,.6 h 1.8 l 2.5,2.6 .2,2.6 1.8,.1 .8,1.1 .6,2 1,.7 h 1.9 l 1.9,-.1 .8,-.9 1.6,-1.2 1.1,-.3 -1.2,-2.1 -.3,.9 -1.5,-3.6 h -.8 l -.4,.9 -1.2,-1 1.3,-1.1 1.8,.4 2.3,2.1 1.3,2.7 1.2,3.3 -1,2.8 v -1.8 l -.7,-1 -3.5,2.3 -.9,-.3 -1.6,1 -.1,1.2 -2.2,1.2 -2,2.1 -2,1.9 h -1.2 l 3.3,-3.3 .5,-1.9 -.5,-.6 -.3,-1.3 -.9,-.1 -.1,1.3 -1,1.2 h -1.2 l -.3,1.1 .4,1.2 -1.2,1.1 -1.1,-.2 -.4,1 -1.4,-3 -1.3,-1.1 -2.6,-1.3 -.6,-2.2 h -.8 l -.7,-2.6 -6.5,2 -.1,-.3 -14.9,3.4 v .7 l -.9,.3 -.5,-.7 -10.5,2.4 -.7,-1 .5,-15 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "MA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "MA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("MA", "northeast", hoveredStateId === "MA")}
          />

          {/* Michigan */}
          <path
            className="mi"
            d="m 663.3,209.8 .1,1.4 21.4,-3.5 .5,-1.2 3.9,-5.9 v -4.3 l .8,-2.1 2.2,-.8 2,-7.8 1,-.5 1,.6 -.2,.6 -1.1,.8 .3,.9 .8,.4 1.9,-1.4 .4,-9.8 -1.6,-2.3 -1.2,-3.7 v -2.5 l -2.3,-4.4 v -1.8 l -1.2,-3.3 -2.3,-3 -2.9,-1 -4.8,3 -2.5,4.6 -.2,.9 -3,3.5 -1.5,-.2 -2.9,-2.8 -.1,-3.4 1.5,-1.9 2,-.2 1.2,-1.7 .2,-4 .8,-.8 1.1,-.1 .9,-1.7 -.2,-9.6 -.3,-1.3 -1.2,-1.2 -1.7,-1 -.1,-1.8 .7,-.6 1.8,.8 -.3,-1.7 -1.9,-2.7 -.7,-1.6 -1.1,-1.1 h -2.2 l -8.1,-2.9 -1.4,-1.7 -3.1,-.3 -1.2,.3 -4.4,-2.3 h -1.4 l .5,1 -2.7,-.1 .1,.6 .6,.6 -2.5,2.1 .1,1.8 1.5,2.3 1.5,.2 v .6 l -1.5,.5 -2.1,-.1 -2.8,2.5 .1,2.5 .4,5.8 -2.2,3.4 .8,-4.5 -.8,-.6 -.9,5.3 -1,-2.3 .5,-2.3 -.5,-1 .6,-1.3 -.6,-1.1 1,-1 v -1.2 l -1.3,.6 -1.3,3.1 -.7,.7 -1.3,2.4 -1.7,-.2 -.1,1.2 h -1.6 l .2,1.5 .2,2 -3,1.2 .1,1.3 1,1.7 -.1,5.2 -1.3,4.4 -1.7,2.5 1.2,1.4 .8,3.5 -1,2.5 -.2,2.1 1.7,3.4 2.5,4.9 1.2,1.9 1.6,6.9 -.1,8.8 -.9,3.9 -2,3.2 -.9,3.7 -2,3 -1.2,1 z m -95.8,-96.8 3,3.8 17,3.8 1.4,1 4,.8 .7,.5 2.8,-.2 4.9,.8 1.4,1.5 -1,1 .8,.8 3.8,.7 1.2,1.2 .1,4.4 -1.3,2.8 2,.1 1,-.8 .9,.8 -1.1,3.1 1,1.6 1.2,.3 .8,-1.8 2.9,-4.6 1.6,-6 2.3,-2 -.5,-1.6 .5,-.9 1,1.6 -.3,2.2 2.9,-2.2 .2,-2.3 2.1,.6 .8,-1.6 .7,.6 -.7,1.5 -1,.5 -1,2 1.4,1.8 1.1,-.5 -.5,-.7 1,-1.5 1.9,-1.7 h .8 l .2,-2.6 2,-1.8 7.9,-.5 1.9,-3.1 3.8,-.3 3.8,1.2 4.2,2.7 .7,-.2 -.2,-3.5 .7,-.2 4.5,1.1 1.5,-.2 2.9,-.7 1.7,.4 1.8,.1 v -1.1 l -.7,-.9 -1.5,-.2 -1.1,-.8 .5,-1.4 -.8,-.3 -2.6,.1 -.1,-1 1.1,-.8 .6,.8 .5,-1.8 -.7,-.7 .7,-.2 -1.4,-1.3 .3,-1.3 .1,-1.9 h -1.3 l -1.5,1 -1.9,.1 -.5,1.8 -1.9,.2 -.3,-1.2 -2.2,.1 -1,1.2 -.7,-.1 -.2,-.8 -2.6,.4 -.1,-4.8 1,-2 -.7,-.1 -1.8,1.1 h -2.2 l -3.8,2.7 -6.2,.3 -4.1,.8 -1.9,1.5 -1.4,1.3 -2.5,1.7 -.3,.8 -.6,-1.7 -1.3,-.6 v .6 l .7,.7 v 1.3 l -1.5,-.6 h -.6 l -.3,1.2 -2,-1.9 -1.3,-.2 -1.3,1.5 -3.2,-.1 -.5,-1.4 -2,-1.9 -1.3,-1.6 v -.7 l -1.1,-1.4 -2.6,-1.2 -3.3,-.1 -1.1,-.9 h -1.4 l -.7,.4 -2.2,2.2 -.7,1.1 -1,-.7 .2,-1 .8,-2.1 3.2,-5 .8,-.2 1.7,-1.9 .7,-1.6 3,-.6 .8,-.6 -.1,-1 -.5,-.5 -4.5,.2 -2,.5 -2.6,1.2 -1.2,1.2 -1.7,2.2 -1.8,1 -3.3,3.4 -.4,1.6 -7.4,4.6 -4,.5 -1.8,.4 -2.3,3 -1.8,.7 -4.4,2.3 z m 100.7,3.8 3.8,.1 .6,-.5 -.2,-2 -1.7,-1.8 -1.9,.1 -.1,.5 1.1,.4 -1.6,.8 -.3,1 -.6,-.6 -.4,.8 z m -75.1,-41.9 -2.3,.2 -2.7,1.9 -7.1,5.3 .8,1 1.8,.3 2.8,-2 -1.1,-.5 2.3,-1.6 h 1 l 3,-1.9 -.1,-.9 z m 41.1,62.8 v 1 l 2.1,1.6 -.2,-2.4 z m -.7,2.8 1.1,.1 v .9 h -1 z m 21.4,-21.3 v .9 l .8,-.2 v -.5 z m 4.7,3.1 -.1,-1.1 -1.6,-.2 -.6,-.4 h -.9 l -.4,.3 .9,.4 1.1,1.1 z m -18,1.2 -.1,1.1 -.3,.7 .2,2.2 .4,.3 .7,.1 .5,-.9 .1,-1.6 -.3,-.6 -.1,-1.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "MI");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "MI");
              if (state) handleClick(state);
            }}
            fill={getStateFill("MI", "midwest", hoveredStateId === "MI")}
          />

          {/* Minnesota */}
          <path
            className="mn"
            d="m 464.7,68.6 -1.1,2.8 .8,1.4 -.3,5.1 -.5,1.1 2.7,9.1 1.3,2.5 .7,14 1,2.7 -.4,5.8 2.9,7.4 .3,5.8 -.1,2.1 -.1,2.2 -.9,2 -3.1,1.9 -.3,1.2 1.7,2.5 .4,1.8 2.6,.6 1.5,1.9 -.2,39.5 h 28.2 l 36.3,-.9 18.6,-.7 -1.1,-4.5 -.2,-3 -2.2,-3 -2.8,-.7 -5.2,-3.6 -.6,-3.3 -6.3,-3.1 -.2,-1.3 h -3.3 l -2.2,-2.6 -2,-1.3 .7,-5.1 -.9,-1.6 .5,-5.4 1,-1.8 -.3,-2.7 -1.2,-1.3 -1.8,-.3 v -1.7 l 2.8,-5.8 5.9,-3.9 -.4,-13 .9,.4 .6,-.5 .1,-1.1 .9,-.6 1.4,1.2 .7,-.1 v 0 l -1.2,-2.2 4.3,-3.1 3.1,-3.7 1.6,-.8 4.7,-5.9 6.3,-5.8 3.9,-2.1 6.3,-2.7 7.6,-4.5 -.6,-.4 -3.7,.7 -2.8,.1 -1,-1.6 -1.4,-.9 -9.8,1.2 -1,-2.8 -1.6,-.1 -1.7,.8 -3.7,3.1 h -4.1 l -2.1,-1 -.3,-1.7 -3.9,-.8 -.6,-1.6 -.7,-1.3 -1,.9 -2.6,.1 -9.9,-5.5 h -2.9 l -.8,-.7 -3.1,1.3 -.8,1.3 -3.3,.8 -1.3,-.2 v -1.7 l -.7,-.9 h -5.9 l -.4,-1.4 h -2.6 l -1.1,.4 -2.4,-1.7 .3,-1.4 -.6,-2.4 -.7,-1.1 -.2,-3 -1,-3.1 -2.1,-1.6 h -2.9 l .1,8 -30.9,-.4 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "MN");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "MN");
              if (state) handleClick(state);
            }}
            fill={getStateFill("MN", "midwest", hoveredStateId === "MN")}
          />

          {/* Mississippi */}
          <path
            className="ms"
            d="m 623.8,468.6 -5,.1 -2.4,-1.5 -7.9,2.5 -.9,-.7 -.5,.2 -.1,1.6 -.6,.1 -2.6,2.7 -.7,-.1 -.6,-.7 -1.2,-1.8 .3,-1.3 -4.8,-6.8 .9,-4.6 1,-1.4 .1,-1.4 -36,2 1.7,-11.9 2.4,-4.8 6,-8.4 -1.8,-2.5 h 2 v -3.3 l -2.4,-2.5 .5,-1.7 -1.2,-1 -1.6,-7.1 .6,-1.4 1.2,-1.5 .5,-3 -1.5,-2.3 -.5,-2.2 .9,-.7 v -.8 l -1.7,-1.1 -.1,-.7 1.6,-.9 -1.2,-1.1 1.7,-7.1 3.4,-1.6 v -.8 l -1.1,-1.4 2.9,-5.4 h 1.9 l 1.5,-1.2 -.3,-5.2 3.1,-4.5 1.8,-.6 -.5,-3.1 38.3,-2.6 1.3,2 -1.3,67 4.4,33.2 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "MS");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "MS");
              if (state) handleClick(state);
            }}
            fill={getStateFill("MS", "south", hoveredStateId === "MS")}
          />

          {/* Missouri */}
          <path
            className="mo"
            d="m 555.3,248.9 -1.1,-1.1 -.6,-1.6 -1.7,-1.3 -14.3,.8 -27.2,1.2 -25.9,-.1 1.3,1.3 -.3,1.4 2.1,3.7 3.9,6.3 2.9,3 2,.6 .9,-1 1.5,2.1 -.1,1.2 -2.7,2.6 -.5,2.3 2.5,2.5 2.6,4.7 3.2,.7 .5,48.1 .2,10.8 39.1,-.7 39.8,-2 1.6,2.5 v 2.2 l -1.7,1.5 -2.8,5.1 11.2,-.8 1,-2 1.2,-.5 v -.7 l -1.2,-1.1 -.6,-1 1.7,.2 .8,-.7 -1.4,-1.5 1.4,-.5 .1,-1 -.6,-1 v -1.3 l -.7,-.7 .2,-1 h 1.1 l .7,.7 -.3,1 .8,.7 .8,-1 1,-2.7 1.4,.9 .7,-.4 1.2,-4.1 -1,-1 1,-2 .2,-.9 -1.3,-.8 h -2.8 l -1.4,-1.5 -1.8,-3.8 v -1.9 l .8,-.6 .1,-1.3 -1.7,-1.9 -.9,-2.5 -2.7,-4.1 -4.8,-1.3 -7.4,-7.1 -.4,-2.4 2.8,-7.6 -.4,-1.9 1.2,-1.1 v -1.3 l -2.8,-1.5 -3,-.7 -3.4,1.2 -1.3,-2.3 .6,-1.9 -.7,-2.4 -8.6,-8.4 -2.2,-1.5 -2.5,-5.9 -1.2,-5.4 1.4,-3.7 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "MO");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "MO");
              if (state) handleClick(state);
            }}
            fill={getStateFill("MO", "midwest", hoveredStateId === "MO")}
          />

          {/* Montana */}
          <path
            className="mt"
            d="m 247,130.5 57.3,7.9 51,5.3 2,-20.7 5.2,-66.7 -53.5,-5.6 -54.3,-7.7 -65.9,-12.5 -4.8,22 3.7,7.4 -1.6,4.8 3.6,4.8 1.9,.7 3.9,8.3 v 2.1 l 2.3,3 h .9 l 1.4,2.1 h 3.2 v 1.6 l -7.1,17 -.5,4.1 1.4,.5 1.6,2.6 2.8,-1.4 3.6,-2.4 1.9,1.9 .5,2.5 -.5,3.2 2.5,9.7 2.6,3.5 2.3,1.4 .4,3 v 4.1 l 2.3,2.3 1.6,-2.3 6.9,1.6 2.1,-1.2 9,1.7 2.8,-3.3 1.8,-.6 1.2,1.8 1.6,4.1 .9,.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "MT");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "MT");
              if (state) handleClick(state);
            }}
            fill={getStateFill("MT", "west", hoveredStateId === "MT")}
          />

          {/* Nebraska */}
          <path
            className="ne"
            d="m 402.5,191.1 38,1.6 3.4,3.2 1.7,.2 2.1,2 1.8,-.1 1.8,-2 1.5,.6 1,-.7 .7,.5 .9,-.4 .7,.4 .9,-.4 1,.5 1.4,-.6 2,.6 .6,1.1 6.1,2.2 1.2,1.3 .9,2.6 1.8,.7 1.5,-.2 .5,.9 v 2.3 l .6,1.7 v 1.4 l 1.3,3.7 2.2,4.3 .2,3.7 2.8,5 .4,6.1 1.3,.7 -.2,2.9 .8,3.3 -.7,2.2 1.8,4.4 1.3,1.3 -.3,1.4 2.1,3.7 3.9,6.3 h -32.4 l -43.7,-1.2 -36,-2 1.4,-22.1 -33.1,-2.4 3.7,-44.2 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "NE");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "NE");
              if (state) handleClick(state);
            }}
            fill={getStateFill("NE", "midwest", hoveredStateId === "NE")}
          />

          {/* Nevada */}
          <path
            className="nv"
            d="m 167.6,296.8 -3.4,17.5 -2.4,2.9 h -2 l -1.2,-2.7 -3.7,-1.4 -3.5,.6 -1,13.6 .5,4.9 -.5,2.9 -1.4,3 -70.4,-105 -1.1,-3.5 16.4,-63.1 47,11.2 24.4,5.4 23.3,4.7 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "NV");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "NV");
              if (state) handleClick(state);
            }}
            fill={getStateFill("NV", "west", hoveredStateId === "NV")}
          />

          {/* New Hampshire */}
          <path
            className="nh"
            d="m 862.6,93.6 -1.3,.1 -1,-1.1 -1.9,1.4 -.5,6.1 1.2,2.3 -1.1,3.5 2.1,2.8 -.4,1.7 .1,1.3 -1.1,2.1 -1.4,.4 -.6,1.3 -2.1,1 -.7,1.5 1.4,3.4 -.5,2.5 .5,1.5 -1,1.9 .4,1.9 -1.3,1.9 .2,2.2 -.7,1.1 .7,4.5 .7,1.5 -.5,2.6 .9,1.8 -.2,2.5 -.5,1.3 -.1,1.4 2.1,2.6 18.4,-3.8 1,-1.5 .3,-1.7 1.9,-.6 .5,-1.1 1.7,-1.1 1.3,.3 .8,-4.8 -2.3,-1.4 -.8,-2.2 -3.2,-2 -.6,-4 -11.9,-36.8 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "NH");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "NH");
              if (state) handleClick(state);
            }}
            fill={getStateFill("NH", "northeast", hoveredStateId === "NH")}
          />

          {/* New Jersey */}
          <path
            className="nj"
            d="m 842.5,195.4 -14.6,-4.9 -1.8,2.5 .1,2.2 -3,5.4 1.5,1.8 -.7,2 -1,1 .5,3.6 2.7,.9 1,2.8 2.1,1.1 4.2,3.2 -3.3,2.6 -1.6,2.3 -1.8,3 -1.6,.6 -1.4,1.7 -1,2.2 -.3,2.1 .8,.9 .4,2.3 1.2,.6 2.4,1.5 1.8,.8 1.6,.8 .1,1.1 .8,.1 1.1,-1.2 .8,.4 2.1,.2 -.2,2.9 .2,2.5 1.8,-.7 1.5,-3.9 1.6,-4.8 2.9,-2.8 .6,-3.5 -.6,-1.2 1.7,-2.9 v -1.2 l -.7,-1.1 1.2,-2.7 -.3,-3.6 -.6,-8.2 -1.2,-1.4 v 1.4 l .5,.6 h -1.1 l -.6,-.4 -1.3,-.2 -.9,.6 -1.2,-1.6 .7,-1.7 v -1 l 1.7,-.7 .8,-2.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "NJ");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "NJ");
              if (state) handleClick(state);
            }}
            fill={getStateFill("NJ", "northeast", hoveredStateId === "NJ")}
          />

          {/* New Mexico */}
          <path
            className="nm"
            d="m 357.5,332.9 h -.8 l -7.9,99.3 -31.8,-2.6 -34.4,-3.6 -.3,3 2,2.2 -30.8,-4.1 -1.4,10.2 -15.7,-2.2 17.4,-124.1 52.6,6.5 51.7,4.8 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "NM");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "NM");
              if (state) handleClick(state);
            }}
            fill={getStateFill("NM", "west", hoveredStateId === "NM")}
          />

          {/* New York */}
          <path
            className="ny"
            d="m 872.9,181.6 -1.3,.1 -.5,1 z m -30.6,22.7 .7,.6 1.3,-.3 1.1,.3 .9,-1.3 h 1.9 l 2.4,-.9 5.1,-2.1 -.5,-.5 -1.9,.8 -2,.9 .2,-.8 2.6,-1.1 .8,-1 1.2,.1 4.1,-2.3 v .7 l -4.2,3 4.5,-2.8 1.7,-2.2 1.5,-.1 4.5,-3.1 3.2,-3.1 3,-2.3 1,-1.2 -1.7,-.1 -1,1.2 -.2,.7 -.9,.7 -.8,-1.1 -1.7,1 -.1,.9 -.9,-.2 .5,-.9 -1.2,-.7 -.6,.9 .9,.3 .2,.5 -.3,.5 -1.4,2.6 h -1.9 l .9,-1.8 .9,-.6 .3,-1.7 1.4,-1.6 .9,-.8 1.5,-.7 -1.2,-.2 -.7,.9 h -.7 l -1.1,.8 -.2,1 -2.2,2.1 -.4,.9 -1.4,.9 -7.7,1.9 .2,.9 -.9,.7 -2,.3 -1,-.6 -.2,1.1 -1.1,-.4 .1,1 -1.2,-.1 -1.2,.5 -.2,1.1 h -1 l .2,1 h -.7 l .2,1 -1.8,.4 -1.5,2.3 z m -.8,-.4 -1.6,.4 v 1 l -.7,1.6 .6,.7 2.4,-2.3 -.1,-.9 z m -10.1,-95.2 -.6,1.9 1.4,.9 -.4,1.5 .5,3.2 2.2,2.3 -.4,2.2 .6,2 -.4,1 -.3,3.8 3.1,6.7 -.8,1.8 .9,2.2 .9,-1.6 1.9,1.5 3,14.2 -.5,2 1.1,1 -.5,15 .7,1 2.8,16.3 1.8,1.5 -3.5,3.4 1.7,2.2 -1.3,3.3 -1.5,1.7 -1.5,2.3 -.2,-.7 .4,-5.9 -14.6,-4.9 -1.6,-1.1 -1.9,.3 -3,-2.2 -3,-5.8 h -2 l -.4,-1.5 -1.7,-1.1 -70.5,13.9 -.8,-6 4.3,-3.9 .6,-1.7 3.9,-2.5 .6,-2.4 2.3,-2 .8,-1.1 -1.7,-3.3 -1.7,-.5 -1.8,-3 -.2,-3.2 7.6,-3.9 8.2,-1.6 h 4.4 l 3.2,1.6 .9,-.1 1.8,-1.6 3.4,-.7 h 3 l 2.6,-1.3 2.5,-2.6 2.4,-3.1 1.9,-.4 1.1,-.5 .4,-3.2 -1.4,-2.7 -1.2,-.7 2,-1.3 -.1,-1.8 h -1.5 l -2.3,-1.4 -.1,-3.1 6.2,-6.1 .7,-2.4 3.7,-6.3 5.9,-6.4 2.1,-1.7 2.5,.1 20.6,-5.2 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "NY");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "NY");
              if (state) handleClick(state);
            }}
            fill={getStateFill("NY", "northeast", hoveredStateId === "NY")}
          />

          {/* North Carolina */}
          <path
            className="nc"
            d="m 829,300.1 -29.1,6.1 -39.4,7.3 -29.4,3.5 v 5.2 l -1.5,-.1 -1.4,1.2 -2.4,5.2 -2.6,-1.1 -3.5,2.5 -.7,2.1 -1.5,1.2 -.8,-.8 -.1,-1.5 -.8,-.2 -4,3.3 -.6,3.4 -4.7,2.4 -.5,1.2 -3.2,2.6 -3.6,.5 -4.6,3 -.8,4.1 -1.3,.9 -1.5,-.1 -1.4,1.3 -.1,4.9 21.4,-3 4.4,-1.9 1.3,-.1 7.3,-4.3 23.2,-2.2 .4,.5 -.2,1.4 .7,.3 1.2,-1.5 3.3,3 .1,2.6 19.7,-2.8 24.5,17.1 4,-2.2 3,-.7 h 1.7 l 1.1,1.1 .8,-2 .6,-5 1.7,-3.9 5.4,-6.1 4.1,-3.5 5.4,-2.3 2.5,-.4 1.3,.4 .7,1.1 3.3,-6.6 3.3,-5.3 -.7,-.3 -4.4,6.8 -.5,-.8 2,-2.2 -.4,-1.5 -2,-.5 1,1.3 -1.2,.1 -1.2,-1.8 -1.2,2 -1.6,.2 1,-2.7 .7,-1.7 -.2,-2.9 -2.2,-.1 .9,-.9 1.1,.3 2.7,.1 .8,-.5 h 2.3 l 2,-1.9 .2,-3.2 1.3,-1.4 1.2,-.2 1.3,-1 -.5,-3.7 -2.2,-3.8 -2.7,-.2 -.9,1.6 -.5,-1 -2.7,.2 -1.2,.4 -1.9,1.2 -.3,-.4 h -.9 l -1.8,1.2 -2.6,.5 v -1.3 l .8,-1 1,.7 h 1 l 1.7,-2.1 3.7,-1.7 2,-2.2 h 2.4 l .8,1.3 1.7,.8 -.5,-1.5 -.3,-1.6 -2.8,-3.1 -.3,-1.4 -.4,1 -.9,-1.3 z m 7,31 2.7,-2.5 4.6,-3.3 v -3.7 l -.4,-3.1 -1.7,-4.2 1.5,1.4 1,3.2 .4,7.6 -1.7,.4 -3.1,2.4 -3.2,3.2 z m 1.9,-19.3 -.9,-.2 v 1 l 2.5,2.2 -.2,-1.4 z m 2.9,2.1 -1.4,-2.8 -2.2,-3.4 -2.4,-3 -2.2,-4.3 -.8,-.7 2.2,4.3 .3,1.3 3.4,5.5 1.8,2.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "NC");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "NC");
              if (state) handleClick(state);
            }}
            fill={getStateFill("NC", "south", hoveredStateId === "NC")}
          />

          {/* North Dakota */}
          <path
            className="nd"
            d="m 464.7,68.6 -1.1,2.8 .8,1.4 -.3,5.1 -.5,1.1 2.7,9.1 1.3,2.5 .7,14 1,2.7 -.4,5.8 2.9,7.4 .3,5.8 -.1,2.1 -29.5,-.4 -46,-2.1 -39.2,-2.9 5.2,-66.7 44.5,3.4 55.3,1.6 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "ND");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "ND");
              if (state) handleClick(state);
            }}
            fill={getStateFill("ND", "midwest", hoveredStateId === "ND")}
          />

          {/* Ohio */}
          <path
            className="oh"
            d="m 685.7,208.8 1.9,-.4 3,1.3 2.1,.6 .7,.9 h 1 l 1,-1.5 1.3,.8 h 1.5 l -.1,1 -3.1,.5 -2,1.1 1.9,.8 1.6,-1.5 2.4,-.4 2.2,1.5 1.5,-.1 2.5,-1.7 3.6,-2.1 5.2,-.3 4.9,-5.9 3.8,-3.1 9.3,-5.1 4.9,29.9 -2.2,1.2 1.4,2.1 -.1,2.2 .6,2 -1.1,3.4 -.1,5.4 -1,3.6 .5,1.1 -.4,2.2 -1.1,.5 -2,3.3 -1.8,2 h -.6 l -1.8,1.7 -1.3,-1.2 -1.5,1.8 -.3,1.2 h -1.3 l -1.3,2.2 .1,2.1 -1,.5 1.4,1.1 v 1.9 l -1,.2 -.7,.8 -1,.5 -.6,-2.1 -1.6,-.5 -1,2.3 -.3,2.2 -1.1,1.3 1.3,3.6 -1.5,.8 -.4,3.5 h -1.5 l -3.2,1.4 -1.2,-2.1 -3.5,-1.4 -.8,-2.9 -.5,-.8 -3.4,1.8 -.6,1.7 h -.9 l -1.3,.7 -1.2,-.8 -3,-.8 -1.9,.8 v 1 l -2.2,-.2 -1.9,-2.1 -2.3,.2 -4.1,-.7 v -1 l -2.2,-3.4 -2.9,-1.2 -1.9,.8 -2.2,-.1 -1.3,-.5 -6.6,-57.2 21.4,-3.5 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "OH");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "OH");
              if (state) handleClick(state);
            }}
            fill={getStateFill("OH", "midwest", hoveredStateId === "OH")}
          />

          {/* Oklahoma */}
          <path
            className="ok"
            d="m 501.5,398.6 -4.6,-3.8 -2.2,-.9 -.5,1.6 -5.1,.3 -.6,-1.5 -5,2.5 -1.6,-.7 -3.7,.3 -.6,1.7 -3.6,.9 -1.3,-1.2 -1.2,.1 -2,-1.8 -2.1,.7 -2,-.5 -1.8,-2 -2.5,4.2 -1.2,.8 -1,-1.8 .3,-2 -1.2,-.7 -2.3,2.5 -1.7,-1.2 -.1,-1.5 -1.3,.5 -2.6,-1.7 -3,2.6 -2.3,-1.1 .7,-2.1 -2.3,.1 -1.9,-3 -3.5,-1.1 -2,2.3 -2.3,-2.2 -1.4,.4 -2,.1 -3.5,-1.9 -2.3,.1 -1.2,-.7 -.5,-2.9 -2.3,-1.7 -1.1,1.5 -1.4,-1 -1.2,-.4 -1.1,1 -1.5,-.3 -2.5,-3 -2.7,-1.3 1.4,-42.7 -52.6,-3.2 .6,-10.6 16.5,1 67.7,2.9 62,.1 .2,10.8 4.1,24.4 -.7,39 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "OK");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "OK");
              if (state) handleClick(state);
            }}
            fill={getStateFill("OK", "south", hoveredStateId === "OK")}
          />

          {/* Oregon */}
          <path
            className="or"
            d="m 93.9,166.5 47,11.2 8.5,-37.3 2.9,-5.8 .4,-2.1 .8,-.9 -.9,-2 -2.9,-1.2 .2,-4.2 4,-5.8 2.5,-.8 1.6,-2.3 -.1,-1.6 1.8,-1.6 3.2,-5.5 4.2,-4.8 -.5,-3.2 -3.5,-3.1 -1.6,-3.6 -30.3,-7.3 -2.8,1 -5.4,-.9 -1.8,-.9 -1.5,1.2 -3.3,-.4 -4.5,.5 -.9,.7 -4.2,-.4 -.8,-1.6 -1.2,-.2 -4.4,1.3 -1.6,-1.1 -2.2,.8 -.2,-1.8 -2.3,-1.2 -1.5,-.2 -1,-1.1 -3,.3 -1.2,-.8 h -1.2 l -1.2,.9 -5.5,.7 -6.6,-4.2 1.1,-5.6 -.4,-4.1 -3.2,-3.7 -3.7,.1 -.4,-1.1 .4,-1.2 -.7,-.8 -1,.1 -1.1,1.3 -1.5,-.2 -.5,-1.1 -1,-.1 -.7,.6 -2,-1.9 v 4.3 l -1.3,1.3 -1.1,3.5 -.1,2.3 -4.5,12.3 -13.2,31.3 -3.2,4.6 -1.6,-.1 .1,2.1 -5.2,7.1 -.3,3.3 1,1.3 .1,2.4 -1.2,1.1 -1.2,3 .1,5.7 1.2,2.9 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "OR");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "OR");
              if (state) handleClick(state);
            }}
            fill={getStateFill("OR", "west", hoveredStateId === "OR")}
          />

          {/* Pennsylvania */}
          <path
            className="pa"
            d="m 826.3,189.4 -1.9,.3 -3,-2.2 -3,-5.8 h -2 l -.4,-1.5 -1.7,-1.1 -70.5,13.9 -.8,-6 -4.2,3.4 -.9,.1 -2.7,3 -3.3,1.7 4.9,29.9 3.2,19.7 17.4,-2.9 60.5,-11.8 1.2,-2.1 1.5,-1.1 1.6,-.3 1.6,.6 1.4,-1.7 1.6,-.6 1.8,-3 1.6,-2.3 3.3,-2.6 -4.2,-3.2 -2.1,-1.1 -1,-2.8 -2.7,-.9 -.5,-3.6 1,-1 .7,-2 -1.5,-1.8 3,-5.4 -.1,-2.2 1.8,-2.5 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "PA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "PA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("PA", "northeast", hoveredStateId === "PA")}
          />

          {/* Rhode Island */}
          <path
            className="ri"
            d="m 883.2,170.7 -1.3,-1.1 -2.6,-1.3 -.6,-2.2 h -.8 l -.7,-2.6 -6.5,2 3.2,12.3 -.4,1.1 .4,1.8 5.6,-3.6 .1,-3 -.8,-.8 .4,-.6 -.1,-1.3 -.9,-.7 1.2,-.4 -.9,-1.6 1.8,.7 .3,1.4 .7,1.2 -1.4,-.8 1.1,1.7 -.3,1.2 -.6,-1.1 v 2.5 l .6,-.9 .4,.9 1.3,-1.5 -.2,-2.5 1.4,3.1 1,-.9 z m -4.7,12.2 h .9 l .5,-.6 -.8,-1.3 -.7,.7 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "RI");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "RI");
              if (state) handleClick(state);
            }}
            fill={getStateFill("RI", "northeast", hoveredStateId === "RI")}
          />

          {/* South Carolina */}
          <path
            className="sc"
            d="m 772.3,350.2 -19.7,2.8 -.1,-2.6 -3.3,-3 -1.2,1.5 -.7,-.3 .2,-1.4 -.4,-.5 -23.2,2.2 -7.3,4.3 -1.3,.1 -4.4,1.9 -.1,1.9 -1.9,1 -1.4,3.2 .2,1.3 6.1,3.8 2.6,-.3 3.1,4 .4,1.7 4.2,5.1 2.6,1.7 1.4,.2 2.2,1.6 1.1,2.2 2,1.6 1.8,.5 2.7,2.7 .1,1.4 2.6,2.8 5,2.3 3.6,6.7 .3,2.7 3.9,2.1 2.5,4.8 .8,3.1 4.2,.4 .8,-1.5 h .6 l 1.8,-1.5 .5,-2 3.2,-2.1 .3,-2.4 -1.2,-.9 .8,-.7 .8,.4 1.3,-.4 1.8,-2.1 3.8,-1.8 1.6,-2.4 .1,-.7 4.8,-4.4 -.1,-.5 -.9,-.8 1.1,-1.5 h .8 l .4,.5 .7,-.8 h 1.3 l .6,-1.5 2.3,-2.1 -.3,-5.4 .8,-2.3 3.6,-6.2 2.4,-2.2 2.2,-1.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "SC");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "SC");
              if (state) handleClick(state);
            }}
            fill={getStateFill("SC", "south", hoveredStateId === "SC")}
          />

          {/* South Dakota */}
          <path
            className="sd"
            d="m 396.5,125.9 46,2.1 29.5,.4 -.1,2.2 -.9,2 -3.1,1.9 -.3,1.2 1.7,2.5 .4,1.8 2.6,.6 1.5,1.9 -.2,39.5 -2.2,-.1 -.1,1.6 1.3,1.5 -.1,1.1 -1,.5 .4,1.6 1.3,.4 .7,2 -1.7,5.1 -1,4.3 1.3,1.2 .3,1.3 .7,1.7 -1.5,.2 -1.8,-.7 -.9,-2.6 -1.2,-1.3 -6.1,-2.2 -.6,-1.1 -2,-.6 -1.4,.6 -1,-.5 -.9,.4 -.7,-.4 -.9,.4 -.7,-.5 -1,.7 -1.5,-.6 -1.8,2 -1.8,.1 -2.1,-2 -1.7,-.2 -3.4,-3.2 -38,-1.6 -51.1,-3.5 3.9,-43.9 2,-20.7 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "SD");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "SD");
              if (state) handleClick(state);
            }}
            fill={getStateFill("SD", "midwest", hoveredStateId === "SD")}
          />

          {/* Tennessee */}
          <path
            className="tn"
            d="m 620.9,365.1 45.7,-4 22.9,-2.9 .1,-4.9 1.4,-1.3 1.5,.1 1.3,-.9 .8,-4.1 4.6,-3 3.6,-.5 3.2,-2.6 .5,-1.2 4.7,-2.4 .6,-3.4 4,-3.3 .8,.2 .1,1.5 .8,.8 1.5,-1.2 .7,-2.1 3.5,-2.5 2.6,1.1 2.4,-5.2 1.4,-1.2 1.5,.1 0,-5.2 .3,-.7 -4.6,.5 -.2,1 -28.9,3.3 -5.6,1.4 -20.5,1.4 -5.2,.8 -17.4,1 -2.6,.8 -22.6,2 -.7,-.6 h -3.7 l 1.2,3.2 -.6,.9 -23.3,1.5 -.8,1 -.8,-.7 h -1 v 1.3 l .6,1 -.1,1 -1.4,.5 1.4,1.5 -.8,.7 -1.7,-.2 .6,1 1.2,1.1 v .7 l -1.2,.5 -1,2 .1,.6 1.4,1 -.4,.7 h -1.5 v .5 l .9,.9 .1,.8 -1.4,.2 -.5,.8 -1.6,.2 -.9,.9 .6,.9 1.1,-.1 .5,.9 -1.6,1.3 .4,1.5 -2,-.6 -.1,.7 .4,1.1 -.3,1.4 -1.3,-.8 -.8,.8 1.1,.1 .1,1.5 -.6,1 1.1,.9 -.3,1.5 .8,.7 -.7,1 -1.2,-.5 -.9,2.2 -1.6,.7 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "TN");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "TN");
              if (state) handleClick(state);
            }}
            fill={getStateFill("TN", "south", hoveredStateId === "TN")}
          />

          {/* Texas */}
          <path
            className="tx"
            d="m 282.3,429 .3,-3 34.4,3.6 31.8,2.6 7.9,-99.3 .8,0 52.6,3.2 -1.4,42.7 2.7,1.3 2.5,3 1.5,.3 1.1,-1 1.2,.4 1.4,1 1.1,-1.5 2.3,1.7 .5,2.9 1.2,.7 2.3,-.1 3.5,1.9 2,-.1 1.4,-.4 2.3,2.2 2,-2.3 3.5,1.1 1.9,3 2.3,-.1 -.7,2.1 2.3,1.1 3,-2.6 2.6,1.7 1.3,-.5 .1,1.5 1.7,1.2 2.3,-2.5 1.2,.7 -.3,2 1,1.8 1.2,-.8 2.5,-4.2 1.8,2 2,.5 2.1,-.7 2,1.8 1.2,-.1 1.3,1.2 3.6,-.9 .6,-1.7 3.7,-.3 1.6,.7 5,-2.5 .6,1.5 5.1,-.3 .5,-1.6 2.2,.9 4.6,3.8 6.4,1.9 2.6,2.3 2.8,-1.3 3.2,.8 .2,11.9 .5,19.9 .7,3.4 2.6,2.8 .7,5.4 3.8,4.6 .8,4.3 h 1 l -.1,7.3 -3.3,6.4 1.3,2.3 -1.3,1.5 .7,3 -.1,4.3 -2.2,3.5 -.1,.8 -1.7,1.2 1,1.8 1.2,1.1 -3.5,.3 -8.4,3.9 -3.5,1.4 -1.8,1.8 -.7,-.5 2.1,-2.3 1.8,-.7 .5,-.9 -2.9,-.1 -.7,-.8 .8,-2 -.9,-1.8 h -.6 l -2.4,1.3 -1.9,2.6 .3,1.7 3.3,3.4 1.3,.3 v .8 l -2.3,1.6 -4.9,4 -4,3.9 -3.2,1.4 -5,3 -3.7,2 -4.5,1.9 -4.1,2.5 3.2,-3 v -1.1 l .6,-.8 -.2,-1.8 -1.5,-.1 -1.1,1.5 -2.6,1.3 -1.8,-1.2 -.3,-1.7 h -1.5 l .8,2.2 1.4,.7 1.2,.9 1.8,1.6 -.7,.8 -3.9,1.7 -1.7,.1 -1.2,-1.2 -.5,2.1 .5,1.1 -2.7,2 -1.5,.2 -.8,.7 -.4,1.7 -1.8,3.3 -1.6,.7 -1.6,-.6 -1.8,1.1 .3,1.4 1.3,.8 1,.8 -1.8,3.5 -.3,2.8 -1,1.7 -1.4,1 -2.9,.4 1.8,.6 1.9,-.6 -.4,3.2 -1.1,-.1 .2,1.2 .3,1.4 -1.3,.9 v 3.1 l 1.6,1.4 .6,3.1 -.4,2.2 -1,.4 .4,1.5 1.1,.4 .8,1.7 v 2.6 l 1.1,2.1 2.2,2.6 -.1,.7 -2.2,-.2 -1.6,1.4 .2,1.4 -.9,-.3 -1.4,-.2 -3.4,-3.7 -2.3,-.6 h -7.1 l -2.8,-.8 -3.6,-3 -1.7,-1 -2.1,.1 -3.2,-2.6 -5.4,-1.6 v -1.3 l -1.4,-1.8 -.9,-4.7 -1.1,-1.7 -1.7,-1.4 v -1.6 l -1.4,-.6 .6,-2.6 -.3,-2.2 -1.3,-1.4 .7,-3 -.8,-3.2 -1.7,-1.4 h -1.1 l -4,-3.5 .1,-1.9 -.8,-1.7 -.8,-.2 -.9,-2.4 -2,-1.6 -2.9,-2.5 -.2,-2.1 -1,-.7 .2,-1.6 .5,-.7 -1.4,-1.5 .1,-.7 -2,-2.2 .1,-2.1 -2.7,-4.9 -.1,-1.7 -1.8,-3.1 -5.1,-4.8 v -1.1 l -3.3,-1.7 -.1,-1.8 -1.2,-.4 v -.7 l -.8,-.2 -2.1,-2.8 h -.8 l -.7,-.6 -1.3,1.1 h -2.2 l -2.6,-1.1 h -4.6 l -4.2,-2.1 -1.3,1.9 -2.2,-.6 -3.3,1.2 -1.7,2.8 -2,3.2 -1.1,4.4 -1.4,1.2 -1.1,.1 -.9,1.6 -1.3,.6 -.1,1.8 -2.9,.1 -1.8,-1.5 h -1 l -2,-2.9 -3.6,-.5 -1.7,-2.3 -1.3,-.2 -2.1,-.8 -3.4,-3.4 .2,-.8 -1.6,-1.2 -1,-.1 -3.4,-3.1 -.1,-2 -2.3,-4 .2,-1.6 -.7,-1.3 .8,-1.5 -.1,-2.4 -2.6,-4.1 -.6,-4.2 -1.6,-1.6 v -1 l -1.2,-.2 -.7,-1.1 -2.4,-1.7 -.9,-.1 -1.9,-1.6 v -1.1 l -2.9,-1.8 -.6,-2.1 -2.6,-2.3 -3.2,-4.4 -3,-1.3 -2.1,-1.8 .2,-1.2 -1.3,-1.4 -1.7,-3.7 -2.4,-1 z m 174.9,138.3 .8,.1 -.6,-4.8 -3.5,-12.3 -.2,-8.1 4.9,-10.5 6.1,-8.2 7.2,-5.1 v -.7 h -.8 l -2.6,1 -3.6,2.3 -.7,1.5 -8.2,11.6 -2.8,7.9 v 8.8 l 3.6,12 z"
            onMouseMove={(e) => {
              const state = STATE_DATA.find((s) => s.id === "TX");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "TX");
              if (state) handleClick(state);
            }}
            fill={getStateFill("TX", "south", hoveredStateId === "TX")}
          />

          {/* Utah */}
          <path
            className="ut"
            d="m 233.2,217.9 3.3,-21.9 -47.9,-8.2 -21,109 46.2,8.2 40,6 11.5,-88.3 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "UT");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "UT");
              if (state) handleClick(state);
            }}
            fill={getStateFill("UT", "west", hoveredStateId === "UT")}
          />

          {/* Vermont */}
          <path
            className="vt"
            d="m 859.1,102.4 -1.1,3.5 2.1,2.8 -.4,1.7 .1,1.3 -1.1,2.1 -1.4,.4 -.6,1.3 -2.1,1 -.7,1.5 1.4,3.4 -.5,2.5 .5,1.5 -1,1.9 .4,1.9 -1.3,1.9 .2,2.2 -.7,1.1 .7,4.5 .7,1.5 -.5,2.6 .9,1.8 -.2,2.5 -.5,1.3 -.1,1.4 2.1,2.6 -12.4,2.7 -1.1,-1 .5,-2 -3,-14.2 -1.9,-1.5 -.9,1.6 -.9,-2.2 .8,-1.8 -3.1,-6.7 .3,-3.8 .4,-1 -.6,-2 .4,-2.2 -2.2,-2.3 -.5,-3.2 .4,-1.5 -1.4,-.9 .6,-1.9 -.8,-1.7 27.3,-6.9 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "VT");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "VT");
              if (state) handleClick(state);
            }}
            fill={getStateFill("VT", "northeast", hoveredStateId === "VT")}
          />

          {/* Virginia */}
          <path
            className="va"
            d="m 834.7,265.4 -1.1,2.8 .5,1.1 .4,-1.1 .8,-3.1 z m -34.6,-7 -.7,-1 1,-.1 1,-.9 .4,-1.8 -.2,-.5 .1,-.5 -.3,-.7 -.6,-.5 -.4,-.1 -.5,-.4 -.6,-.6 h -1 l -.6,-.1 -.4,-.4 .1,-.5 -1.7,-.6 -.8,.3 -1.2,-.1 -.7,-.7 -.5,-.2 -.2,-.7 .6,-.8 v -.9 l -1.2,-.2 -1,-.9 -.9,.1 -1.6,-.3 -.4,.7 -.4,1.6 -.5,2.3 -10,-5.2 -.2,.9 .9,1.6 -.8,2.3 .1,2.9 -1.2,.8 -.5,2.1 -.9,.8 -1.4,1.8 -.9,.8 -1,2.5 -2.4,-1.1 -2.3,8.5 -1.3,1.6 -2.8,-.5 -1.3,-1.9 -2.3,-.7 -.1,4.7 -1.4,1.7 .4,1.5 -2.1,2.2 .4,1.9 -3.7,6.3 -1,3.3 1.5,1.2 -1.5,1.9 .1,1.4 -2.3,2 -.7,-1.1 -4.3,3.1 -1.5,-1 -.6,1.4 .8,.5 -.5,.9 -5.5,2.4 -3,-1.8 -.8,1.7 -1.9,1.8 -2.3,.1 -4.4,-2.3 -.1,-1.5 -1.5,-.7 .8,-1.2 -.7,-.6 -4.9,6.6 -2.9,1 -3,3 -.4,2.2 -2.1,1.3 -.1,1.7 -1.4,1.4 -1.8,.5 -.5,1.9 -1,.4 -6.9,4.2 28.9,-3.3 .2,-1 4.6,-.5 -.3,.7 29.4,-3.5 39.4,-7.3 29.1,-6.1 -.6,-1.2 .4,-.1 .9,.9 -.1,-1.4 -.3,-1.9 1.6,1.2 .9,2.1 v -1.3 l -3.4,-5.5 v -1.2 l -.7,-.8 -1.3,.7 .5,1.4 h -.8 l -.4,-1 -.6,.9 -.9,-1.1 -2.1,-.1 -.2,.7 1.5,2.1 -1.4,-.7 -.5,-1 -.4,.8 -.8,.1 -1.5,1.7 .3,-1.6 v -1.4 l -1.5,-.7 -1.8,-.5 -.2,-1.7 -.6,-1.3 -.6,1.1 -1.7,-1 -2,.3 .2,-.9 1.5,-.2 .9,.5 1.7,-.8 .9,.4 .5,1 v .7 l 1.9,.4 .3,.9 .9,.4 .9,1.2 1.4,-1.6 h .6 l -.1,-2.1 -1.3,1 -.6,-.9 1.5,-.2 -1.2,-.9 -1.2,.6 -.1,-1.7 -1.7,.2 -2.2,-1.1 -1.8,-2.2 3.6,2.2 .9,.3 1.7,-.8 -1.7,-.9 .6,-.6 -1,-.5 .8,-.2 -.3,-.9 1.1,.9 .4,-.8 .4,1.3 1.2,.8 .6,-.5 -.5,-.6 -.1,-2.5 -1.1,-.1 -1.6,-.8 .9,-1.1 -2,-.1 -.4,-.5 -1.4,.6 -1.4,-.8 -.5,-1.2 -2.1,-1.2 -2.1,-1.8 -2.2,-1.9 3,1.3 .9,1.2 2.1,.7 2.3,2.5 .2,-1.7 .6,1.3 2.3,.5 v -4 l -.8,-1.1 1.1,.4 .1,-1.6 -3.1,-1.4 -1.6,-.2 -1.3,-.2 .3,-1.2 -1.5,-.3 -.1,-.6 h -1.8 l -.2,.8 -.7,-1 h -2.7 l -1,-.4 -.2,-1 -1.2,-.6 -.4,-1.5 -.6,-.4 -.7,1.1 -.9,.2 -.9,.7 h -1.5 l -.9,-1.3 .4,-3.1 .5,-2.4 .6,.5 z m 21.9,11.6 .9,-.1 0,-.6 -.8,.1 z m 7.5,14.2 -1,2.7 1.2,-1.3 z m -1.8,-15.3 .7,.3 -.2,1.9 -.5,-.5 -1.3,1 1,.4 -1.8,4.4 .1,8.1 1.9,3.1 .5,-1.5 .4,-2.7 -.3,-2.3 .7,-.9 -.2,-1.4 1.2,-.6 -.6,-.5 .5,-.7 .8,1.1 -.2,1.1 -.4,3.9 1.1,-2.2 .4,-3.1 .1,-3 -.3,-2 .6,-2.3 1.1,-1.8 .1,-2.2 .3,-.9 -4.6,1.6 -.7,.8 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "VA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "VA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("VA", "south", hoveredStateId === "VA")}
          />

          {/* Washington */}
          <path
            className="wa"
            d="m 161.9,83.6 .7,4 -1.1,4.3 -30.3,-7.3 -2.8,1 -5.4,-.9 -1.8,-.9 -1.5,1.2 -3.3,-.4 -4.5,.5 -.9,.7 -4.2,-.4 -.8,-1.6 -1.2,-.2 -4.4,1.3 -1.6,-1.1 -2.2,.8 -.2,-1.8 -2.3,-1.2 -1.5,-.2 -1,-1.1 -3,.3 -1.2,-.8 h -1.2 l -1.2,.9 -5.5,.7 -6.6,-4.2 1.1,-5.6 -.4,-4.1 -3.2,-3.7 -3.7,.1 -.4,-1.1 .4,-1.2 -.7,-.8 -1,.1 -2.1,-1.5 -1.2,.4 -2,-.1 -.7,-1.5 -1.6,-.3 2.5,-7.5 -.7,6 .5,.5 v -2 l .8,-.2 1.1,2.3 -.5,-2.2 1.2,-4.2 1.8,.4 -1.1,-2 -1,.3 -1.5,-.4 .2,-4.2 .2,1.5 .9,.5 .6,-1.6 h 3.2 l -2.2,-1.2 -1.7,-1.9 -1.4,1.6 1.2,-3.1 -.3,-4.6 -.2,-3.6 .9,-6.1 -.5,-2 -1.4,-2.1 .1,-4 .4,-2.7 2,-2.3 -.7,-1.4 .2,-.6 .9,.1 7.8,7.6 4.7,1.9 5.1,2.5 3.2,-.1 .2,3 1,-1.6 h .7 l .6,2.7 .5,-2.6 1.4,-.2 .5,.7 -1.1,.6 .1,1.6 .7,-1.5 h 1.1 l -.4,2.6 -1.1,-.8 .4,1.4 -.1,1.5 -.8,.7 -2.5,2.9 1.2,-3.4 -1.6,.4 -.4,2.1 -3.8,2.8 -.4,1 -2.1,2.2 -.1,1 h 2.2 l 2.4,-.2 .5,-.9 -3.9,.5 v -.6 l 2.6,-2.8 1.8,-.8 1.9,-.2 1,-1.6 3,-2.3 v -1.4 h 1.1 l .1,4 h -1.5 l -.6,.8 -1.1,-.9 .3,1.1 v 1.7 l -.7,.7 -.3,-1.6 -.8,.8 .7,.6 -.9,1.1 h 1.3 l .7,-.5 .1,2 -1,1.9 -.9,1 -.1,1.8 -1,-.2 -.2,-1.4 .9,-1.1 -.8,-.5 -.8,.7 -.7,2.2 -.8,.9 -.1,-2 .8,-1.1 -.2,-1.1 -1.2,1.2 .1,2.2 -.6,.4 -2.1,-.4 -1.3,1.2 2.2,-.6 -.2,2.2 1,-1.8 .4,1.4 .5,-1 .7,1.8 h .7 l .7,-.8 .6,-.1 2,-1.9 .2,-1.2 .8,.6 .3,.9 .7,-.3 .1,-1.2 h 1.3 l .2,-2.9 -.1,-2.7 .9,.3 -.7,-2.1 1.4,-.8 .2,-2.4 2.3,-2.2 1,.1 .3,-1.4 -1.2,-1.4 -.1,-3.5 -.8,.9 .7,2.9 -.6,.1 -.6,-1.9 -.6,-.5 .3,-2.3 1.8,-.1 .3,.7 .3,-1.6 -1.6,-1.7 -.6,-1.6 -.2,2 .9,1.1 -.7,.4 -1,-.8 -1.8,1.3 1.5,.5 .2,2.4 -.3,1.8 .9,-1.3 1.4,2.3 -.4,1.9 h -1.5 v -1.2 l -1.5,-1.2 .5,-3 -1.9,-2.6 2.7,-3 .6,-4.1 h .9 l 1.4,3.2 v -2.6 l 1.2,.3 v -3.3 l -.9,-.8 -1.2,2.5 -1,-3 1.3,-.1 -1.5,-4.9 1.9,-.6 25.4,7.5 31.7,8 23.6,5.5 z m -78.7,-39.4 h .5 l .1,.8 -.5,.3 .1,.6 -.7,.4 -.2,-.9 .5,-.4 z m 5,-4.3 -1.2,1.9 -.1,.8 .4,.2 .5,-.6 1.1,.1 z m -.4,-21.6 .5,.6 1.3,-.3 .2,-1 1.2,-1.8 -1,-.4 -.7,1.6 -.1,-1.6 -1.1,.2 -.7,1.4 z m 3.2,-5.5 .7,1.5 -.9,.2 -.8,.4 -.2,-2.4 z m -2.7,-1.6 -1.1,-.2 .5,1.4 z m -1,2.5 .8,.4 -.4,1.1 1.7,-.5 -.2,-2.2 -.9,-.2 z m -2.7,-.4 .3,2.7 1.6,1.3 .6,-1.9 -1.1,-2.2 z m 1.9,-1.1 -1.1,-1 -.9,.1 1.8,1.5 z m 3.2,-7 h -1.2 v .8 l 1.2,.6 z m -.9,32.5 .4,-2.7 h -1.1 l -.2,1.9 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "WA");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "WA");
              if (state) handleClick(state);
            }}
            fill={getStateFill("WA", "west", hoveredStateId === "WA")}
          />

          {/* West Virginia */}
          <path
            className="wv"
            d="m 723.4,297.5 -.8,1.2 1.5,.7 .1,1.5 4.4,2.3 2.3,-.1 1.9,-1.8 .8,-1.7 3,1.8 5.5,-2.4 .5,-.9 -.8,-.5 .6,-1.4 1.5,1 4.3,-3.1 .7,1.1 2.3,-2 -.1,-1.4 1.5,-1.9 -1.5,-1.2 1,-3.3 3.7,-6.3 -.4,-1.9 2.1,-2.2 -.4,-1.5 1.4,-1.7 .1,-4.7 2.3,.7 1.3,1.9 2.8,.5 1.3,-1.6 2.3,-8.5 2.4,1.1 1,-2.5 .9,-.8 1.4,-1.8 .9,-.8 .5,-2.1 1.2,-.8 -.1,-2.9 .8,-2.3 -.9,-1.6 .2,-.9 10,5.2 .5,-2.3 .4,-1.6 .4,-.7 -.9,-.4 .2,-1.6 -1,-.5 -.2,-.7 h -.7 l -.8,-1.2 .2,-1 -2.6,.4 -2.2,-1.6 -1.4,.3 -.9,1.4 h -1.3 l -1.7,2.9 -3.3,.4 -1.9,-1 -2.6,3.8 -2.2,-.3 -3.1,3.9 -.9,1.6 -1.8,1.6 -1.7,-11.4 -17.4,2.9 -3.2,-19.7 -2.2,1.2 1.4,2.1 -.1,2.2 .6,2 -1.1,3.4 -.1,5.4 -1,3.6 .5,1.1 -.4,2.2 -1.1,.5 -2,3.3 -1.8,2 h -.6 l -1.8,1.7 -1.3,-1.2 -1.5,1.8 -.3,1.2 h -1.3 l -1.3,2.2 .1,2.1 -1,.5 1.4,1.1 v 1.9 l -1,.2 -.7,.8 -1,.5 -.6,-2.1 -1.6,-.5 -1,2.3 -.3,2.2 -1.1,1.3 1.3,3.6 -1.5,.8 -.4,3.5 h -1.5 l -3.2,1.4 -.1,1.1 .6,1 -.6,3.6 1.9,1.6 .8,1.1 1,.6 -.1,.9 4.4,5.6 h 1.4 l 1.5,1.8 1.2,.3 1.4,-.1 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "WV");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "WV");
              if (state) handleClick(state);
            }}
            fill={getStateFill("WV", "south", hoveredStateId === "WV")}
          />

          {/* Wisconsin */}
          <path
            className="wi"
            d="m 611,144 -2.9,.8 .2,2.3 -2.4,3.4 -.2,3.1 .6,.7 .8,-.7 .5,-1.6 2,-1.1 1.6,-4.2 3.5,-1.1 .8,-3.3 .7,-.9 .4,-2.1 1.8,-1.1 v -1.5 l 1,-.9 1.4,.1 v 2 l -1,.1 .5,1.2 -.7,2.2 -.6,.1 -1.2,4.5 -.7,.5 -2.8,7.2 -.3,4.2 .6,2 .1,1.3 -2.4,1.9 .3,1.9 -.9,3.1 .3,1.6 .4,3.7 -1.1,4.1 -1.5,5 1,1.5 -.3,.3 .8,1.7 -.5,1.1 1.1,.9 v 2.7 l 1.3,1.5 -.4,3 .3,4 -45.9,2.8 -1.3,-2.8 -3.3,-.7 -2.7,-1.5 -2,-5.5 .1,-2.5 1.6,-3.3 -.6,-1.1 -2.1,-1.6 -.2,-2.6 -1.1,-4.5 -.2,-3 -2.2,-3 -2.8,-.7 -5.2,-3.6 -.6,-3.3 -6.3,-3.1 -.2,-1.3 h -3.3 l -2.2,-2.6 -2,-1.3 .7,-5.1 -.9,-1.6 .5,-5.4 1,-1.8 -.3,-2.7 -1.2,-1.3 -1.8,-.3 v -1.7 l 2.8,-5.8 5.9,-3.9 -.4,-13 .9,.4 .6,-.5 .1,-1.1 .9,-.6 1.4,1.2 .7,-.1 h 2.6 l 6.8,-2.6 .3,-1 h 1.2 l .7,-1.2 .4,.8 1.8,-.9 1.8,-1.7 .3,.5 1,-1 2.2,1.6 -.8,1.6 -1.2,1.4 .5,1.5 -1.4,1.6 .4,.9 2.3,-1.1 v -1.4 l 3.3,1.9 1.9,.7 1.9,.7 3,3.8 17,3.8 1.4,1 4,.8 .7,.5 2.8,-.2 4.9,.8 1.4,1.5 -1,1 .8,.8 3.8,.7 1.2,1.2 .1,4.4 -1.3,2.8 2,.1 1,-.8 .9,.8 -1.1,3.1 1,1.6 1.2,.3 z m -49.5,-37.3 -.5,.1 -1.5,1.6 .2,.5 1.5,-.6 v -.6 l .9,-.3 z m 1.6,-1.1 -1,.3 -.2,.7 .9,-.1 z m -1.3,-1.6 -.2,.9 h 1.7 l .6,-.4 .1,-1 z m 2.8,-3 -.3,1.9 1.2,-.5 .1,-1.4 z m 58.3,31.9 -2,.3 -.4,1.3 1.3,1.7 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "WI");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "WI");
              if (state) handleClick(state);
            }}
            fill={getStateFill("WI", "midwest", hoveredStateId === "WI")}
          />

          {/* Wyoming */}
          <path
            className="wy"
            d="m 355.3,143.7 -51,-5.3 -57.3,-7.9 -2,10.7 -8.5,54.8 -3.3,21.9 32.1,4.8 44.9,5.7 37.5,3.4 3.7,-44.2 z"
            onMouseEnter={(e) => {
              const state = STATE_DATA.find((s) => s.id === "WY");
              if (state) handleStateMouseMove(e, state);
            }}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              const state = STATE_DATA.find((s) => s.id === "WY");
              if (state) handleClick(state);
            }}
            fill={getStateFill("WY", "west", hoveredStateId === "WY")}
          />

          {/* District of Columbia */}
          {washingtonDcState && (
            <path
              className="dc"
              d="m 803.5,252 -2.6,-1.8 -1,1.7 .5,.4 .4,.1 .6,.5 .3,.7 -.1,.5 .2,.5 z"
              onMouseEnter={(e) => handleStateMouseMove(e, washingtonDcState)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(washingtonDcState)}
              fill={getStateFill(
                washingtonDcState.id,
                washingtonDcState.group,
                hoveredStateId === washingtonDcState.id,
              )}
            />
          )}
        </g>

        <g className="borders" fill="none">
          <path d="m 687.6,447.4 -48.8,5.1 -.5,2.9 2.5,2.8 1.7,.7 .9,1.2 -.4,7.3 -1.1,.6" />
          <path d="m 666.6,361.1 12.9,45.8 2.9,6.1 1.8,1.9 v 3.2 l 1.7,1 .2,1.1 -2.2,3.8 -.3,3.7 -.5,2.6 2.4,5.7 -.6,6.3 .5,1.4 1.5,1.5 .7,2.2" />
          <path d="m 620.9,365.1 1.3,2 -1.3,67 4.4,33.2" />
          <path d="m 620.9,365.1 45.7,-4" />
          <path d="m 516.7,414.2 52.3,-1.3" />
          <path d="m 591.7,344.9 -11.2,.8 2.8,-5.1 1.7,-1.5 v -2.2 l -1.6,-2.5 -39.8,2 -39.1,.7" />
          <path d="m 569,412.9 1.2,-1.5 .5,-3 -1.5,-2.3 -.5,-2.2 .9,-.7 v -.8 l -1.7,-1.1 -.1,-.7 1.6,-.9 -1.2,-1.1 1.7,-7.1 3.4,-1.6 0,-.8 -1.1,-1.4 2.9,-5.4 h 1.9 l 1.5,-1.2 -.3,-5.2 3.1,-4.5 1.8,-.6 -.5,-3.1" />
          <path d="m 507.9,400.5 .7,-39 -4.1,-24.4" />
          <path d="m 582.6,367.7 1.6,-.7 .9,-2.2 1.2,.5 .7,-1 -.8,-.7 .3,-1.5 -1.1,-.9 .6,-1 -.1,-1.5 -1.1,-.1 .8,-.8 1.3,.8 .3,-1.4 -.4,-1.1 .1,-.7 2,.6 -.4,-1.5 1.6,-1.3 -.5,-.9 -1.1,.1 -.6,-.9 .9,-.9 1.6,-.2 .5,-.8 1.4,-.2 -.1,-.8 -.9,-.9 0,-.5 h 1.5 l .4,-.7 -1.4,-1 -.1,-.6" />
          <path d="m 507.9,400.5 2.6,2.3 2.8,-1.3 3.2,.8 .2,11.9" />
          <path d="m 149,338.1 -.9,2.1 1.3,3.4 1.4,1.8 1.2,5.8 2.3,2.5 .4,1.9 -1.3,1.3 -4.8,1.7 -2.4,3.6 -1.6,7 -2.4,3.2 -1.6,.3 -1.1,6.9 1.1,1.6 1.8,.2 1,1.6 -.8,2.4 -3,2.2 -2.2,-.1" />
          <path d="m 253.8,311 -17.4,124.1" />
          <path d="m 167.6,296.8 -3.4,17.5 -2.4,2.9 h -2 l -1.2,-2.7 -3.7,-1.4 -3.5,.6 -1,13.6 .5,4.9 -.5,2.9 -1.4,3" />
          <path d="m 167.6,296.8 46.2,8.2 40,6" />
          <path d="m 93.9,166.5 -16.4,63.1 1.1,3.5 70.4,105" />
          <path d="m 27.8,147.9 66.1,18.6" />
          <path d="m 379.4,256.3 -4.8,67" />
          <path d="m 347.7,231.8 33.1,2.4 -1.4,22.1" />
          <path d="m 253.8,311 52.6,6.5 51.7,4.8" />
          <path d="m 358.1,322.3 16.5,1" />
          <path d="m 265.3,222.7 -11.5,88.3" />
          <path d="m 265.3,222.7 44.9,5.7 37.5,3.4" />
          <path d="m 843.8,171.3 10.5,-2.4 .5,.7 .9,-.3 0,-.7 14.9,-3.4 .1,.3" />
          <path d="m 846.6,194.7 -1.7,-2.2 3.5,-3.4 -1.8,-1.5 -2.8,-16.3" />
          <path d="m 870.7,165.5 3.2,12.3 -.4,1.1 .4,1.8" />
          <path d="m 801.8,254.6 1.7,-2.6 -2.6,-1.8 -1,1.7" />
          <path d="m 799.9,251.9 .5,.4 .4,.1 .6,.5 .3,.7 -.1,.5 .2,.5" />
          <path d="m 817.9,230.1 7.6,27.1 10.9,-2.3" />
          <path d="m 823.8,227.2 -1,2.2 -.3,2.1" />
          <path d="m 817.9,230.1 1.2,-2.1 1.5,-1.1 1.6,-.3 1.6,.6" />
          <path d="m 687.6,447.4 3.3,6 50.1,-3.3 .6,3.2 1,1.1 2.1,-.6 .5,-4.3 -1.4,-2.1 v -2.5 l 2.2,-1.4 1.7,.9 4,.7 3.6,-.3" />
          <path d="m 689.5,358.2 21.4,-3" />
          <path d="m 710.9,355.2 -.1,1.9 -1.9,1 -1.4,3.2 .2,1.3 6.1,3.8 2.6,-.3 3.1,4 .4,1.7 4.2,5.1 2.6,1.7 1.4,.2 2.2,1.6 1.1,2.2 2,1.6 1.8,.5 2.7,2.7 .1,1.4 2.6,2.8 5,2.3 3.6,6.7 .3,2.7 3.9,2.1 2.5,4.8 .8,3.1 4.2,.4" />
          <path d="m 666.6,361.1 22.9,-2.9" />
          <path d="m 556.8,249.7 .7,-.7 .1,-2.3 -.7,-.9 1,-1.5 1.8,-.6 .9,-.3 1,-1.2 0,-2.4 1.7,-2.4 .5,-.5 .1,-3.5 -.9,-1.4 -1,-.3 -1.1,-1.6 1,-4 3,-.8 h 2.4 l 4.2,-1.8 1.7,-2.2 .1,-2.4 1.1,-1.3 1.3,-3.2 -.1,-2.6 -2.8,-3.5 -1.2,0 -.9,-1.1 .2,-1.6 -1.7,-1.7 -2.5,-1.3 .5,-.6" />
          <path d="m 473.6,182 28.2,0 36.3,-.9 18.6,-.7" />
          <path d="m 484.5,246.8 25.9,.1 27.2,-1.2 14.3,-.8 1.7,1.3 .6,1.6 1.1,1.1 1.5,.8" />
          <path d="m 484.5,246.8 -1.8,-4.4 .7,-2.2 -.8,-3.3 .2,-2.9 -1.3,-.7 -.4,-6.1 -2.8,-5 -.2,-3.7 -2.2,-4.3 -1.3,-3.7 v -1.4 l -.6,-1.7 v -2.3 l -.5,-.9" />
          <path d="m 473.5,204.2 -.7,-1.7 -.3,-1.3 -1.3,-1.2 1,-4.3 1.7,-5.1 -.7,-2 -1.3,-.4 -.4,-1.6 1,-.5 .1,-1.1 -1.3,-1.5 .1,-1.6 2.2,.1" />
          <path d="m 567.2,202 -1.3,-2.8 -3.3,-.7 -2.7,-1.5 -2,-5.5 .1,-2.5 1.6,-3.3 -.6,-1.1 -2.1,-1.6 -.2,-2.6" />
          <path d="m 188.8,30.5 -4.8,22 3.7,7.4 -1.6,4.8 3.6,4.8 1.9,.7 3.9,8.3 v 2.1 l 2.3,3 h .9 l 1.4,2.1 h 3.2 v 1.6 l -7.1,17 -.5,4.1 1.4,.5 1.6,2.6 2.8,-1.4 3.6,-2.4 1.9,1.9 .5,2.5 -.5,3.2 2.5,9.7 2.6,3.5 2.3,1.4 .4,3 v 4.1 l 2.3,2.3 1.6,-2.3 6.9,1.6 2.1,-1.2 9,1.7 2.8,-3.3 1.8,-.6 1.2,1.8 1.6,4.1 .9,.1" />
          <path d="m 140.9,177.7 24.4,5.4 23.3,4.7" />
          <path d="m 140.9,177.7 8.5,-37.3 2.9,-5.8 .4,-2.1 .8,-.9 -.9,-2 -2.9,-1.2 .2,-4.2 4,-5.8 2.5,-.8 1.6,-2.3 -.1,-1.6 1.8,-1.6 3.2,-5.5 4.2,-4.8 -.5,-3.2 -3.5,-3.1 -1.6,-3.6" />
          <path d="m 236.5,196 -47.9,-8.2" />
          <path d="m 174.6,27.5 -12.7,56.1 .7,4 -1.1,4.3" />
          <path d="m 245,141.2 -8.5,54.8" />
          <path d="m 619.4,215.7 4.1,50.2 -1,5.2 v 2 l 2.4,3.5 v .7 l -.3,.9 .9,1.9 -.3,2.4 -1.6,1.8 -1.3,4.2 -3.8,5.3 -.1,7 h -1 l .9,1.9" />
          <path d="m 599.9,322.5 -.3,-1.8 4,-3.7 6.9,3 1.5,-.3 .4,-2.4 -1.7,-1.8 .4,-3.3 1,-.5 1.2,.6 .6,-1.2 3.7,-.6 .1,-.9 -1.5,-2.2 -.1,-1.1 2.2,-2.7 v -.9" />
          <path d="m 599.9,322.5 -2.8,0 -1.4,-1.5 -1.8,-3.8 v -1.9 l .8,-.6 .1,-1.3 -1.7,-1.9 -.9,-2.5 -2.7,-4.1 -4.8,-1.3 -7.4,-7.1 -.4,-2.4 2.8,-7.6 -.4,-1.9 1.2,-1.1 v -1.3 l -2.8,-1.5 -3,-.7 -3.4,1.2 -1.3,-2.3 .6,-1.9 -.7,-2.4 -8.6,-8.4 -2.2,-1.5 -2.5,-5.9 -1.2,-5.4 1.4,-3.7" />
          <path d="m 567.2,202 45.9,-2.8" />
          <path d="m 618.3,302.7 1.1,.8 .6,-1 -.7,-1.7 4.6,-.5 .2,1.2 1.1,.2 .4,-.9 -.6,-1.3 .3,-.8 1.3,.8 1.7,-.4 1.7,.6 3.4,2.1 1.8,-2.8 3.5,-2.2 3,3.3 1.6,-2.1 .3,-2.7 3.8,-2.3 .2,1.3 1.9,1.2 3,-.2 1.2,-.7 .1,-3.4 2.5,-3.7 4.6,-4.4 -.1,-1.7 1.2,-3.8 2.2,1 6.7,-4.5 -.4,-1.7 -1.5,-2.1 1,-1.9" />
          <path d="m 630.9,213.2 32.4,-3.4 .1,1.4" />
          <path d="m 670,268.4 -6.6,-57.2" />
          <path d="m 504.3,326.3 -.5,-48.1 -3.2,-.7 -2.6,-4.7 -2.5,-2.5 .5,-2.3 2.7,-2.6 .1,-1.2 -1.5,-2.1 -.9,1 -2,-.6 -2.9,-3" />
          <path d="m 379.4,256.3 36,2 43.7,1.2 h 32.4" />
          <path d="m 374.6,323.3 67.7,2.9 62,.1" />
          <path d="m 596.7,333.5 1,-2.7 1.4,.9 .7,-.4 1.2,-4.1 -1,-1 1,-2 .2,-.9 -1.3,-.8 m -5.8,11.3 -.7,-.7 .2,-1 h 1.1 l .7,.7 -.3,1" />
          <path d="m 670,268.4 1.3,.5 2.2,.1 1.9,-.8 2.9,1.2 2.2,3.4 v 1 l 4.1,.7 2.3,-.2 1.9,2.1 2.2,.2 v -1 l 1.9,-.8 3,.8 1.2,.8 1.3,-.7 h .9 l .6,-1.7 3.4,-1.8 .5,.8 .8,2.9 3.5,1.4 1.2,2.1" />
          <path d="m 596.7,333.5 23.3,-1.5 .6,-.9 -1.2,-3.2 h 3.7 l .7,.6 22.6,-2 2.6,-.8 17.4,-1 5.2,-.8 20.5,-1.4 5.6,-1.4 m -103.6,12.7 h 1" />
          <path d="m 697.7,321.1 6.9,-4.2 1,-.4 .5,-1.9 1.8,-.5 1.4,-1.4 .1,-1.7 2.1,-1.3 .4,-2.2 3,-3 2.9,-1 4.9,-6.6" />
          <path d="m 709.3,279.4 -.1,1.1 .6,1 -.6,3.6 1.9,1.6 .8,1.1 1,.6 -.1,.9 4.4,5.6 h 1.4 l 1.5,1.8 1.2,.3 1.4,-.1" />
          <path d="m 569,412.9 -.6,1.4 1.6,7.1 1.2,1 -.5,1.7 2.4,2.5 v 3.3 l -2,0 1.8,2.5 -6,8.4 -2.4,4.8 -1.7,11.9 36,-2 -.1,1.4 -1,1.4 -.9,4.6 4.8,6.8 -.3,1.3 1.2,1.8 .6,.7" />
          <path d="m 516.7,414.2 .5,19.9 .7,3.4 2.6,2.8 .7,5.4 3.8,4.6 .8,4.3 h 1 l -.1,7.3 -3.3,6.4 1.3,2.3 -1.3,1.5 .7,3 -.1,4.3 -2.2,3.5 -.1,.8 -1.7,1.2 1,1.8 1.2,1.1" />
          <path d="m 856,152.6 18.4,-3.8 1,-1.5 .3,-1.7 1.9,-.6 .5,-1.1 1.7,-1.1 1.3,.3" />
          <path d="m 843.8,171.3 -.7,-1 .5,-15" />
          <path d="m 870.7,165.5 6.5,-2 .7,2.6 h .8 l .6,2.2 2.6,1.3 1.3,1.1 1.4,3" />
          <path d="m 843.6,155.3 12.4,-2.7" />
          <path d="m 757.4,241.9 60.5,-11.8" />
          <path d="m 822.9,269.3 -.8,.1 m 13.2,-4.3 -.6,.3 m -1.3,.2 -4.6,1.6 -.7,.8 m -28.2,-16.1 -.6,-.6 h -1 l -.6,-.1 -.4,-.4 .1,-.5 -1.7,-.6 -.8,.3 -1.2,-.1 -.7,-.7 -.5,-.2 -.2,-.7 .6,-.8 v -.9 l -1.2,-.2 -1,-.9 -.9,.1 -1.6,-.3 m 11.6,13.5 .3,-.4 -.7,-1 1,-.1 1,-.9 .4,-1.8" />
          <path d="m 757.4,241.9 1.7,11.4 1.8,-1.6 .9,-1.6 3.1,-3.9 2.2,.3 2.6,-3.8 1.9,1 3.3,-.4 1.7,-2.9 h 1.3 l .9,-1.4 1.4,-.3 2.2,1.6 2.6,-.4 -.2,1 .8,1.2 h .7 l .2,.7 1,.5 -.2,1.6 .9,.4" />
          <path d="m 881.9,138.3 -2.3,-1.4 -.8,-2.2 -3.2,-2 -.6,-4 -11.9,-36.8" />
          <path d="m 663.4,211.2 21.4,-3.5" />
          <path d="m 565.6,112.3 1.9,.7 3,3.8 17,3.8 1.4,1 4,.8 .7,.5 2.8,-.2 4.9,.8 1.4,1.5 -1,1 .8,.8 3.8,.7 1.2,1.2 .1,4.4 -1.3,2.8 2,.1 1,-.8 .9,.8 -1.1,3.1 1,1.6 1.2,.3" />
          <path d="m 462.3,61.3 2.4,7.3 -1.1,2.8 .8,1.4 -.3,5.1 -.5,1.1 2.7,9.1 1.3,2.5 .7,14 1,2.7 -.4,5.8 2.9,7.4 .3,5.8 -.1,2.1" />
          <path d="m 473.6,182 .2,-39.5 -1.5,-1.9 -2.6,-.6 -.4,-1.8 -1.7,-2.5 .3,-1.2 3.1,-1.9 .9,-2 .1,-2.2" />
          <path d="m 556.7,180.4 -1.1,-4.5 -.2,-3 -2.2,-3 -2.8,-.7 -5.2,-3.6 -.6,-3.3 -6.3,-3.1 -.2,-1.3 -3.3,0 -2.2,-2.6 -2,-1.3 .7,-5.1 -.9,-1.6 .5,-5.4 1,-1.8 -.3,-2.7 -1.2,-1.3 -1.8,-.3 v -1.7 l 2.8,-5.8 5.9,-3.9 -.4,-13 .9,.4 .6,-.5 .1,-1.1 .9,-.6 1.4,1.2 .7,-.1" />
          <path d="m 491.5,259.5 -3.9,-6.3 -2.1,-3.7 .3,-1.4 -1.3,-1.3" />
          <path d="m 504.3,326.3 .2,10.8" />
          <path d="m 591.7,344.9 1,-2 1.2,-.5 v -.7 l -1.2,-1.1 -.6,-1 1.7,.2 .8,-.7 -1.4,-1.5 1.4,-.5 .1,-1 -.6,-1 0,-1.3 m 1,0 .8,.7 .8,-1" />
          <path d="m 582.6,367.7 38.3,-2.6" />
          <path d="m 362.5,56.3 -5.2,66.7" />
          <path d="m 357.3,123 -2,20.7" />
          <path d="m 355.3,143.7 -51,-5.3 -57.3,-7.9 -2,10.7" />
          <path d="m 710.9,355.2 4.4,-1.9 1.3,-.1 7.3,-4.3 23.2,-2.2 .4,.5 -.2,1.4 .7,.3 1.2,-1.5 3.3,3 .1,2.6 19.7,-2.8 24.5,17.1" />
          <path d="m 731.1,317 0,5.2 -1.5,-.1 -1.4,1.2 -2.4,5.2 -2.6,-1.1 -3.5,2.5 -.7,2.1 -1.5,1.2 -.8,-.8 -.1,-1.5 -.8,-.2 -4,3.3 -.6,3.4 -4.7,2.4 -.5,1.2 -3.2,2.6 -3.6,.5 -4.6,3 -.8,4.1 -1.3,.9 -1.5,-.1 -1.4,1.3 -.1,4.9" />
          <path d="m 731.1,317 29.4,-3.5 39.4,-7.3 29.1,-6.1" />
          <path d="m 357.3,123 39.2,2.9 46,2.1 29.5,.4" />
          <path d="m 351.4,187.6 51.1,3.5 38,1.6 3.4,3.2 1.7,.2 2.1,2 1.8,-.1 1.8,-2 1.5,.6 1,-.7 .7,.5 .9,-.4 .7,.4 .9,-.4 1,.5 1.4,-.6 2,.6 .6,1.1 6.1,2.2 1.2,1.3 .9,2.6 1.8,.7 1.5,-.2" />
          <path d="m 347.7,231.8 3.7,-44.2" />
          <path d="m 857.9,100.1 1.2,2.3 -1.1,3.5 2.1,2.8 -.4,1.7 .1,1.3 -1.1,2.1 -1.4,.4 -.6,1.3 -2.1,1 -.7,1.5 1.4,3.4 -.5,2.5 .5,1.5 -1,1.9 .4,1.9 -1.3,1.9 .2,2.2 -.7,1.1 .7,4.5 .7,1.5 -.5,2.6 .9,1.8 -.2,2.5 -.5,1.3 -.1,1.4 2.1,2.6" />
          <path d="m 827.9,190.5 14.6,4.9 -.4,5.9" />
          <path d="m 823.8,227.2 1.4,-1.7 1.6,-.6 1.8,-3 1.6,-2.3 3.3,-2.6 -4.2,-3.2 -2.1,-1.1 -1,-2.8 -2.7,-.9 -.5,-3.6 1,-1 .7,-2 -1.5,-1.8 3,-5.4 -.1,-2.2 1.8,-2.5" />
          <path d="m 358.1,322.3 -.6,10.6" />
          <path d="m 284.3,431.2 -2,-2.2 .3,-3 34.4,3.6 31.8,2.6 7.9,-99.3 .8,0" />
          <path d="m 93.9,166.5 47,11.2" />
          <path d="m 188.6,187.8 -21,109" />
          <path d="m 827.9,190.5 -1.6,-1.1 -1.9,.3 -3,-2.2 -3,-5.8 h -2 l -.4,-1.5 -1.7,-1.1 -70.5,13.9 -.8,-6" />
          <path d="m 843.6,155.3 -1.1,-1 .5,-2 -3,-14.2 -1.9,-1.5 -.9,1.6 -.9,-2.2 .8,-1.8 -3.1,-6.7 .3,-3.8 .4,-1 -.6,-2 .4,-2.2 -2.2,-2.3 -.5,-3.2 .4,-1.5 -1.4,-.9 .6,-1.9 -.8,-1.7" />
          <path d="m 736.8,225.1 -4.9,-29.9" />
          <path d="m 709.3,279.4 3.2,-1.4 h 1.5 l .4,-3.5 1.5,-.8 -1.3,-3.6 1.1,-1.3 .3,-2.2 1,-2.3 1.6,.5 .6,2.1 1,-.5 .7,-.8 1,-.2 v -1.9 l -1.4,-1.1 1,-.5 -.1,-2.1 1.3,-2.2 h 1.3 l .3,-1.2 1.5,-1.8 1.3,1.2 1.8,-1.7 h .6 l 1.8,-2 2,-3.3 1.1,-.5 .4,-2.2 -.5,-1.1 1,-3.6 .1,-5.4 1.1,-3.4 -.6,-2 .1,-2.2 -1.4,-2.1 2.2,-1.2" />
          <path d="m 357.5,332.9 52.6,3.2 -1.4,42.7 2.7,1.3 2.5,3 1.5,.3 1.1,-1 1.2,.4 1.4,1 1.1,-1.5 2.3,1.7 .5,2.9 1.2,.7 2.3,-.1 3.5,1.9 2,-.1 1.4,-.4 2.3,2.2 2,-2.3 3.5,1.1 1.9,3 2.3,-.1 -.7,2.1 2.3,1.1 3,-2.6 2.6,1.7 1.3,-.5 .1,1.5 1.7,1.2 2.3,-2.5 1.2,.7 -.3,2 1,1.8 1.2,-.8 2.5,-4.2 1.8,2 2,.5 2.1,-.7 2,1.8 1.2,-.1 1.3,1.2 3.6,-.9 .6,-1.7 3.7,-.3 1.6,.7 5,-2.5 .6,1.5 5.1,-.3 .5,-1.6 2.2,.9 4.6,3.8 6.4,1.9" />
          <path d="m 161.5,91.9 -30.3,-7.3 -2.8,1 -5.4,-.9 -1.8,-.9 -1.5,1.2 -3.3,-.4 -4.5,.5 -.9,.7 -4.2,-.4 -.8,-1.6 -1.2,-.2 -4.4,1.3 -1.6,-1.1 -2.2,.8 -.2,-1.8 -2.3,-1.2 -1.5,-.2 -1,-1.1 -3,.3 -1.2,-.8 h -1.2 l -1.2,.9 -5.5,.7 -6.6,-4.2 1.1,-5.6 -.4,-4.1 -3.2,-3.7 -3.7,.1 -.4,-1.1 .4,-1.2 -.7,-.8 -1,.1" />
          <path d="m 736.8,225.1 3.2,19.7 17.4,-2.9" />
          <path d="m 351.4,187.6 3.9,-43.9" />
          <path d="m 697.7,321.1 28.9,-3.3 .2,-1 4.6,-.5 -.3,.7" />
          <path d="m 236.5,196 -3.3,21.9 32.1,4.8" />
          <path d="m 722.7,296.9 .7,.6 -.8,1.2 1.5,.7 .1,1.5 4.4,2.3 2.3,-.1 1.9,-1.8 .8,-1.7 3,1.8 5.5,-2.4 .5,-.9 -.8,-.5 .6,-1.4 1.5,1 4.3,-3.1 .7,1.1 2.3,-2 -.1,-1.4 1.5,-1.9 -1.5,-1.2 1,-3.3 3.7,-6.3 -.4,-1.9 2.1,-2.2 -.4,-1.5 1.4,-1.7 .1,-4.7 2.3,.7 1.3,1.9 2.8,.5 1.3,-1.6 2.3,-8.5 2.4,1.1 1,-2.5 .9,-.8 1.4,-1.8 .9,-.8 .5,-2.1 1.2,-.8 -.1,-2.9 .8,-2.3 -.9,-1.6 .2,-.9 10,5.2 .5,-2.3 .4,-1.6 .4,-.7" />
        </g>

        {washingtonDcState && (
          <>
            <circle
              className="dc-hit-target"
              cx="801.6"
              cy="252.1"
              r="14"
              onMouseEnter={(e) => handleStateMouseMove(e, washingtonDcState)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(washingtonDcState)}
              style={{
                fill: "transparent",
                stroke: "transparent",
                pointerEvents: "all",
              }}
            >
              <title>{washingtonDcState.name}</title>
            </circle>
            <circle
              className="state dccircle dc"
              cx="801.6"
              cy="252.1"
              r="6"
              style={{
                pointerEvents: "none",
                fill: getStateFill(
                  washingtonDcState.id,
                  washingtonDcState.group,
                  hoveredStateId === washingtonDcState.id,
                ),
                stroke: "#FFFFFF",
                strokeWidth: 1,
              }}
            >
              <title>{washingtonDcState.name}</title>
            </circle>
          </>
        )}
      </svg>

      {hoveredState && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
          }}
          aria-label={hoveredState.name}
        >
          <MapPopup
            name={hoveredState.name}
            count={hoveredState.count}
            countLabel={countLabel}
          />
        </div>
      )}
    </div>
  );
};
