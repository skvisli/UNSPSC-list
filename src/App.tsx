import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import { FixedSizeList } from 'react-window';
import { DebounceInput } from 'react-debounce-input';
import './App.scss';
import { URL, sortData, prepareData, getBulletUnicode, generateNewCode } from './utils';
import { APICategory, Category } from './types';

const App = () => {
  const [data, setData] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [categoryPlaceholder, setCategoryPlaceholder] =
    useState<{ parentIndex: number; wasSearching: boolean }>();
  const listRef = useRef<FixedSizeList>(null);

  useEffect(() => {
    axios.get<APICategory[]>(URL).then((resp) => setData(prepareData(resp.data)));
  }, []);

  useEffect(() => {
    listRef.current?.scrollToItem(0);
  }, [searchInput]);

  useEffect(() => {
    if (categoryPlaceholder?.wasSearching) {
      listRef.current?.scrollToItem(categoryPlaceholder.parentIndex, 'start');
    }
  }, [categoryPlaceholder]);

  function handleAddSubCategory(parent: Category) {
    if (categoryPlaceholder) return;
    setSearchInput('');
    const parentIndex = data.findIndex((category) => category.code === parent.code);
    const updatedData = [...data];
    updatedData.splice(parentIndex + 1, 0, {
      code: generateNewCode(data, parent, parentIndex),
      name: '',
      level: parent.level + 1,
    });
    setCategoryPlaceholder({
      parentIndex,
      wasSearching: searchInput.length > 0,
    });
    setData(updatedData);
  }

  function handleSubmitName(event: React.FormEvent<HTMLFormElement>, newCategory: Category) {
    event.preventDefault();
    const inputElement = event.currentTarget.elements[0] as HTMLInputElement;
    const name = inputElement.value;
    const newData = data.map((category) =>
      category.code === newCategory.code ? { ...category, name } : category,
    );
    setCategoryPlaceholder(undefined);
    setData(sortData(newData));
  }

  const fuse = new Fuse(data, { keys: ['code', 'level', 'name'], threshold: 0.3 });
  const searchResultList: Category[] = fuse.search(searchInput).map((result) => result.item);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const category = searchResultList.length > 0 ? searchResultList[index] : data[index];
    // if (!category) return null;
    return (
      <div key={category.code} className={`category level-${category.level}`} style={style}>
        {`${getBulletUnicode(category.level)} ${category.code} ${category.name}`}
        {!category.name && (
          <form className="form" onSubmit={(event) => handleSubmitName(event, category)}>
            <input id="input" />
          </form>
        )}
        {category.level < 4 && (
          <button className="add-btn" onClick={() => handleAddSubCategory(category)}>
            +
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <DebounceInput
        className="search-input"
        onChange={(event) => setSearchInput(event.target.value)}
        debounceTimeout={200}
        placeholder="Search for categories"
        value={searchInput}
      />
      <FixedSizeList
        className="list"
        height={document.documentElement.clientHeight - 70}
        itemCount={searchResultList.length > 0 ? searchResultList.length : data.length}
        itemSize={35}
        width={800}
        ref={listRef}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
};

export default App;
