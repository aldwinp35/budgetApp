import React, { useContext } from 'react';
import { CgMathPlus } from 'react-icons/cg';

import Context from '../../context/Context';
import ShowOrEditCategories from './ShowOrEditCategories';
import ButtonCircle from '../util/ButtonCircle';
import Tooltip from '../util/Tooltip';

function CategorySection() {
  const { state, toggleAddCategoryModal } = useContext(Context);

  return (
    <div className="mb-3">
      <div className="section" style={{ minHeight: 'unset' }}>
        <div className="d-flex justify-content-between mb-4">
          <div className="fs-5 fw-semibold">Categories</div>
          <Tooltip text="New category" placement="bottom">
            <ButtonCircle onClick={toggleAddCategoryModal}>
              <CgMathPlus />
            </ButtonCircle>
          </Tooltip>
        </div>
        <div>
          {state.categoryList?.length > 0 ? (
            state.categoryList.map(({ id, name }) => (
              <div key={id}>
                <ShowOrEditCategories id={id} category={name} />
              </div>
            ))
          ) : (
            <div className="text-center text-secondary fst-italic">
              No categories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategorySection;
