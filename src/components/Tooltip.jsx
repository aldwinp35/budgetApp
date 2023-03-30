import React, { useEffect, useRef } from 'react';
import { Tooltip as BSTooltip } from 'bootstrap';

function Tooltip({ children, text, placement = 'right' }) {
  const childRef = useRef(null);

  useEffect(() => {
    const t = new BSTooltip(childRef.current, {
      title: text,
      placement,
      trigger: 'hover',
    });
    return () => t.dispose();
  }, [text]);

  return React.cloneElement(children, { ref: childRef });
}

export default Tooltip;
