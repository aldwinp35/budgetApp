// DEMO: http://raw.githack.com/mymth/vanillajs-datepicker/v1.2.0/demo/index.html

import React from 'react';
import { Datepicker } from '../assets/lib/datepicker/datepicker.min';
import '../assets/lib/datepicker/datepicker.min.css';

function DatePicker(props) {
  React.useEffect(() => {
    const t = new Datepicker(props.refInput.current, props.options);

    if (props.onChange != null) {
      t.element.addEventListener('changeDate', props.onChange);
    }

    return () => t.destroy();
  }, []);

  return React.cloneElement(props.children, { ref: props.refInput });
}

export default DatePicker;
