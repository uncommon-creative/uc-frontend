import * as React from 'react';
import CreatableSelect from 'react-select/creatable'
import { useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import { actions as ArbitratorActions, selectors as ArbitratorSelectors } from '../store/slices/arbitrator'

const TAGS = [
  { value: 'graphic', label: 'graphic' },
  { value: 'translation', label: 'translation' },
  { value: 'painting', label: 'painting' }
]

export const TagsInput = ({ tags, disabled }: any) => {

  const { values, setFieldValue } = useFormikContext();
  const [newTags, setNewTags] = React.useState(tags.map((tag: any) => JSON.parse(tag)));
  const [isDisabled, setIsDisabled] = React.useState(disabled);

  const handleChange = (newValue: any, actionMeta: any) => {
    console.log("in TagsInput newValue: ", newValue)
    setFieldValue('tags', newValue ? newValue : [])
    setNewTags(newValue)
  };

  React.useEffect(() => {
    setIsDisabled(disabled)
  }, [disabled]);

  return (
    <>
      <CreatableSelect isDisabled={isDisabled} options={TAGS} isMulti
        onChange={handleChange}
        value={newTags}
      />
    </>
  )
}