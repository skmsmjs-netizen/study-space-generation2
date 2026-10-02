import { useId } from 'react';
import './observatory-place-art.css';

type Place = 'left' | 'right' | 'back' | 'ceiling';
type BookTone = 'cream' | 'clay' | 'moss' | 'slate' | 'wood';

/** A decorative spine has a blank label, never a fabricated title or progress. */
function Book({
  x,
  y,
  w,
  h,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BookTone;
}) {
  return (
    <g transform={`translate(${x} ${y - h})`}>
      <path d={`M0 1h${w}v${h - 1}H0z`} className={`obs-place-book-${tone}`} />
      <path
        d={`M0 1h2v${h - 1}H0zM${w - 1} 1h1v${h - 1}h-1z`}
        className="obs-place-shadow"
        opacity=".4"
      />
      <path
        d={`M3 5h${Math.max(2, w - 6)}v1H3zM3 ${h - 7}h${Math.max(2, w - 6)}v1H3z`}
        className="obs-place-brass"
        opacity=".65"
      />
      <path
        d={`M3 ${Math.floor(h * 0.37)}h${Math.max(2, w - 6)}v${Math.max(4, Math.floor(h * 0.12))}H3z`}
        className="obs-place-paper"
        opacity=".6"
      />
    </g>
  );
}

function PaperStack({ x, y, width = 60 }: { x: number; y: number; width?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M2 3h${width}v12H2z`} className="obs-place-shadow" />
      <path d={`M0 0h${width}v11H0z`} className="obs-place-paper" />
      <path
        d={`M0 3h${width}v1H0zM2 6h${width - 2}v1H2zM0 9h${width}v1H0z`}
        className="obs-place-paper-edge"
      />
      <path d={`M${Math.floor(width * 0.64)} 0h3v11h-3z`} className="obs-place-clay" opacity=".7" />
    </g>
  );
}

function RoomBase({ place, light }: { place: Place; light: string }) {
  return (
    <g className="obs-place-depth-back">
      <path d="M0 0h960v260H0z" className="obs-place-wall" />
      <path d="M0 0h960v5H0zM0 0h24v222H0zM936 0h24v222h-24z" className="obs-place-shadow" />
      <path d="M25 0h2v220h-2M933 0h2v220h-2M27 220h906v2H27" className="obs-place-wall-edge" />
      <path d="M0 222h960v38H0z" className="obs-place-floor" />
      <path
        d="M0 222h960v3H0M0 256h960v4H0M72 237h175v1H72M287 247h237v1H287M634 234h248v1H634M22 248h111v1H22M721 249h190v1H721"
        className="obs-place-shadow"
        opacity=".6"
      />
      <path
        d="M152 224l-28 36h2l28-36M457 224l-3 36h2l3-36M760 224l28 36h2l-28-36M0 242h960v1H0"
        className="obs-place-wood-light"
        opacity=".2"
      />
      <path d="M0 219h960v2H0" className="obs-place-brass" opacity=".22" />
      {place !== 'back' && (
        <path
          d={place === 'left' ? 'M924 0h36v222H763z' : 'M0 0h36l161 222H0z'}
          fill={`url(#${light})`}
          opacity=".18"
        />
      )}
      <path
        d="M64 16h832v1H64M64 17h1v188h-1M895 17h1v188h-1"
        className="obs-place-wall-edge"
        opacity=".25"
      />
    </g>
  );
}

function Bookshelf({ light }: { light: string }) {
  const books: readonly [number, number, number, number, BookTone][] = [
    [125, 104, 16, 58, 'slate'],
    [143, 104, 13, 50, 'cream'],
    [159, 104, 20, 61, 'clay'],
    [182, 104, 11, 48, 'wood'],
    [197, 104, 17, 56, 'moss'],
    [217, 104, 14, 52, 'cream'],
    [299, 104, 18, 48, 'moss'],
    [320, 104, 14, 58, 'wood'],
    [337, 104, 21, 56, 'slate'],
    [362, 104, 12, 51, 'clay'],
    [378, 104, 19, 62, 'cream'],
    [482, 104, 18, 56, 'clay'],
    [503, 104, 13, 61, 'cream'],
    [519, 104, 18, 47, 'slate'],
    [542, 104, 12, 53, 'moss'],
    [558, 104, 22, 61, 'wood'],
    [125, 184, 21, 57, 'wood'],
    [149, 184, 13, 51, 'clay'],
    [166, 184, 16, 62, 'cream'],
    [304, 184, 15, 55, 'slate'],
    [322, 184, 21, 62, 'moss'],
    [347, 184, 11, 51, 'cream'],
    [494, 184, 19, 57, 'cream'],
    [516, 184, 12, 63, 'slate'],
    [532, 184, 17, 58, 'clay'],
  ];
  return (
    <>
      <g className="obs-place-depth-mid obs-place-shelving">
        <path d="M98 26h522v188H98z" className="obs-place-shadow" />
        <path d="M104 23h512v191H104z" className="obs-place-wood" />
        <path
          d="M116 36h153v148H116zM285 36h153v148H285zM454 36h148v148H454z"
          className="obs-place-recess"
        />
        <path
          d="M118 38h149v3H118M287 38h149v3H287M456 38h144v3H456M116 109h153v7H116M285 109h153v7H285M454 109h148v7H454"
          className="obs-place-shadow"
        />
        {books.map(([x, y, w, h, tone]) => (
          <Book key={`${x}:${y}`} x={x} y={y} w={w} h={h} tone={tone} />
        ))}
        <g transform="translate(233 105) rotate(-11)">
          <Book x={0} y={0} w={15} h={49} tone="clay" />
        </g>
        <PaperStack x={189} y={173} width={61} />
        <PaperStack x={193} y={163} width={56} />
        <PaperStack x={366} y={173} width={55} />
        <PaperStack x={564} y={174} width={27} />
        <path
          d="M104 23h512v4H104M110 27h2v178h-2M274 29h2v154h-2M443 29h2v154h-2M609 27h2v178h-2M104 104h512v4H104M104 184h512v4H104"
          className="obs-place-wood-light"
        />
        <path
          d="M110 191h158v17H110M284 191h154v17H284M454 191h154v17H454"
          className="obs-place-recess"
        />
        <path d="M179 198h24v3h-24M349 198h24v3h-24M519 198h24v3h-24" className="obs-place-brass" />
        <path
          d="M106 212h510v4H106M116 216h13v8h-13M591 216h13v8h-13"
          className="obs-place-shadow"
        />
        <path
          d="M274 56h1v21h-1M445 136h1v27h-1M111 125h1v32h-1M611 76h1v14h-1M121 186h76v1h-76M390 106h37v1h-37"
          className="obs-place-grain"
        />
        <path d="M161 47v53M519 45v55M167 126v54" className="obs-place-spine-scan" />
        <g className="obs-place-page-edge">
          <path
            d="M190 163h58v.7h-58M191 167h57v.6h-57M190 170h59v.6h-59"
            className="obs-place-paper"
          />
        </g>
        <g className="obs-place-detail-near">
          <path
            d={books
              .map(
                ([x, y, w, h]) =>
                  `M${x + w - 3} ${y - h + 9}v${h - 20}M${x + 3} ${y - h + 9}h${Math.max(2, w - 7)}M${x + 3} ${y - 11}h${Math.max(2, w - 7)}`,
              )
              .join('')}
            className="obs-place-detail-line"
          />
          <path
            d="M278 41v9m0 31v22m0 24v37M447 49v19m0 32v14m0 35v23M113 115v9m0 25v19M603 53v19m0 36v27M132 26h87m107 0h42m63 0h43M176 187h56m132 0h38m114 0h35"
            className="obs-place-detail-grain"
          />
          <path
            d="M194 166h4m6 0h11m10 0h6M192 175h6m7 0h8m12 0h14M370 176h6m9 0h5m7 0h11M369 179h11m8 0h7"
            className="obs-place-fiber"
          />
          <path
            d="M183 199h15M353 199h15M523 199h15M272 108h3m-1.5-1.5v3M441 108h3m-1.5-1.5v3M608 186h3m-1.5-1.5v3"
            className="obs-place-detail-line"
          />
        </g>
      </g>
      <g className="obs-place-depth-front obs-place-reading-nook">
        <path
          d="M673 120h176v7H673M688 128h9v94h-9M829 128h9v94h-9M698 186h130v5H698"
          className="obs-place-wood"
        />
        <path
          d="M669 116h184v5H669M681 127h8v91h-8M838 127h8v91h-8"
          className="obs-place-wood-light"
        />
        <path
          d="M671 125h180v3H671M675 122h55v1h-55M803 118h34v1h-34"
          className="obs-place-grain"
        />
        <PaperStack x={691} y={103} width={65} />
        <path d="M720 108h29v1h-29M735 106h1v8h-1" className="obs-place-paper-edge" />
        <path d="M794 80h30l32 39h-93z" fill={`url(#${light})`} className="obs-place-lamp-wash" />
        <path d="M805 76h4v34h-4M797 110h22v2h-22M792 112h32v4h-32" className="obs-place-brass" />
        <path d="M802 53h11v3h5v6h5v8h6v7h-45v-7h6v-8h5v-6h7z" className="obs-place-moss" />
        <path
          d="M786 76h41v2h-41M797 60h2v8h-2M803 56h8v1h-8M793 113h27v1h-27"
          className="obs-place-brass"
        />
        <path d="M790 78h33v2h-33M804 81h7v2h-7" className="obs-place-light" />
        <path d="M698 152h78v39h-78z" className="obs-place-recess" />
        <path d="M702 155h71v30h-71z" className="obs-place-wood-light" />
        <path d="M727 166h23v9h-23z" className="obs-place-paper" opacity=".65" />
        <path d="M773 155h3v32h-74v-2h71z" className="obs-place-shadow" />
        <g className="obs-place-detail-near">
          <path
            d="M693 106h6m8 0h17m9 0h9M694 111h14m9 0h7m10 0h14M705 159h13m17 0h24M702 178h6m6 0h18"
            className="obs-place-fiber"
          />
          <path
            d="M807 87v13M797 73h20M803 57v6M798 114h12M707 120h17m61 0h24"
            className="obs-place-detail-line"
          />
        </g>
      </g>
    </>
  );
}

function PlanningWall() {
  return (
    <>
      <g className="obs-place-depth-mid obs-place-notice-board">
        <path d="M126 25h706v177H126z" className="obs-place-shadow" />
        <path d="M120 20h712v178H120z" className="obs-place-wood" />
        <path d="M129 29h694v157H129z" className="obs-place-cork" />
        <path
          d="M120 20h712v3H120M120 23h3v175h-3M130 187h693v3H130"
          className="obs-place-wood-light"
        />
        <path
          d="M141 43h2v2h-2M292 37h2v2h-2M422 151h2v2h-2M681 165h2v2h-2M803 117h2v2h-2M610 37h2v2h-2M435 56h2v2h-2M305 176h2v2h-2M140 128h2v2h-2M781 43h2v2h-2M519 174h2v2h-2"
          className="obs-place-brass"
          opacity=".28"
        />
        <path
          d="M159 51h121v111H159zM318 55h87v61h-87M336 135h94v44h-94M471 70h74v75h-74M582 42h73v50h-73M603 113h91v58h-91M717 62h76v93h-76"
          className="obs-place-shadow"
          opacity=".4"
        />
        <g className="obs-place-calendar-sheet">
          <path d="M156 47h121v111H156z" className="obs-place-paper" />
          <path d="M156 47h121v16H156z" className="obs-place-clay" />
          <path
            d="M170 42h3v10h-3M190 42h3v10h-3M239 42h3v10h-3M259 42h3v10h-3"
            className="obs-place-brass"
          />
          <path
            d="M166 78h101v1H166M166 95h101v1H166M166 112h101v1H166M166 129h101v1H166M166 146h101v1H166M166 78h1v69h-1M186 78h1v69h-1M206 78h1v69h-1M226 78h1v69h-1M246 78h1v69h-1M266 78h1v69h-1"
            className="obs-place-paper-edge"
          />
          <path
            d="M165 69h16v2h-16M190 69h10v2h-10M274 62h3v96h-3"
            className="obs-place-paper-edge"
            opacity=".6"
          />
        </g>
        <path
          d="M364 78l143 31 109-48M508 109l138 29 107-30M378 149l130-40M617 61l29 77"
          className="obs-place-string"
        />
        <g transform="rotate(-3 360 82)">
          <g className="obs-place-paper-flutter">
            <path d="M314 50h88v62h-88z" className="obs-place-paper" />
            <path
              d="M328 66h53v1h-53M328 72h47v1h-47M328 78h56v1h-56M328 84h34v1h-34M328 96h18v2h-18"
              className="obs-place-paper-edge"
            />
            <path
              d="M398 51h4v61h-4M314 108h84v4h-84"
              className="obs-place-paper-edge"
              opacity=".35"
            />
          </g>
        </g>
        <path
          d="M331 132h95v45h-95zM468 65h74v76h-74zM579 38h74v49h-74zM599 109h92v57h-92zM713 57h77v95h-77z"
          className="obs-place-paper"
        />
        <path
          d="M343 145h27v1h-27M343 152h66v1h-66M343 158h55v1h-55M343 166h36v1h-36M481 80h47v1h-47M481 86h30v1h-30M592 51h45v1h-45M592 58h34v1h-34M592 65h43v1h-43M611 124h60v1h-60M611 131h45v1h-45M611 147h57v1h-57"
          className="obs-place-paper-edge"
        />
        <path d="M483 99h46v24h-46zM718 61h3v85h-3" className="obs-place-paper-edge" opacity=".5" />
        <path
          d="M488 103h36v15h-36zM726 75h21v19h-21M756 75h21v19h-21M726 104h51v24h-51"
          className="obs-place-paper-subtle"
        />
        <path
          d="M748 86h7v1h-7M751 87h1v15h-1M501 98h1v5h-1"
          className="obs-place-ink"
          opacity=".5"
        />
        <path
          d="M355 48h5v5h-5M502 64h5v5h-5M612 37h5v5h-5M642 108h5v5h-5M752 56h5v5h-5M374 131h5v5h-5"
          className="obs-place-brass"
        />
        <path
          d="M355 48h2v2h-2M502 64h2v2h-2M612 37h2v2h-2M642 108h2v2h-2M752 56h2v2h-2M374 131h2v2h-2"
          className="obs-place-light"
        />
        <path
          d="M148 182h130v3H148M439 182h99v3h-99M750 182h48v3h-48"
          className="obs-place-wood-light"
        />
        <path
          d="M402 87l65 14M541 91l39-20M541 116l58 13M691 121l22-9M426 135l41-17"
          className="obs-place-pin-travel"
        />
        <g className="obs-place-detail-near">
          <path
            d="M166 55h7m10 0h5m24 0h6M161 153h8m9 0h13m17 0h8m17 0h18M335 137h7m10 0h11m21 0h6M480 69h6m8 0h8m13 0h11M595 83h6m9 0h13m7 0h10M605 161h10m9 0h4m21 0h10M776 91v7m0 12v6m0 13v8"
            className="obs-place-fiber"
          />
          <path
            d="M355.5 50h3m-1.5-1.5v3M502.5 66h3m-1.5-1.5v3M612.5 39h3m-1.5-1.5v3M642.5 110h3m-1.5-1.5v3M752.5 58h3m-1.5-1.5v3M374.5 133h3m-1.5-1.5v3"
            className="obs-place-detail-line"
          />
          <path
            d="M135 52h2m2 16h2m-8 52h2m7 25h2M289 76h2m8 37h2m-13 30h2M448 38h2m-5 128h2m7-13h2M665 44h2m17 46h2m11 84h2M805 38h2m5 111h2"
            className="obs-place-detail-grain"
          />
        </g>
      </g>
      <g className="obs-place-depth-front">
        <path
          d="M114 202h731v7H114M126 209h12v14h-12M820 209h12v14h-12"
          className="obs-place-wood"
        />
        <path d="M111 200h738v2H111M124 207h681v1H124" className="obs-place-wood-light" />
        <PaperStack x={164} y={188} width={71} />
        <path d="M742 193h52v7h-52M738 190h56v3h-56" className="obs-place-slate" />
        <path d="M746 194h45v4h-45" className="obs-place-paper" />
        <path d="M777 187h39v2h-39M810 185h5v7h-5" className="obs-place-brass" />
        <g className="obs-place-detail-near">
          <path
            d="M169 191h5m6 0h10m8 0h7m8 0h11M166 198h11m9 0h9m7 0h18M751 196h31"
            className="obs-place-fiber"
          />
          <path d="M779 187.5h29M134 201h65m405 0h38" className="obs-place-detail-line" />
        </g>
      </g>
    </>
  );
}

function ResearchBench({ light }: { light: string }) {
  return (
    <>
      <g className="obs-place-depth-mid obs-place-instrument-rack">
        <path d="M260 42h477v74H260z" className="obs-place-recess" />
        <path
          d="M256 38h485v5H256M267 44h2v56h-2M730 44h2v56h-2M256 101h485v6H256"
          className="obs-place-wood"
        />
        <path d="M256 38h485v1H256M257 101h482v1H257" className="obs-place-wood-light" />
        <Book x={285} y={101} w={17} h={47} tone="slate" />
        <Book x={305} y={101} w={11} h={42} tone="clay" />
        <Book x={319} y={101} w={18} h={48} tone="cream" />
        <path d="M365 84h102v17H365zM373 80h86v4h-86" className="obs-place-slate" />
        <path d="M372 88h18v8h-18M401 88h18v8h-18M430 88h26v8h-26" className="obs-place-ink" />
        <path d="M378 90h4v4h-4M407 90h4v4h-4M436 91h14v1h-14" className="obs-place-brass" />
        <path d="M507 61h28v40h-28zM546 67h23v34h-23z" className="obs-place-glass" />
        <path
          d="M507 60h28v4h-28M546 65h23v4h-23M510 94h22v2h-22M549 94h17v2h-17"
          className="obs-place-brass"
        />
        <path d="M511 68h2v20h-2M550 73h2v14h-2" className="obs-place-light" opacity=".5" />
        <PaperStack x={607} y={89} width={89} />
        <path d="M704 50h14v3h-14M710 53h2v5h-2" className="obs-place-brass" />
        <g className="obs-place-pendulum">
          <path
            d="M710 56h1v26h-1M706 82h9v3h3v8h-3v3h-9v-3h-3v-8h3z"
            className="obs-place-brass"
          />
          <path d="M707 84h5v1h-5M705 87h1v4h-1" className="obs-place-light" />
        </g>
        <g className="obs-place-detail-near">
          <path
            d="M514 73h5m-5 5h3m-3 5h5m-5 5h3M553 78h5m-5 5h3m-3 5h5M285 58h11M321 61h10M609 93h6m9 0h7m12 0h18m11 0h8M610 98h16m10 0h4"
            className="obs-place-detail-line"
          />
        </g>
      </g>
      <g className="obs-place-depth-front">
        <path d="M124 176h724l18 13H107z" className="obs-place-wood-light" />
        <path
          d="M107 189h759v12H107M127 201h18v22h-18M827 201h18v22h-18"
          className="obs-place-wood"
        />
        <path
          d="M109 190h754v2H109M146 201h680v4H146M843 200h3v23h-3M140 201h4v22h-4"
          className="obs-place-shadow"
        />
        <path d="M224 203h233v15H224zM470 203h233v15H470z" className="obs-place-recess" />
        <path
          d="M322 207h29v3h-29M570 207h29v3h-29M118 180h70v1h-70M708 185h98v1h-98"
          className="obs-place-brass"
          opacity=".7"
        />
        <g className="obs-place-open-notebook">
          <path d="M370 154l67-8 52 2 46 32-86 9-75-8z" className="obs-place-shadow" />
          <path d="M374 152l62-7 14 10 39-5 42 28-83 8-70-8z" className="obs-place-clay" />
          <path
            d="M377 151l58-6 13 10v28l-67-8zM450 155l39-6 40 27-79 7z"
            className="obs-place-paper"
          />
          <path
            d="M389 157l42-4 .2 1-42 4zM390 161l37-3 .2 1-37 3zM392 166l43-2 .1 1-43 2zM394 171l29-1v1l-29 1zM462 159l21-3 .3 1-21 3zM463 164l31-3 .2 1-31 3zM465 170l37-2 .1 1-37 2z"
            className="obs-place-paper-edge"
          />
          <path
            d="M447 155h2v28h-2M381 177l66 8v1l-66-8zM451 185l77-8v1l-77 8z"
            className="obs-place-paper-edge"
          />
          <path d="M539 153l3-1 22 24-1 4-4-2z" className="obs-place-brass" />
          <path d="M559 177l4 3v-4z" className="obs-place-ink" />
        </g>
        <g className="obs-place-meter">
          <path
            d="M601 133h105v42H601zM607 175h5v5h-5M696 175h5v5h-5"
            className="obs-place-shadow"
          />
          <path d="M597 128h105v46H597z" className="obs-place-slate" />
          <path d="M603 134h57v27h-57z" className="obs-place-paper" />
          <path
            d="M608 155v-4h3v-5h4v-4h32v4h4v5h3v4h-2v-4h-3v-4h-4v-3h-28v3h-4v4h-3v4z"
            className="obs-place-paper-edge"
          />
          <path
            d="M630 154l9-9 1 1-9 9zM629 154h3v3h-3"
            className="obs-place-ink obs-place-meter-needle"
          />
          <path d="M678 139h11v3h3v11h-3v3h-11v-3h-3v-11h3z" className="obs-place-brass" />
          <path
            d="M681 139h2v8h-2M606 168h29v1h-29M645 168h17v1h-17"
            className="obs-place-shadow"
          />
          <path d="M697 128h5v46h-5M597 171h100v3H597" className="obs-place-shadow" opacity=".3" />
        </g>
        <g className="obs-place-glass-lamp">
          <path d="M223 99h44l54 88H171z" fill={`url(#${light})`} className="obs-place-lamp-wash" />
          <path d="M222 167h41v5h8v9h-57v-9h8M239 110h7v57h-7" className="obs-place-brass" />
          <path d="M234 78h17v3h6v8h4v33h-4v6h-28v-6h-4V89h4v-8h5z" className="obs-place-glass" />
          <path
            d="M231 85h2v28h-2M235 81h13v1h-13M255 94h2v20h-2"
            className="obs-place-light"
            opacity=".55"
          />
          <path d="M239 94h7v26h-7M235 120h15v2h-15" className="obs-place-light" />
          <path
            d="M234 76h17v4h-17M227 125h32v4h-32M237 132h11v4h-11M220 174h45v1h-45"
            className="obs-place-brass"
          />
          <path d="M217 180h52v2h-52M249 135h2v30h-2" className="obs-place-shadow" />
        </g>
        <PaperStack x={740} y={168} width={57} />
        <path
          d="M777 147h20v20h-20M797 151h7v11h-7v-3h4v-5h-4"
          className="obs-place-paper-subtle"
        />
        <path d="M779 148h16v3h-16" className="obs-place-ink" />
        <g className="obs-place-tea-steam">
          <path d="M783 143v-4h-2v-6h2v-5h-1v-4" />
          <path d="M790 143v-5h2v-5h-2v-6" className="obs-place-steam-second" />
        </g>
        <path d="M280 179h34v2h-34M283 180h2v6h-2M309 180h2v6h-2" className="obs-place-brass" />
        <g className="obs-place-detail-near">
          <path
            d="M449 157v22M450 160l3-1m-3 5l3-1m-3 5l3-1m-3 5l3-1M385 173h6m9 0h4m11 0h7M476 178h8m10-2h6M743 172h6m8 0h7m8 0h9M744 177h16m8 0h15"
            className="obs-place-fiber"
          />
          <path
            d="M610 149l2 1m3-7l1 2m8-5v2m8-2v2m8-2v2m7 2l-1 2m6 4l-2 1M601 131h2m-1-1v2M696 168h2m-1-1v2M678 146h2m8 0h2M232 99h5m-5 5h3m-3 5h5M250 91v14m0 4v4"
            className="obs-place-detail-line"
          />
          <path
            d="M141 183h37m38 0h19m14 0h55M580 181h16m119 5h21m45 0h39M157 193h19m66 0h27m459 0h30"
            className="obs-place-detail-grain"
          />
        </g>
      </g>
    </>
  );
}

function Ceiling({ light }: { light: string }) {
  return (
    <g className="obs-place-ceiling">
      <g className="obs-place-depth-back">
        <path d="M0 0h960v260H0z" className="obs-place-wall" />
        <path
          d="M0 0h960v10H0M0 250h960v10H0M0 0h22v260H0M938 0h22v260h-22"
          className="obs-place-shadow"
        />
        <path
          d="M22 10h916v5H22M22 245h916v5H22M22 15h5v230h-5M933 15h5v230h-5"
          className="obs-place-wood-light"
          opacity=".45"
        />
        <path
          d="M268 22h424v8h82v14h57v20h39v24h22v83h-22v24h-39v20h-57v14h-82v9H268v-9h-82v-14h-57v-20H90v-24H68V88h22V64h39V44h57V30h82z"
          className="obs-place-recess"
        />
        <path
          d="M273 29h414v8h79v13h56v19h37v23h20v74h-20v23h-37v19h-56v13h-79v9H273v-9h-79v-13h-56v-19h-37v-23H81V92h20V69h37V50h56V37h79z"
          className="obs-place-floor"
        />
        <path
          d="M324 50h312v7h62v10h45v15h32v18h17v58h-17v18h-32v15h-45v10h-62v8H324v-8h-62v-10h-45v-15h-32v-18h-17v-58h17V82h32V67h45V57h62z"
          className="obs-place-wall"
        />
      </g>
      <g className="obs-place-depth-mid">
        <path
          d="M0 0h45l397 106-2 7L0 17zM915 0h45v17L520 113l-2-7zM0 243l440-96 2 7L45 260H0zM518 154l2-7 440 96v17h-45zM468 0h24l-5 92h-14zM473 168h14l5 92h-24zM0 121h411v16H0zM549 121h411v16H549z"
          className="obs-place-wood"
        />
        <path
          d="M30 7l411 104-1 2L25 9zM928 7l-409 104 1 2L934 9zM29 252l411-103 1 2L34 254zM519 149l413 103-5 2-409-103zM473 12h2v76h-2M485 172h2v75h-2M28 122h369v2H28M563 134h368v2H563"
          className="obs-place-wood-light"
        />
        <path
          d="M360 64h38v1h-38M587 194h43v1h-43M235 83h24v1h-24M704 176h29v1h-29M338 214h31v1h-31M617 43h21v1h-21"
          className="obs-place-grain"
        />
        <path d="M44 38h23v39H44zM893 182h23v39h-23z" className="obs-place-recess" />
        <path
          d="M48 43h15v2H48M48 49h15v2H48M48 55h15v2H48M48 61h15v2H48M48 67h15v2H48M897 188h15v2h-15M897 194h15v2h-15M897 200h15v2h-15M897 206h15v2h-15M897 212h15v2h-15"
          className="obs-place-wood-light"
          opacity=".55"
        />
        <path
          d="M117 124h3v3h-3M840 130h3v3h-3M478 45h3v3h-3M478 209h3v3h-3"
          className="obs-place-light"
          opacity=".65"
        />
        <g className="obs-place-detail-near">
          <path
            d="M108 30l64 16m11 3l14 3M747 46l39-10m9-2l11-3M131 226l72-19m530 2l41 11M477 24v29m0 7v6M43 127h42m14 0h8M791 129h32m13 0h58"
            className="obs-place-detail-grain"
          />
          <path
            d="M115 125h7m-3.5-3.5v7M838 131h7m-3.5-3.5v7M476 46h7m-3.5-3.5v7M476 210h7m-3.5-3.5v7M189 52h3m-1.5-1.5v3M769 207h3m-1.5-1.5v3"
            className="obs-place-detail-line"
          />
        </g>
      </g>
      <g className="obs-place-depth-front">
        <ellipse
          cx="480"
          cy="130"
          rx="185"
          ry="107"
          fill={`url(#${light}-halo)`}
          className="obs-place-ceiling-wash"
        />
        <path
          d="M450 81h60v5h22v9h17v15h8v39h-8v15h-17v9h-22v5h-60v-5h-22v-9h-17v-15h-8v-39h8V95h17v-9h22z"
          className="obs-place-shadow"
        />
        <path
          d="M453 81h54v5h22v9h16v15h8v34h-8v15h-16v9h-22v5h-54v-5h-22v-9h-16v-15h-8v-34h8V95h16v-9h22z"
          className="obs-place-brass"
        />
        <path
          d="M455 86h50v5h21v9h15v13h7v28h-7v13h-15v9h-21v5h-50v-5h-21v-9h-15v-13h-7v-28h7v-13h15v-9h21z"
          className="obs-place-wood"
        />
        <path
          d="M459 92h42v4h20v9h14v12h6v20h-6v12h-14v9h-20v4h-42v-4h-20v-9h-14v-12h-6v-20h6v-12h14v-9h20z"
          className="obs-place-brass"
          opacity=".7"
        />
        <path
          d="M462 98h36v4h19v8h12v11h5v12h-5v11h-12v8h-19v4h-36v-4h-19v-8h-12v-11h-5v-12h5v-11h12v-8h19z"
          className="obs-place-glass"
        />
        <path
          d="M466 103h28v4h18v7h11v10h5v6h-5v10h-11v7h-18v4h-28v-4h-18v-7h-11v-10h-5v-6h5v-10h11v-7h18z"
          className="obs-place-light"
          opacity=".62"
        />
        <path
          d="M468 110h24v4h15v7h9v13h-9v7h-15v4h-24v-4h-15v-7h-9v-13h9v-7h15z"
          className="obs-place-light"
          opacity=".65"
        />
        <path
          d="M479 95h2v22h-2M479 137h2v22h-2M431 126h34v2h-34M495 126h34v2h-34M443 103l25 17-1 2-25-17zM491 134l26 17-1 2-26-17zM517 103l1 2-26 17-1-2zM467 134l1 2-25 17-1-2z"
          className="obs-place-brass"
        />
        <path d="M472 118h16v3h4v13h-4v3h-16v-3h-4v-13h4z" className="obs-place-wood" />
        <path d="M476 122h8v11h-8z" className="obs-place-brass" />
        <path
          d="M452 85h2v2h-2M506 85h2v2h-2M411 112h2v2h-2M547 112h2v2h-2M452 167h2v2h-2M506 167h2v2h-2"
          className="obs-place-light"
          opacity=".65"
        />
        <g transform="translate(480 127) scale(1 .62)">
          <g className="obs-place-ceiling-ring">
            <path
              d="M-16-47h-13v6h-10v9h-6v11h-3v27h3v11h6M16 47h13v-6h10v-9h6v-11h3v-27h-3v-11h-6"
              className="obs-place-ring-line"
            />
            <path d="M-42-25h3v2h-3M40 25h3v2h-3" className="obs-place-light" />
          </g>
        </g>
        <path
          d="M455 88h20v1h-20M424 103h1v13h-1M522 156h11v1h-11M484 165h18v1h-18"
          className="obs-place-light obs-place-metal-reflection"
        />
        <g className="obs-place-detail-near">
          <path
            d="M451.5 85.5h3m-1.5-1.5v3M505.5 85.5h3m-1.5-1.5v3M410.5 112.5h3m-1.5-1.5v3M546.5 112.5h3m-1.5-1.5v3M451.5 167.5h3m-1.5-1.5v3M505.5 167.5h3m-1.5-1.5v3"
            className="obs-place-detail-grain"
          />
          <path
            d="M466 106h27M449 115h13m39 0h10M438 125h6m72 0h8M455 143h12m22 0h16M478 124h4m-2-2v7"
            className="obs-place-detail-line"
          />
          <path
            d="M458 89h6m6 0h18m8 0h6M418 123v6m0 5v5M543 119v8m0 5v6M465 164h4m6 0h13"
            className="obs-place-ring-line"
          />
        </g>
      </g>
    </g>
  );
}

/** Decorative room layers; the scene owns camera, engine values and motion policy. */
export function ObservatoryPlaceArt({ place }: { place: Place }) {
  const light = `${useId()}-place-light`;
  return (
    <svg
      className="observatory-place-art"
      data-place-art={place}
      viewBox="0 0 960 260"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={light} x1="0" y1="0" x2="0" y2="1">
          <stop className="obs-place-light-stop" stopOpacity=".9" />
          <stop className="obs-place-light-stop" offset="1" stopOpacity="0" />
        </linearGradient>
        {place === 'ceiling' && (
          <radialGradient id={`${light}-halo`}>
            <stop className="obs-place-light-stop" stopOpacity=".8" />
            <stop className="obs-place-light-stop" offset="1" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      <g className="obs-place-camera">
        {place !== 'ceiling' && <RoomBase place={place} light={light} />}
        {place === 'ceiling' ? (
          <Ceiling light={light} />
        ) : place === 'left' ? (
          <Bookshelf light={light} />
        ) : place === 'back' ? (
          <PlanningWall />
        ) : (
          <ResearchBench light={light} />
        )}
      </g>
    </svg>
  );
}
