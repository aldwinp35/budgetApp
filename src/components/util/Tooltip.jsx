// import React, { useRef } from 'react';
// import { UncontrolledTooltip } from 'reactstrap';

// function Tooltip({ children, text, placement = 'right' }) {
//   if (!text) return children;

//   const ref = useRef(null);

//   return (
//     <span ref={ref}>
//       {children}
//       <UncontrolledTooltip placement={placement} target={ref}>
//         {text}
//       </UncontrolledTooltip>
//     </span>
//   );
// }

// export default Tooltip;

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
  }, [children, text, placement]);

  return React.cloneElement(<span>{children}</span>, { ref: childRef });
}

export default Tooltip;
