import { useEffect, useState } from 'react';
import { Checkbox, Space } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useRaceStore } from '../store/race/raceStore';
import { useMapStore } from '../store/map/mapStore';
import { createCategoryOptions } from '../utils/categoryUtils';

export const CategoryFilter = () => {
  const { raceInfo } = useRaceStore();
  const { setVisibleCategories } = useMapStore();
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  // Initialize options and checked list when raceInfo is loaded
  useEffect(() => {
    if (raceInfo && raceInfo.categories) {
      const categoryOptions = createCategoryOptions(raceInfo);
      setOptions(categoryOptions);

      // Initially set all categories as checked
      const allCategoryIndices = categoryOptions.map(option => option.value);
      setCheckedList(allCategoryIndices);
      setVisibleCategories(allCategoryIndices);
    }
  }, [raceInfo, setVisibleCategories]);

  const onChange = (list: (string | number)[]) => {
    const categoryList = list.map(item => Number(item));
    setCheckedList(categoryList);
    setIndeterminate(
      !!categoryList.length && categoryList.length < options.length
    );
    setCheckAll(categoryList.length === options.length);
    setVisibleCategories(categoryList);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const allValues = options.map(option => option.value);
    setCheckedList(e.target.checked ? allValues : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    setVisibleCategories(e.target.checked ? allValues : []);
  };

  if (!raceInfo || !options.length) {
    return null;
  }

  return (
    <div>
      <Checkbox
        style={{ marginBottom: '15px' }}
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        すべて選択
      </Checkbox>

      {/* 縦並びのチェックボックス */}
      <Space direction="vertical" style={{ width: '100%' }}>
        {options.map(option => (
          <Checkbox
            key={option.value}
            value={option.value}
            checked={checkedList.includes(option.value)}
            onChange={e => {
              const newCheckedList = e.target.checked
                ? [...checkedList, option.value]
                : checkedList.filter(value => value !== option.value);

              onChange(newCheckedList);
            }}
          >
            {option.label}
          </Checkbox>
        ))}
      </Space>
    </div>
  );
};
