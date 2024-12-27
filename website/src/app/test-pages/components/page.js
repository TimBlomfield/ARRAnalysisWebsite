'use client';

import { Fragment, useMemo, useState, useEffect } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { initST } from './utils';
// Components
import CheckBox from '@/components/CheckBox';
import ComboBox from '@/components/ComboBox';
import IconButton from '@/components/IconButton';
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
import LoadingSSR from '@/components/LoadingSSR';
import MultiToggle from '@/components/MultiToggle';
import PlusMinusButton from '@/components/PlusMinusButton';
import PushButton from '@/components/PushButton';
import Slider from '@/components/Slider';
// Images
import PlusSvg from '@/../public/Plus.svg';
// Styles
import styles from './styles.module.scss';


const ComponentsPage = () => {

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
  // Combobox Section - local states
  const [cboxsect_chkWithLabel, setCboxsect_chkWithLabel] = useState(false);
  const [cboxsect_chkDisabled, setCboxsect_chkDisabled] = useState(false);
  const [cboxsect_chkError, setCboxsect_chkError] = useState(false);
  const [cboxsect_chkVirtualized, setCboxsect_chkVirtualized] = useState(false);
  const [cboxsect_chkSearchable, setCboxsect_chkSearchable] = useState(false);
  const [cboxsect_chkTooltip, setCboxsect_chkTooltip] = useState(false);
  const [cboxsect_chkDisableClearable, setCboxsect_chkDisableClearable] = useState(false);
  const [cboxsect_chkDisableListWrap, setCboxsect_chkDisableListWrap] = useState(false);
  const [cboxsect_chkDisableCloseOnSelect, setCboxsect_chkDisableCloseOnSelect] = useState(false);
  const [cboxsect_chkClearOnEscape, setCboxsect_chkClearOnEscape] = useState(false);
  const [cboxsect_chkDebug, setCboxsect_chkDebug] = useState(false);
  const [cboxsect_chkUseReactPortal, setCboxsect_chkUseReactPortal] = useState(false);
  const [cboxsect_mtgMenuSize, setCboxsect_mtgMenuSize] = useState(3);


  // Effects
  useEffect(() => { setDefaultLocale(navigator?.language || 'en-US'); }, []);
  useEffect(() => {  setSliderTicks(initST()); }, [defaultLocale]);


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
  // ComboBox Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const ComboBoxSection_MemoRender = useMemo(() => {
    return (
      <>
        <div className={cn(styles.title, styles.pt)}>&lt;ComboBox /&gt;</div>
        <div className={styles.tweaker}>
          <CheckBox checked={cboxsect_chkWithLabel} setChecked={setCboxsect_chkWithLabel} text="Label" />
          <CheckBox checked={cboxsect_chkDisabled} setChecked={setCboxsect_chkDisabled} text="Disabled" />
          <CheckBox checked={cboxsect_chkError} setChecked={setCboxsect_chkError} text="Error" />
          <CheckBox checked={cboxsect_chkVirtualized} setChecked={setCboxsect_chkVirtualized} text="Virtualized" />
          <CheckBox checked={cboxsect_chkSearchable} setChecked={setCboxsect_chkSearchable} text="Searchable" />
          <CheckBox checked={cboxsect_chkTooltip} setChecked={setCboxsect_chkTooltip} text="Tooltip" />
          <CheckBox checked={cboxsect_chkDisableClearable} setChecked={setCboxsect_chkDisableClearable} text="Disable clearable" />
          <CheckBox checked={cboxsect_chkDisableListWrap} setChecked={setCboxsect_chkDisableListWrap} text="Disable list wrap" />
          <CheckBox checked={cboxsect_chkDisableCloseOnSelect} setChecked={setCboxsect_chkDisableCloseOnSelect} text="Disable close on select" />
          <CheckBox checked={cboxsect_chkClearOnEscape} setChecked={setCboxsect_chkClearOnEscape} text="Clear on escape" />
          <CheckBox checked={cboxsect_chkDebug} setChecked={setCboxsect_chkDebug} text="Debug" />
          <CheckBox checked={cboxsect_chkUseReactPortal} setChecked={setCboxsect_chkUseReactPortal} text="Use React portal" />
          <div className={styles.mtg}>
            <div className={styles.titleM}>Menu size</div>
            <MultiToggle extraClass={styles.xtraMT}
                         selected={cboxsect_mtgMenuSize}
                         options={['2', '3', '4', '5', '6', '7', '8']}
                         onSelect={x => setCboxsect_mtgMenuSize(x)} />
          </div>
        </div>
        <ComboBox />
      </>
    );
  }, [cboxsect_chkWithLabel, cboxsect_chkDisabled, cboxsect_chkError, cboxsect_chkVirtualized, cboxsect_chkSearchable,
    cboxsect_chkTooltip, cboxsect_chkDisableClearable, cboxsect_chkDisableListWrap, cboxsect_chkDisableCloseOnSelect,
    cboxsect_chkClearOnEscape, cboxsect_chkDebug, cboxsect_chkUseReactPortal, cboxsect_mtgMenuSize]);



  return (
    <main className={styles.main}>
      {LoadingSection_MemoRender}
      {PushButtonSection_MemoRender}
      {LinkButtonSection_MemoRender}
      {PlusMinusButtonSection_MemoRender}
      {IconButtonSection_MemoRender}
      {MultiToggleSection_MemoRender}
      {SliderSection_MemoRender}
      {ComboBoxSection_MemoRender}
    </main>
  );
};


export default ComponentsPage;
