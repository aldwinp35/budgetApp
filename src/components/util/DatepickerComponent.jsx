/*
Datepicker documentation: https://mymth.github.io/vanillajs-datepicker/
Datepicker demo: https://raw.githack.com/mymth/vanillajs-datepicker/v1.3.3/demo/bs5.html
*/
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  cloneElement,
} from 'react';
import { Datepicker } from 'vanillajs-datepicker';
// import 'vanillajs-datepicker/css/datepicker.css';
// import 'vanillajs-datepicker/css/datepicker-bs5.css';
import './dp-test-style.css';

export default function DatepickerComponent(props) {
  let {
    // Input attributes
    inputRef,
    selected,
    className,
    placeholder,
    customInput,

    // Datepicker events
    onChangeDate,
    onChangeMonth,
    onChangeView,
    onChangeYear,
    onShow,
    onHide,

    // Datepicker options
    format = 'mm/dd/yyyy',
    ...dpkProps
  } = props;

  const dpkRef = inputRef ?? useRef(null);
  const ref = useRef(null);
  const [strDate, setStrDate] = useState('');

  const handleInputChange = useCallback((e) => {
    setStrDate(e.target.value);
  }, []);

  useEffect(() => {
    // Init vanilajs datepicker when DOM is mounted.
    dpkRef.current = new Datepicker(ref.current, {
      maxView: 2,
      format,
      prevArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 6L9 12L15 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>`,
      nextArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>`,
      ...dpkProps,
      buttonClass: 'btn',
    });

    // Set input attributes
    if (className) dpkRef.current.element.className = className;
    if (placeholder) dpkRef.current.element.placeholder = placeholder;

    /* Datepicker events */
    // Fired when the selected dates are changed.
    if (onChangeDate) {
      dpkRef.current.element.addEventListener('changeDate', onChangeDate);
    }
    // Fired when the focused date is changed to a different month's date.
    if (onChangeMonth) {
      dpkRef.current.element.addEventListener('changeMonth', onChangeMonth);
    }
    // Fired when the current view is changed.
    if (onChangeView) {
      dpkRef.current.element.addEventListener('changeView', onChangeView);
    }
    // Fired when the focused date is changed to a different year's date.
    if (onChangeYear) {
      dpkRef.current.element.addEventListener('changeYear', onChangeYear);
    }
    // Fired when the date picker becomes hidden.
    if (onHide) {
      dpkRef.current.element.addEventListener('hide', onHide);
    }
    // Fired when the date picker becomes hidden.
    if (onShow) {
      dpkRef.current.element.addEventListener('show', onShow);
    }

    // When DOM is unmounted
    return () => {
      // Remove event listeners
      dpkRef.current.element.removeEventListener('changeDate', onChangeDate);
      dpkRef.current.element.removeEventListener('changeMonth', onChangeMonth);
      dpkRef.current.element.removeEventListener('changeView', onChangeView);
      dpkRef.current.element.removeEventListener('changeYear', onChangeYear);
      dpkRef.current.element.removeEventListener('hide', onHide);
      dpkRef.current.element.removeEventListener('show', onShow);
      // Destroy datepicker
      dpkRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    let objDate = selected;

    // Check if date is string
    if (typeof selected === 'string' || selected instanceof String) {
      // Parse to date
      objDate = new Date(selected + '\n');
    }

    // Make sure date is valid
    if (objDate instanceof Date && !isNaN(objDate.valueOf())) {
      // Set datepicker date
      dpkRef.current.setDate(objDate);

      // Set input value (strDate) with selected datepicker date
      const dpkDate = dpkRef.current.getDate(format);
      setStrDate(dpkDate);
    }
  }, [selected]);

  // Return custom input
  // Make sure to change "innerRef" key if used with a different library than "reactstrap"

  if (customInput)
    return cloneElement(customInput, {
      innerRef: ref,
      value: strDate,
      onChange: handleInputChange,
    });

  // Return HTML inputs
  return <input value={strDate} onChange={handleInputChange} ref={ref} />;
}
