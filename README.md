# UNSPSC List
This is a React app that can display a list of UNSPSC formatted categories.
It is possible to add and search for categories and new UNSPSC codes are automatically generated.

## Main dependencies
[react-window](https://github.com/bvaughn/react-window) to virtualize the list and render thousands of list items while maintaining good performance.

[Fuse.js](https://github.com/krisk/fuse) to do a fuzzy search on the list.

[react-debounce-input](https://github.com/nkbt/react-debounce-input) to debounce the search input to not block UI updates.

## Run Project
Run the following commands in the in the project directory:

### `yarn`

Installs dependencies


### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Possible improvements

- Styling
- Show parent categories for hits in search result
- Delete and edit items
- Automatically set focus on input when adding category
- X for clearing search input
- Scroll to add catgory input if below screen
