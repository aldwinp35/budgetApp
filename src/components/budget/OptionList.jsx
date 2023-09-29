import React from 'react';
import ButtonCircle from '../util/ButtonCircle';
import { components } from 'react-select';
import { CgTrash } from 'react-icons/cg';
// import { budgetService } from '../../api';

export function OptionList(props) {
  const { onDelete } = props.selectProps;

  return (
    <components.Option {...props}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>{props.children}</div>
        {!props.data.__isNew__ ? (
          <div>
            {/* Add cofirm before delete */}
            <ButtonCircle small onClick={(e) => onDelete(e, props.data.id)}>
              <CgTrash />
            </ButtonCircle>
          </div>
        ) : null}
      </div>
    </components.Option>
  );
}
