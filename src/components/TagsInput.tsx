import * as React from 'react';
import CreatableSelect from 'react-select/creatable'
import { useFormikContext } from 'formik';

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

    setFieldValue('tags', newValue ? newValue : [])
    setNewTags(newValue)
  };

  React.useEffect(() => {
    setIsDisabled(disabled)
  }, [disabled]);

  React.useEffect(() => {
    setNewTags(tags.map((tag: any) => JSON.parse(tag)))
  }, [tags]);

  return (
    <>
      <CreatableSelect isDisabled={isDisabled} options={TAGS} isMulti
        onChange={handleChange}
        value={newTags}
      />
    </>
  )
}