import type { Product } from "../../features/ProductStoreSlice";

const SearchSuggestions = ({
  searchsuggestions,
  onclick,
}: {
  searchsuggestions: Product[];
  onclick: (arg: string) => void;
}) => {
  console.log(searchsuggestions);

  return (
    <ul className="suggestion_div">
      {searchsuggestions &&
        searchsuggestions.map((suggestion, index) => (
          <li onClick={() => onclick(suggestion.product_name)} key={index}>
            {suggestion.product_name}
          </li>
        ))}
    </ul>
  );
};

export default SearchSuggestions;
