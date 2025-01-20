'use client';

import { forwardRef, useImperativeHandle, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { CircleFlag } from 'react-circle-flags';
import Flags from 'country-flag-icons/react/3x2';
import { FixedSizeList as List } from 'react-window';
import { K_Theme } from '@/utils/common';
import { getFunction_StripDiacritics } from '@/utils/func';
import C from './const';
// Components
import Avatar from '@/components/Avatar';
import IconButton from '@/components/IconButton';
import Gateway from '@/components/Gateway';
import Option from './Option';
import Popper from '@/components/Popper';
// Images
import CloseSvg from '@/../public/Close.svg';
import TriangleSvg from '@/../public/DropdownTriangle.svg';
// Styles
import styles from './styles.module.scss';


const ComboBox = forwardRef(({theme = K_Theme.Dark, inputExtraClass = '', adornExtraClass = '', wrapperExtraClass = '',
  errorText = '', errorPlaceholder = false, errorBorder = false, errorTextExtraClass = '', label = '', id = '',
  tooltipOnInput = false, searchable = true, options = C.emptyArr, getOptionLabel = C.getOptLabel,
  getOptionData = C.getOpdData, selected, onSelect, pageSize = 5, disableListWrap = true, disableClearable = false,
  disableCloseOnSelect = false, clearOnEscape = false, debug = false, portalId = '', roundFlags = true,
  pop_MatchWidth = false, pop_ForceLimits = false, pop_AutoFlipAnchor = true, pop_NeverCover = false, pop_Limiter,
  pop_LimiterOffset, pop_LimiterClip = 0, listOptimized = false, lopt_Width = '100%', lopt_ItemSize = 36, ...attr}, ref) => {
  const refInput = useRef(), refInputWrapper = useRef(), refList = useRef(), refPopBody = useRef();

  const bHasError = !!errorText;
  const bHasLabel = !!label;
  const bDisabled = attr?.disabled === true;

  useImperativeHandle(ref, () => ({
    comboFocus: () => refInput.current.focus(),
  }));

  // Component state
  const [stripDiacritics] = useState(() => getFunction_StripDiacritics());
  const [hiliteIdx, setHiliteIdx] = useState(-1);
  const [collapsed, setCollapsed] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [inputValPrepared, setInputValPrepared] = useState('');
  const [extendedOptions, setExtendedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [popWidth, setPopWidth] = useState(-1);

  // Utility functions
  const prepare = val => stripDiacritics( val.trim().toLowerCase() );
  const initInputVal = () => (selected >= 0) ? getOptionLabel(options[selected]) : '';

  // Function to avoid server error (because CSS.number() is not available on the server)
  const getNumber = (value) => {
    if (typeof window !== 'undefined' && window.CSS?.number != null && typeof window.CSS.number === 'function') {
      return CSS.number(value);
    }
    // Fallback for server-side
    return parseFloat(value);
  };

  // In case options change dynamically:
  useEffect(() => {
    const getMemoString = opt => {
      const data = getOptionData(opt);
      let ret = getOptionLabel(opt);
      if (data != null) {
        if (data.svg) ret += '-' + (data.svg?.render?.name || 'svg');
        if (data.img) ret += '-' + data.img;
        if (data.avatar) ret += '-' + data.avatar;
        if (data.flag) ret += '-' + data.flag;
      }
      return ret;
    };

    const extOpts = options.map((item, idxOriginal) => ({
      item,
      idxOriginal,
      idxFiltered: idxOriginal,
      filterText: searchable ? prepare(getOptionLabel(item)) : undefined,
      memo: getMemoString(item),
    }));

    setExtendedOptions(extOpts);
    setFilteredOptions([...extOpts]);
    const initialInputValue = initInputVal();
    setInputVal(initialInputValue);
    setInputValPrepared(prepare( initialInputValue ));
    if (!debug && !disableCloseOnSelect) setCollapsed(true);
    if (hiliteIdx !== selected) setHiliteIdx(selected);
  }, [options]);

  // In case selected changes externally (by some external action)
  useEffect(() => {
    if (selected === -1) setHiliteIdx(-1);
    if (selected >= 0) {
      const initialInputValue = initInputVal();
      if (initialInputValue !== inputVal) {
        setInputVal(initialInputValue);
        setInputValPrepared(prepare( initialInputValue ));
        setHiliteIdx(selected);
      }
    }
  }, [selected]);

  useEffect(() => {
    if (listOptimized) {
      if (!collapsed && hiliteIdx >= 0) {
        setTimeout(() => {
          if (refList && refList.current)
            refList.current.scrollToItem(hiliteIdx);
        }, 0);
      }
    } else {
      if (!collapsed && hiliteIdx >= 0) {
        setTimeout(() => {
          if (refPopBody.current != null) {
            const elemHlt = refPopBody.current.children.item(hiliteIdx);
            if (elemHlt)
              elemHlt.scrollIntoView({block: 'nearest', scrollMode: 'if-needed'});
          }
        }, 0);
      }
    }
  }, [hiliteIdx, collapsed]);

  useEffect(() => {
    const inpWrp_onResize = () => {
      if (pop_MatchWidth) {
        if (refInputWrapper.current != null) {
          const rcWrp = refInputWrapper.current.getBoundingClientRect();
          setPopWidth(rcWrp.width);
        }
      } else
        setPopWidth(-1);
    };

    inpWrp_onResize();

    const resizeObserver = new ResizeObserver(inpWrp_onResize);
    resizeObserver.observe(refInputWrapper.current);

    return () => { if (refInputWrapper.current) resizeObserver.unobserve(refInputWrapper.current); };
  }, [pop_MatchWidth]);

  const calcHiliteFromSelected = _default => selected < 0 ? _default : selected;


  const onInputTextChange = newText => {
    const newTextPrepared = prepare(newText);
    setInputVal(newText);

    if (newTextPrepared !== inputValPrepared) {
      setCollapsed(false);
      setInputValPrepared(newTextPrepared);
      if (newTextPrepared === '' && !disableClearable) {
        onSelect(-1);
        setHiliteIdx(-1);
        setFilteredOptions([...extendedOptions]);
      } else {
        setHiliteIdx(calcHiliteFromSelected(-1));
        let idxF = 0;
        setFilteredOptions(extendedOptions.reduce((acc, cur) => {
          if (cur.filterText.includes(newTextPrepared)) {
            acc.push({...cur, idxFiltered: idxF++});
          }
          return acc;
        }, []));
      }
    }
  };

  const onInputClick = (/* evt */) => {
    if (inputValPrepared === '') {
      if (!collapsed) setHiliteIdx(calcHiliteFromSelected(-1));
    }
    setCollapsed(prev => !prev);
  };

  const onInputBlur = (/* evt */) => {
    if (!debug) {
      const inputText = (selected >= 0) ? getOptionLabel(options[selected]) : '';
      setInputVal(inputText);
      setInputValPrepared(prepare(inputText));
      setCollapsed(true);
      setFilteredOptions([...extendedOptions]);
      setHiliteIdx(calcHiliteFromSelected(-1));
    }
  };

  const onClearButtonClick = () => {
    if (refInput.current && document.activeElement !== refInput.current) refInput.current.focus();
    onSelect(-1);
    setCollapsed(true);
    setHiliteIdx(-1);
    setInputVal('');
    setInputValPrepared('');
    setFilteredOptions([...extendedOptions]);
  };

  const onArrowButtonClick = () => {
    if (refInput.current && document.activeElement !== refInput.current) refInput.current.focus();
    setCollapsed(prev => !prev);
  };

  const advanceHighlightedIndex = direction => {
    if (collapsed || hiliteIdx < 0) {
      setHiliteIdx(calcHiliteFromSelected(0));
    } else {
      let nextHiliteIdx = hiliteIdx + direction;

      if (nextHiliteIdx >= filteredOptions.length) {
        nextHiliteIdx = filteredOptions.length - 1;
        if (Math.abs(direction) === 1 && !disableListWrap) nextHiliteIdx = 0;
      } else if (nextHiliteIdx < 0) {
        nextHiliteIdx = 0;
        if (Math.abs(direction) === 1 && !disableListWrap) nextHiliteIdx = filteredOptions.length - 1;
      }

      setHiliteIdx(nextHiliteIdx);
    }
  };

  const onItemClick = useCallback(opt => {
    setFilteredOptions([...extendedOptions]);
    if (!debug && !disableCloseOnSelect) setCollapsed(true);

    setHiliteIdx(opt.idxOriginal);
    onSelect(opt.idxOriginal);
    setInputVal(getOptionLabel(opt.item));
    setInputValPrepared(opt.filterText);
  }, [extendedOptions, selected, onSelect]);

  const onInputKeyDown = evt => {
    switch (evt.code) {
      case 'Home':
        if ((!collapsed || !searchable) && !evt.shiftKey && !evt.ctrlKey && !evt.altKey) {
          evt.preventDefault();
          advanceHighlightedIndex(-filteredOptions.length);
          setCollapsed(false);
        }
        break;

      case 'End':
        if ((!collapsed || !searchable) && !evt.shiftKey && !evt.ctrlKey && !evt.altKey) {
          evt.preventDefault();
          advanceHighlightedIndex(+filteredOptions.length);
          setCollapsed(false);
        }
        break;

      case 'ArrowDown':
        evt.preventDefault();
        advanceHighlightedIndex(+1);
        setCollapsed(false);
        break;

      case 'ArrowUp':
        evt.preventDefault();
        advanceHighlightedIndex(-1);
        setCollapsed(false);
        break;

      case 'PageDown':
        evt.preventDefault();
        advanceHighlightedIndex(+pageSize);
        setCollapsed(false);
        break;

      case 'PageUp':
        evt.preventDefault();
        advanceHighlightedIndex(-pageSize);
        setCollapsed(false);
        break;

      case 'Enter':
      case 'NumpadEnter':
        // Wait until IME is settled
        if (evt.which === 229) break;
        if (!collapsed && hiliteIdx >= 0 && filteredOptions.length > hiliteIdx) {
          evt.preventDefault();
          const opt = filteredOptions[hiliteIdx];
          onItemClick(opt);
        }
        break;

      case 'Escape':
        if (!collapsed) {
          evt.preventDefault();
          evt.stopPropagation();  // Avoid modal handling the event
          setCollapsed(true);
        } else if (clearOnEscape && !disableClearable && selected >= 0) {
          evt.preventDefault();
          evt.stopPropagation();  // Avoid modal handling the event
          onClearButtonClick();
        }
        break;
    }
  };

  const renderOption = (opt, style) => {
    const data = getOptionData(opt.item);
    const bHilited = opt.idxFiltered === hiliteIdx;
    const bSelected = selected === opt.idxOriginal;
    const label = getOptionLabel(opt.item);
    const Flag = (data?.flag && !roundFlags) ? Flags[data.flag.toUpperCase()] : null;

    return (
      <div key={opt.idxOriginal}
           title={label}
           className={cn(styles.item, {[styles.hilite]: bHilited, [styles.sel]: bSelected, [styles.padL0]: data?.avatar || data?.flag}, opt.itemClass)}
           style={style}
           onMouseDown={evt => evt.preventDefault()}
           onClick={() => onItemClick(opt)}>
        {data?.avatar &&
          <div className={cn(styles.wrap, styles.avtrWrap)}>
            <div className={styles.outline} />
            <Avatar className={styles.avatar} url={data.avatar} />
          </div>
        }
        {data?.flag &&
          <div className={styles.wrap}>
            {roundFlags ? <CircleFlag countryCode={data.flag} height={24} /> : <Flag className={styles.rcflag} />}
          </div>
        }
        <div className={cn(opt.textClass || styles.txt)}>{label}</div>
      </div>
    );
  };

  const renderDropdown = () => {
    if (filteredOptions.length > 0) {
      if (listOptimized) {
        return (
          <List ref={refList}
                width={lopt_Width}
                height={Math.min(filteredOptions.length*lopt_ItemSize, pageSize*lopt_ItemSize)}
                itemCount={filteredOptions.length}
                itemSize={lopt_ItemSize}>
            {({index, style}) => <Option key={index}
                                         fn={renderOption}
                                         opt={filteredOptions[index]}
                                         style={style}
                                         hlt={hiliteIdx}
                                         onClk={onItemClick} />}
          </List>
        );
      } else {
        return (
          <div style={{ flex: 1, overflowY: 'auto' }} ref={refPopBody}>
            {filteredOptions.map(opt => <Option key={opt.idxOriginal}
                                                fn={renderOption}
                                                opt={opt}
                                                hlt={hiliteIdx}
                                                onClk={onItemClick} />)}
          </div>
        );
      }
    } else  {
      return (
        <div className={styles.noOptions}>
          <div className={styles.txt}>No options</div>
        </div>
      );
    }
  };

  let iconButtonScale = 1;
  if (attr?.style?.height != null) {
    const x = getNumber(attr.style.height);
    if (!isNaN(x))
      iconButtonScale = x / 48;
  }

  const bClearButton = !disableClearable && !bDisabled && selected >= 0;
  const clearButtonScale = Math.min(1, iconButtonScale);

  return (
    <>
      <div className={cn(styles.wrapper, wrapperExtraClass)} ref={refInputWrapper}>
        {bHasLabel &&
          <label className={cn(styles.label, theme === K_Theme.Dark && styles.dark, {[styles.disabled]: bDisabled})} htmlFor={id}>
            {label}
          </label>
        }
        <div className={cn(styles.withAdorn, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.error]: bHasError, [styles.errorBorder]: errorBorder}, adornExtraClass)}
             {...((attr?.style?.height != null) ? { style: { height: attr.style.height } } : {})}
        >
          <input ref={refInput}
                 className={cn(styles.input, inputExtraClass)}
                 {...(id ? { id } : {})}
                 {...(tooltipOnInput ? { title: inputVal } : {})}
                 {...(searchable ? {} : { readOnly: true })}
                 value={inputVal}
                 onChange={evt => onInputTextChange(evt.target.value)}
                 onBlur={onInputBlur}
                 onClick={onInputClick}
                 onKeyDown={onInputKeyDown}
                 {...attr} />
          {bClearButton &&
            <IconButton theme={K_Theme.Light}
                        extraClass={cn(styles.clearButton, styles.padZero)}
                        transparent
                        scale={clearButtonScale * .93}
                        svgScale={clearButtonScale * .9}
                        svg={CloseSvg}
                        invertBkTheme
                        tabIndex={-1}
                        onMouseDown={evt => evt.preventDefault()}
                        onClick={onClearButtonClick} />
          }
          <IconButton theme={K_Theme.Light}
                      extraClass={styles.padZero}
                      transparent
                      scale={iconButtonScale * .91}
                      svgScale={collapsed ? iconButtonScale : -iconButtonScale}
                      svg={TriangleSvg}
                      invertBkTheme
                      tabIndex={-1}
                      onMouseDown={evt => evt.preventDefault()}
                      onClick={onArrowButtonClick}
                      noBkgnd={bDisabled} // Don't render the background circle when disabled
                      disabled={bDisabled} />
        </div>
        {(bHasError || errorPlaceholder) &&
          <div className={cn(styles.errorText,
            theme === K_Theme.Dark ? styles.dkError : styles.ltError,
            {[styles.disabled]: bDisabled},
            errorTextExtraClass)}>
            {errorText}
          </div>
        }
      </div>
      {!collapsed &&
        <Gateway portalId={portalId}>
          <Popper className={styles.popper}
                  autoFlipAnchor={pop_AutoFlipAnchor}
                  {...((pop_MatchWidth && popWidth >= 0) ? { style: { width: popWidth } } : {})}
                  // matchWidth={pop_MatchWidth}
                  bForceLimits={pop_ForceLimits}
                  neverCover={pop_NeverCover}
                  limiter={pop_Limiter}
                  limiterOffset={pop_LimiterOffset}
                  limiterClip={pop_LimiterClip}
                  anchorEl={refInput.current}>
            <div className={styles.popperMain}
                 style={{ maxHeight: pageSize*36 + 18 }}
                 onMouseDown={evt => evt.preventDefault()}>
              <div className={styles.popperContents}>
                {renderDropdown()}
              </div>
            </div>
          </Popper>
        </Gateway>
      }
    </>
  );
});

ComboBox.displayName = 'ComboBox';


export default ComboBox;
