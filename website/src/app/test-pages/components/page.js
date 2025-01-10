'use client';
/* eslint-disable @next/next/no-img-element */

import { Fragment, useMemo, useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { countries } from 'country-flag-icons';
import { CircleFlag } from 'react-circle-flags';
import Flags from 'country-flag-icons/react/3x2';
import { K_Theme, PORTAL_ID_MENU } from '@/utils/common';
import { mkFix } from '@/utils/func';
import { initST } from './utils';
import { comboboxUsers, comboboxMovies } from './test-data';
import { getCountryCodeFromNumber } from '@/utils/phone';
// Components
import Box from './Box';
import CheckBox from '@/components/CheckBox';
import ComboBox from '@/components/ComboBox';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
import LoadingSSR from '@/components/LoadingSSR';
import MultiToggle from '@/components/MultiToggle';
import PhoneInput from '@/components/PhoneInput';
import PlusMinusButton from '@/components/PlusMinusButton';
import Popper from '@/components/Popper';
import PushButton from '@/components/PushButton';
import Slider from '@/components/Slider';
// Images
import blankAvatar from '@/../public/BlankAvatar.png';
import InterphoneSvg from '@/../public/international-call.svg';
import PlusSvg from '@/../public/Plus.svg';
// Styles
import styles from './styles.module.scss';


const ComponentsPage = () => {
  const ref_popperButton = useRef(), ref_popperContainer = useRef();

  const [defaultLocale, setDefaultLocale] = useState('en-US');
  // PlusMinusButton Section - local states
  const [plusMinusValue, setPlusMinusValue] = useState(0);
  // MultiToggle Section - local states
  const [multiToggle_01, setMultiToggle_01] = useState(0);
  const [multiToggle_02, setMultiToggle_02] = useState(0);
  const [multiToggle_03, setMultiToggle_03] = useState(0);
  // Slider Section - local states
  const [sliderTicks, setSliderTicks] = useState(() => initST());
  const [slider_mtgShowValue, setSlider_mtgShowValue] = useState(0);
  const [slider_mtgValuePos, setSlider_mtgValuePos] = useState(0);
  const [slider_chkThin, setSlider_chkThin] = useState(false);
  const [slider_chkDisabled, setSlider_chkDisabled] = useState(false);
  const [slider_horizontal01, setSlider_horizontal01] = useState(0);
  const [slider_horizontal02, setSlider_horizontal02] = useState(0);
  const [slider_horizontal03, setSlider_horizontal03] = useState(0);
  const [slider_horizontal04, setSlider_horizontal04] = useState(0);
  const [slider_vertical01, setSlider_vertical01] = useState(0);
  const [slider_vertical02, setSlider_vertical02] = useState(0);
  const [slider_vertical03, setSlider_vertical03] = useState(0);
  // Popper Section - local states
  const [popper_mtgAnchor, setPopper_mtgAnchor] = useState(3);
  const [popper_mtgAlignment, setPopper_mtgAlignment] = useState(0);
  const [popper_chkMatchWidth, setPopper_chkMatchWidth] = useState(false);
  const [popper_chkAutoFlipAnchor, setPopper_chkAutoFlipAnchor] = useState(true);
  const [popper_chkNeverCover, setPopper_chkNeverCover] = useState(false);
  const [popper_sldButtonLeft, setPopper_sldButtonLeft] = useState(50);
  const [popper_sldButtonTop, setPopper_sldButtonTop] = useState(50);
  const [popper_chkUseLimiter, setPopper_chkUseLimiter] = useState(false);
  const [popper_chkClipLeft, setPopper_chkClipLeft] = useState(false);
  const [popper_chkClipTop, setPopper_chkClipTop] = useState(false);
  const [popper_chkClipRight, setPopper_chkClipRight] = useState(false);
  const [popper_chkClipBottom, setPopper_chkClipBottom] = useState(false);
  const [popper_sldOffsetLeft, setPopper_sldOffsetLeft] = useState(200);
  const [popper_sldOffsetTop, setPopper_sldOffsetTop] = useState(200);
  const [popper_sldOffsetRight, setPopper_sldOffsetRight] = useState(200);
  const [popper_sldOffsetBottom, setPopper_sldOffsetBottom] = useState(200);
  const [popper_opened, setPopper_opened] = useState(false);
  // Input Section - local states
  const [input_chkWithLabel, setInput_chkWithLabel] = useState(false);
  const [input_chkReadOnly, setInput_chkReadOnly] = useState(false);
  const [input_chkDisabled, setInput_chkDisabled] = useState(false);
  const [input_chkError, setInput_chkError] = useState(false);
  const [input_chkPlaceholder, setInput_chkPlaceholder] = useState(false);
  const [input_chkMultiline, setInput_chkMultiline] = useState(false);
  const [input_sldHeight, setInput_sldHeight] = useState(32);
  const [input_sldFontSize, setInput_sldFontSize] = useState(9);
  const [input_valDark, setInput_valDark] = useState('');
  const [input_valLight, setInput_valLight] = useState('');
  const [input_valPhoneDark, setInput_valPhoneDark] = useState('');
  const [input_valPhoneLight, setInput_valPhoneLight] = useState('');
  // Combobox Section - local states
  const [cboxsect_chkWithLabel, setCboxsect_chkWithLabel] = useState(false);
  const [cboxsect_chkDisabled, setCboxsect_chkDisabled] = useState(false);
  const [cboxsect_chkError, setCboxsect_chkError] = useState(false);
  const [cboxsect_chkVirtualized, setCboxsect_chkVirtualized] = useState(false);
  const [cboxsect_chkPlaceholder, setCboxsect_chkPlaceholder] = useState(false);
  const [cboxsect_chkSearchable, setCboxsect_chkSearchable] = useState(true);
  const [cboxsect_chkTooltip, setCboxsect_chkTooltip] = useState(false);
  const [cboxsect_chkDisableClearable, setCboxsect_chkDisableClearable] = useState(false);
  const [cboxsect_chkDisableListWrap, setCboxsect_chkDisableListWrap] = useState(false);
  const [cboxsect_chkDisableCloseOnSelect, setCboxsect_chkDisableCloseOnSelect] = useState(false);
  const [cboxsect_chkClearOnEscape, setCboxsect_chkClearOnEscape] = useState(false);
  const [cboxsect_chkDebug, setCboxsect_chkDebug] = useState(false);
  const [cboxsect_chkPopMatchWidth, setCboxsect_chkPopMatchWidth] = useState(false);
  const [cboxsect_chkUseReactPortal, setCboxsect_chkUseReactPortal] = useState(false);
  const [cboxsect_chkRoundFlags, setCboxsect_chkRoundFlags] = useState(true);
  const [cboxsect_sldHeight, setCboxsect_sldHeight] = useState(16);
  const [cboxsect_sldFontSize, setCboxsect_sldFontSize] = useState(9);
  const [cboxsect_mtgMenuSize, setCboxsect_mtgMenuSize] = useState(3);
  const [cboxsect_comboMoviesDk, setCboxsect_comboMoviesDk] = useState(-1);
  const [cboxsect_comboMoviesLt, setCboxsect_comboMoviesLt] = useState(20);
  const [cboxsect_countries, setCboxsect_countries] = useState([]);
  const [cboxsect_comboCountriesDk, setCboxsect_comboCountriesDk] = useState(-1);
  const [cboxsect_comboCountriesLt, setCboxsect_comboCountriesLt] = useState(-1);
  const [cboxsect_comboUsersDk, setCboxsect_comboUsersDk] = useState(-1);
  const [cboxsect_comboUsersLt, setCboxsect_comboUsersLt] = useState(6);


  // Effects
  useEffect(() => { setDefaultLocale(navigator?.language || 'en-US'); }, []);
  useEffect(() => {
    setSliderTicks(initST());

    const regionNamesLocalized = new Intl.DisplayNames([defaultLocale], { type: 'region' });
    setCboxsect_countries(
      countries.map(code => ({
        name: mkFix(regionNamesLocalized.of(code)),
        flag: code.toLowerCase(),
      }))
    );
    setCboxsect_comboCountriesLt(80);
  }, [defaultLocale]);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Loading Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const LoadingSection_MemoRender = useMemo(() => (
    <>
      <div className={styles.title}>&lt;Loading size={'{1}'} text=&quot;Hello&quot; /&gt;</div>
      <div className={styles.loadingGrid}>
        <div className={styles.cell}><Loading /></div>
        <div className={styles.cell}><Loading scale={1.5} /></div>
        <div className={styles.cell}><Loading scale={2} /></div>
        <div className={styles.cell}><Loading text="Loading..." /></div>
        <div className={styles.cell}><Loading scale={2} text="Loading..." /></div>
        <div className={cn(styles.cell, styles.wider)}><Loading text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
        <div className={styles.cell}><Loading scale={2} text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
        <div className={styles.cell}><LoadingSSR theme={K_Theme.Dark} scale={1} text="Howdy" /></div>
        <div className={cn(styles.cell, styles.wider)}><LoadingSSR scale={2} text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
      </div>
    </>
  ), []);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PushButton Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const PushButtonSection_MemoRender = useMemo(() => (
    <>
      <div className={cn(styles.title, styles.pt)}>&lt;PushButton /&gt;</div>
      <div className={styles.pushButtonGrid}>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} onClick={() => toast('Light!')}>Button Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} invertBkTheme onClick={() => toast('Light!')}>Button Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} onClick={() => toast('Dark!')}>Button Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} invertBkTheme onClick={() => toast('Dark!')}>Button Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} invertBkTheme onClick={() => toast('Light!')} disabled>Button
            Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} onClick={() => toast('Light!')} disabled>Button Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} invertBkTheme onClick={() => toast('Dark!')} disabled>Button
            Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} onClick={() => toast('Dark!')} disabled>Button Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} onClick={() => toast('Danger!')}>Danger</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} invertBkTheme onClick={() => toast('Danger!')}>Danger</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} onClick={() => toast('Danger!')} disabled>Danger</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} onClick={() => toast('Danger!')} disabled>Danger</PushButton>
        </div>
      </div>
    </>
  ), []);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // LinkButton Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const LinkButtonSection_MemoRender = useMemo(() => (
    <>
      <div className={cn(styles.title, styles.pt)}>&lt;LinkButton /&gt;</div>
      <div className={styles.pushButtonGrid}>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} href="https://www.google.com/">Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} invertBkTheme href="https://www.google.com/">Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} href="https://www.google.com/">Button Dark</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} invertBkTheme href="https://www.google.com/">Button Dark</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} invertBkTheme href="https://www.google.com/" disabled>Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} href="https://www.google.com/" disabled>Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} invertBkTheme href="https://www.google.com/" disabled>Button Dark</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} href="https://www.google.com/" disabled>Button Dark</LinkButton>
        </div>
      </div>
    </>
  ), []);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PlusMinusButton Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const PlusMinusButtonSection_MemoRender = useMemo(() => {
    const lessen = () => setPlusMinusValue(prev => prev > 0 ? prev - 1 : 0);
    const grow = () => setPlusMinusValue(prev => prev < 50 ? prev + 1 : 50);
    return (
      <>
        <div className={cn(styles.title, styles.pt)}>&lt;PlusMinusButton /&gt;</div>
        <div className={styles.plusMinusGrid}>
          <div className={styles.cell}>{plusMinusValue}</div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Dark} invertBkTheme onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Light} invertBkTheme onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Dark} onLess={lessen} onMore={grow} />
          </div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Light} onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}></div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Dark} invertBkTheme disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Light} invertBkTheme disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Dark} disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Light} disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}></div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Dark} invertBkTheme extraBtnClass={styles.extraBtnClass1} onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Light} invertBkTheme extraBtnClass={styles.extraBtnClass2} onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Dark} extraBtnClass={styles.extraBtnClass3} onLess={lessen} onMore={grow} />
          </div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Light} extraBtnClass={styles.extraBtnClass4} onLess={lessen} onMore={grow} />
          </div>
        </div>
      </>
    );
  }, [plusMinusValue]);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // IconButton Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const IconButtonSection_MemoRender = useMemo(() => (
    <>
      <div className={cn(styles.title, styles.pt)}>&lt;IconButton /&gt;</div>
      <div className={styles.iconButtonGrid}>
        {Object.values(K_Theme).map(theme => (
          <Fragment key={theme}>
            <div className={styles.child}>
              <IconButton theme={theme} svg={PlusSvg} invertBkTheme onClick={() => toast('Icon Button!')} />
            </div>
            <div className={styles.child}>
              <IconButton theme={theme} svg={PlusSvg} onClick={() => toast('Icon Button!')} />
            </div>
            <div className={styles.child}>
              <IconButton theme={theme} svg={PlusSvg} scale={1.8} invertBkTheme
                          onClick={() => toast('Icon Button!')} />
            </div>
            <div className={styles.child}>
              <IconButton theme={theme} svg={PlusSvg} scale={1.3} svgScale={1.5}
                          onClick={() => toast('Icon Button!')} />
            </div>
            <div className={styles.child}>
              <IconButton theme={theme} svg={PlusSvg} scale={1.3} svgScale={1.5} disabled
                          onClick={() => toast('Icon Button!')} />
            </div>
            <div className={styles.child}>
              <IconButton theme={theme} svg={PlusSvg} scale={1.3} svgScale={1.5} disabled onClick={() => toast('Icon Button!')} />
            </div>
          </Fragment>
        ))}
        {[false,true].map(d => (
          <Fragment key={d.toString()}>
            <div className={styles.child}>
              <IconButton theme={K_Theme.Light} transparent svg={PlusSvg} invertBkTheme onClick={() => toast('Icon Button!')} disabled={d} />
            </div>
            <div className={styles.child}>
              <IconButton theme={K_Theme.Dark} transparent svg={PlusSvg} invertBkTheme onClick={() => toast('Icon Button!')} disabled={d} />
            </div>
            <div className={styles.child}>
              <IconButton theme={K_Theme.Danger} transparent svg={PlusSvg} invertBkTheme onClick={() => toast('Icon Button!')} disabled={d} />
            </div>
          </Fragment>
        ))}
      </div>
    </>
  ), []);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // MultiToggle Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const MultiToggleSection_MemoRender = useMemo(() => (
    <>
      <div className={cn(styles.title, styles.pt)}>&lt;MultiToggle /&gt;</div>
      <div className={styles.multiToggleGrid}>
        <div className={styles.cell}>
          <MultiToggle selected={multiToggle_01}
                       options={['Suscipit', 'Erat', 'Vestibulum', 'Ullamcorper ', 'Cras']}
                       onSelect={x => setMultiToggle_01(x)} />
        </div>
        <div className={styles.cell}>
          <MultiToggle extraClass={cn(styles.xtraMT, styles.otherBk)}
                       selected={multiToggle_02}
                       options={['Suscipit', 'Erat', 'Vestibulum', 'Ullamcorper ', 'Cras']}
                       onSelect={x => setMultiToggle_02(x)} />
        </div>
        <div className={styles.cell}>
          <MultiToggle theme={K_Theme.Light}
                       selected={multiToggle_03}
                       options={['A', 'B', 'C']}
                       onSelect={x => setMultiToggle_03(x)} />
        </div>
        <div className={styles.cell}>
          <MultiToggle selected={multiToggle_01}
                       options={['Suscipit', 'Erat', 'Vestibulum', 'Ullamcorper ', 'Cras']}
                       onSelect={x => setMultiToggle_01(x)}
                       disabled />
        </div>
        <div className={styles.cell}>
          <MultiToggle extraClass={styles.xtraMT}
                       selected={multiToggle_02}
                       options={['Suscipit', 'Erat', 'Vestibulum', 'Ullamcorper ', 'Cras']}
                       onSelect={x => setMultiToggle_02(x)}
                       disabled />
        </div>
        <div className={styles.cell}>
          <MultiToggle theme={K_Theme.Light}
                       selected={multiToggle_03}
                       options={['A', 'B', 'C']}
                       onSelect={x => setMultiToggle_03(x)}
                       disabled />
        </div>
      </div>
    </>
  ), [multiToggle_01, multiToggle_02, multiToggle_03]);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Slider Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const SliderSection_MemoRender = useMemo(() => {
    return (
      <>
        <div className={cn(styles.title, styles.pt)}>&lt;Slider /&gt;</div>
        <div className={styles.tweaker}>
          <div className={styles.mtg}>
            <div className={styles.titleM}>Show value</div>
            <MultiToggle extraClass={styles.xtraMT}
                         selected={slider_mtgShowValue}
                         options={['Off', 'On', 'Auto']}
                         onSelect={setSlider_mtgShowValue} />
          </div>
          <div className={styles.mtg}>
            <div className={styles.titleM}>Show value</div>
            <MultiToggle extraClass={styles.xtraMT}
                         selected={slider_mtgValuePos}
                         options={['Above', 'Below', 'Left', 'Right']}
                         onSelect={setSlider_mtgValuePos} />
          </div>
          <CheckBox checked={slider_chkThin} setChecked={setSlider_chkThin} text="Thin" />
          <CheckBox checked={slider_chkDisabled} setChecked={setSlider_chkDisabled} text="Disabled" />
        </div>
        <div className={styles.slider_grid}>
        <div className={cn(styles.s1, styles.b)}>
          <Slider ticks={sliderTicks.time}
                  selected={slider_horizontal01}
                  onSelect={setSlider_horizontal01}
                  small={slider_chkThin}
                  disabled={slider_chkDisabled}
                  showValue={slider_mtgShowValue}
                  valuePos={slider_mtgValuePos} />
        </div>
        <div className={cn(styles.s2, styles.b)}>
          <Slider ticks={sliderTicks.deg}
                  selected={slider_horizontal02}
                  onSelect={setSlider_horizontal02}
                  small={slider_chkThin}
                  disabled={slider_chkDisabled}
                  showValue={slider_mtgShowValue}
                  valuePos={slider_mtgValuePos} />
        </div>
        <div className={cn(styles.s3, styles.b)}>
          <Slider min={0}
                  max={50}
                  tot={51}
                  selected={slider_horizontal03}
                  onSelect={setSlider_horizontal03}
                  small={slider_chkThin}
                  disabled={slider_chkDisabled}
                  showValue={slider_mtgShowValue}
                  valuePos={slider_mtgValuePos} />
        </div>
        <div className={cn(styles.s4, styles.b)}>
          <Slider min={-20000}
                  max={50000}
                  tot={130}
                  selected={slider_horizontal04}
                  onSelect={setSlider_horizontal04}
                  small={slider_chkThin}
                  disabled={slider_chkDisabled}
                  showValue={slider_mtgShowValue}
                  valuePos={slider_mtgValuePos} />
        </div>
        <div className={cn(styles.s5, styles.b)} style={{ zIndex: slider_mtgValuePos === 2 ? 1 : 3 }}>
          <Slider vertical
                  ticks={sliderTicks.time}
                  selected={slider_vertical01}
                  onSelect={setSlider_vertical01}
                  small={slider_chkThin}
                  disabled={slider_chkDisabled}
                  showValue={slider_mtgShowValue}
                  valuePos={slider_mtgValuePos} />
        </div>
        <div className={cn(styles.s6, styles.b)} style={{ zIndex: 2 }}>
          <Slider vertical
                  ticks={sliderTicks.deg}
                  selected={slider_vertical02}
                  onSelect={setSlider_vertical02}
                  small={slider_chkThin}
                  disabled={slider_chkDisabled}
                  showValue={slider_mtgShowValue}
                  valuePos={slider_mtgValuePos} />
        </div>
        <div className={cn(styles.s7, styles.b)} style={{ zIndex: slider_mtgValuePos === 2 ? 3 : 1 }}>
          <Slider vertical
                  min={-5}
                  max={5}
                  tot={3}
                  selected={slider_vertical03}
                  onSelect={setSlider_vertical03}
                  small={slider_chkThin}
                  disabled={slider_chkDisabled}
                  showValue={slider_mtgShowValue}
                  valuePos={slider_mtgValuePos} />
        </div>
      </div>
      </>
    );
  }, [slider_mtgShowValue, slider_mtgValuePos, slider_chkThin, slider_chkDisabled, slider_horizontal01,
    slider_horizontal02, slider_horizontal03, slider_horizontal04, slider_vertical01, slider_vertical02,
    slider_vertical03]);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Popper Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const PopperSection_MemoRender = useMemo(() => {
    const offsetSliders = [
      { title: 'Offset Left', value: popper_sldOffsetLeft, func: setPopper_sldOffsetLeft },
      { title: 'Offset Top', value: popper_sldOffsetTop, func: setPopper_sldOffsetTop },
      { title: 'Offset Right', value: popper_sldOffsetRight, func: setPopper_sldOffsetRight },
      { title: 'Offset Bottom', value: popper_sldOffsetBottom, func: setPopper_sldOffsetBottom },
    ];

    return (
      <>
        <div className={cn(styles.title, styles.pt)}>&lt;Popper /&gt;</div>
        <div className={styles.tweaker}>
          <div className={styles.mtg}>
            <div className={styles.titleM}>Anchor</div>
            <MultiToggle extraClass={styles.xtraMT}
                         selected={popper_mtgAnchor}
                         options={['Left', 'Top', 'Right', 'Bottom']}
                         onSelect={setPopper_mtgAnchor} />
          </div>
          <div className={styles.mtg}>
            <div className={styles.titleM}>Alignment</div>
            <MultiToggle extraClass={styles.xtraMT}
                         selected={popper_mtgAlignment}
                         options={['Start', 'Center', 'End']}
                         onSelect={setPopper_mtgAlignment} />
          </div>
          <CheckBox checked={popper_chkMatchWidth} setChecked={setPopper_chkMatchWidth} text="Match Width" />
          <CheckBox checked={popper_chkAutoFlipAnchor} setChecked={setPopper_chkAutoFlipAnchor}
                    text="Auto Flip Anchor" />
          <CheckBox checked={popper_chkNeverCover} setChecked={setPopper_chkNeverCover} text="Never Cover" />
          <div className={styles.mtg} style={{minWidth: 150}}>
            <div className={styles.titleM}>Button Left</div>
            <Slider min={-50}
                    max={120}
                    tot={171}
                    selected={popper_sldButtonLeft}
                    onSelect={setPopper_sldButtonLeft} />
          </div>
          <div className={styles.mtg} style={{minWidth: 150}}>
            <div className={styles.titleM}>Button Top</div>
            <Slider min={-50}
                    max={120}
                    tot={171}
                    selected={popper_sldButtonTop}
                    onSelect={setPopper_sldButtonTop} />
          </div>
          <div className={styles.break} />
          <CheckBox checked={popper_chkUseLimiter} setChecked={setPopper_chkUseLimiter} text='Use the "limiter" prop' />
          <div className={styles.break} />
          <CheckBox disabled={!popper_chkUseLimiter} checked={popper_chkClipLeft} setChecked={setPopper_chkClipLeft} text="Clip left" />
          <CheckBox disabled={!popper_chkUseLimiter} checked={popper_chkClipTop} setChecked={setPopper_chkClipTop} text="Clip top" />
          <CheckBox disabled={!popper_chkUseLimiter} checked={popper_chkClipRight} setChecked={setPopper_chkClipRight} text="Clip right" />
          <CheckBox disabled={!popper_chkUseLimiter} checked={popper_chkClipBottom} setChecked={setPopper_chkClipBottom} text="Clip bottom" />
          {offsetSliders.map(slider => (
            <div className={styles.mtg} style={{minWidth: 150}} key={slider.title}>
              <div className={styles.titleM}>{slider.title}</div>
              <Slider min={-200}
                      max={200}
                      tot={401}
                      disabled={!popper_chkUseLimiter}
                      selected={slider.value}
                      onSelect={slider.func} />
            </div>
          ))}
        </div>
        <div className={styles.popper_resizableContainer} ref={ref_popperContainer}>
          <PushButton extraClass={styles.button}
                      ref={ref_popperButton}
                      style={{left: `${popper_sldButtonLeft - 50}%`, top: `${popper_sldButtonTop - 50}%`}}
                      onClick={() => setPopper_opened(prev => !prev)}>
            Popper
          </PushButton>
          {popper_opened &&
            <Popper className={styles.popper}
                    alignment={popper_mtgAlignment}
                    anchor={popper_mtgAnchor}
                    matchWidth={popper_chkMatchWidth}
                    autoFlipAnchor={popper_chkAutoFlipAnchor}
                    neverCover={popper_chkNeverCover}
                    anchorEl={ref_popperButton.current}
                    {...popper_chkUseLimiter
                      ? {
                        limiter: ref_popperContainer.current,
                        limiterOffset: {
                          left: popper_sldOffsetLeft - 200,
                          top: popper_sldOffsetTop - 200,
                          right: popper_sldOffsetRight - 200,
                          bottom: popper_sldOffsetBottom - 200,
                        },
                        limiterClip: 0 | (popper_chkClipLeft ? Popper.Clip.Left : 0)
                          | (popper_chkClipTop ? Popper.Clip.Top : 0) | (popper_chkClipRight ? Popper.Clip.Right : 0)
                          | (popper_chkClipBottom ? Popper.Clip.Bottom : 0),
                      }
                      : {}
                    }>
              <div className={styles.frame}>
                <div className={styles.contents}>
                  <div className={styles.txt}>Popper text</div>
                </div>
              </div>
            </Popper>
          }
        </div>
      </>
    );
  }, [popper_mtgAnchor, popper_mtgAlignment, popper_chkMatchWidth, popper_chkAutoFlipAnchor, popper_chkNeverCover,
    popper_sldButtonLeft, popper_sldButtonTop, popper_chkUseLimiter, popper_chkClipLeft, popper_chkClipTop,
    popper_chkClipRight, popper_chkClipBottom, popper_sldOffsetLeft, popper_sldOffsetTop, popper_sldOffsetRight,
    popper_sldOffsetBottom, popper_opened]);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Input Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const InputSection_MemoRender = useMemo(() => {
    const regionNamesLocalized = new Intl.DisplayNames([defaultLocale], { type: 'region' });

    let FlagDk = null, titleDk = '';
    const countryCodeDk = getCountryCodeFromNumber(input_valPhoneDark);
    if (countryCodeDk != null && Flags[countryCodeDk] != null) {
      FlagDk = Flags[countryCodeDk];
      titleDk = mkFix(regionNamesLocalized.of(countryCodeDk));
    }

    let FlagLt = null, titleLt = '';
    const countryCodeLt = getCountryCodeFromNumber(input_valPhoneLight);
    if (countryCodeLt != null && Flags[countryCodeLt] != null) {
      FlagLt = Flags[countryCodeLt];
      titleLt = mkFix(regionNamesLocalized.of(countryCodeLt));
    }

    return (
      <>
        <div className={cn(styles.title, styles.pt)}>&lt;Input /&gt;</div>
        <div className={styles.tweaker}>
          <CheckBox checked={input_chkWithLabel} setChecked={setInput_chkWithLabel} text="Label" />
          <CheckBox disabled={input_chkDisabled} checked={input_chkReadOnly} setChecked={setInput_chkReadOnly} text="Read-only" />
          <CheckBox checked={input_chkError} setChecked={setInput_chkError} text="Error" />
          <CheckBox checked={input_chkDisabled} setChecked={setInput_chkDisabled} text="Disabled" />
          <CheckBox checked={input_chkPlaceholder} setChecked={setInput_chkPlaceholder} text="Placeholder" />
          <CheckBox checked={input_chkMultiline} setChecked={setInput_chkMultiline} text="Multiline" />
          <div className={styles.mtg} style={{minWidth: 150}}>
            <div className={styles.titleM}>Height</div>
            <Slider min={32}
                    max={72}
                    tot={41}
                    selected={input_sldHeight}
                    onSelect={setInput_sldHeight} />
          </div>
          <div className={styles.mtg} style={{minWidth: 150}}>
            <div className={styles.titleM}>Font Size</div>
            <Slider min={9}
                    max={32}
                    tot={24}
                    selected={input_sldFontSize}
                    onSelect={setInput_sldFontSize} />
          </div>
        </div>
        <div className={styles.combobox_hflex}>
          <Box caption="Dark" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px' }} style={{ minWidth: 222 }}>
            <Input theme={K_Theme.Dark}
                   name="dark"
                   type="text"
                   {...(input_chkWithLabel ? { label: 'Sample label:' } : {})}
                   {...(input_chkPlaceholder ? { placeholder: 'Sample Placeholder' } : {})}
                   multiline={input_chkMultiline}
                   {...(input_chkError ? {
                     errorText: 'Phasellus cursus libero ante, eget ornare ex tempus et.',
                     errorBorder: true,
                   } : {})}
                   {...(input_chkReadOnly ? { readOnly: true } : {})}
                   {...(input_chkDisabled ? { disabled: true } : {})}
                   extraClass={styles.input_w_100}
                   style={{ height: input_sldHeight + 32, fontSize: input_sldFontSize + 9 }}
                   value={input_valDark}
                   onChange={evt => setInput_valDark(evt.target.value)} />
          </Box>
          <Box caption="Light" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px', backgroundColor: '#253551' }} style={{ minWidth: 222 }}>
            <Input theme={K_Theme.Light}
                   name="light"
                   type="text"
                   {...(input_chkWithLabel ? { label: 'Sample label:' } : {})}
                   {...(input_chkPlaceholder ? { placeholder: 'Sample Placeholder' } : {})}
                   multiline={input_chkMultiline}
                   {...(input_chkError ? {
                     errorText: 'Phasellus cursus libero ante, eget ornare ex tempus et.',
                     errorBorder: true,
                   } : {})}
                   {...(input_chkReadOnly ? { readOnly: true } : {})}
                   {...(input_chkDisabled ? { disabled: true } : {})}
                   extraClass={styles.input_w_100}
                   style={{ height: input_sldHeight + 32, fontSize: input_sldFontSize + 9 }}
                   value={input_valLight}
                   onChange={evt => setInput_valLight(evt.target.value)} />
          </Box>
        </div>
        <div className={styles.combobox_hflex}>
          <Box caption="Dark (PhoneInput)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px' }} style={{ minWidth: 222 }}>
            <div className={styles.withLAdorn}>
              <div className={styles.flag} title={titleDk}>
                {FlagDk != null
                  ? <FlagDk className={cn(styles.rcflag, {[styles.disabled]: input_chkDisabled})} />
                  : <InterphoneSvg className={cn(styles.interphone, {[styles.disabled]: input_chkDisabled})} />
                }
              </div>
              <PhoneInput theme={K_Theme.Dark}
                          name="dark-phone"
                          type="text"
                          {...(input_chkWithLabel ? { label: 'Phone label:' } : {})}
                          {...(input_chkPlaceholder ? { placeholder: '+1 234 567 8988' } : {})}
                          {...(input_chkError ? {
                            errorText: 'Invalid phone number.',
                            errorBorder: true,
                          } : {})}
                          {...(input_chkReadOnly ? { readOnly: true } : {})}
                          {...(input_chkDisabled ? { disabled: true } : {})}
                          extraClass={styles.input_w_100}
                          style={{ height: input_sldHeight + 32, fontSize: input_sldFontSize + 9 }}
                          value={input_valPhoneDark}
                          changeFn={setInput_valPhoneDark} />
            </div>
          </Box>
          <Box caption="Light (PhoneInput)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px', backgroundColor: '#253551' }} style={{ minWidth: 222 }}>
            <div className={styles.withLAdorn}>
              <div className={styles.flag} title={titleLt}>
                {FlagLt != null
                  ? <FlagLt className={cn(styles.rcflag, {[styles.disabled]: input_chkDisabled})} />
                  : <InterphoneSvg className={cn(styles.interphone, {[styles.disabled]: input_chkDisabled})} />
                }
              </div>
              <PhoneInput theme={K_Theme.Light}
                          name="light-phone"
                          type="text"
                          {...(input_chkWithLabel ? { label: 'Phone label:' } : {})}
                          {...(input_chkPlaceholder ? { placeholder: '+1 880 555 0123' } : {})}
                          {...(input_chkError ? {
                            errorText: 'Invalid phone number.',
                            errorBorder: true,
                          } : {})}
                          {...(input_chkReadOnly ? { readOnly: true } : {})}
                          {...(input_chkDisabled ? { disabled: true } : {})}
                          extraClass={styles.input_w_100}
                          style={{ height: input_sldHeight + 32, fontSize: input_sldFontSize + 9 }}
                          value={input_valPhoneLight}
                          changeFn={setInput_valPhoneLight} />
            </div>
          </Box>
        </div>
      </>
    );
  }, [defaultLocale, input_chkWithLabel, input_chkReadOnly, input_chkDisabled, input_chkError, input_chkPlaceholder,
    input_chkMultiline, input_sldHeight, input_sldFontSize, input_valDark, input_valLight, input_valPhoneDark,
    input_valPhoneLight]);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ComboBox Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const ComboBoxSection_MemoRender = useMemo(() => {
    let FlagDk = null, FlagLt = null;
    if (cboxsect_comboCountriesDk >= 0 && !cboxsect_chkRoundFlags) {
      const data = cboxsect_countries[cboxsect_comboCountriesDk];
      FlagDk = Flags[data.flag.toUpperCase()];
    }
    if (cboxsect_comboCountriesLt >= 0 && !cboxsect_chkRoundFlags) {
      const data = cboxsect_countries[cboxsect_comboCountriesLt];
      FlagLt = Flags[data.flag.toUpperCase()];
    }

    return (
      <>
        <div className={cn(styles.title, styles.pt)}>&lt;ComboBox /&gt;</div>
        <div className={styles.tweaker}>
          <CheckBox checked={cboxsect_chkWithLabel} setChecked={setCboxsect_chkWithLabel} text="Label" />
          <CheckBox checked={cboxsect_chkError} setChecked={setCboxsect_chkError} text="Error" />
          <CheckBox checked={cboxsect_chkDisabled} setChecked={setCboxsect_chkDisabled} text="Disabled" />
          <CheckBox checked={cboxsect_chkVirtualized} setChecked={setCboxsect_chkVirtualized} text="Virtualized" />
          <CheckBox checked={cboxsect_chkSearchable} setChecked={setCboxsect_chkSearchable} text="Searchable" />
          <CheckBox checked={cboxsect_chkTooltip} setChecked={setCboxsect_chkTooltip} text="Tooltip" />
          <CheckBox checked={cboxsect_chkPlaceholder} setChecked={setCboxsect_chkPlaceholder} text="Placeholder" />
          <CheckBox checked={cboxsect_chkDisableClearable} setChecked={setCboxsect_chkDisableClearable}
                    text="Disable clearable" />
          <CheckBox checked={cboxsect_chkDisableListWrap} setChecked={setCboxsect_chkDisableListWrap}
                    text="Disable list wrap" />
          <CheckBox checked={cboxsect_chkDisableCloseOnSelect} setChecked={setCboxsect_chkDisableCloseOnSelect} text="Disable close on select" />
          <CheckBox checked={cboxsect_chkClearOnEscape} setChecked={setCboxsect_chkClearOnEscape} text="Clear on escape" />
          <CheckBox checked={cboxsect_chkDebug} setChecked={setCboxsect_chkDebug} text="Debug" />
          <CheckBox checked={cboxsect_chkPopMatchWidth} setChecked={setCboxsect_chkPopMatchWidth} text="Popper match width" />
          <CheckBox checked={cboxsect_chkUseReactPortal} setChecked={setCboxsect_chkUseReactPortal} text="Use React portal" />
          <CheckBox checked={cboxsect_chkRoundFlags} setChecked={setCboxsect_chkRoundFlags} text="Round flags" />
          <div className={styles.mtg} style={{minWidth: 150}}>
            <div className={styles.titleM}>Height</div>
            <Slider min={32}
                    max={72}
                    tot={41}
                    selected={cboxsect_sldHeight}
                    onSelect={setCboxsect_sldHeight} />
          </div>
          <div className={styles.mtg} style={{minWidth: 150}}>
            <div className={styles.titleM}>Font Size</div>
            <Slider min={9}
                    max={32}
                    tot={24}
                    selected={cboxsect_sldFontSize}
                    onSelect={setCboxsect_sldFontSize} />
          </div>
          <div className={styles.mtg}>
            <div className={styles.titleM}>Menu size</div>
            <MultiToggle extraClass={styles.xtraMT}
                         selected={cboxsect_mtgMenuSize}
                         options={['2', '3', '4', '5', '6', '7', '8']}
                         onSelect={x => setCboxsect_mtgMenuSize(x)} />
          </div>
        </div>
        <div className={styles.combobox_hflex}>
          <Box caption="Movies&nbsp;&nbsp;&nbsp;(Dark theme)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px' }} style={{ minWidth: 222 }}>
            <ComboBox theme={K_Theme.Dark}
                      name="dark-movies"
                      type="text"
                      {...(cboxsect_chkWithLabel ? { label: 'Movies:' } : {})}
                      {...(cboxsect_chkPlaceholder ? { placeholder: 'Movies Placeholder' } : {})}
                      {...(cboxsect_chkError ? {
                        errorText: 'Phasellus cursus libero ante, eget ornare ex tempus et.',
                        errorBorder: true,
                      } : {})}
                      {...(cboxsect_chkDisabled ? { disabled: true } : {})}
                      listOptimized={cboxsect_chkVirtualized}
                      tooltipOnInput={cboxsect_chkTooltip}
                      searchable={cboxsect_chkSearchable}
                      disableClearable={cboxsect_chkDisableClearable}
                      disableListWrap={cboxsect_chkDisableListWrap}
                      disableCloseOnSelect={cboxsect_chkDisableCloseOnSelect}
                      clearOnEscape={cboxsect_chkClearOnEscape}
                      {...(cboxsect_chkUseReactPortal ? { portalId: PORTAL_ID_MENU } : {})}
                      debug={cboxsect_chkDebug}
                      pop_MatchWidth={cboxsect_chkPopMatchWidth}
                      pageSize={cboxsect_mtgMenuSize + 2}
                      options={comboboxMovies}
                      getOptionLabel={o => o.title}
                      selected={cboxsect_comboMoviesDk}
                      onSelect={setCboxsect_comboMoviesDk}
                      wrapperExtraClass={styles.input_w_100}
                      style={{ height: cboxsect_sldHeight + 32, fontSize: cboxsect_sldFontSize + 9 }} />
          </Box>
          <Box caption="Movies&nbsp;&nbsp;&nbsp;(Light theme)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px', backgroundColor: '#253551' }} style={{ minWidth: 222 }}>
            <ComboBox theme={K_Theme.Light}
                      name="light-movies"
                      type="text"
                      {...(cboxsect_chkWithLabel ? { label: 'Movies:' } : {})}
                      {...(cboxsect_chkPlaceholder ? { placeholder: 'Movies Placeholder' } : {})}
                      {...(cboxsect_chkError ? {
                        errorText: 'Phasellus cursus libero ante, eget ornare ex tempus et.',
                        errorBorder: true,
                      } : {})}
                      {...(cboxsect_chkDisabled ? { disabled: true } : {})}
                      listOptimized={cboxsect_chkVirtualized}
                      tooltipOnInput={cboxsect_chkTooltip}
                      searchable={cboxsect_chkSearchable}
                      disableClearable={cboxsect_chkDisableClearable}
                      disableListWrap={cboxsect_chkDisableListWrap}
                      disableCloseOnSelect={cboxsect_chkDisableCloseOnSelect}
                      clearOnEscape={cboxsect_chkClearOnEscape}
                      {...(cboxsect_chkUseReactPortal ? { portalId: PORTAL_ID_MENU } : {})}
                      debug={cboxsect_chkDebug}
                      pop_MatchWidth={cboxsect_chkPopMatchWidth}
                      pageSize={cboxsect_mtgMenuSize + 2}
                      options={comboboxMovies}
                      getOptionLabel={o => o.title}
                      selected={cboxsect_comboMoviesLt}
                      onSelect={setCboxsect_comboMoviesLt}
                      wrapperExtraClass={styles.input_w_100}
                      style={{ height: cboxsect_sldHeight + 32, fontSize: cboxsect_sldFontSize + 9 }} />
          </Box>
        </div>
        <div className={styles.combobox_hflex}>
          <Box caption="Countries&nbsp;&nbsp;&nbsp;(Dark theme)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px' }} style={{ minWidth: 222 }}>
            <div className={styles.withLAdorn}>
              <div className={styles.flag}>
                {cboxsect_comboCountriesDk >= 0 &&
                  (cboxsect_chkRoundFlags
                     ? <CircleFlag countryCode={cboxsect_countries[cboxsect_comboCountriesDk].flag} height={28} className={cn(styles.out, {[styles.disabled]: cboxsect_chkDisabled})} />
                     : <FlagDk className={cn(styles.rcflag, {[styles.disabled]: cboxsect_chkDisabled})} />)
                }
              </div>
              <ComboBox theme={K_Theme.Dark}
                        name="dark-countries"
                        type="text"
                        {...(cboxsect_chkWithLabel ? { label: 'Countries:' } : {})}
                        {...(cboxsect_chkPlaceholder ? { placeholder: 'Countries Placeholder' } : {})}
                        {...(cboxsect_chkError ? {
                          errorText: 'Phasellus cursus libero ante, eget ornare ex tempus et.',
                          errorBorder: true,
                        } : {})}
                        {...(cboxsect_chkDisabled ? { disabled: true } : {})}
                        listOptimized={cboxsect_chkVirtualized}
                        tooltipOnInput={cboxsect_chkTooltip}
                        searchable={cboxsect_chkSearchable}
                        disableClearable={cboxsect_chkDisableClearable}
                        disableListWrap={cboxsect_chkDisableListWrap}
                        disableCloseOnSelect={cboxsect_chkDisableCloseOnSelect}
                        clearOnEscape={cboxsect_chkClearOnEscape}
                        {...(cboxsect_chkUseReactPortal ? { portalId: PORTAL_ID_MENU } : {})}
                        debug={cboxsect_chkDebug}
                        pop_MatchWidth={cboxsect_chkPopMatchWidth}
                        pageSize={cboxsect_mtgMenuSize + 2}
                        roundFlags={cboxsect_chkRoundFlags}
                        options={cboxsect_countries}
                        getOptionLabel={o => o.name}
                        getOptionData={o => o}
                        selected={cboxsect_comboCountriesDk}
                        onSelect={setCboxsect_comboCountriesDk}
                        wrapperExtraClass={styles.input_w_100}
                        style={{ height: cboxsect_sldHeight + 32, fontSize: cboxsect_sldFontSize + 9 }} />
            </div>
          </Box>
          <Box caption="Countries&nbsp;&nbsp;&nbsp;(Light theme)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px', backgroundColor: '#253551' }} style={{ minWidth: 222 }}>
            <div className={styles.withLAdorn}>
              <div className={styles.flag}>
                {cboxsect_comboCountriesLt >= 0 &&
                  (cboxsect_chkRoundFlags
                     ? <CircleFlag countryCode={cboxsect_countries[cboxsect_comboCountriesLt].flag} height={28} className={cn(styles.out, {[styles.disabled]: cboxsect_chkDisabled})} />
                     : <FlagLt className={cn(styles.rcflag, {[styles.disabled]: cboxsect_chkDisabled})} />)
                }
              </div>
              <ComboBox theme={K_Theme.Light}
                        name="light-countries"
                        type="text"
                        {...(cboxsect_chkWithLabel ? { label: 'Countries:' } : {})}
                        {...(cboxsect_chkPlaceholder ? { placeholder: 'Kountries Placeholder' } : {})}
                        {...(cboxsect_chkError ? {
                          errorText: 'Phasellus cursus libero ante, eget ornare.',
                          errorBorder: true,
                        } : {})}
                        {...(cboxsect_chkDisabled ? { disabled: true } : {})}
                        listOptimized={cboxsect_chkVirtualized}
                        tooltipOnInput={cboxsect_chkTooltip}
                        searchable={cboxsect_chkSearchable}
                        disableClearable={cboxsect_chkDisableClearable}
                        disableListWrap={cboxsect_chkDisableListWrap}
                        disableCloseOnSelect={cboxsect_chkDisableCloseOnSelect}
                        clearOnEscape={cboxsect_chkClearOnEscape}
                        {...(cboxsect_chkUseReactPortal ? { portalId: PORTAL_ID_MENU } : {})}
                        debug={cboxsect_chkDebug}
                        pop_MatchWidth={cboxsect_chkPopMatchWidth}
                        pageSize={cboxsect_mtgMenuSize + 2}
                        roundFlags={cboxsect_chkRoundFlags}
                        options={cboxsect_countries}
                        getOptionLabel={o => o.name}
                        getOptionData={o => o}
                        selected={cboxsect_comboCountriesLt}
                        onSelect={setCboxsect_comboCountriesLt}
                        wrapperExtraClass={styles.input_w_100}
                        style={{ height: cboxsect_sldHeight + 32, fontSize: cboxsect_sldFontSize + 9 }} />
            </div>
          </Box>
        </div>
        <div className={styles.combobox_hflex}>
          <Box caption="People&nbsp;&nbsp;&nbsp;(Dark theme)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px' }} style={{ minWidth: 222 }}>
            <div className={styles.withLAdorn}>
              <div className={styles.flag}>
                {cboxsect_comboUsersDk >= 0 &&
                  <img className={cn(styles.avatar, {[styles.disabled]: cboxsect_chkDisabled})}
                       src={comboboxUsers[cboxsect_comboUsersDk].avatar === '-' ? blankAvatar.src : comboboxUsers[cboxsect_comboUsersDk].avatar}
                       alt="user" />
                }
              </div>
              <ComboBox theme={K_Theme.Dark}
                        name="dark-users"
                        type="text"
                        {...(cboxsect_chkWithLabel ? { label: 'Users:' } : {})}
                        {...(cboxsect_chkPlaceholder ? { placeholder: 'Users Placeholder' } : {})}
                        {...(cboxsect_chkError ? {
                          errorText: 'Phasellus cursus libero ante, eget ornare ex tempus et lorem ipsum dolor.',
                          errorBorder: true,
                        } : {})}
                        {...(cboxsect_chkDisabled ? { disabled: true } : {})}
                        listOptimized={cboxsect_chkVirtualized}
                        tooltipOnInput={cboxsect_chkTooltip}
                        searchable={cboxsect_chkSearchable}
                        disableClearable={cboxsect_chkDisableClearable}
                        disableListWrap={cboxsect_chkDisableListWrap}
                        disableCloseOnSelect={cboxsect_chkDisableCloseOnSelect}
                        clearOnEscape={cboxsect_chkClearOnEscape}
                        {...(cboxsect_chkUseReactPortal ? { portalId: PORTAL_ID_MENU } : {})}
                        debug={cboxsect_chkDebug}
                        pop_MatchWidth={cboxsect_chkPopMatchWidth}
                        pageSize={cboxsect_mtgMenuSize + 2}
                        options={comboboxUsers}
                        getOptionLabel={o => o.name}
                        getOptionData={o => o}
                        selected={cboxsect_comboUsersDk}
                        onSelect={setCboxsect_comboUsersDk}
                        wrapperExtraClass={styles.input_w_100}
                        style={{ height: cboxsect_sldHeight + 32, fontSize: cboxsect_sldFontSize + 9 }} />
            </div>
          </Box>
          <Box caption="People&nbsp;&nbsp;&nbsp;(Light theme)" resizable bodyStyle={{ minWidth: 220, padding: '25px 25px 15px', backgroundColor: '#253551' }} style={{ minWidth: 222 }}>
            <div className={styles.withLAdorn}>
              <div className={styles.flag}>
                {cboxsect_comboUsersLt >= 0 &&
                  <img className={cn(styles.avatar, {[styles.disabled]: cboxsect_chkDisabled})}
                       src={comboboxUsers[cboxsect_comboUsersLt].avatar === '-' ? blankAvatar.src : comboboxUsers[cboxsect_comboUsersLt].avatar}
                       alt="user" />
                }
              </div>
              <ComboBox theme={K_Theme.Light}
                        name="light-users"
                        type="text"
                        {...(cboxsect_chkWithLabel ? { label: 'Users Lt:' } : {})}
                        {...(cboxsect_chkPlaceholder ? { placeholder: 'Users Light' } : {})}
                        {...(cboxsect_chkError ? {
                          errorText: 'Phallus cursus libero ante, eget ornare ex tempus et lorem ipsum dolor.',
                          errorBorder: true,
                        } : {})}
                        {...(cboxsect_chkDisabled ? { disabled: true } : {})}
                        listOptimized={cboxsect_chkVirtualized}
                        tooltipOnInput={cboxsect_chkTooltip}
                        searchable={cboxsect_chkSearchable}
                        disableClearable={cboxsect_chkDisableClearable}
                        disableListWrap={cboxsect_chkDisableListWrap}
                        disableCloseOnSelect={cboxsect_chkDisableCloseOnSelect}
                        clearOnEscape={cboxsect_chkClearOnEscape}
                        {...(cboxsect_chkUseReactPortal ? { portalId: PORTAL_ID_MENU } : {})}
                        debug={cboxsect_chkDebug}
                        pop_MatchWidth={cboxsect_chkPopMatchWidth}
                        pageSize={cboxsect_mtgMenuSize + 2}
                        options={comboboxUsers}
                        getOptionLabel={o => o.name}
                        getOptionData={o => o}
                        selected={cboxsect_comboUsersLt}
                        onSelect={setCboxsect_comboUsersLt}
                        wrapperExtraClass={styles.input_w_100}
                        style={{ height: cboxsect_sldHeight + 32, fontSize: cboxsect_sldFontSize + 9 }} />
            </div>
          </Box>
        </div>
      </>
    );
  }, [cboxsect_chkWithLabel, cboxsect_chkDisabled, cboxsect_chkError, cboxsect_chkVirtualized, cboxsect_chkPlaceholder,
    cboxsect_chkSearchable, cboxsect_chkTooltip, cboxsect_chkDisableClearable, cboxsect_chkDisableListWrap,
    cboxsect_chkDisableCloseOnSelect, cboxsect_chkClearOnEscape, cboxsect_chkDebug, cboxsect_chkPopMatchWidth,
    cboxsect_chkUseReactPortal, cboxsect_chkRoundFlags, cboxsect_sldHeight, cboxsect_sldFontSize, cboxsect_mtgMenuSize,
    cboxsect_comboMoviesDk, cboxsect_comboMoviesLt, cboxsect_countries, cboxsect_comboCountriesDk,
    cboxsect_comboCountriesLt, cboxsect_comboUsersDk, cboxsect_comboUsersLt]);


  return (
    <main className={styles.main}>
      {LoadingSection_MemoRender}
      {PushButtonSection_MemoRender}
      {LinkButtonSection_MemoRender}
      {PlusMinusButtonSection_MemoRender}
      {IconButtonSection_MemoRender}
      {MultiToggleSection_MemoRender}
      {SliderSection_MemoRender}
      {PopperSection_MemoRender}
      {InputSection_MemoRender}
      {ComboBoxSection_MemoRender}
    </main>
  );
};


export default ComponentsPage;
