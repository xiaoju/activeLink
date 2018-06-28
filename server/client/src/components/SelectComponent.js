import React from 'react';
import Select from 'react-select';
import * as Animated from 'react-select/lib/animated';
import { colourOptions } from './SelectComponentData';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

function SelectComponent() {
  return (
    <Select
      className="SelectComponent"
      closeMenuOnSelect={false}
      components={Animated}
      defaultValue={[colourOptions[4], colourOptions[5]]}
      isMulti
      options={colourOptions}
    />
  );
}

export default SelectComponent;
