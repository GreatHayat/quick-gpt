const List = () => {
  <div
    className="absolute left-0 right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    role="menu"
    aria-orientation="vertical"
    aria-labelledby="menu-button"
    tabindex="-1"
  >
    <div className="py-1" role="none">
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="menu-item-0"
      >
        Edit
      </a>
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="menu-item-1"
      >
        Duplicate
      </a>
    </div>
    <div className="py-1" role="none">
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="menu-item-2"
      >
        Archive
      </a>
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="menu-item-3"
      >
        Move
      </a>
    </div>
    <div className="py-1" role="none">
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="menu-item-4"
      >
        Share
      </a>
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="menu-item-5"
      >
        Add to favorites
      </a>
    </div>
    <div className="py-1" role="none">
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="menu-item-6"
      >
        Delete
      </a>
    </div>
  </div>;
};

export default List;
